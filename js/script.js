// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';
const RECENTLY_VIEWED_KEY = 'torgovchik_recently_viewed';
const RECENTLY_VIEWED_MAX = 12;
const PROMO_KEY = 'torgovchik_promo';
const USER_CACHE_KEY = 'torgovchik_user_cache';

// =============================================
// ===== ДОСТУПНЫЕ АВАТАРКИ =====
// =============================================
const AVATARS = [
    { id: 1,  image: 'assets/avatars/1.png' },
    { id: 2,  image: 'assets/avatars/2.png' },
    { id: 3,  image: 'assets/avatars/3.png' },
    { id: 4,  image: 'assets/avatars/4.png' },
    { id: 5,  image: 'assets/avatars/5.png' },
    { id: 6,  image: 'assets/avatars/6.png' },
    { id: 7,  image: 'assets/avatars/7.png' },
    { id: 8,  image: 'assets/avatars/8.png' },
    { id: 9,  image: 'assets/avatars/9.png' },
    { id: 10, image: 'assets/avatars/10.png' },
    { id: 11, image: 'assets/avatars/11.png' },
    { id: 12, image: 'assets/avatars/12.png' },
    { id: 13, image: 'assets/avatars/13.png' },
    { id: 14, image: 'assets/avatars/14.png' },
    { id: 15, image: 'assets/avatars/15.png' },
    { id: 16, image: 'assets/avatars/16.png' },
    { id: 17, image: 'assets/avatars/17.png' },
    { id: 18, image: 'assets/avatars/18.png' },
    { id: 19, image: 'assets/avatars/19.png' },
    { id: 20, image: 'assets/avatars/20.png' }
];

const DEFAULT_AVATAR_ID = 6;

// =============================================
// ===== ШАПКИ ПРОФИЛЯ (чистый CSS, без картинок) =====
// skin — класс из modal.css (секция «CSS-ШАПКИ ПРОФИЛЯ»),
// вешается и на шапку профиля, и на превью в сетке выбора
// =============================================
const BANNERS = [
    { id: 1, name: 'Amber Glow', skin: 'banner-skin-amber' },
    { id: 2, name: 'Frost Blue', skin: 'banner-skin-frost' },
    { id: 3, name: 'Deep Noir', skin: 'banner-skin-noir' },
    { id: 4, name: 'Geometry', skin: 'banner-skin-geo' }
];
const BANNER_SKINS = BANNERS.map(b => b.skin);

// =============================================
// ===== ФРАЗЫ НА ЛОГОТИПЕ =====
// =============================================
const LOGO_PHRASES = [
    'Купил жижу?', 'Заправиться не хочешь?', 'Есть вкусненькое?',
    'Скучал по нам?', 'Как насчёт новой вкусняшки?', 'Жижа сама себя не купит!',
    'Пара затяжек — и день ярче', 'Твой Pod скучает по новой жиже',
    'Вкусный день сегодня, да?', 'Псс, есть кое-что новенькое...'
];

// =============================================
// ===== SVG-ИКОНКИ (Lucide, stroke=currentColor) =====
// =============================================
// Используются в тостах, подтверждениях, статусах заказов и пустых состояниях.
// Атрибуты базовые, aria-hidden не нужен — иконки декоративные внутри role="status" и т.п.
const SVG_BASE = 'width="#SIZE#" height="#SIZE#" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px;" aria-hidden="true"';

function svgIcon(paths, size) {
  return `<svg ${SVG_BASE.replace(/#SIZE#/g, size || 16)}>${paths}</svg>`;
}

const UI_ICONS = {
  info:   s => svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', s),
  success: s => svgIcon('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', s),
  error:  s => svgIcon('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>', s),
  warning: s => svgIcon('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>', s),
  trash:  s => svgIcon('<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>', s),
  heart:  s => svgIcon('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>', s),
  heartCrack: s => svgIcon('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="m12 13-1-1 2-2-3-3 2-2"/>', s),
  user:   s => svgIcon('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', s),
  users:  s => svgIcon('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', s),
  ticket: s => svgIcon('<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>', s),
  package: s => svgIcon('<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>', s),
  clock:  s => svgIcon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s)
};

// =============================================
// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
// =============================================
let products = [];
let productStats = {}; 
let promocodes = [];
let cart = [];
let favorites = [];
let appliedPromo = null;
let discountPercent = 0;
let currentUser = null;
let referralCode = null;
let pendingAvatarId = null;
let pendingBannerId = null;
let currentAuthTab = 'login';
let currentCategory = 'liquids';
let orderIdempotencyKey = null;

let retryTimer = null;
let retryInterval = null;
let retryCountdown = 0;

// =============================================
// ===== УНИВЕРСАЛЬНЫЕ ФУНКЦИИ ДЛЯ МОДАЛОК =====
// =============================================
function showModal(modal) {
  if (!modal) return;
  modal.classList.add('open', 'show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
  if (!modal) return;
  modal.classList.remove('open', 'show');
  modal.setAttribute('aria-hidden', 'true');
  const anyOpen = document.querySelector(
    '.login-modal.open, .profile-modal.open, .avatar-modal.open, .banner-modal.open, .order-modal.open, .announcement-modal.open, .favorites-modal.open, .confirm-modal.open, .age-gate-modal.open'
  );
  if (!anyOpen) document.body.style.overflow = '';
}

// =============================================
// ===== 18+ ВРАТА =====
// =============================================
function initAgeGate() {
  const isVerified = localStorage.getItem('torgovchik_age_verified') === 'true';
  const modal = document.getElementById('ageGateModal');
  if (!modal) return;

  if (isVerified) {
    hideModal(modal);
    return;
  }

  showModal(modal);

  const question = document.getElementById('ageGateQuestion');
  const deny = document.getElementById('ageGateDeny');

  document.getElementById('ageGateYes').addEventListener('click', () => {
    localStorage.setItem('torgovchik_age_verified', 'true');
    hideModal(modal);
  });

  document.getElementById('ageGateNo').addEventListener('click', () => {
    question.style.display = 'none';
    deny.classList.add('open', 'show');
  });
}

// =============================================
// ===== КНОПКА "НАВЕРХ" =====
// =============================================
function initScrollToTop() {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================================
// ===== CONFIRM-МОДАЛКА =====
// =============================================
function showConfirm(options) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    const iconEl = document.getElementById('confirmIcon');
    const titleEl = document.getElementById('confirmTitle');
    const textEl = document.getElementById('confirmText');
    const okBtn = document.getElementById('confirmOkBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');

    iconEl.innerHTML = options.icon || UI_ICONS.warning(40);
    titleEl.textContent = options.title || 'Подтвердите действие';
    textEl.textContent = options.text || '';
    okBtn.textContent = options.okText || 'Подтвердить';
    cancelBtn.textContent = options.cancelText || 'Отмена';
    
    okBtn.className = 'confirm-modal__btn ' + (options.danger ? 'confirm-modal__btn--danger' : 'confirm-modal__btn--primary');

    showModal(modal);
    okBtn.focus();

    const closeAndResolve = (result) => {
      hideModal(modal);
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      modal.removeEventListener('click', onOverlay);
      modal.removeEventListener('keydown', onKeydown);
      document.removeEventListener('keydown', onKeydown);
      resolve(result);
    };

    const onOk = () => closeAndResolve(true);
    const onCancel = () => closeAndResolve(false);
    const onOverlay = (e) => {
      if (e.target === modal) closeAndResolve(false);
    };
    // Esc закрывает, Tab циркулирует внутри модалки
    const onKeydown = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); closeAndResolve(false); return; }
      if (e.key === 'Tab') {
        const focusable = getModalFocusable(modal);
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    modal.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onKeydown);
  });
}

