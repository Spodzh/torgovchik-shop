// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';

// =============================================
// ===== ДОСТУПНЫЕ АВАТАРКИ (20 шт.) =====
// =============================================
const AVATARS = [
    { id: 1,  image: 'https://i.ibb.co/vvmQyYqG/image.png' },
    { id: 2,  image: 'https://i.ibb.co/XZ99y2Y4/image.png' },
    { id: 3,  image: 'https://i.ibb.co/j9c7vSW0/image.png' },
    { id: 4,  image: 'https://i.ibb.co/KxwDPKRc/image.png' },
    { id: 5,  image: 'https://i.ibb.co/0pX5p3SJ/image.png' },
    { id: 6,  image: 'https://i.ibb.co/JRRrkvYc/image.png' },
    { id: 7,  image: 'https://i.ibb.co/H64GB86/image.png' },
    { id: 8,  image: 'https://i.ibb.co/tw8HBvBr/image.png' },
    { id: 9,  image: 'https://i.ibb.co/NdVVyhNS/image.png' },
    { id: 10, image: 'https://i.ibb.co/C3CFsxGm/image.png' },
    { id: 11, image: 'https://i.ibb.co/8gYmjq4V/image.png' },
    { id: 12, image: 'https://i.ibb.co/1J4y8QQV/image.png' },
    { id: 13, image: 'https://i.ibb.co/SXPrTVTR/image.png' },
    { id: 14, image: 'https://i.ibb.co/SwSFWgTR/image.png' },
    { id: 15, image: 'https://i.ibb.co/g11MxGY/image.png' },
    { id: 16, image: 'https://i.ibb.co/ccmPQ6Tz/image.png' },
    { id: 17, image: 'https://i.ibb.co/jkCdhV3P/image.png' },
    { id: 18, image: 'https://i.ibb.co/Y49QDG0S/image.png' },
    { id: 19, image: 'https://i.ibb.co/k6GxF5ks/image.png' },
    { id: 20, image: 'https://i.ibb.co/Nz2SQ4w/image.png' }
];

const DEFAULT_AVATAR_ID = 6;

// =============================================
// ===== ШАПКИ ПРОФИЛЯ (4 шт.) =====
// =============================================
const BANNERS = [
    { id: 1, image: 'https://i.ibb.co/FbQzf5tN/image.png' },
    { id: 2, image: 'https://i.ibb.co/rRHB6BV4/image.png' },
    { id: 3, image: 'https://i.ibb.co/wNB7K5VH/image.png' },
    { id: 4, image: 'https://i.ibb.co/W4Dm8kq9/image.png' }
];

// =============================================
// ===== ФРАЗЫ НА ЛОГОТИПЕ =====
// =============================================
const LOGO_PHRASES = [
    'Купил жижу? 😏',
    'Заправиться не хочешь?',
    'Есть вкусненькое 😉',
    'Скучал по нам?',
    'Как насчёт новой вкусняшки?',
    'Жижа сама себя не купит!',
    'Пара затяжек — и день ярче 🌿',
    'Твой Pod скучает по новой жиже 👀',
    'Вкусный день сегодня, да?',
    'Псс, есть кое-что новенькое...'
];

// =============================================
// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
// =============================================
let products = [];
let promocodes = [];
let cart = [];
let appliedPromo = null;
let discountPercent = 0;
let currentUser = null;
let referralCode = null;
let pendingAvatarId = null;
let pendingBannerId = null;
let currentAuthTab = 'login';
let currentCategory = 'liquids';
let orderIdempotencyKey = null;

// =============================================
// ===== УТИЛИТЫ =====
// =============================================
function generateUUID() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function validateTelegramUsername(raw) {
  if (!raw || typeof raw !== 'string') return 'Введите Telegram username';
  const clean = raw.trim().startsWith('@') ? raw.trim().slice(1) : raw.trim();
  if (clean.length === 0) return 'Введите Telegram username';
  if (clean.length < 5) return 'Username должен быть минимум 5 символов';
  if (clean.length > 32) return 'Username должен быть максимум 32 символа';
  if (!/^[a-zA-Z]/.test(clean)) return 'Username должен начинаться с буквы';
  if (!/^[a-zA-Z0-9_]+$/.test(clean)) return 'Только латиница, цифры и _';
  if (clean.endsWith('_')) return 'Username не может заканчиваться на _';
  if (clean.includes('__')) return 'Нельзя использовать __ подряд';
  return null;
}

function normalizeTelegramUsername(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  return trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
}

// =============================================
// ===== УТИЛИТЫ МОДАЛОК (a11y) =====
// =============================================
function updateBodyOverflow() {
  const anyOpen = document.querySelector(
    '.login-modal.open, .profile-modal.open, .avatar-modal.open, .banner-modal.open, .order-modal.open, .announcement-modal.open'
  );
  document.body.style.overflow = anyOpen ? 'hidden' : '';
}

