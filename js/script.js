// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';

// =============================================
// ===== ТОВАРЫ (загружаются с сервера) =====
// =============================================
let products = [];

async function loadProducts() {
    try {
        const response = await fetch(WORKER_URL + 'products');
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        products = await response.json();
        // После загрузки перерисовываем текущую категорию
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

// =============================================
// ===== 2. КОРЗИНА =====
// =============================================
let cart = [];
let appliedPromo = null;
let discountPercent = 0;

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
// ===== 3. ТОСТЫ =====
// =============================================
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✅' : '❌';
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
// ===== 4. ПРОМОКОДЫ =====
// =============================================
const promoInput = document.getElementById('promoCode');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoMessage = document.getElementById('promoMessage');

const validPromos = {
    'spodzh': 13
};

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

    if (validPromos[code] !== undefined) {
        discountPercent = validPromos[code];
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
// ===== 5. УНИВЕРСАЛЬНЫЙ ФИЛЬТР =====
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
// ===== 6. ОТРИСОВКА ТОВАРОВ =====
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
// ===== 7. ФОРМА ЗАКАЗА =====
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
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.description || 'Ошибка отправки заказа');
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
        }, 2000);

    } catch (error) {
        console.error('Ошибка отправки:', error);
        orderMessage.style.display = 'block';
        orderMessage.textContent = `⚠️ Ошибка: ${error.message}. Попробуйте позже.`;
        orderMessage.style.color = '#ff7777';
    }
});

// =============================================
// ===== 8. КАТЕГОРИИ =====
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
    } else if (category === 'coils') {
        categoryContent.innerHTML = `
            <div class="category-content active">
                <div class="catalog__grid" id="productGrid"></div>
            </div>
        `;
        renderProducts('coils', 'Все');
    } else {
        const titles = {
            disposables: 'Одноразки / Pod-системы'
        };
        categoryContent.innerHTML = `
            <div class="category-content active">
                <div class="placeholder">
                    <h3>${titles[category]}</h3>
                    <p>🛠 Скоро появится!</p>
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
// ===== 9. БУРГЕР-МЕНЮ =====
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
// ===== 10. FAQ АККОРДЕОН =====
// =============================================
document.querySelectorAll('.faq__question').forEach(question => {
    question.addEventListener('click', function() {
        const parent = this.closest('.faq__item');
        if (!parent) return;
        parent.classList.toggle('open');
    });
});

// =============================================
// ===== 11. ВСПЛЫВАЮЩАЯ ПОДСКАЗКА ПРИ КЛИКЕ НА ЛОГОТИП =====
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
// ===== 12. ЗАПУСК =====
// =============================================
loadProducts();