// =============================================
// ===== УТИЛИТЫ МОДАЛОК (для setupModal) =====
// =============================================
function updateBodyOverflow() {
  const anyOpen = document.querySelector(
    '.login-modal.open, .profile-modal.open, .avatar-modal.open, .banner-modal.open, .order-modal.open, .announcement-modal.open, .favorites-modal.open, .confirm-modal.open, .age-gate-modal.open'
  );
  document.body.style.overflow = anyOpen ? 'hidden' : '';
}

// Поиск фокусируемых элементов внутри модалки (используется setupModal и showConfirm)
function getModalFocusable(modal) {
  return Array.from(modal.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )).filter(el => el.offsetParent !== null);
}

function setupModal(modalId, onClose, opts) {
  const modal = document.getElementById(modalId);
  if (!modal) return null;
  const options = opts || {};
  const dismissible = options.dismissible !== false;

  const closeFn = () => {
    hideModal(modal);
    if (typeof onClose === 'function') onClose();
  };

  let lastFocused = null;
  let wasOpen = false;

  modal.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open') && !modal.classList.contains('show')) return;
    // Возрастные ворота нельзя закрыть по Esc/клику вне окна (юридическое требование)
    if (dismissible && e.key === 'Escape') { e.preventDefault(); closeFn(); return; }

    if (e.key === 'Tab') {
      const focusable = getModalFocusable(modal);
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  modal.addEventListener('click', (e) => {
    if (dismissible && e.target === modal) closeFn();
  });

  const observer = new MutationObserver(() => {
    const isOpen = modal.classList.contains('open') || modal.classList.contains('show');
    if (isOpen && !wasOpen) {
      lastFocused = document.activeElement;
      updateBodyOverflow();
      setTimeout(() => {
        const focusable = getModalFocusable(modal);
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
// ===== ТОСТЫ =====
// =============================================
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type, action) {
  type = type || 'info';
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  
  const iconSvg = type === 'success' ? UI_ICONS.success(20) : type === 'error' ? UI_ICONS.error(20) : UI_ICONS.info(20);

  const iconEl = document.createElement('span');
  iconEl.className = 'toast__icon';
  iconEl.innerHTML = iconSvg;
  const msgEl = document.createElement('span');
  msgEl.className = 'toast__message';
  // textContent — message может содержать текст ошибки с сервера
  msgEl.textContent = message;
  toast.appendChild(iconEl);
  toast.appendChild(msgEl);

  if (action) {
    const btn = document.createElement('button');
    btn.className = 'toast__action';
    btn.textContent = action.text;
    btn.style.cssText = 'background:var(--accent); color:#17191B; border:none; padding:4px 10px; border-radius:4px; font-weight:bold; margin-left:10px; cursor:pointer; font-size:12px;';
    btn.addEventListener('click', () => {
      action.onClick();
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    });
    toast.appendChild(btn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast__close';
  closeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  closeBtn.addEventListener('click', () => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  });
  toast.appendChild(closeBtn);

  toastContainer.appendChild(toast);
  
  const timeout = setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 300);
    }
  }, action ? 5000 : 3500);

  if (action) {
    toast.addEventListener('mouseenter', () => clearTimeout(timeout), { once: true });
  }
}

// =============================================
// ===== ЗАГРУЗКА ТОВАРОВ И ПРОМОКОДОВ =====
// =============================================
function renderSkeletonCatalog() {
  const content = document.getElementById('categoryContent');
  if (!content) return;
  const skeletonCards = Array(6).fill(0).map(() => `
    <div class="product-card product-card--skeleton">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-line skeleton-line--short"></div>
      <div class="skeleton skeleton-line skeleton-line--tiny"></div>
      <div class="skeleton skeleton-line skeleton-line--price"></div>
    </div>
  `).join('');
  content.innerHTML = `
    <div class="category-content active">
      <div class="catalog__grid">${skeletonCards}</div>
    </div>
  `;
}

function renderCatalogError() {
  const content = document.getElementById('categoryContent');
  if (!content) return;
  content.innerHTML = `
    <div class="placeholder">
      <h3>Не удалось загрузить каталог</h3>
      <p>Проверьте интернет-соединение</p>
      <button class="btn btn-primary" onclick="manualRetry()" style="margin-top:20px;">Повторить</button>
      <p class="catalog-retry-notice" id="retryNotice" style="display:none;">
        Следующая попытка через <span class="catalog-retry-notice__count" id="retryCountdown">5</span> сек...
      </p>
    </div>`;
}

function manualRetry() {
  clearTimeout(retryTimer);
  if (retryInterval) { clearInterval(retryInterval); retryInterval = null; }
  retryTimer = null;
  loadProducts();
}

function startAutoRetry() {
  if (retryTimer) clearTimeout(retryTimer);
  if (retryInterval) clearInterval(retryInterval);
  retryTimer = null;
  retryInterval = null;
  retryCountdown = 5;
  
  const notice = document.getElementById('retryNotice');
  const counter = document.getElementById('retryCountdown');
  if (notice) notice.style.display = 'block';
  if (counter) counter.textContent = retryCountdown;

  // Интервал только для отсчёта на экране; единственный реальный вызов — по таймеру ниже
  retryInterval = setInterval(() => {
    if (retryCountdown > 0) {
      retryCountdown--;
      if (counter) counter.textContent = retryCountdown;
    } else {
      clearInterval(retryInterval);
      retryInterval = null;
    }
  }, 1000);

  retryTimer = setTimeout(() => {
    if (retryInterval) { clearInterval(retryInterval); retryInterval = null; }
    loadProducts();
  }, 5000);
}

async function loadProductStats() {
  try {
    const response = await fetch(WORKER_URL + 'product-stats');
    if (response.ok) {
      productStats = await response.json();
    }
  } catch (e) {
    productStats = {};
  }
}

async function loadProducts() {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
  if (retryInterval) {
    clearInterval(retryInterval);
    retryInterval = null;
  }
  
  renderSkeletonCatalog();
  
  try {
    const response = await fetch(WORKER_URL + 'products');
    if (!response.ok) throw new Error('Ошибка загрузки товаров');
    
    products = await response.json();
    
    await Promise.all([loadPromocodes(), loadProductStats()]);
    
    switchCategory(currentCategory);
    renderRecentlyViewedOnIndex();
    loadCartFromStorage(true);
    
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    products = [];
    renderCatalogError();
    startAutoRetry();
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
  restorePromo();
}

// Восстановление промокода между сессиями: код хранится в localStorage,
// скидка заново сверяется со списком с сервера (удалили/изменили — сбросится)
function restorePromo() {
  const saved = localStorage.getItem(PROMO_KEY);
  if (!saved) return;
  const promo = promocodes.find(p => p.code === saved);
  if (promo) {
    appliedPromo = promo.code;
    discountPercent = promo.discount;
    if (promoInput) promoInput.value = promo.code;
    if (promoInput) promoInput.disabled = true;
    if (applyPromoBtn) applyPromoBtn.disabled = true;
    if (promoMessage) {
      promoMessage.textContent = `Промокод "${promo.code}" применён! Скидка ${discountPercent}%`;
      promoMessage.style.color = '#2ecc71';
    }
  } else {
    localStorage.removeItem(PROMO_KEY);
  }
}

function persistPromo(code) {
  if (code) localStorage.setItem(PROMO_KEY, code);
  else localStorage.removeItem(PROMO_KEY);
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
// ===== НЕДАВНО ПРОСМОТРЕННЫЕ =====
// =============================================
function loadRecentlyViewed() {
  try {
    const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (saved) {
      const arr = JSON.parse(saved);
      return Array.isArray(arr) ? arr : [];
    }
  } catch (e) {}
  return [];
}

function renderRecentlyViewedOnIndex() {
  const section = document.getElementById('recentlyViewedSection');
  const grid = document.getElementById('recentlyViewedGrid');
  if (!section || !grid) return;

  const ids = loadRecentlyViewed();
  const items = ids
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, RECENTLY_VIEWED_MAX);

  if (items.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  grid.innerHTML = items.map(p => `
    <a href="product.html?id=${encodeURIComponent(String(p.id))}" class="recently-viewed__card">
      <img src="${Utils.escapeHtml(p.image)}" alt="${Utils.escapeHtml(p.name)}" class="recently-viewed__image" loading="lazy" onerror="this.src='assets/logo.png'">
      <div class="recently-viewed__name">${Utils.escapeHtml(p.name)}</div>
      <div class="recently-viewed__brand">${Utils.escapeHtml(p.brand)}</div>
      <div class="recently-viewed__price">${Utils.escapeHtml(p.price)} BYN</div>
    </a>
  `).join('');
}

// =============================================
// ===== ИЗБРАННОЕ =====
// =============================================
function loadFavoritesFromStorage() {
  try {
    const saved = localStorage.getItem('torgovchik_favorites');
    if (saved) {
      favorites = JSON.parse(saved);
      if (!Array.isArray(favorites)) favorites = [];
    }
  } catch (e) {
    console.error('Ошибка загрузки избранного:', e);
    favorites = [];
  }
  updateFavoritesUI();
}

function saveFavoritesToStorage() {
  localStorage.setItem('torgovchik_favorites', JSON.stringify(favorites));
}

function toggleFavorite(productId) {
  const product = products.find(p => p.id === productId);
  const result = Utils.toggleFavoriteInList(favorites, productId);
  favorites = result.list;
  saveFavoritesToStorage();
  updateFavoritesUI();
  refreshFavoriteIcons();

  if (result.added) {
    showToast(`${product ? product.name : 'Товар'} добавлен в избранное`, 'success');
  } else {
    showToast(`${product ? product.name : 'Товар'} убран из избранного`, 'info');
  }
}

function updateFavoritesUI() {
  const countEl = document.getElementById('favoritesCount');
  if (countEl) countEl.textContent = favorites.length;

  const toggleBtn = document.getElementById('favoritesToggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.favorites-icon');
    if (icon) icon.innerHTML = favorites.length > 0 ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  }

  const grid = document.getElementById('favoritesGrid');
  if (grid) renderFavoritesModal();
}

function refreshFavoriteIcons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = parseInt(card.dataset.id);
    const heart = card.querySelector('.product-card__fav');
    if (heart) {
      const active = Utils.isFavorite(favorites, id);
      heart.classList.toggle('active', active);
      heart.innerHTML = active ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
      heart.setAttribute('aria-label', active ? 'Убрать из избранного' : 'Добавить в избранное');
      heart.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  });
}

function renderFavoritesModal() {
  const grid = document.getElementById('favoritesGrid');
  if (!grid) return;

  const favProducts = favorites
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  if (favProducts.length === 0) {
    grid.innerHTML = `
      <div class="favorites-empty">
        <div class="favorites-empty__icon" style="color:var(--accent); margin-bottom:16px;">${UI_ICONS.heartCrack(48)}</div>
        <div class="favorites-empty__title" style="font-family:'Bitter', serif; font-size:20px; margin-bottom:8px;">Пока ничего нет</div>
        <div class="favorites-empty__text" style="color:var(--text-secondary); margin-bottom:20px;">Добавляйте товары сердечком — они появятся здесь</div>
        <button class="btn btn-primary favorites-empty__btn" id="favoritesGoCatalog">В каталог</button>
      </div>
    `;
    const goBtn = document.getElementById('favoritesGoCatalog');
    if (goBtn) {
      goBtn.addEventListener('click', () => {
        favoritesModalCtrl.closeFn();
        document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
      });
    }
    return;
  }

  grid.innerHTML = favProducts.map(p => `
    <div class="favorites-card" data-id="${Utils.escapeHtml(p.id)}">
      <button class="favorites-card__fav" data-id="${Utils.escapeHtml(p.id)}" aria-label="Убрать из избранного" aria-pressed="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
      <a href="product.html?id=${encodeURIComponent(String(p.id))}" class="favorites-card__link" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; flex:1;">
        <img src="${Utils.escapeHtml(p.image)}" alt="${Utils.escapeHtml(p.name)}" class="favorites-card__image" loading="lazy" onerror="this.src='assets/logo.png'">
        <div class="favorites-card__name">${Utils.escapeHtml(p.name)}</div>
        <div class="favorites-card__brand">${Utils.escapeHtml(p.brand)}</div>
        <div class="favorites-card__price">${Utils.escapeHtml(p.price)} BYN</div>
      </a>
      <button class="favorites-card__btn" data-id="${Utils.escapeHtml(p.id)}">В корзину</button>
    </div>
  `).join('');

  grid.querySelectorAll('.favorites-card__fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(parseInt(btn.dataset.id));
    });
  });

  grid.querySelectorAll('.favorites-card__btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(parseInt(btn.dataset.id));
    });
  });
}

