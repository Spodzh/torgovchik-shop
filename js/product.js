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
let renderFinished = false;

// =============================================
// ===== ТОСТЫ =====
// =============================================
function showToast(message, type, action) {
  type = type || 'info';
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `
    <span class="toast__icon">${icon}</span>
    <span class="toast__message">${message}</span>
  `;

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
  closeBtn.innerHTML = '✕';
  closeBtn.addEventListener('click', () => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  });
  toast.appendChild(closeBtn);

  container.appendChild(toast);

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
// ===== 18+ ВРАТА =====
// =============================================
function initAgeGate() {
  const modal = document.getElementById('ageGateModal');
  if (!modal) return;

  const isVerified = localStorage.getItem('torgovchik_age_verified') === 'true';
  if (isVerified) {
    modal.classList.remove('open', 'show');
    document.body.style.overflow = '';
    return;
  }

  modal.classList.add('open', 'show');
  document.body.style.overflow = 'hidden';

  const question = document.getElementById('ageGateQuestion');
  const deny = document.getElementById('ageGateDeny');
  const yesBtn = document.getElementById('ageGateYes');
  const noBtn = document.getElementById('ageGateNo');

  if (yesBtn) {
    yesBtn.addEventListener('click', () => {
      localStorage.setItem('torgovchik_age_verified', 'true');
      modal.classList.remove('open', 'show');
      document.body.style.overflow = '';
    });
  }

  if (noBtn && question && deny) {
    noBtn.addEventListener('click', () => {
      question.style.display = 'none';
      deny.classList.add('open', 'show');
    });
  }
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
  let total = 0;
  if (typeof Utils !== 'undefined' && Utils.countCartItems) {
    total = Utils.countCartItems(cart);
  } else {
    total = cart.reduce((s, i) => s + (parseInt(i.quantity) || 0), 0);
  }
  badge.textContent = total;
}

