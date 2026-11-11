// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';
const RECENTLY_VIEWED_KEY = 'torgovchik_recently_viewed';
const RECENTLY_VIEWED_MAX = 12;

// ===== SVG-ИКОНКИ (Lucide, stroke=currentColor) — те же, что в script.js =====
function svgIcon(paths, size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px;" aria-hidden="true">${paths}</svg>`;
}
const UI_ICONS = {
  info:   s => svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>', s),
  success: s => svgIcon('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>', s),
  error:  s => svgIcon('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>', s),
  leaf:   s => svgIcon('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>', s)
};

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

  const closeModal = () => {
    modal.classList.remove('open', 'show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const isVerified = localStorage.getItem('torgovchik_age_verified') === 'true';
  if (isVerified) {
    closeModal();
    return;
  }

  // Ворота нельзя закрыть по Esc/клику вне окна (юридическое требование) —
  // поэтому без setupModal: только фокус-ловушка по Tab.
  modal.classList.add('open', 'show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const question = document.getElementById('ageGateQuestion');
  const deny = document.getElementById('ageGateDeny');
  const yesBtn = document.getElementById('ageGateYes');
  const noBtn = document.getElementById('ageGateNo');

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); return; }
    if (e.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('button')).filter(el => el.offsetParent !== null);
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  if (yesBtn) {
    yesBtn.focus();
    yesBtn.addEventListener('click', () => {
      localStorage.setItem('torgovchik_age_verified', 'true');
      closeModal();
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
// ===== ВИТРИНА ДРУГА (шеринг карточки товара) =====
// =============================================
// Генерирует премиальную карточку 1200x630 (идеальный размер для Telegram
// и соцсетей) через Canvas и шарит файлом. Без файла (ПК/старые браузеры) —
// скачивание картинки; если Canvas «запятнан» CORS — шерингом ссылки.

const SHARE_SITE_URL = 'spodzh.github.io/torgovchik-shop';

// Загрузка картинки товара: сначала с CORS (чтобы Canvas не запятнать),
// при неудаче — без CORS (картинка нарисуется, но экспорт будет заблокирован)
function loadShareImage(src) {
  return new Promise((resolve) => {
    const crossOrigin = (() => {
      try { return new URL(src, window.location.href).origin !== window.location.origin; }
      catch (e) { return true; }
    })();

    const attempt = (useCors) => {
      const img = new Image();
      if (useCors) img.crossOrigin = 'anonymous';
      const timeout = setTimeout(() => { img.onerror = img.onload = null; resolve({ img: null, tainted: false }); }, 6000);
      img.onload = () => { clearTimeout(timeout); resolve({ img, tainted: !useCors && crossOrigin }); };
      img.onerror = () => {
        clearTimeout(timeout);
        if (useCors) attempt(false);
        else resolve({ img: null, tainted: false });
      };
      img.src = src;
    };
    attempt(true);
  });
}

function wrapShareText(ctx, text, maxWidth, maxLines) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = words[i];
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  const covered = lines.join(' ').split(/\s+/).length;
  if (lines.length === maxLines && covered < words.length) {
    lines[maxLines - 1] += '…';
  }
  return lines;
}

function drawShareCard(product, img) {
  const W = 1200, H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const rr = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // ===== ФОН: тёмный + янтарное и холодное свечение =====
  ctx.fillStyle = '#17191B';
  ctx.fillRect(0, 0, W, H);

  let glow = ctx.createRadialGradient(120, 80, 0, 120, 80, 520);
  glow.addColorStop(0, 'rgba(197, 138, 69, 0.14)');
  glow.addColorStop(1, 'rgba(197, 138, 69, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  glow = ctx.createRadialGradient(1080, 560, 0, 1080, 560, 480);
  glow.addColorStop(0, 'rgba(130, 149, 160, 0.10)');
  glow.addColorStop(1, 'rgba(130, 149, 160, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ===== СТЕКЛЯННАЯ КАРТОЧКА =====
  rr(24, 24, W - 48, H - 48, 32);
  ctx.fillStyle = 'rgba(41, 39, 37, 0.62)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(130, 149, 160, 0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Блик по верхней кромке
  const shine = ctx.createLinearGradient(24, 24, W - 24, 24);
  shine.addColorStop(0, 'rgba(255,255,255,0)');
  shine.addColorStop(0.5, 'rgba(255,255,255,0.22)');
  shine.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = shine;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(56, 25.5);
  ctx.lineTo(W - 56, 25.5);
  ctx.stroke();

  // ===== ПЬЕДЕСТАЛ ПОД КАРТИНКОЙ ТОВАРА =====
  glow = ctx.createRadialGradient(900, 380, 0, 900, 380, 300);
  glow.addColorStop(0, 'rgba(217, 160, 91, 0.12)');
  glow.addColorStop(1, 'rgba(217, 160, 91, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(560, 60, 640, 540);

  // Подложка картинки — как .product-image-wrap на странице
  rr(700, 95, 400, 400, 28);
  ctx.fillStyle = 'rgba(23, 25, 27, 0.65)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(130, 149, 160, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (img) {
    const pad = 36;
    const boxW = 400 - pad * 2, boxH = 400 - pad * 2;
    const scale = Math.min(boxW / img.width, boxH / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    // Мягкая тень под товаром, как на витрине
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 14;
    ctx.drawImage(img, 900 - dw / 2, 295 - dh / 2, dw, dh);
    ctx.restore();
  } else {
    // Товар без картинки: аккуратный водяной знак вместо фото
    ctx.fillStyle = '#7A7D7C';
    ctx.font = '700 30px Manrope, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TORGOVCHIK', 900, 305);
    ctx.font = '500 18px Manrope, sans-serif';
    ctx.fillText('Гомель', 900, 340);
    ctx.textAlign = 'left';
  }

  // ===== ТЕКСТ СЛЕВА =====
  const textX = 80;

  // Бренд
  ctx.fillStyle = '#C58A45';
  ctx.font = '700 20px Manrope, sans-serif';
  try { ctx.letterSpacing = '4px'; } catch (e) { /* старые браузеры */ }
  ctx.fillText(String(product.brand || '').toUpperCase(), textX, 160);
  try { ctx.letterSpacing = '0px'; } catch (e) { /* noop */ }

  // Название: Unbounded с переносом (мелкий шрифт, если слова длинные)
  let titleSize = 46;
  ctx.font = `600 ${titleSize}px Unbounded, Manrope, sans-serif`;
  const longestWord = String(product.name || '').trim().split(/\s+/).reduce((a, w) => Math.max(a, ctx.measureText(w).width), 0);
  if (longestWord > 560) titleSize = 34;
  ctx.font = `600 ${titleSize}px Unbounded, Manrope, sans-serif`;
  ctx.fillStyle = '#E4E7E5';
  const titleLines = wrapShareText(ctx, product.name || '', 560, 3);
  titleLines.forEach((line, i) => ctx.fillText(line, textX, 230 + i * (titleSize * 1.25)));

  // Цена
  ctx.fillStyle = '#D9A05B';
  ctx.font = '600 62px Unbounded, Manrope, sans-serif';
  const priceText = String(product.price || '');
  ctx.fillText(priceText, textX, 480);
  const priceW = ctx.measureText(priceText).width;
  ctx.fillStyle = '#A7AAA8';
  ctx.font = '500 26px Manrope, sans-serif';
  ctx.fillText('BYN', textX + priceW + 16, 480);

  // ===== ПОДВАЛ: ник или магазин + ссылка =====
  const telegram = (localStorage.getItem('user_telegram') || '').replace(/^@/, '');
  ctx.fillStyle = '#A7AAA8';
  ctx.font = '500 24px Manrope, sans-serif';
  ctx.fillText(telegram ? `Витрина от @${telegram}` : 'Магазин Torgovchik', textX, 565);

  ctx.fillStyle = '#7A7D7C';
  ctx.font = '500 20px Manrope, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(SHARE_SITE_URL, W - 80, 565);
  ctx.textAlign = 'left';

  return canvas;
}

async function shareProduct(product, btn) {
  if (!product) return;
  if (btn) { btn.disabled = true; }

  try {
    // Ждём загрузки Unbounded/Manrope — без этого Canvas отрисует фолбэк-шрифт
    try {
      await Promise.all([
        document.fonts.load('600 46px Unbounded'),
        document.fonts.load('600 62px Unbounded'),
        document.fonts.load('700 20px Manrope'),
        document.fonts.load('500 24px Manrope')
      ]);
      await document.fonts.ready;
    } catch (e) { /* нет Font API — рисуем тем, что есть */ }

    const { img } = await loadShareImage(product.image);
    const canvas = drawShareCard(product, img);

    // Экспорт может упасть, если картинка загрузилась без CORS (запятнанный Canvas)
    let blob = null;
    try {
      blob = await new Promise((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob empty')), 'image/png');
      });
    } catch (e) {
      blob = null; // запятнанный Canvas —sharing только ссылкой
    }

    const shareText = `${product.name} — ${product.brand} · ${product.price} BYN`;
    const shareUrl = window.location.href;

    if (blob) {
      const file = new File([blob], `torgovchik-${parseInt(product.id, 10) || 'item'}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'Torgovchik', text: shareText, url: shareUrl });
          return; // системное окно закрыто пользователем — тост не нужен
        } catch (err) {
          if (err && err.name === 'AbortError') return;
          // Web Share не сработал — скачаем
        }
      }
      // Фолбэк: скачивание картинки
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast('Карточка сохранена — отправь её друзьям!', 'success');
      return;
    }

    // Canvas запятнан (нет CORS на картинках) — делимся ссылкой
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Torgovchik', text: shareText, url: shareUrl });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    await navigator.clipboard.writeText(shareText + ' ' + shareUrl);
    showToast('Ссылка на товар скопирована', 'info');
  } catch (err) {
    console.error('Ошибка шеринг-карточки:', err);
    showToast('Не удалось подготовить карточку', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
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
    <a href="product.html?id=${encodeURIComponent(String(p.id))}" class="recently-viewed__card">
      <img src="${Utils.escapeHtml(p.image)}" alt="${Utils.escapeHtml(p.name)}" class="recently-viewed__image" loading="lazy" onerror="this.src='assets/logo.png'">
      <div class="recently-viewed__name">${Utils.escapeHtml(p.name)}</div>
      <div class="recently-viewed__brand">${Utils.escapeHtml(p.brand)}</div>
      <div class="recently-viewed__price">${Utils.escapeHtml(p.price)} BYN</div>
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
      <div class="product-not-found__icon" style="color:var(--accent); margin-bottom:20px; filter:drop-shadow(0 0 10px rgba(197,138,69,0.3));">${UI_ICONS.leaf(56)}</div>
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

  const nameEsc = Utils.escapeHtml(p.name);
  const brandEsc = Utils.escapeHtml(p.brand);
  const categoryEsc = Utils.escapeHtml(categoryLabel);
  const priceEsc = Utils.escapeHtml(Utils.formatPrice(p.price));
  const sku = '#' + String(parseInt(p.id, 10) || 0).padStart(4, '0');

  const popularityHtml = boughtCount > 0
    ? `<div class="product-info__brand" style="color:var(--accent); background:rgba(197,138,69,0.1); display:inline-block; padding:4px 12px; border-radius:20px; margin-bottom:12px; width:fit-content;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> Купили ${parseInt(boughtCount, 10) || 0} раз</div>`
    : '';

  content.innerHTML = `
    <div class="product-container">
      <div class="product-image-wrap">
        <button class="product-card__fav ${isFav ? 'active' : ''}"
                id="productFavBtn"
                aria-label="${isFav ? 'Убрать из избранного' : 'Добавить в избранное'}"
                aria-pressed="${isFav ? 'true' : 'false'}">${isFav ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'}</button>
        <img src="${Utils.escapeHtml(p.image)}"
             alt="${nameEsc}"
             onerror="this.src='assets/logo.png'">
      </div>

      <div class="product-info">
        <div class="product-info__brand">${brandEsc}</div>
        <h1 class="product-info__title">${nameEsc}</h1>
        ${popularityHtml}
        <div class="product-info__price">${priceEsc} <span>BYN</span></div>
        
        <div class="product-info__desc">
          Качественный товар от проверенного бренда. Отличный выбор для вашей Pod-системы. В наличии в Гомеле.
        </div>

        <div class="product-info__actions">
          <button class="btn ${inCart ? 'btn-secondary' : 'btn-primary'}"
                  id="productAddBtn"
                  ${inCart ? 'disabled' : ''}>
            ${inCart ? '✓ В корзине' : 'Добавить в корзину'}
          </button>
          <button class="btn btn-secondary btn-share" id="productShareBtn" type="button" aria-label="Поделиться товаром с друзьями">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
            Поделиться
          </button>
          <a href="index.html" class="btn btn-secondary" style="text-decoration:none;">
            В каталог
          </a>
        </div>

        <div class="product-info__meta">
          <div class="product-meta-item">
            <span>Бренд</span>
            <strong>${brandEsc}</strong>
          </div>
          <div class="product-meta-item">
            <span>Категория</span>
            <strong>${categoryEsc}</strong>
          </div>
          <div class="product-meta-item">
            <span>Артикул</span>
            <strong>${Utils.escapeHtml(sku)}</strong>
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

  const shareBtn = document.getElementById('productShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => shareProduct(p, shareBtn));
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
    if (ogImage) ogImage.setAttribute('content', new URL(p.image, window.location.href).href);

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
    favBtn.innerHTML = isFav ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
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
    await loadProductStats();

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