function openFavoritesModal() {
  renderFavoritesModal();
  showModal(document.getElementById('favoritesModal'));
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

  if (data.title) { titleEl.textContent = data.title; titleEl.style.display = 'block'; }
  else { titleEl.textContent = ''; titleEl.style.display = 'none'; }

  if (data.image) { img.src = data.image; img.style.display = 'block'; }
  else { img.removeAttribute('src'); img.style.display = 'none'; }

  if (data.text) { text.textContent = data.text; text.style.display = 'block'; }
  else { text.textContent = ''; text.style.display = 'none'; }

  showModal(modal);
  localStorage.setItem(seenKey, '1');
}

// =============================================
// ===== ПРОФИЛЬ =====
// =============================================
// ===== СНАПШОТ ПОЛЬЗОВАТЕЛЯ (анти-FOUC) =====
// Мини-кэш для мгновенной отрисовки кнопки профиля до первого кадра:
// его читает inline-скрипт в <head> и сразу после хедера (index/product).
// Обновляется при каждом updateProfileUI, чистится при выходе.
// =============================================
function saveUserSnapshot(user) {
  try {
    if (!user || !user.telegram) { localStorage.removeItem(USER_CACHE_KEY); return; }
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify({
      telegram: user.telegram,
      avatarId: user.avatar || DEFAULT_AVATAR_ID,
      bannerId: user.banner || null,
      tickets: user.totalTickets || 0
    }));
  } catch (e) { /* приватный режим / переполнение — не критично */ }
}

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
    showToast('Не удалось загрузить профиль', 'error');
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
    el.innerHTML = fallbackText
      ? Utils.escapeHtml(fallbackText.charAt(0).toUpperCase())
      : UI_ICONS.user(28);
  }
}

