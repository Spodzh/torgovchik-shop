// =============================================
// ===== BRIDGE · TORGOVCHIK · OpenCode мост =====
// Забирает AI-задачи из Worker и исполняет их через opencode run.
//   mode 'plan'  → только план (агент plan, БЕЗ правок файлов, БЕЗ git)
//   mode 'build' → полный цикл: правки + git add/commit/push
// =============================================
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ---- КОНФИГ ----
const SERVER_URL = process.env.BRIDGE_SERVER_URL || 'https://torgovchik-bot.ernest-chanel.workers.dev';
const PROJECT_DIR = process.env.BRIDGE_PROJECT_DIR || path.resolve(__dirname, '.');
const POLL_INTERVAL_MS = 10 * 1000;          // опрос очереди раз в 10 секунд
const TASK_TIMEOUT_MS = 13 * 60 * 1000;      // таймаут opencode (13 мин — меньше STALE_MS=15 мин на воркере)
const GIT_TIMEOUT_MS = 2 * 60 * 1000;        // таймаут git-команд
const PLAN_PROMPT_PREFIX = 'Сначала составь подробный план действий, НЕ МЕНЯЙ код. Промпт: ';

// =============================================
// ===== HTTP-ХЕЛПЕРЫ =====
// =============================================
async function fetchNextTask() {
  const res = await fetch(`${SERVER_URL}/ai-task/next`, { method: 'GET' });
  if (!res.ok) throw new Error(`ai-task/next HTTP ${res.status}`);
  const data = await res.json();
  return data && data.task ? data.task : null;
}