function setupModal(modalId, onClose) {
  const modal = document.getElementById(modalId);
  if (!modal) return null;

  const closeFn = () => {
    modal.classList.remove('open');
    updateBodyOverflow();
    if (typeof onClose === 'function') onClose();
  };

  const getFocusable = () =>
    modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

  let lastFocused = null;
  let wasOpen = false;

  modal.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeFn();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = Array.from(getFocusable()).filter(el => el.offsetParent !== null);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeFn();
  });

  const observer = new MutationObserver(() => {
    const isOpen = modal.classList.contains('open');

    if (isOpen && !wasOpen) {
      lastFocused = document.activeElement;
      updateBodyOverflow();
      setTimeout(() => {
        const focusable = Array.from(getFocusable()).filter(el => el.offsetParent !== null);
        if (focusable.length) focusable[0].focus();
      }, 60);
    } else if (!isOpen && wasOpen) {
      updateBodyOverflow();
      if (lastFocused && typeof lastFocused.focus === 'function') {
        try { lastFocused.focus(); } catch (e) {}
      }
    }

    wasOpen = isOpen;
  });
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });

  return { modal, closeFn };
}

// =============================================
// ===== ЗАГРУЗКА ТОВАРОВ И ПРОМОКОДОВ =====
// =============================================
async function loadProducts() {
  try {
    const response = await fetch(WORKER_URL + 'products');
    if (!response.ok) throw new Error('Ошибка загрузки товаров');
    products = await response.json();
    await loadPromocodes();
    switchCategory(currentCategory);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    products = [];
    document.getElementById('categoryContent').innerHTML = `
      <div class="placeholder">
        <h3>Не удалось загрузить каталог</h3>
        <p>Проверьте интернет-соединение</p>
        <button class="btn btn-primary" onclick="loadProducts()" style="margin-top:20px;">Повторить</button>
      </div>`;
  }
}

async function loadPromocodes() {
  try {
    const response = await fetch(WORKER_URL + 'promocodes');
    if (response.ok) promocodes = await response.json();
  } catch (error) {
    console.error('Ошибка загрузки промокодов:', error);
    promocodes = [];
  }
}

// =============================================
// ===== РЕФЕРАЛЬНАЯ СИСТЕМА =====
// =============================================
function checkReferral() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  if (ref && !localStorage.getItem('user_telegram')) {
    localStorage.setItem('referralCode', ref);
  }
  referralCode = localStorage.getItem('referralCode') || null;
}

// =============================================
// ===== ОБЪЯВЛЕНИЕ =====
// =============================================
async function checkAnnouncement() {
  try {
    const response = await fetch(WORKER_URL + 'announcement');
    if (!response.ok) return;
    const data = await response.json();

    if (!data || !data.enabled) return;
    if (!data.title && !data.text && !data.image) return;

    const version = data.updatedAt || 'default';
    const seenKey = 'announcement_seen_' + version;
    if (localStorage.getItem(seenKey)) return;

    setTimeout(() => showAnnouncement(data, seenKey), 2000);
  } catch (error) {
    console.error('Announcement error:', error);
  }
}

function showAnnouncement(data, seenKey) {
  const modal = document.getElementById('announcementModal');
  const titleEl = document.getElementById('announcementTitle');
  const img = document.getElementById('announcementImage');
  const text = document.getElementById('announcementText');
  if (!modal) return;

  if (data.title) {
    titleEl.textContent = data.title;
    titleEl.style.display = 'block';
  } else {
    titleEl.textContent = '';
    titleEl.style.display = 'none';
  }

  if (data.image) {
    img.src = data.image;
    img.style.display = 'block';
  } else {
    img.removeAttribute('src');
    img.style.display = 'none';
  }

  if (data.text) {
    text.textContent = data.text;
    text.style.display = 'block';
  } else {
    text.textContent = '';
    text.style.display = 'none';
  }

  modal.classList.add('open');
  localStorage.setItem(seenKey, '1');
}

// =============================================
// ===== ПРОФИЛЬ =====
// =============================================
async function loadUserProfile(telegram) {
  try {
    const response = await fetch(WORKER_URL + 'user/' + encodeURIComponent(telegram));
    if (!response.ok) throw new Error('Ошибка загрузки профиля');
    const data = await response.json();
    currentUser = data;
    updateProfileUI();
    return data;
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
    showToast('⚠️ Не удалось загрузить профиль', 'error');
    return null;
  }
}