function updateProfileUI() {
  saveUserSnapshot(currentUser);
  const userBtn = document.getElementById('userBtn');
  if (currentUser && currentUser.telegram) {
    const tickets = currentUser.totalTickets || 0;
    const avatarId = currentUser.avatar || DEFAULT_AVATAR_ID;

    userBtn.innerHTML = `
      <span class="user-btn__avatar"></span>
      <span class="user-btn__name">${Utils.escapeHtml(currentUser.telegram)}</span>
      <span class="user-btn__tickets"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 2px;"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v14"/></svg>${Utils.escapeHtml(tickets)}</span>
    `;
    applyAvatar(userBtn.querySelector('.user-btn__avatar'), avatarId, currentUser.telegram);

    document.getElementById('profileName').textContent = currentUser.telegram;
    document.getElementById('profileTickets').textContent = tickets;
    document.getElementById('profileOrdersCount').textContent = (currentUser.orders || []).length;

    applyAvatar(document.getElementById('profileAvatar'), avatarId, currentUser.telegram);

    const profileBanner = document.getElementById('profileHeader');
    if (profileBanner) {
      profileBanner.classList.remove(...BANNER_SKINS);
      const banner = BANNERS.find(b => b.id === currentUser.banner);
      if (banner) profileBanner.classList.add(banner.skin);
    }

    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${currentUser.telegram}`;
    const referralDiv = document.getElementById('profileReferral');
    if (referralDiv) {
      referralDiv.innerHTML = `
        <div class="profile-referral-card" style="display:flex; flex-direction:column; gap:12px; width:100%;">
          <div class="profile-referral-card__header" style="display:flex; align-items:center; gap:8px; color:var(--cold-blue); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">
            <span class="profile-referral-card__icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </span>
            <span class="profile-referral-card__title">Реферальная ссылка</span>
          </div>
          <div class="profile-referral-card__body" style="display:flex; gap:8px;">
            <span class="profile-referral-card__link" style="flex:1; background:var(--bg-main); padding:10px; border-radius:8px; font-size:12px; color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${Utils.escapeHtml(referralLink)}</span>
            <button class="profile-referral-card__copy" id="copyReferralBtn" style="background:var(--accent); color:#17191B; border:none; padding:0 16px; border-radius:8px; font-weight:700; cursor:pointer; font-size:12px;">Копировать</button>
          </div>
          <div class="profile-referral-card__footer" style="font-size:12px; color:var(--text-secondary); display:flex; align-items:center; gap:6px;">
            ${UI_ICONS.users(14)} Приглашено: <strong style="color:var(--accent);">${Utils.escapeHtml(currentUser.referralCount || 0)}</strong> человек
          </div>
        </div>
      `;

      const copyBtn = document.getElementById('copyReferralBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', function() {
          navigator.clipboard.writeText(referralLink).then(() => {
            this.textContent = '✓ Скопировано';
            this.classList.add('copied');
            showToast('Реферальная ссылка скопирована!', 'success');
            setTimeout(() => {
              this.textContent = 'Копировать';
              this.classList.remove('copied');
            }, 2000);
          }).catch(() => showToast('Не удалось скопировать', 'error'));
        });
      }
    }

    const ordersDiv = document.getElementById('profileOrders');
    if (currentUser.orders && currentUser.orders.length > 0) {
      let html = '';
      currentUser.orders.slice().reverse().forEach(order => {
        const status = order.approved === true ? 'approved' : (order.approved === false ? 'rejected' : 'pending');
        const statusLabel = order.approved === true
          ? `${UI_ICONS.success(12)} Одобрен`
          : (order.approved === false ? `${UI_ICONS.error(12)} Отклонён` : `${UI_ICONS.clock(12)} Ожидает`);
        const date = new Date(order.date).toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
        const total = order.total || 0;
        html += `
          <div class="order-card ${status}" style="background:var(--bg-main); border:1px solid var(--border-soft); border-radius:10px; padding:12px 16px; margin-bottom:12px;">
            <div class="order-header" style="display:flex; justify-content:space-between; font-size:14px; font-weight:600; margin-bottom:4px;">
              <span>Заказ #${order.id ? Utils.escapeHtml(String(order.id).slice(-6)) : '—'}</span>
              <span class="order-total" style="color:var(--price);">${Utils.formatPrice(total)} BYN</span>
            </div>
            <div class="order-date" style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">${date}</div>
            <span class="order-status ${status}" style="font-size:11px; padding:4px 8px; border-radius:4px; font-weight:700; background:rgba(255,255,255,0.05); display:inline-flex; align-items:center; gap:4px;">${statusLabel}</span>
            ${order.tickets ? `&nbsp;<span style="color:#E7A04A; font-size:12px; display:inline-flex; align-items:center; gap:4px;">${UI_ICONS.ticket(12)} ${order.tickets} бил.</span>` : ''}
          </div>
        `;
      });
      ordersDiv.innerHTML = html;
    } else {
      ordersDiv.innerHTML = `<div class="orders-empty" style="text-align:center; padding:20px; color:var(--text-muted);"><div class="orders-empty__icon" style="color:var(--text-muted); margin-bottom:10px;">${UI_ICONS.package(32)}</div><div class="orders-empty__title">Пока здесь пусто</div></div>`;
    }
  } else {
    userBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 6px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Войти`;
    document.getElementById('profileName').textContent = 'Пользователь';
    document.getElementById('profileTickets').textContent = '0';
    document.getElementById('profileOrdersCount').textContent = '0';
    applyAvatar(document.getElementById('profileAvatar'), null, null);
    const profileBanner = document.getElementById('profileHeader');
    if (profileBanner) profileBanner.classList.remove(...BANNER_SKINS);
    const ordersDiv = document.getElementById('profileOrders');
    if (ordersDiv) ordersDiv.innerHTML = `<div class="orders-empty" style="text-align:center; padding:20px; color:var(--text-muted);"><div class="orders-empty__icon" style="color:var(--text-muted); margin-bottom:10px;">${UI_ICONS.package(32)}</div><div class="orders-empty__title">Пока здесь пусто</div></div>`;
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
  showModal(document.getElementById('avatarModal'));
}

function renderAvatarGrid() {
  const grid = document.getElementById('avatarGrid');
  grid.innerHTML = AVATARS.map(a => `
    <div class="avatar-item ${pendingAvatarId === a.id ? 'active' : ''}" data-avatar-id="${a.id}" title="Аватарка ${a.id}" role="button" tabindex="0" aria-label="Аватарка ${a.id}" aria-pressed="${pendingAvatarId === a.id ? 'true' : 'false'}">
      <img src="${a.image}" alt="Аватарка ${a.id}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" loading="lazy">
    </div>
  `).join('');

  grid.querySelectorAll('.avatar-item').forEach(el => {
    const select = () => {
      pendingAvatarId = parseInt(el.dataset.avatarId);
      grid.querySelectorAll('.avatar-item').forEach(o => { o.classList.remove('active'); o.setAttribute('aria-pressed', 'false'); });
      el.classList.add('active');
      el.setAttribute('aria-pressed', 'true');
    };
    el.addEventListener('click', select);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });
}

async function saveAvatar() {
  if (!currentUser || !currentUser.telegram) return showToast('Войдите в профиль', 'error');
  if (!pendingAvatarId) return showToast('Выберите аватарку', 'error');
  const saveBtn = document.getElementById('avatarSaveBtn');
  saveBtn.disabled = true; saveBtn.textContent = 'Сохранение...';
  try {
    const response = await fetch(WORKER_URL + 'update-avatar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: currentUser.telegram, avatar: pendingAvatarId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка сохранения');
    currentUser.avatar = pendingAvatarId;
    updateProfileUI(); avatarModalCtrl.closeFn();
    showToast('Аватарка обновлена!', 'success');
  } catch (err) {
    showToast(`${err.message}`, 'error');
  } finally {
    saveBtn.disabled = false; saveBtn.textContent = 'Сохранить';
  }
}

// =============================================
// ===== ШАПКА =====
// =============================================
function openBannerModal() {
  pendingBannerId = (currentUser && currentUser.banner) ? currentUser.banner : null;
  renderBannerGrid();
  showModal(document.getElementById('bannerModal'));
}

function renderBannerGrid() {
  const grid = document.getElementById('bannerGrid');
  grid.innerHTML = BANNERS.map(b => `
    <div class="banner-item ${b.skin} ${pendingBannerId === b.id ? 'active' : ''}" data-banner-id="${b.id}" title="Шапка «${b.name}»" role="button" tabindex="0" aria-label="Шапка «${b.name}»" aria-pressed="${pendingBannerId === b.id ? 'true' : 'false'}">
      <span class="banner-item__label">${Utils.escapeHtml(b.name)}</span>
    </div>
  `).join('');

  grid.querySelectorAll('.banner-item').forEach(el => {
    const select = () => {
      pendingBannerId = parseInt(el.dataset.bannerId);
      grid.querySelectorAll('.banner-item').forEach(o => { o.classList.remove('active'); o.setAttribute('aria-pressed', 'false'); });
      el.classList.add('active'); el.setAttribute('aria-pressed', 'true');
    };
    el.addEventListener('click', select);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });
}

async function saveBanner() {
  if (!currentUser || !currentUser.telegram) return showToast('Войдите в профиль', 'error');
  const saveBtn = document.getElementById('bannerSaveBtn');
  saveBtn.disabled = true; saveBtn.textContent = 'Сохранение...';
  try {
    const response = await fetch(WORKER_URL + 'update-banner', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: currentUser.telegram, banner: pendingBannerId })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ошибка сохранения');
    currentUser.banner = pendingBannerId;
    updateProfileUI(); bannerModalCtrl.closeFn();
    showToast(pendingBannerId ? 'Шапка обновлена!' : 'Шапка убрана', 'success');
  } catch (err) {
    showToast(`${err.message}`, 'error');
  } finally {
    saveBtn.disabled = false; saveBtn.textContent = 'Сохранить';
  }
}

