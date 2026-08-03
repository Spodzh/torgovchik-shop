// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';

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

// =============================================
// ===== ЗАГРУЗКА ТОВАРОВ И ПРОМОКОДОВ =====
// =============================================
async function loadProducts() {
  try {
    const response = await fetch(WORKER_URL + 'products');
    if (!response.ok) throw new Error('Ошибка загрузки товаров');
    products = await response.json();
    await loadPromocodes();
    const activeCategory = document.querySelector('.category-btn.active');
    if (activeCategory) {
      switchCategory(activeCategory.dataset.category);
    } else {
      switchCategory('liquids');
    }
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    products = [];
    showToast('⚠️ Не удалось загрузить ассортимент', 'error');
  }
}

async function loadPromocodes() {
  try {
    const response = await fetch(WORKER_URL + 'promocodes');
    if (!response.ok) throw new Error('Ошибка загрузки промокодов');
    promocodes = await response.json();
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
// ===== СИСТЕМА ПРОФИЛЕЙ (с паролями) =====
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

function updateProfileUI() {
  const userBtn = document.getElementById('userBtn');
  if (currentUser && currentUser.telegram) {
    const tickets = currentUser.totalTickets || 0;
    userBtn.innerHTML = `👤 ${currentUser.telegram} 🎟️${tickets}`;
    document.getElementById('profileName').textContent = currentUser.telegram;
    document.getElementById('profileTickets').textContent = tickets;
    document.getElementById('profileOrdersCount').textContent = (currentUser.orders || []).length;
    document.getElementById('profileAvatar').textContent = currentUser.telegram.charAt(0).toUpperCase();

    // ---- Реферальная ссылка ----
    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${currentUser.telegram}`;
    const referralDiv = document.getElementById('profileReferral');
    if (referralDiv) {
      referralDiv.innerHTML = `
        <p><strong>Реферальная ссылка:</strong></p>
        <div style="display:flex; gap:8px; align-items:center; background:rgba(255,255,255,0.05); border-radius:12px; padding:8px; word-break:break-all;">
          <span style="flex:1; font-size:14px; color:#c8b0e0;">${referralLink}</span>
          <button onclick="copyReferralLink('${referralLink}')" class="btn btn-primary" style="padding:6px 14px; font-size:13px;">Копировать</button>
        </div>
        <p style="margin-top:8px; color:#a080b8; font-size:14px;">Приглашено: <strong>${currentUser.referralCount || 0}</strong> человек</p>
      `;
    }

    // ---- Заказы ----
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
              <span class="order-total">${Math.round(total)} BYN</span>
            </div>
            <div class="order-date">${date}</div>
            <span class="order-status ${status}">${statusLabel}</span>
            ${order.tickets ? `&nbsp;<span style="color:#f7c948; font-size:13px;">🎟️ ${order.tickets} бил.</span>` : ''}
          </div>
        `;
      });
      ordersDiv.innerHTML = html;
    } else {
      ordersDiv.innerHTML = '<p style="color:#a080b8;">Заказов пока нет.</p>';
    }
  } else {
    userBtn.innerHTML = '👤 Войти';
    document.getElementById('profileName').textContent = 'Пользователь';
    document.getElementById('profileTickets').textContent = '0';
    document.getElementById('profileOrdersCount').textContent = '0';
    document.getElementById('profileAvatar').textContent = '👤';
    document.getElementById('profileOrders').innerHTML = '<p style="color:#a080b8;">Войдите, чтобы увидеть историю.</p>';
    const referralDiv = document.getElementById('profileReferral');
    if (referralDiv) referralDiv.innerHTML = '';
  }
}

// ---- КОПИРОВАНИЕ РЕФЕРАЛЬНОЙ ССЫЛКИ ----
window.copyReferralLink = function(link) {
  navigator.clipboard.writeText(link).then(() => {
    showToast('🔗 Реферальная ссылка скопирована!', 'success');
  }).catch(() => {
    const input = document.createElement('input');
    input.value = link;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('🔗 Реферальная ссылка скопирована!', 'success');
  });
};