async function completeTask(taskId, status, result, tokens) {
  const body = { taskId, status, result };
  if (Number.isFinite(tokens)) body.tokens = tokens;
  const res = await fetch(`${SERVER_URL}/ai-task/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`ai-task/complete HTTP ${res.status}`);
  return res.json();
}

// =============================================
// ===== ЗАПУСК ПРОЦЕССОВ =====
// =============================================
function runCmd(cmd, args, cwd, timeout) {
  return new Promise((resolve) => {
    // На Windows opencode — это .cmd, который execFile без shell не находит.
    // Собираем ОДНУ строку команды (args-массив + shell:true в Node 22+
    // вызывает DeprecationWarning DEP0190) и запускаем через spawn.
    const fullCommand = [cmd, ...args]
      .map((s) => '"' + String(s).replace(/"/g, '""') + '"')
      .join(' ');

    const child = spawn(fullCommand, {
      cwd,
      timeout,
      shell: true,
      windowsHide: true
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', () => resolve({ code: 1, stdout, stderr }));
    child.on('close', (code) => resolve({ code: typeof code === 'number' ? code : 1, stdout, stderr }));
  });
}

// Достаём потраченные токены из ответа OpenCode.
// Он пишет по-разному: «Tokens: 1250», «Token usage: 1,250»,
// «totalTokens: 1250», «… 34 tokens» — покрываем основные варианты.
function parseTokens(text) {
  if (!text) return null;
  // Вариант 1: ключевое слово, затем число — «Tokens: 1250»
  // (точку из разделителей убрали — иначе «usage: 0.05» склеится в 005)
  let m = text.match(/(?:token\s*usage|tokens?)[^\d\n]{0,30}(\d[\d\s,']*)/i);
  if (m) {
    const n = parseInt(m[1].replace(/[\s,']/g, ''), 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  // Вариант 2: число перед словом — «… всего 34 tokens».
  // Группы разделителей требуем строго по 3 цифры, чтобы
  // «$0.05, 34 tokens» не склеился в 534
  m = text.match(/(\d{1,3}(?:[ ,]\d{3})+|\d+)\s*tokens?\b/i);
  if (m) {
    const n = parseInt(m[1].replace(/[\s,']/g, ''), 10);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

// Грубая оценка токенов, если parseTokens не нашёл число в выводе:
// ~(символы промпта + ответа) / 4
function estimateTokens(prompt, output) {
  return Math.ceil(((prompt || '').length + (output || '').length) / 4);
}

// OpenCode: plan → агент plan (read-only), build → обычный запуск
async function runOpencode(prompt, mode) {
  const args = ['run'];
  if (mode === 'plan') {
    args.push('--agent', 'plan');
    args.push(PLAN_PROMPT_PREFIX + prompt);
  } else {
    args.push('--auto');
    args.push(prompt);
  }
  const r = await runCmd('opencode', args, PROJECT_DIR, TASK_TIMEOUT_MS);
  const output = ((r.stdout || '') + '\n' + (r.stderr || '')).trim();
  const tokens = parseTokens(output) ?? estimateTokens(prompt, output);
  if (tokens != null) console.log(`🪙 Токены: ${tokens.toLocaleString('ru-RU')}`);
  if (r.code !== 0) {
    return { ok: false, tokens, output: output || `opencode завершился с кодом ${r.code}` };
  }
  return { ok: true, tokens, output: output || '(пустой ответ OpenCode)' };
}

// =============================================
// ===== GIT (только для mode build) =====
// =============================================
async function gitAddCommitPush(prompt) {
  const commitMsg = 'AI task: ' + prompt.slice(0, 60).replace(/[\r\n]+/g, ' ');

  const add = await runCmd('git', ['add', '-A'], PROJECT_DIR, GIT_TIMEOUT_MS);
  if (add.code !== 0) return { ok: false, output: add.stderr || `git add: код ${add.code}` };

  const commit = await runCmd('git', ['commit', '-m', commitMsg], PROJECT_DIR, GIT_TIMEOUT_MS);
  if (commit.code !== 0) {
    const errText = (commit.stderr || '').trim();
    // «nothing to commit» — не ошибка, OpenCode просто ничего не изменил
    if (errText.includes('nothing to commit')) {
      return { ok: true, output: 'Изменений нет — коммит пропущен.' };
    }
    return { ok: false, output: errText || `git commit: код ${commit.code}` };
  }

  const push = await runCmd('git', ['push'], PROJECT_DIR, GIT_TIMEOUT_MS);
  if (push.code !== 0) return { ok: false, output: (push.stderr || '').trim() || `git push: код ${push.code}` };

  return { ok: true, output: 'Изменения закоммичены и отправлены на сервер.' };
}

// =============================================
// ===== ОБРАБОТКА ЗАДАЧИ =====
// =============================================
async function processTask(task) {
  const mode = task.mode === 'plan' ? 'plan' : 'build';
  console.log(`▶ Задача ${task.taskId} · режим: ${mode}`);

  const run = await runOpencode(task.prompt, mode);
  if (!run.ok) {
    console.error(`✖ opencode ошибка: ${run.output.slice(0, 300)}`);
    await completeTask(task.taskId, 'error', run.output.slice(0, 10000), run.tokens);
    return;
  }

  // PLAN: только текстовый отчёт, git-шаги полностью пропускаем
  if (mode === 'plan') {
    console.log('✓ План составлен (git-шаги пропущены)');
    await completeTask(task.taskId, 'done', run.output.slice(0, 10000), run.tokens);
    return;
  }

  // BUILD: обычный цикл — коммит и пуш
  const git = await gitAddCommitPush(task.prompt);
  const result = `${run.output}\n\n---\nGIT: ${git.ok ? 'OK' : 'FAIL'}\n${git.output}`;
  if (git.ok) {
    console.log(`✓ Задача выполнена: ${git.output}`);
    await completeTask(task.taskId, 'done', result.slice(0, 10000), run.tokens);
  } else {
    console.error(`✖ git ошибка: ${git.output.slice(0, 300)}`);
    await completeTask(task.taskId, 'error', result.slice(0, 10000), run.tokens);
  }
}

// =============================================
// ===== ГЛАВНЫЙ ЦИКЛ =====
// =============================================
async function loop() {
  let task = null;
  try {
    task = await fetchNextTask();
  } catch (e) {
    console.error('⚠ Очередь недоступна:', e.message);
  }

  if (task) {
    try {
      await processTask(task);
    } catch (e) {
      console.error('✖ Ошибка обработки задачи:', e);
      try { await completeTask(task.taskId, 'error', 'Bridge error: ' + e.message); } catch (e2) {}
    }
  }

  setTimeout(loop, POLL_INTERVAL_MS);
}

if (!fs.existsSync(PROJECT_DIR)) {
  console.error(`✖ Проект не найден: ${PROJECT_DIR}`);
  process.exit(1);
}

console.log(`🚀 Мост запущен · сервер: ${SERVER_URL} · проект: ${PROJECT_DIR}`);
loop();
