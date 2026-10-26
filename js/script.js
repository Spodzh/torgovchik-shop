// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';
const RECENTLY_VIEWED_KEY = 'torgovchik_recently_viewed';
const RECENTLY_VIEWED_MAX = 12;

// =============================================
// ===== ДОСТУПНЫЕ АВАТАРКИ =====
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
// ===== ШАПКИ ПРОФИЛЯ =====
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
    'Купил жижу? 😏', 'Заправиться не хочешь?', 'Есть вкусненькое 😉',
    'Скучал по нам?', 'Как насчёт новой вкусняшки?', 'Жижа сама себя не купит!',
    'Пара затяжек — и день ярче 🌿', 'Твой Pod скучает по новой жиже 👀',
    'Вкусный день сегодня, да?', 'Псс, есть кое-что новенькое...'
];

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
let retryCountdown = 0;

// =============================================
// ===== 18+ ВРАТА =====
// =============================================
function initAgeGate() {
  const isVerified = localStorage.getItem('torgovchik_age_verified') === 'true';
  const modal = document.getElementById('ageGateModal');
  if (!modal) return;

  if (isVerified) {
    modal.classList.remove('open');
    return;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const question = document.getElementById('ageGateQuestion');
  const deny = document.getElementById('ageGateDeny');

  document.getElementById('ageGateYes').addEventListener('click', () => {
    localStorage.setItem('torgovchik_age_verified', 'true');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  });

  document.getElementById('ageGateNo').addEventListener('click', () => {
    question.style.display = 'none';
    deny.classList.add('open');
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

    iconEl.textContent = options.icon || '⚠️';
    titleEl.textContent = options.title || 'Подтвердите действие';
    textEl.textContent = options.text || '';
    okBtn.textContent = options.okText || 'Подтвердить';
    cancelBtn.textContent = options.cancelText || 'Отмена';
    
    okBtn.className = 'confirm-modal__btn ' + (options.danger ? 'confirm-modal__btn--danger' : 'confirm-modal__btn--primary');

    modal.classList.add('open');

    const closeAndResolve = (result) => {
      modal.classList.remove('open');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      modal.removeEventListener('click', onOverlay);
      resolve(result);
    };

    const onOk = () => closeAndResolve(true);
    const onCancel = () => closeAndResolve(false);
    const onOverlay = (e) => {
      if (e.target === modal) closeAndResolve(false);
    };

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    modal.addEventListener('click', onOverlay);
  });
}

// =============================================
// ===== УТИЛИТЫ МОДАЛОК =====
// =============================================
function updateBodyOverflow() {
  const anyOpen = document.querySelector(
    '.login-modal.open, .profile-modal.open, .avatar-modal.open, .banner-modal.open, .order-modal.open, .announcement-modal.open, .favorites-modal.open, .confirm-modal.open'
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
    if (e.key === 'Escape') { e.preventDefault(); closeFn(); return; }

    if (e.key === 'Tab') {
      const focusable = Array.from(getFocusable()).filter(el => el.offsetParent !== null);
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  modal.addEventListener('click', (e) => { if (e.target === modal) closeFn(); });

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
// ===== ТОСТЫ =====
// =============================================
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type, action) {
  type = type || 'success';
  const toast = document.createElement('div');
  toast.className = 'toast' + (action ? ' toast--action' : '');
  toast.setAttribute('role', 'status');
  
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  
  let html = `
    <div class="toast__body">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;
  
  toast.innerHTML = html;

  if (action) {
    const btn = document.createElement('button');
    btn.className = 'toast__action';
    btn.textContent = action.text;
    btn.addEventListener('click', () => {
      action.onClick();
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    });
    toast.appendChild(btn);
  }

  toastContainer.appendChild(toast);
  
  const timeout = setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, action ? 5000 : 3000);

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
  retryTimer = null;
  loadProducts();
}

function startAutoRetry() {
  if (retryTimer) clearTimeout(retryTimer);
  retryCountdown = 5;
  
  const notice = document.getElementById('retryNotice');
  const counter = document.getElementById('retryCountdown');
  if (notice) notice.style.display = 'block';

  const tick = () => {
    retryCountdown--;
    if (counter) counter.textContent = retryCountdown;
    
    if (retryCountdown <= 0) {
      clearInterval(interval);
      loadProducts();
    }
  };

  if (counter) counter.textContent = retryCountdown;
  const interval = setInterval(tick, 1000);
  
  retryTimer = setTimeout(() => {
    clearInterval(interval);
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
  
  renderSkeletonCatalog();
  
  try {
    const response = await fetch(WORKER_URL + 'products');
    if (!response.ok) throw new Error('Ошибка загрузки товаров');
    
    products = await response.json();
    
    await Promise.all([loadPromocodes(), loadProductStats()]);
    
    switchCategory(currentCategory);
    renderRecentlyViewedOnIndex();
    loadCartFromStorage();
    
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
    <a href="product.html?id=${p.id}" class="recently-viewed__card">
      <img src="${p.image}" alt="${p.name}" class="recently-viewed__image" loading="lazy" onerror="this.src='https://i.ibb.co/VWRmsGHt/logo.png'">
      <div class="recently-viewed__name">${p.name}</div>
      <div class="recently-viewed__brand">${p.brand}</div>
      <div class="recently-viewed__price">${p.price} BYN</div>
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
    showToast(`❤️ ${product ? product.name : 'Товар'} добавлен в избранное`, 'success');
  } else {
    showToast(`💔 ${product ? product.name : 'Товар'} убран из избранного`, 'info');
  }
}

function updateFavoritesUI() {
  const countEl = document.getElementById('favoritesCount');
  if (countEl) countEl.textContent = favorites.length;

  const toggleBtn = document.getElementById('favoritesToggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('.favorites-icon');
    if (icon) icon.textContent = favorites.length > 0 ? '❤' : '♡';
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
      heart.textContent = active ? '❤' : '♡';
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
        <div class="favorites-empty__icon">💔</div>
        <div class="favorites-empty__title">Пока ничего нет</div>
        <div class="favorites-empty__text">Добавляйте товары сердечком — они появятся здесь</div>
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
    <div class="favorites-card" data-id="${p.id}">
      <button class="favorites-card__fav" data-id="${p.id}" aria-label="Убрать из избранного" aria-pressed="true">❤</button>
      <a href="product.html?id=${p.id}" class="favorites-card__link" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; flex:1;">
        <img src="${p.image}" alt="${p.name}" class="favorites-card__image" loading="lazy" onerror="this.src='https://i.ibb.co/VWRmsGHt/logo.png'">
        <div class="favorites-card__name">${p.name}</div>
        <div class="favorites-card__brand">${p.brand}</div>
        <div class="favorites-card__price">${p.price} BYN</div>
      </a>
      <button class="favorites-card__btn" data-id="${p.id}">В корзину</button>
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
  document.getElementById('favoritesModal').classList.add('open');
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
      if (banner) profileBanner.style.backgroundImage = `url('${banner.image}')`;
      else profileBanner.style.backgroundImage = '';
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
          }).catch(() => showToast('⚠️ Не удалось скопировать', 'error'));
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
      ordersDiv.innerHTML = `<div class="orders-empty"><div class="orders-empty__icon">📦</div><div class="orders-empty__title">Пока здесь пусто</div></div>`;
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
    if (ordersDiv) ordersDiv.innerHTML = `<div class="orders-empty"><div class="orders-empty__icon">📦</div><div class="orders-empty__title">Пока здесь пусто</div></div>`;
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
    <div class="avatar-option ${pendingAvatarId === a.id ? 'selected' : ''}" data-avatar-id="${a.id}" title="Аватарка ${a.id}" role="button" tabindex="0" aria-label="Аватарка ${a.id}" aria-pressed="${pendingAvatarId === a.id ? 'true' : 'false'}">
      <img src="${a.image}" alt="Аватарка ${a.id}" loading="lazy">
    </div>
  `).join('');

  grid.querySelectorAll('.avatar-option').forEach(el => {
    const select = () => {
      pendingAvatarId = parseInt(el.dataset.avatarId);
      grid.querySelectorAll('.avatar-option').forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-pressed', 'false'); });
      el.classList.add('selected');
      el.setAttribute('aria-pressed', 'true');
    };
    el.addEventListener('click', select);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });
}

async function saveAvatar() {
  if (!currentUser || !currentUser.telegram) return showToast('⚠️ Войдите в профиль', 'error');
  if (!pendingAvatarId) return showToast('⚠️ Выберите аватарку', 'error');
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
    showToast('✅ Аватарка обновлена!', 'success');
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
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
  document.getElementById('bannerModal').classList.add('open');
}

function renderBannerGrid() {
  const grid = document.getElementById('bannerGrid');
  grid.innerHTML = BANNERS.map(b => `
    <div class="banner-option ${pendingBannerId === b.id ? 'selected' : ''}" data-banner-id="${b.id}" style="background-image: url('${b.image}');" title="Шапка ${b.id}" role="button" tabindex="0" aria-label="Шапка ${b.id}" aria-pressed="${pendingBannerId === b.id ? 'true' : 'false'}"></div>
  `).join('');

  grid.querySelectorAll('.banner-option').forEach(el => {
    const select = () => {
      pendingBannerId = parseInt(el.dataset.bannerId);
      grid.querySelectorAll('.banner-option').forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-pressed', 'false'); });
      el.classList.add('selected'); el.setAttribute('aria-pressed', 'true');
    };
    el.addEventListener('click', select);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  });
}

async function saveBanner() {
  if (!currentUser || !currentUser.telegram) return showToast('⚠️ Войдите в профиль', 'error');
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
    showToast(pendingBannerId ? '✅ Шапка обновлена!' : '✅ Шапка убрана', 'success');
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
  } finally {
    saveBtn.disabled = false; saveBtn.textContent = 'Сохранить';
  }
}

function removeBanner() {
  pendingBannerId = null;
  document.querySelectorAll('.banner-option').forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-pressed', 'false'); });
}

// =============================================
// ===== АВТОРИЗАЦИЯ =====
// =============================================
function switchAuthTab(tab) {
  currentAuthTab = tab;
  document.querySelectorAll('.auth-tab').forEach(t => { t.classList.toggle('active', t.dataset.tab === tab); t.setAttribute('aria-selected', t.dataset.tab === tab ? 'true' : 'false'); });
  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSubtitle');
  const submitText = document.getElementById('authSubmitText');
  const forgot = document.getElementById('authForgot');
  const passwordInput = document.getElementById('loginPassword');

  if (tab === 'register') {
    title.textContent = 'Создать аккаунт'; subtitle.textContent = 'Зарегистрируйтесь, чтобы получать билетики';
    submitText.textContent = 'Зарегистрироваться'; forgot.classList.add('hidden'); passwordInput.setAttribute('autocomplete', 'new-password');
  } else {
    title.textContent = 'С возвращением'; subtitle.textContent = 'Войдите, чтобы продолжить покупки';
    submitText.textContent = 'Войти'; forgot.classList.remove('hidden'); passwordInput.setAttribute('autocomplete', 'current-password');
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
  document.getElementById('togglePassword').textContent = '👁';
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
      document.querySelectorAll('.toast').forEach(t => t.classList.add('hide'));
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
    icon: '🧹',
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
  saveCartToStorage();
  updateCartUI();
  showToast('🧹 Корзина очищена', 'info');
}

function getCartTotal() {
  return Utils.calculateCartTotal(cart, discountPercent);
}

// ИСПРАВЛЕНИЕ №1: Добавлен бренд в корзину
function updateCartUI() {
  const totalItems = Utils.countCartItems(cart);
  cartCount.textContent = totalItems;

  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) clearBtn.style.display = cart.length > 0 ? 'inline-block' : 'none';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
    cartTotal.textContent = '0.00';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__info">
        <span class="cart-item__name">
          <span style="display:block; font-size:12px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">${item.brand}</span>
          ${item.name}
        </span>
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
// ===== ПРОМОКОДЫ =====
// =============================================
const promoInput = document.getElementById('promoCode');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoMessage = document.getElementById('promoMessage');

function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();
  if (!code) { promoMessage.textContent = '⚠️ Введите промокод'; promoMessage.style.color = '#ff7777'; return; }
  if (appliedPromo === code) { promoMessage.textContent = 'ℹ️ Этот промокод уже применён'; promoMessage.style.color = '#B9A99A'; return; }
  const promo = promocodes.find(p => p.code === code);
  if (promo) {
    discountPercent = promo.discount;
    appliedPromo = code;
    promoMessage.textContent = `✅ Промокод "${code}" применён! Скидка ${discountPercent}%`;
    promoMessage.style.color = '#8aff8a';
    promoInput.disabled = true; applyPromoBtn.disabled = true;
    updateCartUI(); showToast(`✅ Промокод "${code}" применён!`, 'success');
  } else {
    promoMessage.textContent = `❌ Промокод "${code}" не найден`;
    promoMessage.style.color = '#ff7777';
  }
}

// =============================================
// ===== ФИЛЬТРЫ =====
// =============================================
// ИСПРАВЛЕНИЕ №2: Сортировка брендов по новизне (по убыванию ID товаров)
function initFilters(category) {
  const container = document.getElementById('filterContainer');
  if (!container) return;
  const catProducts = products.filter(p => p.category === category);
  
  // Собираем уникальные бренды
  const brands = [...new Set(catProducts.map(p => p.brand))];
  
  // Сортируем бренды так, чтобы те, у которых есть товары с большим ID (новинки), были первыми
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
    
    return `
      <div class="product-card" data-id="${p.id}">
        <button class="product-card__fav ${fav ? 'active' : ''}" data-id="${p.id}" aria-label="${fav ? 'Убрать из избранного' : 'Добавить в избранное'}" aria-pressed="${fav ? 'true' : 'false'}">${fav ? '❤' : '♡'}</button>
        <a href="product.html?id=${p.id}" class="product-card__link" aria-label="Открыть ${p.name}">
          <img src="${p.image}" alt="${p.name}" class="product-card__image" loading="lazy" onerror="this.src='https://i.ibb.co/VWRmsGHt/logo.png'">
          ${popularity}
          <div class="product-card__name">${p.name}</div>
          <div class="product-card__brand">${p.brand}</div>
          <div class="product-card__price">${p.price} BYN</div>
        </a>
        <button class="product-card__btn" onclick="addToCart(${p.id}, event)" aria-label="Добавить ${p.name} в корзину">В корзину</button>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.product-card__fav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); e.preventDefault();
      toggleFavorite(parseInt(btn.dataset.id));
    });
  });
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
    document.getElementById('profileModal').classList.add('open'); updateProfileUI();
  } else {
    resetAuthForm(); document.getElementById('loginModal').classList.add('open');
  }
});

document.querySelectorAll('.auth-tab').forEach(tab => tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab)));
document.getElementById('authForm').addEventListener('submit', (e) => { e.preventDefault(); if (currentAuthTab === 'register') register(); else login(); });

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
  input.addEventListener('input', () => { input.closest('.auth-field').classList.remove('error'); input.removeAttribute('aria-invalid'); });
});

document.getElementById('forgotPasswordLink').addEventListener('click', (e) => { e.preventDefault(); showToast('📩 Напишите в наш Telegram — поможем восстановить пароль', 'info'); });

document.getElementById('profileLogout').addEventListener('click', () => {
  localStorage.removeItem('user_telegram'); currentUser = null; updateProfileUI();
  profileModalCtrl.closeFn(); showToast('👋 Вы вышли из профиля', 'info');
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
  document.getElementById('orderModal').classList.add('open');
  orderMessage.style.display = 'none'; orderMessage.textContent = '';
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('orderName').value.trim();
  const telegramRaw = document.getElementById('orderTelegram').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const comment = document.getElementById('orderComment').value.trim();

  if (!name) { orderMessage.style.display = 'block'; orderMessage.textContent = '⚠️ Пожалуйста, укажите имя.'; orderMessage.style.color = '#ff7777'; return; }
  
  const telegramClean = Utils.normalizeTelegramUsername(telegramRaw);
  const telegramErr = Utils.validateTelegramUsername(telegramClean);
  if (telegramErr) { orderMessage.style.display = 'block'; orderMessage.textContent = '⚠️ ' + telegramErr; orderMessage.style.color = '#ff7777'; return; }
  
  const telegramForServer = '@' + telegramClean;
  const submitBtn = document.getElementById('orderSubmit');
  submitBtn.disabled = true; submitBtn.textContent = 'Отправка...';

  if (!orderIdempotencyKey) orderIdempotencyKey = Utils.generateUUID();

  const orderData = {
    name, telegram: telegramForServer, address, comment, items: cart,
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    total: getCartTotal(), promo: appliedPromo, discount: discountPercent, idempotencyKey: orderIdempotencyKey
  };

  try {
    const response = await fetch(WORKER_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: orderData }) });
    if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || 'Ошибка отправки заказа'); }

    orderMessage.style.display = 'block'; orderMessage.textContent = '✅ Заказ успешно отправлен! Мы свяжемся с вами в Telegram.'; orderMessage.style.color = '#8aff8a';

    setTimeout(() => {
      cart = []; appliedPromo = null; discountPercent = 0; orderIdempotencyKey = null;
      saveCartToStorage(); updateCartUI(); closeCart(); orderModalCtrl.closeFn(); orderForm.reset();
      orderMessage.style.display = 'none'; promoInput.value = ''; promoInput.disabled = false;
      applyPromoBtn.disabled = false; promoMessage.textContent = '';
      showToast('✅ Заказ оформлен! Спасибо!', 'success');
      if (currentUser && currentUser.telegram) loadUserProfile(currentUser.telegram);
    }, 2000);
  } catch (error) {
    orderMessage.style.display = 'block'; orderMessage.textContent = `⚠️ Ошибка: ${error.message || 'Неизвестная ошибка'}. Попробуйте позже.`; orderMessage.style.color = '#ff7777';
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

categoryBtns.forEach(btn => btn.addEventListener('click', () => switchCategory(btn.dataset.category)));
categoryBtnsMobile.forEach(btn => {
  btn.addEventListener('click', () => {
    switchCategory(btn.dataset.category); burger.classList.remove('active'); mobileMenu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
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
    
    // Немного подсвечиваем кнопку при клике
    secretBtn.style.opacity = '0.5';
    
    if (secretClickTimeout) clearTimeout(secretClickTimeout);

    if (secretClickCount >= 3) {
      // Перекидываем в игру
      window.location.href = 'flappy.html';
    } else {
      // Если не успел кликнуть 3 раза за 2 секунды, счетчик сбрасывается
      secretClickTimeout = setTimeout(() => {
        secretClickCount = 0;
        secretBtn.style.opacity = '0.05';
      }, 2000);
    }
  });
}

// =============================================
// ===== ЗАПУСК =====
// =============================================
initAgeGate();
initScrollToTop();
checkReferral();
loadFavoritesFromStorage();
loadProducts().then(() => {
  initProfile();
  checkAnnouncement();
});