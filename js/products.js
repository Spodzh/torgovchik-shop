// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';
const RECENTLY_VIEWED_KEY = 'torgovchik_recently_viewed';
const RECENTLY_VIEWED_MAX = 12;

// =============================================
// ===== СОСТОЯНИЕ =====
// =============================================
let products = [];
let productStats = {};
let cart = [];
let favorites = [];
let currentProduct = null;

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

  toast.innerHTML = `
    <div class="toast__body">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

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
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================================
// ===== КОРЗИНА =====
// =============================================
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('torgovchik_cart');
    if (saved) {
      cart = JSON.parse(saved);
      if (!Array.isArray(cart)) cart = [];
    }
  } catch (e) {
    cart = [];
  }
  updateCartBadge();
}

function saveCartToStorage() {
  localStorage.setItem('torgovchik_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  const total = Utils.countCartItems(cart);
  badge.textContent = total;
}

function flyToCart(sourceEl, imageSrc) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!sourceEl) return;

  // На странице товара корзина — это ссылка <a class="cart-btn">
  const cartBtn = document.querySelector('.cart-btn');
  if (!cartBtn) return;

  const startRect = sourceEl.getBoundingClientRect();
  const endRect = cartBtn.getBoundingClientRect();

  const img = document.createElement('img');
  img.src = imageSrc;
  img.className = 'fly-to-cart';
  img.style.left = startRect.left + 'px';
  img.style.top = startRect.top + 'px';
  img.style.width = Math.min(startRect.width, 200) + 'px';
  img.style.height = Math.min(startRect.height, 200) + 'px';
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
  updateCartBadge();
  updateProductActions();

  if (event) {
    const btn = event.currentTarget || event.target;
    flyToCart(btn, product.image);
  }

  showToast(`${product.name} добавлен в корзину`, 'success', {
    text: 'Перейти в корзину',
    onClick: () => {
      window.location.href = 'index.html#catalog';
    }
  });
}

function isInCart(productId) {
  return cart.some(item => item.id === productId);
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
    favorites = [];
  }
  updateFavoritesBadge();
}

function saveFavoritesToStorage() {
  localStorage.setItem('torgovchik_favorites', JSON.stringify(favorites));
}

function updateFavoritesBadge() {
  const badge = document.getElementById('favoritesCount');
  if (!badge) return;
  badge.textContent = favorites.length;
}

function toggleFavorite(productId) {
  if (!currentProduct) return;
  const result = Utils.toggleFavoriteInList(favorites, productId);
  favorites = result.list;
  saveFavoritesToStorage();
  updateFavoritesBadge();
  updateProductActions();

  if (result.added) {
    showToast(currentProduct.name + ' добавлен в избранное', 'success');
  } else {
    showToast(currentProduct.name + ' убран из избранного', 'info');
  }
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

function saveRecentlyViewed(list) {
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
}

function addToRecentlyViewed(productId) {
  let list = loadRecentlyViewed();
  list = list.filter(id => id !== productId);
  list.unshift(productId);
  if (list.length > RECENTLY_VIEWED_MAX) list = list.slice(0, RECENTLY_VIEWED_MAX);
  saveRecentlyViewed(list);
}

function renderRecentlyViewed(currentProductId) {
  const section = document.getElementById('recentlyViewedSection');
  const grid = document.getElementById('recentlyViewedGrid');
  if (!section || !grid) return;

  const ids = loadRecentlyViewed().filter(id => id !== currentProductId);
  const items = ids
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

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
// ===== ЗАГРУЗКА =====
// =============================================
function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  return isNaN(id) ? null : id;
}

function renderNotFound() {
  const content = document.getElementById('productContent');
  content.innerHTML = `
    <div class="product-not-found">
      <div class="product-not-found__icon">🍂</div>
      <h2 class="product-not-found__title">Товар не найден</h2>
      <p class="product-not-found__text">
        Возможно, он уже распродан или вы перешли по устаревшей ссылке.<br>
        Загляните в каталог — там много вкусного.
      </p>
      <a href="index.html" class="btn btn-primary">← В каталог</a>
    </div>
  `;
}

function setMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function renderProduct(p) {
  const content = document.getElementById('productContent');
  const fav = Utils.isFavorite(favorites, p.id);
  const inCart = isInCart(p.id);
  const boughtCount = productStats[p.id] || 0;

  const categoryLabels = {
    liquids: 'Жидкости',
    coils: 'Испарители / Картриджи',
    snus: 'Снюс',
    disposables: 'Одноразки / Pod-системы'
  };
  const categoryLabel = categoryLabels[p.category] || p.category || '—';

  const popularityHtml = boughtCount > 0
    ? `<div class="product-detail__popularity">🔥 Купили ${boughtCount} раз</div>`
    : '';

  content.innerHTML = `
    <div class="product-detail">
      <div class="product-detail__image-wrap">
        <button class="product-detail__fav ${fav ? 'active' : ''}"
                id="productFavBtn"
                aria-label="${fav ? 'Убрать из избранного' : 'Добавить в избранное'}"
                aria-pressed="${fav ? 'true' : 'false'}">${fav ? '❤' : '♡'}</button>
        <img src="${p.image}"
             alt="${p.name}"
             class="product-detail__image"
             onerror="this.src='https://i.ibb.co/VWRmsGHt/logo.png'">
      </div>

      <div class="product-detail__info">
        <div class="product-detail__brand">${p.brand}</div>
        <h1 class="product-detail__name">${p.name}</h1>
        ${popularityHtml}
        <div class="product-detail__price">${p.price}<span>BYN</span></div>
        <span class="product-detail__category">${categoryLabel}</span>

        <div class="product-detail__actions">
          <button class="product-detail__btn ${inCart ? 'product-detail__btn--in-cart' : 'product-detail__btn--primary'}"
                  id="productAddBtn"
                  ${inCart ? 'disabled' : ''}>
            ${inCart ? '✓ В корзине' : 'В корзину'}
          </button>
          <a href="index.html" class="product-detail__btn product-detail__btn--secondary" style="text-align:center; text-decoration:none; display:flex; align-items:center; justify-content:center;">
            Продолжить покупки
          </a>
        </div>

        <div class="product-detail__meta">
          <div class="product-detail__meta-row">
            <span class="product-detail__meta-label">Бренд</span>
            <span class="product-detail__meta-value">${p.brand}</span>
          </div>
          <div class="product-detail__meta-row">
            <span class="product-detail__meta-label">Категория</span>
            <span class="product-detail__meta-value">${categoryLabel}</span>
          </div>
          <div class="product-detail__meta-row">
            <span class="product-detail__meta-label">Артикул</span>
            <span class="product-detail__meta-value">#${String(p.id).padStart(4, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('productFavBtn').addEventListener('click', () => {
    toggleFavorite(p.id);
  });

  const addBtn = document.getElementById('productAddBtn');
  if (addBtn && !inCart) {
    addBtn.addEventListener('click', (e) => {
      addToCart(p.id, e);
    });
  }

  // ===== SEO: обновляем мета-теги =====
  const pageTitle = p.name + ' — ' + p.brand + ' — Torgovchik';
  document.title = pageTitle;

  const metaDesc = 'Купить ' + p.name + ' от ' + p.brand + ' в магазине Torgovchik. Цена ' + p.price + ' BYN.';

  const descEl = document.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute('content', metaDesc);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', window.location.origin + window.location.pathname + '?id=' + p.id);
  }

  const ogTitle = document.getElementById('ogTitle');
  if (ogTitle) ogTitle.setAttribute('content', pageTitle);

  const ogDesc = document.getElementById('ogDescription');
  if (ogDesc) ogDesc.setAttribute('content', metaDesc);

  const ogImage = document.getElementById('ogImage');
  if (ogImage) ogImage.setAttribute('content', p.image);

  // Стандарт Open Graph for Products
  setMeta('product:price:amount', String(p.price));
  setMeta('product:price:currency', 'BYN');
  setMeta('product:availability', 'in stock');
  setMeta('og:price:amount', String(p.price));
  setMeta('og:price:currency', 'BYN');

  // JSON-LD Product
  const ldScript = document.createElement('script');
  ldScript.type = 'application/ld+json';
  ldScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': p.name,
    'brand': { '@type': 'Brand', 'name': p.brand },
    'image': p.image,
    'category': categoryLabel,
    'sku': '#' + String(p.id).padStart(4, '0'),
    'offers': {
      '@type': 'Offer',
      'price': p.price,
      'priceCurrency': 'BYN',
      'availability': 'https://schema.org/InStock',
      'seller': { '@type': 'Organization', 'name': 'Torgovchik' }
    }
  });
  document.head.appendChild(ldScript);
}

