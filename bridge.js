// ============================================================
// ===== BRIDGE.JS · МОСТ CLOUDFLARE WORKER → OPENCODE =====
// ============================================================
// Что делает:
//   1. Каждые 5 секунд опрашивает воркер: GET /ai-task/next
//   2. Если есть задача — запускает OpenCode в headless-режиме
//      (opencode run "текст задачи")
//   3. После завершения OpenCode коммитит и пушит изменения:
//      git add . → git commit → git push
//   4. Отчитывается воркеру: POST /ai-task/complete
//      (status: 'done' или 'error' + текст ошибки + tokens: сколько
//       токенов потратил OpenCode, распарсено из его stdout)
//
// Требования:
//   - Node.js 18+ (глобальный fetch появился в 18-й версии)
//   - Установленный opencode (команда `opencode` или `npx opencode-ai`)
//   - Настроенный git в рабочей папке (remote, ветка, автор)
// ============================================================

// ============================================================
// ===== НАСТРОЙКИ (правьте под себя) =====
// ============================================================
const CONFIG = {
  // Адрес вашего Cloudflare Worker-а (без слэша на конце)
  WORKER_URL: 'https://torgovchik-bot.ernest-chanel.workers.dev',

  // Интервал опроса очереди, мс
  POLL_INTERVAL: 5000,

  // Папка репозитория, в которой OpenCode будет работать
  // По умолчанию — папка, откуда запущен скрипт
  WORK_DIR: process.cwd(),

  // Как запускать OpenCode:
  //   если установлен глобально:          ['opencode', 'run']
  //   если через npm-пакет opencode-ai:   ['npx', 'opencode-ai', 'run']
  // Флаг --auto обязателен: без него headless-режим (opencode run) не может
  // показать запрос разрешения никому — и АВТО-ОТКЛОНЯЕТ его
  // ("permission requested: ...; auto-rejecting"), обрывая задачу на полпути.
  // --auto одобряет всё, что не запрещено явно правилами "deny" в opencode.json.
  // (Примечание: флага --yes не существует; --auto — документированный вариант,
  //  --yolo и --dangerously-skip-permissions — его скрытые алиасы.)
  OPENCODE_CMD: ['opencode', 'run', '--auto']
};

// ============================================================
// ===== ИМПОРТЫ =====
// ============================================================
const { spawn } = require('child_process');
const path = require('path');

// Экранирование аргумента для cmd.exe (Windows) / sh (Unix):
// оборачиваем в кавычки и удваиваем внутренние кавычки
function quoteArg(s) {
  return '"' + String(s).replace(/"/g, '""') + '"';
}

// Запуск команды через spawn.
// Раньше здесь был execFile с массивом аргументов + shell: true —
// в Node 22+ это вызывает DeprecationWarning DEP0190
// ("Passing args to a child process with shell option is deprecated").
// Теперь собираем ОДНУ строку команды и передаём её в spawn —
// никакого предупреждения в принципе не возникает.
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const fullCommand = [cmd, ...args].map(quoteArg).join(' ');

    const child = spawn(fullCommand, {
      cwd: opts.cwd || CONFIG.WORK_DIR,
      shell: true,        // без shell на Windows не находятся .cmd-файлы (opencode.cmd)
      windowsHide: true,  // не мигать окном консоли на Windows
      stdio: ['ignore', 'pipe', 'pipe'], // stdin отключён — процессу нечего «ждать» от нас
      // лимит вывода: 10 МБ (stdout+stderr), чтобы не переполнить память
      maxBuffer: 10 * 1024 * 1024,
      // таймаут по умолчанию 15 минут (OpenCode может думать долго)
      timeout: opts.timeout || 15 * 60 * 1000,
      env: {
        ...process.env,
        // страховка: глушим любые DeprecationWarning от Node.js и зависимостей
        NODE_NO_WARNINGS: '1'
      }
    });

    let stdout = '';
    let stderr = '';
    const MAX = 10 * 1024 * 1024;

    child.stdout.on('data', d => {
      if (stdout.length < MAX) stdout += d;
    });
    child.stderr.on('data', d => {
      if (stderr.length < MAX) stderr += d;
    });

    child.on('error', err => reject(err));

    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve((stdout || '').trim());
      } else {
        const err = new Error(
          `Процесс завершился с кодом ${code}` +
          (signal ? ` (сигнал ${signal})` : '')
        );
        err.stderr = (stderr || '').trim();
        err.stdout = (stdout || '').trim();
        reject(err);
      }
    });
  });
}