// ---- ВХОД ----
async function login() {
  const input = document.getElementById('loginInput');
  const passwordInput = document.getElementById('loginPassword');
  const username = input.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    showToast('⚠️ Заполните все поля', 'error');
    return;
  }
  try {
    const response = await fetch(WORKER_URL + 'login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegram: username, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка входа');
    }
    localStorage.setItem('user_telegram', username);
    currentUser = data;
    updateProfileUI();
    document.getElementById('loginModal').classList.remove('open');
    showToast(`✅ Добро пожаловать, ${username}!`, 'success');
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
  }
}

// ---- РЕГИСТРАЦИЯ (с реферальным кодом) ----
async function register() {
  const input = document.getElementById('loginInput');
  const passwordInput = document.getElementById('loginPassword');
  const username = input.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    showToast('⚠️ Заполните все поля', 'error');
    return;
  }
  if (password.length < 4) {
    showToast('⚠️ Пароль должен быть не менее 4 символов', 'error');
    return;
  }
  try {
    const response = await fetch(WORKER_URL + 'register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram: username,
        password,
        ref: referralCode || null
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Ошибка регистрации');
    }
    showToast('✅ Регистрация успешна! Теперь войдите.', 'success');
    localStorage.removeItem('referralCode');
    await login();
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
  }
}

// ---- ИНИЦИАЛИЗАЦИЯ ПРОФИЛЯ ----
function initProfile() {
  const saved = localStorage.getItem('user_telegram');
  if (saved) {
    loadUserProfile(saved).then(() => {
      updateProfileUI();
    });
  }
}

// ---- ОБРАБОТЧИКИ ДЛЯ МОДАЛОК ----
document.getElementById('userBtn').addEventListener('click', () => {
  if (currentUser && currentUser.telegram) {
    document.getElementById('profileModal').classList.add('open');
    updateProfileUI();
  } else {
    document.getElementById('loginModal').classList.add('open');
    document.getElementById('loginInput').value = '';
    document.getElementById('loginPassword').value = '';
  }
});

document.getElementById('loginModalClose').addEventListener('click', () => {
  document.getElementById('loginModal').classList.remove('open');
});

document.getElementById('loginSubmit').addEventListener('click', login);
document.getElementById('registerSubmit').addEventListener('click', register);

document.getElementById('loginPassword').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});
document.getElementById('loginInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') login();
});

document.getElementById('profileModalClose').addEventListener('click', () => {
  document.getElementById('profileModal').classList.remove('open');
});

document.getElementById('profileLogout').addEventListener('click', () => {
  localStorage.removeItem('user_telegram');
  currentUser = null;
  updateProfileUI();
  document.getElementById('profileModal').classList.remove('open');
  showToast('👋 Вы вышли из профиля', 'info');
});

// ---- ЗАКРЫТИЕ МОДАЛОК ПО OVERLAY ----
document.getElementById('overlay').addEventListener('click', () => {
  document.getElementById('loginModal').classList.remove('open');
  document.getElementById('profileModal').classList.remove('open');
});