function updateProductActions() {
  if (!currentProduct) return;
  const fav = Utils.isFavorite(favorites, currentProduct.id);
  const inCart = isInCart(currentProduct.id);

  const favBtn = document.getElementById('productFavBtn');
  if (favBtn) {
    favBtn.classList.toggle('active', fav);
    favBtn.textContent = fav ? '❤' : '♡';
    favBtn.setAttribute('aria-label', fav ? 'Убрать из избранного' : 'Добавить в избранное');
    favBtn.setAttribute('aria-pressed', fav ? 'true' : 'false');
  }

  const addBtn = document.getElementById('productAddBtn');
  if (addBtn) {
    if (inCart) {
      addBtn.classList.remove('product-detail__btn--primary');
      addBtn.classList.add('product-detail__btn--in-cart');
      addBtn.textContent = '✓ В корзине';
      addBtn.disabled = true;
    } else {
      addBtn.classList.add('product-detail__btn--primary');
      addBtn.classList.remove('product-detail__btn--in-cart');
      addBtn.textContent = 'В корзину';
      addBtn.disabled = false;
    }
  }
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

async function loadData() {
  try {
    const [productsResp] = await Promise.all([
      fetch(WORKER_URL + 'products'),
      loadProductStats()
    ]);

    if (!productsResp.ok) throw new Error('Ошибка загрузки');
    products = await productsResp.json();
  } catch (e) {
    console.error('Не удалось загрузить каталог:', e);
    renderNotFound();
    return;
  }

  const productId = getIdFromUrl();
  if (productId === null) {
    renderNotFound();
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    renderNotFound();
    return;
  }

  currentProduct = product;
  renderProduct(product);
  addToRecentlyViewed(productId);
  renderRecentlyViewed(productId);
}

// =============================================
// ===== ЗАПУСК =====
// =============================================
initAgeGate();
initScrollToTop();
loadCartFromStorage();
loadFavoritesFromStorage();
loadData();