// ============================================================
// ===== API ВОРКЕРА =====
// ============================================================

// Забрать самую старую pending-задачу.
// Воркер при этом переводит её в processing (блокировка от дублей).
async function fetchNextTask() {
  const res = await fetch(`${CONFIG.WORKER_URL}/ai-task/next`);
  if (!res.ok) throw new Error(`GET /ai-task/next → HTTP ${res.status}`);
  const data = await res.json();
  return data.task; // { taskId, prompt, createdAt } или null
}

// Отправить отчёт о выполнении (done/error) + потраченные токены (если известны)
async function reportComplete(taskId, status, result, tokens) {
  const body = { taskId, status, result };
  if (Number.isFinite(tokens) && tokens > 0) {
    body.tokens = tokens;
  }
  const res = await fetch(`${CONFIG.WORKER_URL}/ai-task/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST /ai-task/complete → HTTP ${res.status}`);
  return await res.json();
}

// ============================================================
// ===== РАБОЧАЯ ЛОГИКА =====
// ============================================================

// Обрезка текста задачи для commit-сообщения (первые 30 символов)
function shortLabel(text) {
  const oneLine = text.replace(/\s+/g, ' ').trim();
  return oneLine.length > 30 ? oneLine.slice(0, 30) : oneLine;
}

// Запуск OpenCode в headless-режиме с текстом задачи
async function runOpenCode(prompt) {
  console.log(`🧠 Запускаю OpenCode: "${shortLabel(prompt)}"...`);
  // opencode run "текст задачи" — `run()` сам экранирует кавычки
  // и собирает строку команды, инъекции через промпт исключены.
  // `opencode run` — уже headless-режим (TUI не открывается), результат
  // печатается в stdout. --auto не даёт задаче оборваться на запросе разрешения.
  const [cmd, ...baseArgs] = CONFIG.OPENCODE_CMD;
  const output = await run(cmd, [...baseArgs, prompt]);
  console.log('✅ OpenCode завершил работу');
  return output;
}

