// =============================================
// ===== TORGOVCHIK AI STUDIO / чат-заглушка =====
// =============================================
// Пока без реальных запросов: сообщения пользователя
// просто появляются в ленте, ИИ отвечает заглушкой.

(function () {
  'use strict';

  const feed = document.getElementById('chatFeed');
  const form = document.getElementById('composerForm');
  const input = document.getElementById('composerInput');
  const sendBtn = document.getElementById('composerSend');

  // Заглушки-ответы ИИ (потом заменятся реальными ответами бэкенда)
  const AI_STUB_REPLIES = [
    '⏳ Задача принята в разработку...',
    '📋 Понял. Задача добавлена в очередь — ПК скоро возьмётся за неё.',
    '🚀 Принял! Начинаю выполнять и после готовности запушу на GitHub.',
    '🛠 Задача зарегистрирована. О результате сообщу здесь.'
  ];
  let stubIndex = 0;

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

  function showTyping() {
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

  function aiReply(userText) {
    showTyping();
    // Имитируем раздумья ИИ, затем отдаём заглушку
    setTimeout(() => {
      hideTyping();
      appendMessage('ai', AI_STUB_REPLIES[stubIndex % AI_STUB_REPLIES.length]);
      stubIndex += 1;
    }, 900 + Math.min(userText.length * 15, 900));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    input.value = '';
    autosize();
    updateSendState();
    input.focus();

    aiReply(text);
  }

  function autosize() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  function updateSendState() {
    sendBtn.disabled = input.value.trim().length === 0;
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

  // Приветствие от ИИ при открытии приложения
  appendMessage(
    'ai',
    'Привет! Я твой AI-ассистент Torgovchik Studio. 👋\n\nОпиши задачу — например: «обнови каталог», «поправь стили на главной» или «добавь новый товар» — и я передам её на твой ПК. По готовности всё улетит на GitHub.'
  );
  updateSendState();
})();