function applyAvatar(el, avatarId, fallbackText) {
  if (!el) return;
  el.innerHTML = '';

  const avatar = AVATARS.find(a => a.id === avatarId);
  if (avatar && avatar.image) {
    const img = document.createElement('img');
    img.src = avatar.image;
    img.alt = 'avatar';
    img.style.cssText = 'width:100%; height:100%; object-fit:cover; display:block; border-radius:50%;';
    el.appendChild(img);
  } else {
    el.textContent = fallbackText ? fallbackText.charAt(0).toUpperCase() : '👤';
  }
}

function updateProfileUI() {
  const userBtn = document.getElementById('userBtn');
  if (currentUser && currentUser.telegram) {
    const tickets = currentUser.totalTickets || 0;
    const avatarId = currentUser.avatar || DEFAULT_AVATAR_ID;

    userBtn.innerHTML = `
      <span class="user-btn__avatar"></span>
      <span class="user-btn__name">${currentUser.telegram}</span>
      <span class="user-btn__tickets">🎟️${tickets}</span>
    `;
    applyAvatar(userBtn.querySelector('.user-btn__avatar'), avatarId, currentUser.telegram);

    document.getElementById('profileName').textContent = currentUser.telegram;
    document.getElementById('profileTickets').textContent = tickets;
    document.getElementById('profileOrdersCount').textContent = (currentUser.orders || []).length;

    applyAvatar(document.getElementById('profileAvatar'), avatarId, currentUser.telegram);

    const profileBanner = document.getElementById('profileHeader');
    if (profileBanner) {
      const banner = BANNERS.find(b => b.id === currentUser.banner);
      if (banner) {
        profileBanner.style.backgroundImage = `url('${banner.image}')`;
      } else {
        profileBanner.style.backgroundImage = '';
      }
    }

    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${currentUser.telegram}`;
    const referralDiv = document.getElementById('profileReferral');
    if (referralDiv) {
      referralDiv.innerHTML = `
        <div class="profile-referral-card">
          <div class="profile-referral-card__header">
            <span class="profile-referral-card__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </span>
            <span class="profile-referral-card__title">Реферальная ссылка</span>
          </div>
          <div class="profile-referral-card__body">
            <span class="profile-referral-card__link">${referralLink}</span>
            <button class="profile-referral-card__copy" id="copyReferralBtn">Копировать</button>
          </div>
          <div class="profile-referral-card__footer">
            👥 Приглашено: <strong>${currentUser.referralCount || 0}</strong> человек
          </div>
        </div>
      `;

      const copyBtn = document.getElementById('copyReferralBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', function() {
          navigator.clipboard.writeText(referralLink).then(() => {
            this.textContent = '✓ Скопировано';
            this.classList.add('copied');
            showToast('🔗 Реферальная ссылка скопирована!', 'success');
            setTimeout(() => {
              this.textContent = 'Копировать';
              this.classList.remove('copied');
            }, 2000);
          }).catch(() => {
            showToast('⚠️ Не удалось скопировать', 'error');
          });
        });
      }
    }

    const ordersDiv = document.getElementById('profileOrders');
    if (currentUser.orders && currentUser.orders.length > 0) {
      let html = '';
      currentUser.orders.slice().reverse().forEach(order => {
        const status = order.approved === true ? 'approved' : (order.approved === false ? 'rejected' : 'pending');
        const statusLabel = order.approved === true ? '✅ Одобрен' : (order.approved === false ? '❌ Отклонён' : '⏳ Ожидает');
        const date = new Date(order.date).toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
        const total = order.total || 0;
        html += `
          <div class="order-card ${status}">
            <div class="order-header">
              <span>Заказ #${order.id ? order.id.slice(-6) : '—'}</span>
              <span class="order-total">${Number(total).toFixed(2)} BYN</span>
            </div>
            <div class="order-date">${date}</div>
            <span class="order-status ${status}">${statusLabel}</span>
            ${order.tickets ? `&nbsp;<span style="color:#E7A04A; font-size:13px;">🎟️ ${order.tickets} бил.</span>` : ''}
          </div>
        `;
      });
      ordersDiv.innerHTML = html;
    } else {
      ordersDiv.innerHTML = `
        <div class="orders-empty">
          <div class="orders-empty__icon">📦</div>
          <div class="orders-empty__title">Пока здесь пусто</div>
        </div>
      `;
    }
  } else {
    userBtn.innerHTML = '👤 Войти';
    document.getElementById('profileName').textContent = 'Пользователь';
    document.getElementById('profileTickets').textContent = '0';
    document.getElementById('profileOrdersCount').textContent = '0';
    applyAvatar(document.getElementById('profileAvatar'), null, null);

    const profileBanner = document.getElementById('profileHeader');
    if (profileBanner) profileBanner.style.backgroundImage = '';

    const ordersDiv = document.getElementById('profileOrders');
    if (ordersDiv) {
      ordersDiv.innerHTML = `
        <div class="orders-empty">
          <div class="orders-empty__icon">📦</div>
          <div class="orders-empty__title">Пока здесь пусто</div>
        </div>
      `;
    }
    const referralDiv = document.getElementById('profileReferral');
    if (referralDiv) referralDiv.innerHTML = '';
  }
}

// =============================================
// ===== АВАТАРКА =====
// =============================================
function openAvatarModal() {
  pendingAvatarId = (currentUser && currentUser.avatar) ? currentUser.avatar : DEFAULT_AVATAR_ID;
  renderAvatarGrid();
  document.getElementById('avatarModal').classList.add('open');
}

function renderAvatarGrid() {
  const grid = document.getElementById('avatarGrid');
  grid.innerHTML = AVATARS.map(a => `
    <div class="avatar-option ${pendingAvatarId === a.id ? 'selected' : ''}"
         data-avatar-id="${a.id}"
         title="Аватарка ${a.id}"
         role="button"
         tabindex="0"
         aria-label="Аватарка ${a.id}"
         aria-pressed="${pendingAvatarId === a.id ? 'true' : 'false'}">
      <img src="${a.image}" alt="Аватарка ${a.id}" loading="lazy">
    </div>
  `).join('');

  grid.querySelectorAll('.avatar-option').forEach(el => {
    const select = () => {
      pendingAvatarId = parseInt(el.dataset.avatarId);
      grid.querySelectorAll('.avatar-option').forEach(o => {
        o.classList.remove('selected');
        o.setAttribute('aria-pressed', 'false');
      });
      el.classList.add('selected');
      el.setAttribute('aria-pressed', 'true');
    };
    el.addEventListener('click', select);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select();
      }
    });
  });
}

async function saveAvatar() {
  if (!currentUser || !currentUser.telegram) {
    showToast('⚠️ Войдите в профиль', 'error');
    return;
  }
  if (!pendingAvatarId) {
    showToast('⚠️ Выберите аватарку', 'error');
    return;
  }

  const saveBtn = document.getElementById('avatarSaveBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Сохранение...';

  try {
    const response = await fetch(WORKER_URL + 'update-avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: currentUser.telegram, avatar: pendingAvatarId })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка сохранения');

    currentUser.avatar = pendingAvatarId;
    updateProfileUI();
    avatarModalCtrl.closeFn();
    showToast('✅ Аватарка обновлена!', 'success');
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Сохранить';
  }
}

// =============================================
// ===== ШАПКА =====
// =============================================
function openBannerModal() {
  pendingBannerId = (currentUser && currentUser.banner) ? currentUser.banner : null;
  renderBannerGrid();
  document.getElementById('bannerModal').classList.add('open');
}

function renderBannerGrid() {
  const grid = document.getElementById('bannerGrid');
  grid.innerHTML = BANNERS.map(b => `
    <div class="banner-option ${pendingBannerId === b.id ? 'selected' : ''}"
         data-banner-id="${b.id}"
         style="background-image: url('${b.image}');"
         title="Шапка ${b.id}"
         role="button"
         tabindex="0"
         aria-label="Шапка ${b.id}"
         aria-pressed="${pendingBannerId === b.id ? 'true' : 'false'}"></div>
  `).join('');

  grid.querySelectorAll('.banner-option').forEach(el => {
    const select = () => {
      pendingBannerId = parseInt(el.dataset.bannerId);
      grid.querySelectorAll('.banner-option').forEach(o => {
        o.classList.remove('selected');
        o.setAttribute('aria-pressed', 'false');
      });
      el.classList.add('selected');
      el.setAttribute('aria-pressed', 'true');
    };
    el.addEventListener('click', select);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select();
      }
    });
  });
}

async function saveBanner() {
  if (!currentUser || !currentUser.telegram) {
    showToast('⚠️ Войдите в профиль', 'error');
    return;
  }

  const saveBtn = document.getElementById('bannerSaveBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Сохранение...';

  try {
    const response = await fetch(WORKER_URL + 'update-banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: currentUser.telegram, banner: pendingBannerId })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка сохранения');

    currentUser.banner = pendingBannerId;
    updateProfileUI();
    bannerModalCtrl.closeFn();
    showToast(pendingBannerId ? '✅ Шапка обновлена!' : '✅ Шапка убрана', 'success');
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Сохранить';
  }
}

function removeBanner() {
  pendingBannerId = null;
  const grid = document.getElementById('bannerGrid');
  grid.querySelectorAll('.banner-option').forEach(o => {
    o.classList.remove('selected');
    o.setAttribute('aria-pressed', 'false');
  });
}

// =============================================
// ===== АВТОРИЗАЦИЯ =====
// =============================================
function switchAuthTab(tab) {
  currentAuthTab = tab;
  document.querySelectorAll('.auth-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
    t.setAttribute('aria-selected', t.dataset.tab === tab ? 'true' : 'false');
  });

  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSubtitle');
  const submitText = document.getElementById('authSubmitText');
  const forgot = document.getElementById('authForgot');
  const passwordInput = document.getElementById('loginPassword');

  if (tab === 'register') {
    title.textContent = 'Создать аккаунт';
    subtitle.textContent = 'Зарегистрируйтесь, чтобы получать билетики';
    submitText.textContent = 'Зарегистрироваться';
    forgot.classList.add('hidden');
    passwordInput.setAttribute('autocomplete', 'new-password');
  } else {
    title.textContent = 'С возвращением';
    subtitle.textContent = 'Войдите, чтобы продолжить покупки';
    submitText.textContent = 'Войти';
    forgot.classList.remove('hidden');
    passwordInput.setAttribute('autocomplete', 'current-password');
  }

  clearAuthErrors();
}

function clearAuthErrors() {
  document.querySelectorAll('.auth-error').forEach(el => {
    el.textContent = '';
    el.classList.remove('visible');
  });
  document.querySelectorAll('.auth-field').forEach(el => el.classList.remove('error'));
}

function showFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) {
    field.closest('.auth-field').classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
  }
  if (error) {
    error.textContent = message;
    error.classList.add('visible');
  }
}

function resetAuthForm() {
  document.getElementById('loginInput').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginPassword').type = 'password';
  document.getElementById('togglePassword').textContent = '👁';
  clearAuthErrors();
  switchAuthTab('login');
}

async function login() {
  clearAuthErrors();

  const input = document.getElementById('loginInput');
  const passwordInput = document.getElementById('loginPassword');
  const username = normalizeTelegramUsername(input.value);
  const password = passwordInput.value.trim();

  const userErr = validateTelegramUsername(username);
  if (userErr) {
    showFieldError('loginInput', 'usernameError', userErr);
    return;
  }
  if (!password) {
    showFieldError('loginPassword', 'passwordError', 'Введите пароль');
    return;
  }

  const submitBtn = document.getElementById('authSubmitBtn');
  submitBtn.disabled = true;

  try {
    const response = await fetch(WORKER_URL + 'login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: username, password })
    });
    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error || 'Ошибка входа';
      const lower = errMsg.toLowerCase();
      if (lower.includes('не найден')) {
        showFieldError('loginInput', 'usernameError', 'Пользователь не найден');
      } else if (lower.includes('пароль')) {
        showFieldError('loginPassword', 'passwordError', 'Неверный пароль');
      } else {
        showFieldError('loginPassword', 'passwordError', errMsg);
      }
      return;
    }

    localStorage.setItem('user_telegram', username);
    currentUser = data;
    updateProfileUI();
    loginModalCtrl.closeFn();
    showToast(`✅ Добро пожаловать, ${username}!`, 'success');
    resetAuthForm();
  } catch (err) {
    showFieldError('loginPassword', 'passwordError', err.message || 'Ошибка сети');
  } finally {
    submitBtn.disabled = false;
  }
}

async function register() {
  clearAuthErrors();

  const input = document.getElementById('loginInput');
  const passwordInput = document.getElementById('loginPassword');
  const username = normalizeTelegramUsername(input.value);
  const password = passwordInput.value.trim();

  const userErr = validateTelegramUsername(username);
  if (userErr) {
    showFieldError('loginInput', 'usernameError', userErr);
    return;
  }
  if (!password) {
    showFieldError('loginPassword', 'passwordError', 'Введите пароль');
    return;
  }
  if (password.length < 4) {
    showFieldError('loginPassword', 'passwordError', 'Пароль должен содержать минимум 4 символа');
    return;
  }

  const submitBtn = document.getElementById('authSubmitBtn');
  submitBtn.disabled = true;

  try {
    const response = await fetch(WORKER_URL + 'register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: username, password, ref: referralCode || null })
    });
    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error || 'Ошибка регистрации';
      if (errMsg.toLowerCase().includes('существует')) {
        showFieldError('loginInput', 'usernameError', 'Такой пользователь уже существует');
      } else {
        showFieldError('loginInput', 'usernameError', errMsg);
      }
      return;
    }

    showToast('✅ Регистрация успешна! Теперь войдите.', 'success');
    localStorage.removeItem('referralCode');
    await login();
  } catch (err) {
    showFieldError('loginPassword', 'passwordError', err.message || 'Ошибка сети');
  } finally {
    submitBtn.disabled = false;
  }
}

function initProfile() {
  const saved = localStorage.getItem('user_telegram');
  if (saved) {
    loadUserProfile(saved).then(() => updateProfileUI());
  }
}

// =============================================
// ===== КОРЗИНА =====
// =============================================
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('torgovchik_cart');
    if (saved) {
      cart = JSON.parse(saved);
      cart = cart.map(item => {
        const actual = products.find(p => p.id === item.id);
        return actual ? { ...actual, quantity: item.quantity } : item;
      });
      updateCartUI();
    }
  } catch (e) {
    console.error('Ошибка загрузки корзины:', e);
    cart = [];
  }
}

function saveCartToStorage() {
  localStorage.setItem('torgovchik_cart', JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCartToStorage();
  updateCartUI();
  showToast(`✅ ${product.name} добавлен в корзину`, 'success');
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  saveCartToStorage();
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToStorage();
  updateCartUI();
}

function getCartTotal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (discountPercent > 0) {
    return parseFloat((subtotal * (1 - discountPercent / 100)).toFixed(2));
  }
  return parseFloat(subtotal.toFixed(2));
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
    cartTotal.textContent = '0.00';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__info">
        <span class="cart-item__name">${item.name}</span>
        <span class="cart-item__price">${item.price} BYN</span>
      </div>
      <div class="cart-item__controls">
        <button class="cart-qty-btn" onclick="changeQuantity(${item.id}, -1)" aria-label="Уменьшить количество">−</button>
        <span class="cart-qty-val">${item.quantity}</span>
        <button class="cart-qty-btn" onclick="changeQuantity(${item.id}, 1)" aria-label="Увеличить количество">+</button>
        <button class="cart-item__remove" onclick="removeFromCart(${item.id})" aria-label="Удалить товар">✕</button>
      </div>
    </div>
  `).join('');

  cartTotal.textContent = getCartTotal();
}