// =============================================
// ===== КОРЗИНА =====
// =============================================
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
  showToast(`✅ ${product.name} добавлен в корзину`, 'success');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function getCartTotal() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (discountPercent > 0) {
    return subtotal * (1 - discountPercent / 100);
  }
  return subtotal;
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
    cartTotal.textContent = '0';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__info">
        <span class="cart-item__name">
          <img src="${item.image}" alt="${item.name}" style="width:24px; height:24px; object-fit:cover; border-radius:4px; vertical-align:middle; margin-right:6px;">
          ${item.name} × ${item.quantity}
        </span>
        <span class="cart-item__price">${item.price} BYN</span>
      </div>
      <button class="cart-item__remove" data-id="${item.id}">✕</button>
    </div>
  `).join('');

  document.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      removeFromCart(id);
    });
  });

  const total = getCartTotal();
  cartTotal.textContent = Math.round(total);
}

function openCart() {
  cartPanel.classList.add('open');
  overlay.classList.add('show');
}

function closeCart() {
  cartPanel.classList.remove('open');
  overlay.classList.remove('show');
}

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// =============================================
// ===== ТОСТЫ =====
// =============================================
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
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
    promoMessage.style.color = '#c8b0e0';
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

applyPromoBtn.addEventListener('click', applyPromo);
promoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    applyPromo();
  }
});

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
    renderProducts(category, firstBtn.dataset.filter);
  } else {
    renderProducts(category, 'Все');
  }

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
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
  if (filter !== 'Все') {
    filtered = filtered.filter(p => p.brand === filter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="placeholder"><p>🛠 В этой категории пока нет товаров</p></div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" class="product-card__image">
      <div class="product-card__name">${p.name}</div>
      <div class="product-card__brand">${p.brand}</div>
      <div class="product-card__price">${p.price} BYN</div>
      <button class="product-card__btn" data-id="${p.id}">Добавить в корзину</button>
    </div>
  `).join('');

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.classList.contains('product-card__btn')) return;
      document.querySelectorAll('.product-card.expanded').forEach(other => {
        if (other !== this) other.classList.remove('expanded');
      });
      this.classList.toggle('expanded');
    });
  });

  document.querySelectorAll('.product-card__btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.dataset.id);
      addToCart(id);
    });
  });
}

// =============================================
// ===== ФОРМА ЗАКАЗА =====
// =============================================
const orderModal = document.getElementById('orderModal');
const orderModalClose = document.getElementById('orderModalClose');
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
  orderModal.classList.add('open');
  orderMessage.style.display = 'none';
  orderMessage.textContent = '';
});

orderModalClose.addEventListener('click', () => {
  orderModal.classList.remove('open');
});

overlay.addEventListener('click', () => {
  orderModal.classList.remove('open');
});

orderForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('orderName').value.trim();
  const telegram = document.getElementById('orderTelegram').value.trim();
  const address = document.getElementById('orderAddress').value.trim();
  const comment = document.getElementById('orderComment').value.trim();

  if (!name || !telegram) {
    orderMessage.style.display = 'block';
    orderMessage.textContent = '⚠️ Пожалуйста, заполните имя и Telegram.';
    orderMessage.style.color = '#ff7777';
    return;
  }

  if (!telegram.startsWith('@')) {
    orderMessage.style.display = 'block';
    orderMessage.textContent = '⚠️ Укажите Telegram username, начиная с @';
    orderMessage.style.color = '#ff7777';
    return;
  }

  const orderData = {
    name,
    telegram,
    address,
    comment,
    items: cart,
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    total: getCartTotal(),
    promo: appliedPromo,
    discount: discountPercent
  };

  let message = `🛒 Новый заказ!\n\n`;
  message += `👤 Имя: ${orderData.name}\n`;
  message += `📱 Telegram: ${orderData.telegram}\n`;
  if (orderData.address) message += `📍 Адрес: ${orderData.address}\n`;
  if (orderData.comment) message += `💬 Комментарий: ${orderData.comment}\n`;
  message += `\n📦 Товары:\n`;
  orderData.items.forEach(item => {
    message += `  • ${item.brand} | ${item.name} × ${item.quantity} = ${item.price * item.quantity} BYN\n`;
  });
  message += `\n💰 Сумма: ${orderData.subtotal} BYN`;
  if (orderData.discount > 0) {
    message += `\n🎉 Скидка: ${orderData.discount}%`;
    message += `\n💰 Итого: ${Math.round(orderData.total)} BYN`;
  } else {
    message += `\n💰 Итого: ${Math.round(orderData.total)} BYN`;
  }

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        order: orderData
      })
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
      updateCartUI();
      closeCart();
      orderModal.classList.remove('open');
      orderForm.reset();
      orderMessage.style.display = 'none';
      promoInput.value = '';
      promoInput.disabled = false;
      applyPromoBtn.disabled = false;
      promoMessage.textContent = '';
      showToast('✅ Заказ оформлен! Спасибо!', 'success');
      if (currentUser && currentUser.telegram) {
        loadUserProfile(currentUser.telegram);
      }
    }, 2000);

  } catch (error) {
    console.error('Ошибка отправки:', error);
    orderMessage.style.display = 'block';
    orderMessage.textContent = `⚠️ Ошибка: ${error.message || 'Неизвестная ошибка'}. Попробуйте позже.`;
    orderMessage.style.color = '#ff7777';
  }
});