function removeBanner() {
  pendingBannerId = null;
  document.querySelectorAll('.banner-item').forEach(o => { o.classList.remove('active'); o.setAttribute('aria-pressed', 'false'); });
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
  const consentWrap = document.getElementById('authConsentWrap');

  if (tab === 'register') {
    title.textContent = 'Создать аккаунт';
    subtitle.textContent = 'Зарегистрируйтесь, чтобы получать билетики';
    submitText.textContent = 'Зарегистрироваться';
    if (forgot) forgot.style.display = 'none';
    passwordInput.setAttribute('autocomplete', 'new-password');
    if (consentWrap) consentWrap.style.display = 'block';
  } else {
    title.textContent = 'С возвращением';
    subtitle.textContent = 'Войдите, чтобы продолжить покупки';
    submitText.textContent = 'Войти';
    if (forgot) forgot.style.display = 'block';
    passwordInput.setAttribute('autocomplete', 'current-password');
    if (consentWrap) consentWrap.style.display = 'none';
  }

  clearAuthErrors();
}

function clearAuthErrors() {
  document.querySelectorAll('.auth-error').forEach(el => { el.textContent = ''; el.classList.remove('visible'); });
  document.querySelectorAll('.auth-field').forEach(el => el.classList.remove('error'));
}

function showFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) { field.closest('.auth-field').classList.add('error'); field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', errorId); }
  if (error) { error.textContent = message; error.classList.add('visible'); }
}

function resetAuthForm() {
  document.getElementById('loginInput').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginPassword').type = 'password';
  document.getElementById('togglePassword').innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  clearAuthErrors(); switchAuthTab('login');
}

async function login() {
  clearAuthErrors();
  const username = Utils.normalizeTelegramUsername(document.getElementById('loginInput').value);
  const password = document.getElementById('loginPassword').value.trim();
  const userErr = Utils.validateTelegramUsername(username);
  
  if (userErr) return showFieldError('loginInput', 'usernameError', userErr);
  if (!password) return showFieldError('loginPassword', 'passwordError', 'Введите пароль');

  const submitBtn = document.getElementById('authSubmitBtn');
  submitBtn.disabled = true;

  try {
    const response = await fetch(WORKER_URL + 'login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: username, password })
    });
    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error || 'Ошибка входа';
      if (errMsg.toLowerCase().includes('не найден')) showFieldError('loginInput', 'usernameError', 'Пользователь не найден');
      else if (errMsg.toLowerCase().includes('пароль')) showFieldError('loginPassword', 'passwordError', 'Неверный пароль');
      else showFieldError('loginPassword', 'passwordError', errMsg);
      return;
    }

    localStorage.setItem('user_telegram', username);
    currentUser = data; updateProfileUI();
    loginModalCtrl.closeFn();
    showToast(`Добро пожаловать, ${username}!`, 'success');
    resetAuthForm();
  } catch (err) {
    showFieldError('loginPassword', 'passwordError', err.message || 'Ошибка сети');
  } finally {
    submitBtn.disabled = false;
  }
}

async function register() {
  clearAuthErrors();
  
  const consentCheckbox = document.getElementById('authConsent');
  if (consentCheckbox && !consentCheckbox.checked) {
    const err = document.getElementById('consentError');
    if (err) {
      err.textContent = 'Необходимо согласие на обработку данных';
      err.classList.add('visible');
    }
    return;
  }
  
  const input = document.getElementById('loginInput');
  const username = Utils.normalizeTelegramUsername(document.getElementById('loginInput').value);
  const password = document.getElementById('loginPassword').value.trim();
  const userErr = Utils.validateTelegramUsername(username);

  if (userErr) return showFieldError('loginInput', 'usernameError', userErr);
  if (!password) return showFieldError('loginPassword', 'passwordError', 'Введите пароль');
  if (password.length < 4) return showFieldError('loginPassword', 'passwordError', 'Пароль должен содержать минимум 4 символа');

  const submitBtn = document.getElementById('authSubmitBtn');
  submitBtn.disabled = true;

  try {
    const response = await fetch(WORKER_URL + 'register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: username, password, ref: referralCode || null })
    });
    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error || 'Ошибка регистрации';
      if (errMsg.toLowerCase().includes('существует')) showFieldError('loginInput', 'usernameError', 'Такой пользователь уже существует');
      else showFieldError('loginInput', 'usernameError', errMsg);
      return;
    }

    showToast('Регистрация успешна! Теперь войдите.', 'success');
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
  if (saved) loadUserProfile(saved).then(() => updateProfileUI());
}

// =============================================
// ===== КОРЗИНА =====
// =============================================
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');

// syncWithProducts=true: подменить цены товаров свежими данными каталога
// (вызывается после загрузки products). false: только восстановить корзину для бейджа.
function loadCartFromStorage(syncWithProducts) {
  try {
    const saved = localStorage.getItem('torgovchik_cart');
    if (saved) {
      cart = JSON.parse(saved);
      if (Array.isArray(cart)) {
        if (syncWithProducts) {
          cart = cart.map(item => {
            const actual = products.find(p => p.id === item.id);
            return actual ? { ...actual, quantity: item.quantity } : item;
          });
        }
      } else {
        cart = [];
      }
    }
  } catch (e) {
    console.error('Ошибка загрузки корзины:', e);
    cart = [];
  }
  updateCartUI();
}

function saveCartToStorage() {
  localStorage.setItem('torgovchik_cart', JSON.stringify(cart));
}

function flyToCart(sourceEl, imageSrc) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!sourceEl) return;

  const cartBtn = document.getElementById('cartToggle');
  if (!cartBtn) return;

  const startRect = sourceEl.getBoundingClientRect();
  const endRect = cartBtn.getBoundingClientRect();

  const img = document.createElement('img');
  img.src = imageSrc;
  img.className = 'fly-to-cart';
  img.style.left = startRect.left + 'px';
  img.style.top = startRect.top + 'px';
  img.style.width = startRect.width + 'px';
  img.style.height = startRect.height + 'px';
  document.body.appendChild(img);

  img.getBoundingClientRect();

  requestAnimationFrame(() => {
    img.style.left = (endRect.left + endRect.width / 2 - 20) + 'px';
    img.style.top = (endRect.top + endRect.height / 2 - 20) + 'px';
    img.style.width = '40px';
    img.style.height = '40px';
    img.style.opacity = '0';
    img.style.transform = 'rotate(360deg)';
  });

  setTimeout(() => {
    img.remove();
    cartBtn.classList.add('cart-btn--bump');
    setTimeout(() => cartBtn.classList.remove('cart-btn--bump'), 400);
  }, 700);
}