function openCart() {
  cartPanel.classList.add('open');
  overlay.classList.add('show');
  cartPanel.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartPanel.classList.remove('open');
  overlay.classList.remove('show');
  cartPanel.setAttribute('aria-hidden', 'true');
}

// =============================================
// ===== ТОСТЫ =====
// =============================================
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// =============================================
// ===== ПРОМОКОДЫ =====
// =============================================
const promoInput = document.getElementById('promoCode');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoMessage = document.getElementById('promoMessage');

function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();
  if (!code) {
    promoMessage.textContent = '⚠️ Введите промокод';
    promoMessage.style.color = '#ff7777';
    return;
  }
  if (appliedPromo === code) {
    promoMessage.textContent = 'ℹ️ Этот промокод уже применён';
    promoMessage.style.color = '#B9A99A';
    return;
  }
  const promo = promocodes.find(p => p.code === code);
  if (promo) {
    discountPercent = promo.discount;
    appliedPromo = code;
    promoMessage.textContent = `✅ Промокод "${code}" применён! Скидка ${discountPercent}%`;
    promoMessage.style.color = '#8aff8a';
    promoInput.disabled = true;
    applyPromoBtn.disabled = true;
    updateCartUI();
    showToast(`✅ Промокод "${code}" применён!`, 'success');
  } else {
    promoMessage.textContent = `❌ Промокод "${code}" не найден`;
    promoMessage.style.color = '#ff7777';
  }
}