function flyToCart(sourceEl, imageSrc) {
  if (!sourceEl) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    text: 'В корзину',
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

  let result;
  if (typeof Utils !== 'undefined' && Utils.toggleFavoriteInList) {
    result = Utils.toggleFavoriteInList(favorites, productId);
  } else {
    const arr = favorites.slice();
    const idx = arr.indexOf(productId);
    if (idx >= 0) { arr.splice(idx, 1); result = { list: arr, added: false }; }
    else { arr.push(productId); result = { list: arr, added: true }; }
  }

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
      <img src="${p.image}" alt="${p.name}" class="recently-viewed__image" loading="lazy" onerror="this.src='assets/logo.png'">
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

function renderNotFound(message) {
  const content = document.getElementById('productContent');
  if (!content) return;
  renderFinished = true;
  content.innerHTML = `
    <div class="product-not-found" style="text-align:center; padding:60px 20px;">
      <div class="product-not-found__icon" style="font-size:64px; margin-bottom:20px; filter:drop-shadow(0 0 10px rgba(197,138,69,0.3));">🍂</div>
      <h2 class="product-not-found__title" style="font-family:'Bitter', serif; font-size:28px; color:var(--text-primary); margin-bottom:12px;">Товар не найден</h2>
      <p class="product-not-found__text" style="color:var(--text-secondary); margin-bottom:24px; line-height:1.6;">
        ${message || 'Возможно, он уже распродан или вы перешли по устаревшей ссылке.'}<br>
        Загляните в каталог — там много вкусного.
      </p>
      <a href="index.html" class="btn btn-primary" style="display:inline-block; padding:14px 28px;">← В каталог</a>
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
  if (!content) return;

  renderFinished = true;

  const isFav = typeof Utils !== 'undefined' && Utils.isFavorite
    ? Utils.isFavorite(favorites, p.id)
    : favorites.indexOf(p.id) !== -1;
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
    ? `<div class="product-info__brand" style="color:var(--accent); background:rgba(197,138,69,0.1); display:inline-block; padding:4px 12px; border-radius:20px; margin-bottom:12px; width:fit-content;">🔥 Купили ${boughtCount} раз</div>`
    : '';

  content.innerHTML = `
    <div class="product-container">
      <div class="product-image-wrap">
        <button class="product-card__fav ${isFav ? 'active' : ''}"
                id="productFavBtn"
                aria-label="${isFav ? 'Убрать из избранного' : 'Добавить в избранное'}"
                aria-pressed="${isFav ? 'true' : 'false'}">${isFav ? '❤' : '♡'}</button>
        <img src="${p.image}"
             alt="${p.name}"
             onerror="this.src='assets/logo.png'">
      </div>

      <div class="product-info">
        <div class="product-info__brand">${p.brand}</div>
        <h1 class="product-info__title">${p.name}</h1>
        ${popularityHtml}
        <div class="product-info__price">${p.price} <span>BYN</span></div>
        
        <div class="product-info__desc">
          Качественный товар от проверенного бренда. Отличный выбор для вашей Pod-системы. В наличии в Гомеле.
        </div>

        <div class="product-info__actions">
          <button class="btn ${inCart ? 'btn-secondary' : 'btn-primary'}"
                  id="productAddBtn"
                  ${inCart ? 'disabled' : ''}>
            ${inCart ? '✓ В корзине' : 'Добавить в корзину'}
          </button>
          <a href="index.html" class="btn btn-secondary" style="text-decoration:none;">
            В каталог
          </a>
        </div>

        <div class="product-info__meta">
          <div class="product-meta-item">
            <span>Бренд</span>
            <strong>${p.brand}</strong>
          </div>
          <div class="product-meta-item">
            <span>Категория</span>
            <strong>${categoryLabel}</strong>
          </div>
          <div class="product-meta-item">
            <span>Артикул</span>
            <strong>#${String(p.id).padStart(4, '0')}</strong>
          </div>
          <div class="product-meta-item">
            <span>Наличие</span>
            <strong style="color: #2ecc71;">В наличии</strong>
          </div>
        </div>
      </div>
    </div>
  `;

  const favBtn = document.getElementById('productFavBtn');
  if (favBtn) {
    favBtn.addEventListener('click', () => toggleFavorite(p.id));
  }

  const addBtn = document.getElementById('productAddBtn');
  if (addBtn && !inCart) {
    addBtn.addEventListener('click', (e) => addToCart(p.id, e));
  }

  // SEO
  try {
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

    setMeta('product:price:amount', String(p.price));
    setMeta('product:price:currency', 'BYN');
    setMeta('product:availability', 'in stock');
    setMeta('og:price:amount', String(p.price));
    setMeta('og:price:currency', 'BYN');

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
  } catch (e) {
    console.warn('SEO update failed:', e);
  }
}

function updateProductActions() {
  if (!currentProduct) return;

  const isFav = typeof Utils !== 'undefined' && Utils.isFavorite
    ? Utils.isFavorite(favorites, currentProduct.id)
    : favorites.indexOf(currentProduct.id) !== -1;
  const inCart = isInCart(currentProduct.id);

  const favBtn = document.getElementById('productFavBtn');
  if (favBtn) {
    favBtn.classList.toggle('active', isFav);
    favBtn.textContent = isFav ? '❤' : '♡';
    favBtn.setAttribute('aria-label', isFav ? 'Убрать из избранного' : 'Добавить в избранное');
    favBtn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
  }

  const addBtn = document.getElementById('productAddBtn');
  if (addBtn) {
    if (inCart) {
      addBtn.classList.remove('btn-primary');
      addBtn.classList.add('btn-secondary');
      addBtn.textContent = '✓ В корзине';
      addBtn.disabled = true;
    } else {
      addBtn.classList.add('btn-primary');
      addBtn.classList.remove('btn-secondary');
      addBtn.textContent = 'Добавить в корзину';
      addBtn.disabled = false;
    }
  }
}

async function loadProductStats() {
  try {
    const response = await fetch(WORKER_URL + 'product-stats');
    if (response.ok) productStats = await response.json();
  } catch (e) {
    productStats = {};
  }
}

async function loadData() {
  // Защитный таймер: если через 6 секунд ничего не отрендерилось — показать ошибку
  const safetyTimeout = setTimeout(() => {
    if (!renderFinished) {
      console.warn('Товар не отрендерился за 6 секунд');
      renderNotFound('Страница загружается слишком долго. Проверьте интернет и попробуйте ещё раз.');
    }
  }, 6000);

  try {
    console.log('Начинаем загрузку товаров...');
    const productsResp = await fetch(WORKER_URL + 'products');
    if (!productsResp.ok) throw new Error('Ошибка загрузки каталога: HTTP ' + productsResp.status);

    products = await productsResp.json();
    if (!Array.isArray(products)) throw new Error('Некорректный ответ сервера');

    console.log('Товары загружены:', products.length);
    loadProductStats();

    const productId = getIdFromUrl();
    console.log('ID товара из URL:', productId);

    if (productId === null) {
      clearTimeout(safetyTimeout);
      renderNotFound('В ссылке не указан ID товара.');
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
      clearTimeout(safetyTimeout);
      renderNotFound('Товар с таким ID не найден.');
      return;
    }

    currentProduct = product;
    clearTimeout(safetyTimeout);
    renderProduct(product);
    addToRecentlyViewed(productId);
    renderRecentlyViewed(productId);
    console.log('Товар успешно отрендерен.');
  } catch (e) {
    clearTimeout(safetyTimeout);
    console.error('Не удалось загрузить данные:', e);
    renderNotFound('Ошибка загрузки: ' + (e.message || 'неизвестная ошибка') + '. Попробуйте обновить страницу.');
  }
}

// =============================================
// ===== ГЛОБАЛЬНЫЙ ОБРАБОТЧИК ОШИБОК =====
// =============================================
window.addEventListener('error', function (e) {
  console.error('JS Error:', e.message, 'at', e.filename + ':' + e.lineno);
  if (!renderFinished) {
    renderNotFound('Произошла ошибка при загрузке страницы. Попробуйте обновить.');
  }
});

window.addEventListener('unhandledrejection', function (e) {
  console.error('Unhandled Promise Rejection:', e.reason);
  if (!renderFinished) {
    renderNotFound('Произошла ошибка. Попробуйте обновить страницу.');
  }
});

// =============================================
// ===== ЗАПУСК =====
// =============================================
try { initAgeGate(); } catch (e) { console.warn('initAgeGate failed:', e); }
try { initScrollToTop(); } catch (e) { console.warn('initScrollToTop failed:', e); }
try { loadCartFromStorage(); } catch (e) { console.warn('loadCartFromStorage failed:', e); }
try { loadFavoritesFromStorage(); } catch (e) { console.warn('loadFavoritesFromStorage failed:', e); }
loadData();