function addToCart(productId, event) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  
  saveCartToStorage();
  updateCartUI();
  
  if (event) {
    const btn = event.currentTarget || event.target;
    flyToCart(btn, product.image);
  }

  showToast(`${product.name} добавлен`, 'success', {
    text: 'Открыть корзину',
    onClick: () => {
      openCart();
      document.querySelectorAll('.toast').forEach(t => t.classList.add('hiding'));
    }
  });
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== productId);
  saveCartToStorage(); updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCartToStorage(); updateCartUI();
}

async function clearCart() {
  if (cart.length === 0) return;
  
  const confirmed = await showConfirm({
    icon: UI_ICONS.trash(40),
    title: 'Очистить корзину?',
    text: 'Все товары будут удалены. Это действие нельзя отменить.',
    okText: 'Очистить',
    cancelText: 'Отмена',
    danger: true
  });

  if (!confirmed) return;

  cart = [];
  appliedPromo = null;
  discountPercent = 0;
  persistPromo(null);
  saveCartToStorage();
  updateCartUI();
  showToast('Корзина очищена', 'info');
}

function getCartTotal() {
  return Utils.calculateCartTotal(cart, discountPercent);
}

function updateCartUI() {
  const totalItems = Utils.countCartItems(cart);
  if (cartCount) cartCount.textContent = totalItems;

  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) clearBtn.style.display = cart.length > 0 ? 'block' : 'none';

  if (cart.length === 0) {
    if (cartItems) cartItems.innerHTML = `
      <div class="cart-empty">
          <p>Корзина пуста</p>
          <span>Добавьте товары из каталога</span>
      </div>
    `;
    if (cartTotal) cartTotal.textContent = Utils.formatPrice(0);
    return;
  }

  if (cartItems) {
    cartItems.innerHTML = cart.map(item => {
      // id только число: onclick-атрибут не должен интерполировать произвольные данные
      const iid = parseInt(item.id, 10);
      if (isNaN(iid)) return '';
      return `
      <div class="cart-item">
        <div class="cart-item__info">
          <span class="cart-item__name">
            <span style="display:block; font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">${Utils.escapeHtml(item.brand)}</span>
            ${Utils.escapeHtml(item.name)}
          </span>
          <span class="cart-item__price">${Utils.escapeHtml(item.price)} BYN</span>
        </div>
        <div class="cart-item__controls">
          <button class="cart-qty-btn" onclick="changeQuantity(${iid}, -1)" aria-label="Уменьшить количество">−</button>
          <span class="cart-qty-val">${item.quantity}</span>
          <button class="cart-qty-btn" onclick="changeQuantity(${iid}, 1)" aria-label="Увеличить количество">+</button>
          <button class="cart-item__remove" onclick="removeFromCart(${iid})" aria-label="Удалить товар"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
      </div>
    `;
    }).join('');
  }

  if (cartTotal) cartTotal.textContent = Utils.formatPrice(getCartTotal());
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
// ===== ПРОМОКОДЫ =====
// =============================================
const promoInput = document.getElementById('promoCode');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoMessage = document.getElementById('promoMessage');