// =============================================
// ===== ФИЛЬТРЫ =====
// =============================================
function initFilters(category) {
  const container = document.getElementById('filterContainer');
  if (!container) return;

  const catProducts = products.filter(p => p.category === category);
  const brands = [...new Set(catProducts.map(p => p.brand))];

  container.innerHTML = brands.map(b => `
    <button class="filter-btn" data-filter="${b}">${b}</button>
  `).join('');

  const firstBtn = container.querySelector('.filter-btn');
  if (firstBtn) {
    firstBtn.classList.add('active');
    firstBtn.setAttribute('aria-pressed', 'true');
    renderProducts(category, firstBtn.dataset.filter);
  } else {
    renderProducts(category, 'Все');
  }

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderProducts(category, btn.dataset.filter);
    });
  });
}

// =============================================
// ===== ОТРИСОВКА ТОВАРОВ =====
// =============================================
function renderProducts(category, filter = 'Все') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  let filtered = products.filter(p => p.category === category);
  if (filter !== 'Все') filtered = filtered.filter(p => p.brand === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="placeholder"><p>В этой категории пока нет товаров</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" class="product-card__image" loading="lazy" onerror="this.src='https://i.ibb.co/VWRmsGHt/logo.png'">
      <div class="product-card__name">${p.name}</div>
      <div class="product-card__brand">${p.brand}</div>
      <div class="product-card__price">${p.price} BYN</div>
      <button class="product-card__btn" onclick="addToCart(${p.id})" aria-label="Добавить ${p.name} в корзину">В корзину</button>
    </div>
  `).join('');
}

// =============================================
// ===== КАТЕГОРИИ =====
// =============================================
const categoryBtns = document.querySelectorAll('.category-btn');
const categoryBtnsMobile = document.querySelectorAll('.category-btn-mobile');
const categoryContent = document.getElementById('categoryContent');

function switchCategory(category) {
  currentCategory = category;

  categoryBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));
  categoryBtnsMobile.forEach(btn => btn.classList.toggle('active', btn.dataset.category === category));

  if (category === 'liquids' || category === 'snus') {
    categoryContent.innerHTML = `
      <div class="category-content active">
        <div class="catalog__filters" id="filterContainer"></div>
        <div class="catalog__grid" id="productGrid"></div>
      </div>`;
    initFilters(category);
  } else if (category === 'coils' || category === 'disposables') {
    categoryContent.innerHTML = `
      <div class="category-content active">
        <div class="catalog__grid" id="productGrid"></div>
      </div>`;
    renderProducts(category, 'Все');
  } else {
    categoryContent.innerHTML = `
      <div class="category-content active">
        <div class="placeholder">
          <h3>Скоро появится!</h3>
          <p style="font-size: 14px; margin-top: 8px; color: #9D887A;">Следите за обновлениями</p>
        </div>
      </div>`;
  }
}

// =============================================
// ===== ИНИЦИАЛИЗАЦИЯ МОДАЛОК =====
// =============================================
const loginModalCtrl = setupModal('loginModal');
const profileModalCtrl = setupModal('profileModal');
const avatarModalCtrl = setupModal('avatarModal', () => { pendingAvatarId = null; });
const bannerModalCtrl = setupModal('bannerModal', () => { pendingBannerId = null; });
const orderModalCtrl = setupModal('orderModal');
const announcementCtrl = setupModal('announcementModal');

document.getElementById('loginModalClose').addEventListener('click', () => loginModalCtrl.closeFn());
document.getElementById('profileModalClose').addEventListener('click', () => profileModalCtrl.closeFn());
document.getElementById('avatarModalClose').addEventListener('click', () => avatarModalCtrl.closeFn());
document.getElementById('avatarCancelBtn').addEventListener('click', () => avatarModalCtrl.closeFn());
document.getElementById('bannerModalClose').addEventListener('click', () => bannerModalCtrl.closeFn());
document.getElementById('orderModalClose').addEventListener('click', () => orderModalCtrl.closeFn());
document.getElementById('announcementClose').addEventListener('click', () => announcementCtrl.closeFn());
document.getElementById('announcementOk').addEventListener('click', () => announcementCtrl.closeFn());

document.getElementById('userBtn').addEventListener('click', () => {
  if (currentUser && currentUser.telegram) {
    document.getElementById('profileModal').classList.add('open');
    updateProfileUI();
  } else {
    resetAuthForm();
    document.getElementById('loginModal').classList.add('open');
  }
});

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
});

document.getElementById('authForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (currentAuthTab === 'register') register();
  else login();
});

document.getElementById('togglePassword').addEventListener('click', function() {
  const input = document.getElementById('loginPassword');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  this.textContent = isPassword ? '🙈' : '👁';
  this.setAttribute('aria-label', isPassword ? 'Скрыть пароль' : 'Показать пароль');
});

document.querySelectorAll('.auth-field input').forEach(input => {
  input.addEventListener('focus', () => input.closest('.auth-field').classList.add('focused'));
  input.addEventListener('blur', () => input.closest('.auth-field').classList.remove('focused'));
  input.addEventListener('input', () => {
    input.closest('.auth-field').classList.remove('error');
    input.removeAttribute('aria-invalid');
  });
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
  e.preventDefault();
  showToast('📩 Напишите в наш Telegram — поможем восстановить пароль', 'info');
});

document.getElementById('profileLogout').addEventListener('click', () => {
  localStorage.removeItem('user_telegram');
  currentUser = null;
  updateProfileUI();
  profileModalCtrl.closeFn();
  showToast('👋 Вы вышли из профиля', 'info');
});

document.getElementById('avatarEditBtn').addEventListener('click', openAvatarModal);
document.getElementById('avatarSaveBtn').addEventListener('click', saveAvatar);

document.getElementById('bannerEditBtn').addEventListener('click', openBannerModal);
document.getElementById('bannerRemoveBtn').addEventListener('click', removeBanner);
document.getElementById('bannerSaveBtn').addEventListener('click', saveBanner);

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// =============================================
// ===== ФОРМА ЗАКАЗА =====
// =============================================
const orderForm = document.getElementById('orderForm');
const orderMessage = document.getElementById('orderMessage');

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Корзина пуста. Добавьте товары.', 'error');
    return;
  }
  if (currentUser && currentUser.telegram) {
    document.getElementById('orderTelegram').value = '@' + currentUser.telegram;
  }
  orderIdempotencyKey = null;
  document.getElementById('orderModal').classList.add('open');
  orderMessage.style.display = 'none';
  orderMessage.textContent = '';
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('orderName').value.trim();
  const telegramRaw = document.getElementById('orderTelegram').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const comment = document.getElementById('orderComment').value.trim();

  if (!name) {
    orderMessage.style.display = 'block';
    orderMessage.textContent = '⚠️ Пожалуйста, укажите имя.';
    orderMessage.style.color = '#ff7777';
    return;
  }

  const telegramClean = normalizeTelegramUsername(telegramRaw);
  const telegramErr = validateTelegramUsername(telegramClean);
  if (telegramErr) {
    orderMessage.style.display = 'block';
    orderMessage.textContent = '⚠️ ' + telegramErr;
    orderMessage.style.color = '#ff7777';
    return;
  }
  const telegramForServer = '@' + telegramClean;

  const submitBtn = document.getElementById('orderSubmit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  if (!orderIdempotencyKey) {
    orderIdempotencyKey = generateUUID();
  }

  const orderData = {
    name,
    telegram: telegramForServer,
    address,
    comment,
    items: cart,
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    total: getCartTotal(),
    promo: appliedPromo,
    discount: discountPercent,
    idempotencyKey: orderIdempotencyKey
  };

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: orderData })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка отправки заказа');
    }

    orderMessage.style.display = 'block';
    orderMessage.textContent = '✅ Заказ успешно отправлен! Мы свяжемся с вами в Telegram.';
    orderMessage.style.color = '#8aff8a';

    setTimeout(() => {
      cart = [];
      appliedPromo = null;
      discountPercent = 0;
      orderIdempotencyKey = null;
      saveCartToStorage();
      updateCartUI();
      closeCart();
      orderModalCtrl.closeFn();
      orderForm.reset();
      orderMessage.style.display = 'none';
      promoInput.value = '';
      promoInput.disabled = false;
      applyPromoBtn.disabled = false;
      promoMessage.textContent = '';
      showToast('✅ Заказ оформлен! Спасибо!', 'success');
      if (currentUser && currentUser.telegram) loadUserProfile(currentUser.telegram);
    }, 2000);

  } catch (error) {
    console.error('Ошибка отправки:', error);
    orderMessage.style.display = 'block';
    orderMessage.textContent = `⚠️ Ошибка: ${error.message || 'Неизвестная ошибка'}. Попробуйте позже.`;
    orderMessage.style.color = '#ff7777';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить заказ';
  }
});

applyPromoBtn.addEventListener('click', applyPromo);
promoInput.addEventListener('keypress', e => { if (e.key === 'Enter') applyPromo(); });

// =============================================
// ===== ПЕРЕКЛЮЧЕНИЕ КАТЕГОРИЙ =====
// =============================================
categoryBtns.forEach(btn => btn.addEventListener('click', () => switchCategory(btn.dataset.category)));
categoryBtnsMobile.forEach(btn => {
  btn.addEventListener('click', () => {
    switchCategory(btn.dataset.category);
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// =============================================
// ===== БУРГЕР =====
// =============================================
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

burger.setAttribute('aria-expanded', 'false');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

document.addEventListener('click', e => {
  if (!e.target.closest('.header__inner')) {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// =============================================
// ===== FAQ =====
// =============================================
document.querySelectorAll('.faq__question').forEach(question => {
  question.setAttribute('role', 'button');
  question.setAttribute('tabindex', '0');
  question.setAttribute('aria-expanded', 'false');

  const toggle = () => {
    const parent = question.closest('.faq__item');
    if (!parent) return;
    const isOpen = parent.classList.toggle('open');
    question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  question.addEventListener('click', toggle);
  question.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});

// =============================================
// ===== ПАСХАЛКА НА ЛОГОТИПЕ =====
// =============================================
document.addEventListener('DOMContentLoaded', function() {
  const logo = document.querySelector('.logo');
  if (!logo) return;

  let tooltipTimeout = null;

  logo.addEventListener('click', function(e) {
    e.preventDefault();

    const oldTooltip = logo.querySelector('.logo-tooltip');
    if (oldTooltip) oldTooltip.remove();
    if (tooltipTimeout) clearTimeout(tooltipTimeout);

    const phrase = LOGO_PHRASES[Math.floor(Math.random() * LOGO_PHRASES.length)];
    const tooltip = document.createElement('div');
    tooltip.className = 'logo-tooltip';
    tooltip.textContent = phrase;
    tooltip.setAttribute('role', 'status');

    logo.appendChild(tooltip);
    requestAnimationFrame(() => tooltip.classList.add('show'));

    tooltipTimeout = setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => tooltip.remove(), 300);
    }, 2500);
  });
});

// =============================================
// ===== ЗАПУСК =====
// =============================================
checkReferral();
loadProducts().then(() => {
  loadCartFromStorage();
  initProfile();
  checkAnnouncement();
});