// =============================================
// ===== КАТЕГОРИИ =====
// =============================================
const categoryBtns = document.querySelectorAll('.category-btn');
const categoryBtnsMobile = document.querySelectorAll('.category-btn-mobile');
const categoryContent = document.getElementById('categoryContent');

function switchCategory(category) {
  categoryBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });
  categoryBtnsMobile.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  if (category === 'liquids' || category === 'snus') {
    categoryContent.innerHTML = `
      <div class="category-content active">
        <div class="catalog__filters" id="filterContainer"></div>
        <div class="catalog__grid" id="productGrid"></div>
      </div>
    `;
    initFilters(category);
  } else if (category === 'coils' || category === 'disposables') {
    categoryContent.innerHTML = `
      <div class="category-content active">
        <div class="catalog__grid" id="productGrid"></div>
      </div>
    `;
    renderProducts(category, 'Все');
  } else {
    categoryContent.innerHTML = `
      <div class="category-content active">
        <div class="placeholder">
          <h3>Скоро появится!</h3>
          <p style="font-size: 14px; margin-top: 8px; color: #8888aa;">Следите за обновлениями</p>
        </div>
      </div>
    `;
  }
}

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    switchCategory(btn.dataset.category);
  });
});

categoryBtnsMobile.forEach(btn => {
  btn.addEventListener('click', () => {
    switchCategory(btn.dataset.category);
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// =============================================
// ===== БУРГЕР-МЕНЮ =====
// =============================================
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.header__inner')) {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
  }
});

// =============================================
// ===== FAQ =====
// =============================================
document.querySelectorAll('.faq__question').forEach(question => {
  question.addEventListener('click', function() {
    const parent = this.closest('.faq__item');
    if (!parent) return;
    parent.classList.toggle('open');
  });
});

// =============================================
// ===== ПОДСКАЗКА НА ЛОГОТИПЕ =====
// =============================================
document.addEventListener('DOMContentLoaded', function() {
  const logo = document.querySelector('.logo');
  if (!logo) return;

  const phrases = [
    'Заказывай жижу :3',
    'Какой сегодня вкус хочешь?',
    'Время выбрать свой вкус!',
    'Хочешь сладкого или мятного?',
    'Новый день — новый вкус!',
    'Что-то вкусненькое уже ждёт!',
    'Лови свой идеальный вкус!',
    'Сделай выбор — закажи сейчас!',
    'Клубника, мята, апельсин — всё здесь!',
    'Найди свой любимый вкус!'
  ];

  let tooltipTimeout = null;

  logo.addEventListener('click', function(e) {
    e.preventDefault();

    const oldTooltip = document.querySelector('.logo-tooltip');
    if (oldTooltip) oldTooltip.remove();
    if (tooltipTimeout) clearTimeout(tooltipTimeout);

    const randomIndex = Math.floor(Math.random() * phrases.length);
    const phrase = phrases[randomIndex];

    const tooltip = document.createElement('div');
    tooltip.className = 'logo-tooltip';
    tooltip.textContent = phrase;

    const rect = this.getBoundingClientRect();
    const top = rect.top - 10;
    const left = rect.left + rect.width / 2;

    tooltip.style.position = 'fixed';
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
    tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
    tooltip.style.zIndex = '1000';

    document.body.appendChild(tooltip);

    requestAnimationFrame(() => {
      tooltip.classList.add('show');
    });

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
loadProducts();
initProfile();