function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();
  if (!code) { promoMessage.textContent = 'Введите промокод'; promoMessage.style.color = '#e74c3c'; return; }
  if (appliedPromo === code) { promoMessage.textContent = 'Этот промокод уже применён'; promoMessage.style.color = 'var(--text-secondary)'; return; }
  const promo = promocodes.find(p => p.code === code);
  if (promo) {
    discountPercent = promo.discount;
    appliedPromo = code;
    persistPromo(code);
    promoMessage.textContent = `Промокод "${code}" применён! Скидка ${discountPercent}%`;
    promoMessage.style.color = '#2ecc71';
    promoInput.disabled = true; applyPromoBtn.disabled = true;
    updateCartUI(); showToast(`Промокод "${code}" применён!`, 'success');
  } else {
    promoMessage.textContent = `Промокод "${code}" не найден`;
    promoMessage.style.color = '#e74c3c';
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
  
  brands.sort((a, b) => {
    const maxIdA = Math.max(...catProducts.filter(p => p.brand === a).map(p => p.id));
    const maxIdB = Math.max(...catProducts.filter(p => p.brand === b).map(p => p.id));
    return maxIdB - maxIdA;
  });

  container.innerHTML = brands.map(b => `<button class="filter-btn" data-filter="${b}">${b}</button>`).join('');

  const firstBtn = container.querySelector('.filter-btn');
  if (firstBtn) {
    firstBtn.classList.add('active'); firstBtn.setAttribute('aria-pressed', 'true');
    renderProducts(category, firstBtn.dataset.filter);
  } else {
    renderProducts(category, 'Все');
  }

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
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

  grid.innerHTML = filtered.map(p => {
    const fav = Utils.isFavorite(favorites, p.id);
    const count = productStats[p.id] || 0;
    const popularity = count > 0 ? `<div class="product-card__popularity">Купили ${count} раз</div>` : '';
    // id только числовой: защищает onclick\\/href от инъекций через API
    const pid = parseInt(p.id, 10);
    if (isNaN(pid)) return '';
    const nameEsc = Utils.escapeHtml(p.name);

    return `
      <div class="product-card reveal" data-id="${pid}">
        <button class="product-card__fav ${fav ? 'active' : ''}" data-id="${pid}" aria-label="${fav ? 'Убрать из избранного' : 'Добавить в избранное'}" aria-pressed="${fav ? 'true' : 'false'}">${fav ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'}</button>
        <a href="product.html?id=${pid}" class="product-card__link" aria-label="Открыть ${nameEsc}">
          <img src="${Utils.escapeHtml(p.image)}" alt="${nameEsc}" class="product-card__image" loading="lazy" onerror="this.src='assets/logo.png'">
          ${popularity}
          <div class="product-card__name">${nameEsc}</div>
          <div class="product-card__brand">${Utils.escapeHtml(p.brand)}</div>
          <div class="product-card__price">${Utils.escapeHtml(p.price)} BYN</div>
        </a>
        <button class="product-card__btn" onclick="addToCart(${pid}, event)" aria-label="Добавить ${nameEsc} в корзину">В корзину</button>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.product-card__fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); e.preventDefault();
      toggleFavorite(parseInt(btn.dataset.id));
    });
  });

  // Появление карточек при скролле (скелетоны не трогаем — их перерисовка)
  observeReveals(grid);
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
    categoryContent.innerHTML = `<div class="category-content active"><div class="catalog__filters" id="filterContainer"></div><div class="catalog__grid" id="productGrid"></div></div>`;
    initFilters(category);
  } else if (category === 'coils' || category === 'disposables') {
    categoryContent.innerHTML = `<div class="category-content active"><div class="catalog__grid" id="productGrid"></div></div>`;
    renderProducts(category, 'Все');
  } else {
    categoryContent.innerHTML = `<div class="category-content active"><div class="placeholder"><h3>Скоро появится!</h3></div></div>`;
  }
}

// =============================================
// ===== ИНИЦИАЛИЗАЦИЯ МОДАЛОК =====
// =============================================
// Возрастные ворота: закрытие только по кнопкам внутри, без Esc и бэкдропа
const ageGateCtrl = setupModal('ageGateModal', null, { dismissible: false });
const loginModalCtrl = setupModal('loginModal');
const profileModalCtrl = setupModal('profileModal');
const avatarModalCtrl = setupModal('avatarModal', () => { pendingAvatarId = null; });
const bannerModalCtrl = setupModal('bannerModal', () => { pendingBannerId = null; });
const orderModalCtrl = setupModal('orderModal');
const announcementCtrl = setupModal('announcementModal');
const favoritesModalCtrl = setupModal('favoritesModal');

document.getElementById('loginModalClose').addEventListener('click', () => loginModalCtrl.closeFn());
document.getElementById('profileModalClose').addEventListener('click', () => profileModalCtrl.closeFn());
document.getElementById('avatarModalClose').addEventListener('click', () => avatarModalCtrl.closeFn());
document.getElementById('avatarCancelBtn').addEventListener('click', () => avatarModalCtrl.closeFn());
document.getElementById('bannerModalClose').addEventListener('click', () => bannerModalCtrl.closeFn());
document.getElementById('orderModalClose').addEventListener('click', () => orderModalCtrl.closeFn());
document.getElementById('announcementClose').addEventListener('click', () => announcementCtrl.closeFn());
document.getElementById('announcementOk').addEventListener('click', () => announcementCtrl.closeFn());
document.getElementById('favoritesModalClose').addEventListener('click', () => favoritesModalCtrl.closeFn());

document.getElementById('userBtn').addEventListener('click', () => {
  if (currentUser && currentUser.telegram) {
    showModal(document.getElementById('profileModal')); updateProfileUI();
  } else {
    resetAuthForm(); showModal(document.getElementById('loginModal'));
  }
});

document.querySelectorAll('.auth-tab').forEach(tab => tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab)));
document.getElementById('authForm').addEventListener('submit', (e) => { e.preventDefault(); if (currentAuthTab === 'register') register(); else login(); });

document.getElementById('togglePassword').addEventListener('click', function() {
  const input = document.getElementById('loginPassword');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  this.innerHTML = isPassword ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  this.setAttribute('aria-label', isPassword ? 'Скрыть пароль' : 'Показать пароль');
});

document.querySelectorAll('.auth-field input').forEach(input => {
  input.addEventListener('focus', () => input.closest('.auth-field').classList.add('focused'));
  input.addEventListener('blur', () => input.closest('.auth-field').classList.remove('focused'));
  input.addEventListener('input', () => { input.closest('.auth-field').classList.remove('error'); input.removeAttribute('aria-invalid'); });
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => { e.preventDefault(); showToast('Напишите в наш Telegram — поможем восстановить пароль', 'info'); });

document.getElementById('profileLogout').addEventListener('click', () => {
  localStorage.removeItem('user_telegram'); localStorage.removeItem(USER_CACHE_KEY);
  currentUser = null; updateProfileUI();
  profileModalCtrl.closeFn(); showToast('Вы вышли из профиля', 'info');
});

document.getElementById('avatarEditBtn').addEventListener('click', openAvatarModal);
document.getElementById('avatarSaveBtn').addEventListener('click', saveAvatar);
document.getElementById('bannerEditBtn').addEventListener('click', openBannerModal);
document.getElementById('bannerRemoveBtn').addEventListener('click', removeBanner);
document.getElementById('bannerSaveBtn').addEventListener('click', saveBanner);

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.getElementById('favoritesToggle').addEventListener('click', openFavoritesModal);
document.getElementById('clearCartBtn').addEventListener('click', clearCart);

// =============================================
// ===== ФОРМА ЗАКАЗА =====
// =============================================
const orderForm = document.getElementById('orderForm');
const orderMessage = document.getElementById('orderMessage');

document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (cart.length === 0) return showToast('Корзина пуста. Добавьте товары.', 'error');
  if (currentUser && currentUser.telegram) document.getElementById('orderTelegram').value = '@' + currentUser.telegram;
  orderIdempotencyKey = null;
  showModal(document.getElementById('orderModal'));
  orderMessage.style.display = 'none'; orderMessage.textContent = '';
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const orderConsent = document.getElementById('orderConsent');
  if (orderConsent && !orderConsent.checked) {
    orderMessage.style.display = 'block';
    orderMessage.textContent = 'Необходимо согласие на обработку персональных данных.';
    orderMessage.style.color = '#e74c3c';
    return;
  }
  
  const name = document.getElementById('orderName').value.trim();
  const telegramRaw = document.getElementById('orderTelegram').value.trim();
  const comment = document.getElementById('orderComment').value.trim();

  if (!name) { orderMessage.style.display = 'block'; orderMessage.textContent = 'Пожалуйста, укажите имя.'; orderMessage.style.color = '#e74c3c'; return; }
  
  const telegramClean = Utils.normalizeTelegramUsername(telegramRaw);
  const telegramErr = Utils.validateTelegramUsername(telegramClean);
  if (telegramErr) { orderMessage.style.display = 'block'; orderMessage.textContent = telegramErr; orderMessage.style.color = '#e74c3c'; return; }
  
  const telegramForServer = '@' + telegramClean;
  const submitBtn = document.getElementById('orderSubmit');
  submitBtn.disabled = true; submitBtn.textContent = 'Отправка...';

  if (!orderIdempotencyKey) orderIdempotencyKey = Utils.generateUUID();

  const orderData = {
    name, telegram: telegramForServer, comment, items: cart,
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    total: getCartTotal(), promo: appliedPromo, discount: discountPercent, idempotencyKey: orderIdempotencyKey
  };

  try {
    const response = await fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: orderData }) });
    if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || 'Ошибка отправки заказа'); }

    orderMessage.style.display = 'block'; orderMessage.textContent = 'Заказ успешно отправлен! Мы свяжемся с вами в Telegram.'; orderMessage.style.color = '#2ecc71';

    setTimeout(() => {
      cart = []; appliedPromo = null; discountPercent = 0; orderIdempotencyKey = null;
      persistPromo(null);
      saveCartToStorage(); updateCartUI(); closeCart(); orderModalCtrl.closeFn(); orderForm.reset();
      orderMessage.style.display = 'none'; promoInput.value = ''; promoInput.disabled = false;
      applyPromoBtn.disabled = false; promoMessage.textContent = '';
      showToast('Заказ оформлен! Спасибо!', 'success');
      if (currentUser && currentUser.telegram) loadUserProfile(currentUser.telegram);
    }, 2000);
  } catch (error) {
    orderMessage.style.display = 'block'; orderMessage.textContent = `Ошибка: ${error.message || 'Неизвестная ошибка'}. Попробуйте позже.`; orderMessage.style.color = '#e74c3c';
  } finally {
    submitBtn.disabled = false; submitBtn.textContent = 'Отправить заказ';
  }
});

applyPromoBtn.addEventListener('click', applyPromo);
promoInput.addEventListener('keypress', e => { if (e.key === 'Enter') applyPromo(); });

// =============================================
// ===== БУРГЕР =====
// =============================================
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (burger) {
  burger.setAttribute('aria-expanded', 'false');
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.header__inner')) {
      burger.classList.remove('active'); mobileMenu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
    }
  });
}

categoryBtns.forEach(btn => btn.addEventListener('click', () => switchCategory(btn.dataset.category)));
categoryBtnsMobile.forEach(btn => {
  btn.addEventListener('click', () => {
    switchCategory(btn.dataset.category); 
    if (burger) {
      burger.classList.remove('active'); 
      mobileMenu.classList.remove('open'); 
      burger.setAttribute('aria-expanded', 'false');
    }
  });
});

// =============================================
// ===== FAQ =====
// =============================================
document.querySelectorAll('.faq__question').forEach(question => {
  question.setAttribute('role', 'button'); question.setAttribute('tabindex', '0'); question.setAttribute('aria-expanded', 'false');
  const toggle = () => {
    const parent = question.closest('.faq__item'); if (!parent) return;
    const isOpen = parent.classList.toggle('open');
    question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };
  question.addEventListener('click', toggle);
  question.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
});

// =============================================
// ===== ПАСХАЛКА НА ЛОГОТИПЕ =====
// =============================================
document.addEventListener('DOMContentLoaded', function() {
  const logo = document.querySelector('.logo'); if (!logo) return;
  let tooltipTimeout = null;
  logo.addEventListener('click', function(e) {
    e.preventDefault();
    const oldTooltip = logo.querySelector('.logo-tooltip'); if (oldTooltip) oldTooltip.remove();
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    const phrase = LOGO_PHRASES[Math.floor(Math.random() * LOGO_PHRASES.length)];
    const tooltip = document.createElement('div'); tooltip.className = 'logo-tooltip'; tooltip.textContent = phrase; tooltip.setAttribute('role', 'status');
    logo.appendChild(tooltip); requestAnimationFrame(() => tooltip.classList.add('show'));
    tooltipTimeout = setTimeout(() => { tooltip.classList.remove('show'); setTimeout(() => tooltip.remove(), 300); }, 2500);
  });
});

// =============================================
// ===== СЕКРЕТНАЯ КНОПКА (ПАСХАЛКА) =====
// =============================================
let secretClickCount = 0;
let secretClickTimeout = null;
const secretBtn = document.getElementById('secretGameBtn');

if (secretBtn) {
  secretBtn.addEventListener('click', () => {
    secretClickCount++;
    secretBtn.style.opacity = '0.5';
    if (secretClickTimeout) clearTimeout(secretClickTimeout);

    if (secretClickCount >= 3) {
      window.location.href = 'flappy.html';
    } else {
      secretClickTimeout = setTimeout(() => {
        secretClickCount = 0;
        secretBtn.style.opacity = '1';
      }, 2000);
    }
  });
}

// =============================================
// ===== АТМОСФЕРА: ИСКРЫ И СНЕЖИНКИ =====
// =============================================
// «Поздняя осень / Первый иней»: редкие тёплые искры поднимаются,
// холодные снежинки оседают. Прекомпилированные спрайты (градиент
// рисуется один раз), DPR <= 2, пауза на скрытой вкладке.
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var dpr = 1, w = 0, h = 0, particles = [], rafId = null, lastT = 0, sizeDirty = true;

  // Спрайт: радиальный градиент одного цвета (тёплая искра / холодная снежинка)
  function makeSprite(r, g, b) {
    var s = document.createElement('canvas');
    s.width = s.height = 28;
    var c = s.getContext('2d');
    var grad = c.createRadialGradient(14, 14, 0, 14, 14, 14);
    grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',0.85)');
    grad.addColorStop(0.45, 'rgba(' + r + ',' + g + ',' + b + ',0.25)');
    grad.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    c.fillStyle = grad;
    c.fillRect(0, 0, 28, 28);
    return s;
  }
  var sparkSprite = makeSprite(217, 160, 91);
  var snowSprite = makeSprite(150, 175, 196);

  function spawn(spawnAnywhere) {
    var isSnow = Math.random() < 0.62;
    return {
      type: isSnow ? snowSprite : sparkSprite,
      x: Math.random() * w,
      y: spawnAnywhere ? Math.random() * h : (isSnow ? -16 : h + 16),
      size: 5 + Math.random() * 9,
      baseAlpha: 0.14 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.5 + Math.random() * 1.4,
      // скорость px/c; снег падает, искры поднимаются
      vy: isSnow ? 10 + Math.random() * 16 : -(7 + Math.random() * 12),
      vx: isSnow ? (Math.random() - 0.5) * 7 : (Math.random() - 0.5) * 5
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var target = Math.min(Math.round((w * h) / 30000), 36); // редко — только атмосфера
    particles.length = 0;
    for (var i = 0; i < target; i++) particles.push(spawn(true));
  }

  function tick(t) {
    rafId = null;
    if (sizeDirty) { resize(); sizeDirty = false; }
    if (!lastT) lastT = t;
    var dt = Math.min((t - lastT) / 1000, 0.05); // прыжки фокуса вкладки не сносит частицы в отрыв
    lastT = t;

    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y += p.vy * dt;
      p.x += p.vx * dt + Math.sin(p.phase += p.twinkle * dt) * 6 * dt;
      // перерождение за кадром экрана
      if (p.y < -20 || p.y > h + 20) {
        particles[i] = spawn(false);
        continue;
      }
      ctx.globalAlpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(p.phase * 2.1));
      var s = p.size;
      ctx.drawImage(p.type, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function () { sizeDirty = true; }, { passive: true });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else if (!rafId) {
      lastT = 0;
      rafId = requestAnimationFrame(tick);
    }
  });

  resize();
  rafId = requestAnimationFrame(tick);
})();

// =============================================
// ===== СПOTLIGHT КАРТОЧЕК (Glass Noir) =====
// =============================================
// Обновляет --mx/--my для подсветки, следующей за курсором.
// Делегирование — работает и для динамически созданных карточек.
document.addEventListener('pointermove', function (e) {
    var card = e.target.closest ? e.target.closest('.product-card') : null;
    if (!card || card.classList.contains('product-card--skeleton')) return;
    var rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
}, { passive: true });

// =============================================
// ===== SCROLL REVEAL (появление при скролле) =====
// =============================================
// Карточки товаров, блоки «О нас» и заголовки секций плавно проявляются,
// когда попадают в экран (IntersectionObserver), с каскадной задержкой
// внутри ряда. При prefers-reduced-motion всё остаётся видимым без анимаций.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = ('IntersectionObserver' in window) && !prefersReducedMotion
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  : null;

function revealElement(el) {
  // Каскад: индекс среди .reveal-соседей даёт задержку появления
  const siblings = el.parentElement
    ? Array.prototype.filter.call(el.parentElement.children, c => c.classList && c.classList.contains('reveal'))
    : [];
  const idx = siblings.indexOf(el);
  if (idx > 0) el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
  el.classList.add('reveal--visible');
  // После анимации снимаем reveal-классы: возвращаем элементу его
  // собственные transition (ховеры карточек и т.п.)
  let done = false;
  const finish = () => {
    if (done) return; done = true;
    el.classList.remove('reveal', 'reveal--visible');
    el.style.transitionDelay = '';
  };
  el.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, 900); // фолбэк, если transitionend не сработал
}

// Навешивает наблюдение на все скрытые .reveal в области (или в документе).
// Вызывается на старте и после каждой перерисовки каталога.
function observeReveals(root) {
  const scope = root || document;
  if (!revealObserver) {
    scope.querySelectorAll('.reveal').forEach(el => el.classList.add('reveal--visible'));
    return;
  }
  scope.querySelectorAll('.reveal:not(.reveal--visible)').forEach(el => revealObserver.observe(el));
}

function initScrollReveal() {
  if (prefersReducedMotion) return; // без движения — ничего не прячем
  document.querySelectorAll('.about__card, .section-title').forEach(el => el.classList.add('reveal'));
  observeReveals();
}

// =============================================
// ===== ЗАПУСК =====
// =============================================
initAgeGate();
initScrollReveal();
initScrollToTop();
checkReferral();
loadFavoritesFromStorage();
loadCartFromStorage(false);
loadProducts().then(() => {
  initProfile();
  checkAnnouncement();
});