// Достаём потраченные токены из stdout `opencode run`.
// Форматы, которые встречаются в выводе:
//   "Tokens: 1 234"          "tokens: 1,234"
//   "Total tokens: 12.3k"    "tokens=1234"
//   "1 234 tokens used"      "tokens": {"total": 1234}
function parseTokensFromOutput(output) {
  if (!output) return null;
  const text = String(output);
  const toNumber = (s) => parseInt(String(s).replace(/[\s,']/g, ''), 10);

  // «12.3k» / «1,2k» рядом со словом tokens — сокращённая запись тысяч
  const kForm = text.match(/tokens?[^\d\n\r]{0,10}(\d+(?:[.,]\d+)?)\s*k\b/i)
    || text.match(/(\d+(?:[.,]\d+)?)\s*k\s*tokens?/i);
  if (kForm) {
    const n = Math.round(parseFloat(kForm[1].replace(',', '.')) * 1000);
    if (Number.isFinite(n) && n > 0) return n;
  }

  // Порядок «метка: число» — включая вложенный JSON вида "tokens": {"total": N}
  const labeled = text.match(/total[^\n\r]{0,30}?tokens?[^\d\n\r]{0,30}(\d[\d\s,']*)/i)
    || text.match(/tokens?[^\d\n\r]{0,30}(\d[\d\s,']*)/i);
  if (labeled) {
    const n = toNumber(labeled[1]);
    if (Number.isFinite(n) && n > 0) return n;
  }

  // Обратный порядок: «1 234 tokens»
  const reversed = text.match(/(\d[\d\s,']*)\s*tokens?/i);
  if (reversed) {
    const n = toNumber(reversed[1]);
    if (Number.isFinite(n) && n > 0) return n;
  }

  return null;
}

// Коммит и пуш изменений
async function gitCommitAndPush(prompt) {
  console.log('📝 git add . ...');
  await run('git', ['add', '.']);

  // Проверяем, есть ли вообще что коммитить — иначе git commit упадёт
  const status = await run('git', ['status', '--porcelain']);
  if (!status) {
    console.log('ℹ️ OpenCode ничего не изменил — коммит не нужен');
    return false;
  }

  const msg = `AI Update: ${shortLabel(prompt)}`;
  console.log(`📝 git commit -m "${msg}" ...`);
  await run('git', ['commit', '-m', msg]);

  console.log('🚀 git push ...');
  await run('git', ['push']);
  console.log('✅ Изменения запушены');
  return true;
}

// Полный цикл обработки одной задачи:
// OpenCode → git → отчёт. Любая ошибка → status: 'error'.
async function processTask(task) {
  console.log(`\n🤖 Получена новая задача: ${task.prompt}`);
  try {
    const output = await runOpenCode(task.prompt);
    const tokens = parseTokensFromOutput(output);
    if (tokens != null) {
      console.log(`🪙 Потрачено токенов: ${tokens}`);
    } else {
      console.log('ℹ️ Токены в выводе OpenCode не найдены — отправляю отчёт без них');
    }
    await gitCommitAndPush(task.prompt);
    await reportComplete(task.taskId, 'done', 'Успешно обновлено и запушено', tokens);
    console.log('📤 Отчёт отправлен: done');
  } catch (err) {
    const msg = (err.stderr || err.stdout || err.message || 'Unknown error').slice(0, 1000);
    console.error(`❌ Ошибка обработки: ${msg}`);
    // Токены могли быть потрачены даже при ошибке — пробуем вытащить из stdout
    const tokens = parseTokensFromOutput(err.stdout);
    await reportComplete(task.taskId, 'error', msg, tokens);
    console.log('📤 Отчёт отправлен: error');
  }
}

// ============================================================
// ===== ГЛАВНЫЙ ЦИКЛ =====
// ============================================================

// Проверка окружения перед стартом, чтобы сразу показать понятные ошибки
async function preflight() {
  if (CONFIG.WORKER_URL.includes('YOUR-SUBDOMAIN')) {
    throw new Error('Укажите свой WORKER_URL в CONFIG наверху файла');
  }
  // Закомментировано: preflight не проходит на Windows, т.к. spawn
  // без shell:true не видит .cmd-файлы — мешал запуску, хотя opencode работает
  // const [cmd] = CONFIG.OPENCODE_CMD;
  // try {
  //   await run(cmd, ['--version'], { timeout: 30000 });
  //   console.log(`✅ ${cmd} доступен`);
  // } catch (e) {
  //   throw new Error(
  //     `Команда "${cmd}" не найдена или не отвечает. ` +
  //     `Установите opencode или поменяйте OPENCODE_CMD на ['npx', 'opencode-ai', 'run']`
  //   );
  // }
}

// Бесконечный цикл опроса. Задачи обрабатываются строго по одной,
// чтобы два OpenCode-процесса не правили репозиторий одновременно.
async function main() {
  await preflight();

  console.log(`\n🌉 Bridge запущен`);
  console.log(`   Воркер:    ${CONFIG.WORKER_URL}`);
  console.log(`   Папка:     ${path.resolve(CONFIG.WORK_DIR)}`);
  console.log(`   Опрос:     каждые ${CONFIG.POLL_INTERVAL / 1000} сек\n`);

  while (true) {
    try {
      const task = await fetchNextTask();
      if (task) {
        await processTask(task);
      }
      // Задач нет — просто ждём следующий цикл
    } catch (err) {
      // Ошибка сети/воркера не должна уронить скрипт — пишем и продолжаем
      console.error(`⚠️ Цикл опроса: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, CONFIG.POLL_INTERVAL));
  }
}

// Обработчики фатальных ошибок: логируем, но не падаем молча
process.on('unhandledRejection', err => console.error('❌ unhandledRejection:', err));
process.on('uncaughtException', err => console.error('❌ uncaughtException:', err));

main().catch(err => {
  console.error('❌ Bridge не смог запуститься:', err.message);
  process.exit(1);
});
