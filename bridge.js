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
//      (status: 'done' или 'error' + текст ошибки)
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
  WORKER_URL: 'https://torgovchik.YOUR-SUBDOMAIN.workers.dev',

  // Интервал опроса очереди, мс
  POLL_INTERVAL: 5000,

  // Папка репозитория, в которой OpenCode будет работать
  // По умолчанию — папка, откуда запущен скрипт
  WORK_DIR: process.cwd(),

  // Как запускать OpenCode:
  //   если установлен глобально:          ['opencode', 'run']
  //   если через npm-пакет opencode-ai:   ['npx', 'opencode-ai', 'run']
  OPENCODE_CMD: ['opencode', 'run']
};

// ============================================================
// ===== ИМПОРТЫ =====
// ============================================================
const { execFile } = require('child_process');
const path = require('path');

// Обёртка над execFile, чтобы удобно использовать await
function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    execFile(
      cmd,
      args,
      {
        cwd: opts.cwd || CONFIG.WORK_DIR,
        // лимит вывода: 10 МБ (stdout+stderr), чтобы не переполнить память
        maxBuffer: 10 * 1024 * 1024,
        // таймаут по умолчанию 15 минут (OpenCode может думать долго)
        timeout: opts.timeout || 15 * 60 * 1000,
        windowsHide: true // не мигать окном консоли на Windows
      },
      (err, stdout, stderr) => {
        if (err) {
          // Добавляем stderr к ошибке — так проще понять, что сломалось
          err.stderr = (stderr || '').trim();
          err.stdout = (stdout || '').trim();
          reject(err);
        } else {
          resolve((stdout || '').trim());
        }
      }
    );
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

// Отправить отчёт о выполнении (done/error)
async function reportComplete(taskId, status, result) {
  const res = await fetch(`${CONFIG.WORKER_URL}/ai-task/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, status, result })
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
  // opencode run "текст задачи" — аргументы передаём массивом,
  // чтобы не экранировать кавычки вручную и не бояться инъекций
  const [cmd, ...baseArgs] = CONFIG.OPENCODE_CMD;
  const output = await run(cmd, [...baseArgs, prompt]);
  console.log('✅ OpenCode завершил работу');
  return output;
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
    await runOpenCode(task.prompt);
    await gitCommitAndPush(task.prompt);
    await reportComplete(task.taskId, 'done', 'Успешно обновлено и запушено');
    console.log('📤 Отчёт отправлен: done');
  } catch (err) {
    const msg = (err.stderr || err.stdout || err.message || 'Unknown error').slice(0, 1000);
    console.error(`❌ Ошибка обработки: ${msg}`);
    await reportComplete(task.taskId, 'error', msg);
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
  const [cmd] = CONFIG.OPENCODE_CMD;
  try {
    await run(cmd, ['--version'], { timeout: 30000 });
    console.log(`✅ ${cmd} доступен`);
  } catch (e) {
    throw new Error(
      `Команда "${cmd}" не найдена или не отвечает. ` +
      `Установите opencode или поменяйте OPENCODE_CMD на ['npx', 'opencode-ai', 'run']`
    );
  }
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
