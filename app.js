// =============================================
// ===== TORGOVCHIK AI STUDIO / чат с бэкендом =====
// =============================================

(function () {
  'use strict';

  // Тот же воркер, что и в js/script.js
  const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';

  const POLL_INTERVAL_MS = 4000;  // опрос статуса каждые 4 секунды
  const POLL_TIMEOUT_MS = 10 * 60 * 1000; // максимальное ожидание задачи — 10 минут

  const feed = document.getElementById('chatFeed');
  const form = document.getElementById('composerForm');
  const input = document.getElementById('composerInput');
  const sendBtn = document.getElementById('composerSend');
  const tokensValue = document.getElementById('tokensValue');
  const tokensReset = document.getElementById('tokensReset');

  function nowTime() {
    return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  function scrollDown() {
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }

  function appendMessage(role, text) {
    const el = document.createElement('div');
    el.className = 'msg msg--' + role;

    // Текст вставляем как textContent — без HTML из пользовательского ввода
    el.textContent = text;

    const meta = document.createElement('span');
    meta.className = 'msg__meta';
    meta.textContent = (role === 'ai' ? 'AI Studio · ' : 'Ты · ') + nowTime();
    el.appendChild(meta);

    feed.appendChild(el);
    scrollDown();
    return el;
  }

  // Пульсирующие точки — индикатор ожидания ответа сервера
  function showTyping() {
    if (document.getElementById('typingIndicator')) return;
    const el = document.createElement('div');
    el.className = 'typing';
    el.id = 'typingIndicator';
    el.innerHTML = '<span></span><span></span><span></span>';
    feed.appendChild(el);
    scrollDown();
  }

  function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function setSending(sending) {
    sendBtn.disabled = sending || input.value.trim().length === 0;
    input.disabled = sending;
  }

  // POST /ai-task — ставим задачу в очередь
  async function submitTask(prompt) {
    const res = await fetch(WORKER_URL + 'ai-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt })
    });
    if (!res.ok) {
      throw new Error('Сервер вернул ' + res.status);
    }
    const data = await res.json().catch(() => ({}));
    // Воркер может отдать id под разными именами — проверяем основные варианты
    const taskId = data.taskId || data.task_id || data.id || (data.task && data.task.id);
    if (!taskId) {
      throw new Error('Сервер не вернул taskId');
    }
    return taskId;
  }

  // GET /ai-task/status?taskId=... — узнаём судьбу конкретной задачи
  async function fetchTaskStatus(taskId) {
    const res = await fetch(WORKER_URL + 'ai-task/status?taskId=' + encodeURIComponent(taskId));
    if (!res.ok) {
      throw new Error('Сервер вернул ' + res.status);
    }
    return res.json();
  }

  // Поллинг: каждые POLL_INTERVAL_MS спрашиваем статус, пока не done/error
  function pollTaskStatus(taskId) {
    const startedAt = Date.now();
    showTyping();

    const timer = setInterval(async () => {
      try {
        const data = await fetchTaskStatus(taskId);
        const status = data.status || data.state;

        if (status === 'done') {
          clearInterval(timer);
          hideTyping();
          const result = data.result || data.message || 'Код обновлен и запушен в GitHub';
          appendMessage('ai', '✅ ' + result);
          setSending(false);
          input.focus();
          fetchAiStats(); // счётчик токенов мог измениться
        } else if (status === 'error') {
          clearInterval(timer);
          hideTyping();
          const detail = data.error || data.message || '';
          appendMessage('ai', '❌ Ошибка выполнения' + (detail ? ': ' + detail : ''));
          setSending(false);
          input.focus();
          fetchAiStats();
        } else if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          clearInterval(timer);
          hideTyping();
          appendMessage('ai', '⌛ Задача выполняется слишком долго. Результат придёт позже — проверь GitHub.');
          setSending(false);
          input.focus();
        }
        // иначе — статус pending/queued/running, продолжаем ждать
      } catch (err) {
        console.error('Ошибка опроса статуса:', err);
        // Разовый сбой сети не роняем поллинг — попробуем на следующем тике
      }
    }, POLL_INTERVAL_MS);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    appendMessage('user', text);
    input.value = '';
    autosize();
    updateSendState();

    setSending(true);
    try {
      const taskId = await submitTask(text);
      appendMessage('ai', '⏳ Задача отправлена в очередь...');
      pollTaskStatus(taskId);
    } catch (err) {
      console.error('Ошибка отправки задачи:', err);
      hideTyping();
      appendMessage('ai', '❌ Не удалось отправить задачу на сервер. Попробуй ещё раз.');
      setSending(false);
    }
    input.focus();
  }

  function autosize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  function updateSendState() {
    if (!input.disabled) {
      sendBtn.disabled = input.value.trim().length === 0;
    }
  }

  form.addEventListener('submit', handleSubmit);
  input.addEventListener('input', () => { autosize(); updateSendState(); });

  input.addEventListener('keydown', (e) => {
    // Enter — отправить, Shift+Enter — перенос строки
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
  });

  // ===== iOS: клавиатура =====
  const appShell = document.querySelector('.app');

  // В iOS клавиатура сжимает visual viewport, а layout остаётся прежним —
  // иначе композер уезжает под клавиатуру. Сдвигаем каркас на величину смещения.
  function applyKeyboardOffset() {
    const vv = window.visualViewport;
    if (!vv) return;
    const overlap = window.innerHeight - vv.height;
    if (overlap > 0) {
      appShell.style.height = vv.height + 'px';
      appShell.style.transform = 'translateY(' + vv.offsetTop + 'px)';
    } else {
      appShell.style.height = '';
      appShell.style.transform = '';
    }
  }

  // Прокрутка чата вниз с учётом того, что iOS анимирует клавиатуру ~250мс
  function scrollAfterKeyboard() {
    setTimeout(scrollDown, 120);
    setTimeout(scrollDown, 350);
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      applyKeyboardOffset();
      scrollAfterKeyboard();
    });
    window.visualViewport.addEventListener('scroll', applyKeyboardOffset);
  }

  // При фокусе на поле (выезд клавиатуры) последнее сообщение не должно прятаться
  input.addEventListener('focus', () => {
    applyKeyboardOffset();
    scrollAfterKeyboard();
  });
  input.addEventListener('blur', applyKeyboardOffset);

  // ===== Счётчик токенов (GET /ai-stats) =====
  let statsResetMs = null;

  async function fetchAiStats() {
    try {
      const res = await fetch(WORKER_URL + 'ai-stats');
      if (!res.ok) throw new Error('Сервер вернул ' + res.status);
      const data = await res.json();
      renderAiStats(data);
    } catch (err) {
      console.error('Не удалось получить статистику токенов:', err);
    }
  }

  // Воркер может назвать поля по-разному — поддерживаем основные варианты
  function renderAiStats(data) {
    if (!data || typeof data !== 'object') return;

    const tokens = data.tokens ?? data.tokensUsed ?? data.usedTokens ?? data.totalTokens ?? data.count;
    if (tokens != null && Number.isFinite(Number(tokens))) {
      tokensValue.textContent = '🪙 Токены: ' + Number(tokens).toLocaleString('ru-RU');
    }

    // Момент сброса лимита: timestamp, ISO-строка или «осталось N сек/мин/ч»
    let resetMs = null;
    const raw = data.resetAt ?? data.reset_at ?? data.resetTime ?? data.resetsAt ?? data.nextReset;
    if (raw != null) {
      if (typeof raw === 'number') resetMs = raw > 1e12 ? raw : raw * 1000;
      else {
        const parsed = Date.parse(raw);
        if (!Number.isNaN(parsed)) resetMs = parsed;
      }
    }
    if (resetMs == null) {
      const hours = data.resetInHours;
      const minutes = data.resetInMinutes;
      const seconds = data.resetInSeconds ?? data.resetSeconds ?? data.resetIn;
      if (typeof hours === 'number') resetMs = Date.now() + hours * 3600000;
      else if (typeof minutes === 'number') resetMs = Date.now() + minutes * 60000;
      else if (typeof seconds === 'number') resetMs = Date.now() + seconds * 1000;
    }
    if (resetMs != null) {
      statsResetMs = resetMs;
      updateResetTimer();
    }
  }

  function updateResetTimer() {
    if (statsResetMs == null) return;
    const diff = statsResetMs - Date.now();
    if (diff <= 0) {
      statsResetMs = null;
      tokensReset.textContent = 'Лимит сброшен';
      fetchAiStats(); // лимит обнулился — запрашиваем свежие цифры
      return;
    }
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    tokensReset.textContent = hours > 0
      ? 'Сброс через ' + hours + ' ч'
      : 'Сброс через ' + minutes + ' мин';
  }

  setInterval(updateResetTimer, 30000);
  fetchAiStats();

  // Приветствие от ИИ при открытии приложения
  appendMessage(
    'ai',
    'Привет! Я твой AI-ассистент Torgovchik Studio. 👋\n\nОпиши задачу — например: «обнови каталог», «поправь стили на главной» или «добавь новый товар» — и я передам её на твой ПК. По готовности всё улетит на GitHub.'
  );
  updateSendState();
})();
