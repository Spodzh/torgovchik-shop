// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';

// =============================================
// ===== 1. ТОВАРЫ (ассортимент) =====
// =============================================
const products = [
    // Rick and Morty Bad acid (15)
    { id: 1, name: 'Ананасовый леденец', brand: 'Rick and Morty Bad acid', price: 15, emoji: '🍍' },
    { id: 2, name: 'Киви лайм', brand: 'Rick and Morty Bad acid', price: 15, emoji: '🥝' },
    { id: 3, name: 'Клюква лайм', brand: 'Rick and Morty Bad acid', price: 15, emoji: '🍒' },
    { id: 4, name: 'Вишня клюква', brand: 'Rick and Morty Bad acid', price: 15, emoji: '🍒' },
    // Catswill extra (15)
    { id: 5, name: 'Кислый швепс грейпфрут', brand: 'Catswill extra', price: 15, emoji: '🍊' },
    // Подонки Подгон (15)
    { id: 6, name: 'Апельсин мята', brand: 'Подонки Подгон', price: 15, emoji: '🍊' },
    { id: 7, name: 'Апельсин', brand: 'Подонки Подгон', price: 15, emoji: '🍊' },
    // Подонки (15)
    { id: 8, name: 'Кола сода айс (критикал)', brand: 'Подонки', price: 15, emoji: '🥤' },
    // Подонки Блуд (15)
    { id: 9, name: 'Черная смородина', brand: 'Подонки Блуд', price: 15, emoji: '🫐' },
    { id: 10, name: 'Классический бабл гам', brand: 'Подонки Блуд', price: 15, emoji: '🍬' },
    { id: 11, name: 'Яблоко виноград', brand: 'Подонки Блуд', price: 15, emoji: '🍏' },
    { id: 12, name: 'Персиковый лимонад', brand: 'Подонки Блуд', price: 15, emoji: '🍑' },
    { id: 13, name: 'Скитлс', brand: 'Подонки Блуд', price: 15, emoji: '🍬' },
    { id: 14, name: 'Сочная малина', brand: 'Подонки Блуд', price: 15, emoji: '🍓' },
    { id: 15, name: 'Виноград черника', brand: 'Подонки Блуд', price: 15, emoji: '🍇' },
    { id: 16, name: 'Конфеты смородина мята', brand: 'Подонки Блуд', price: 15, emoji: '🍬' },
    { id: 17, name: 'Брусничный морс', brand: 'Подонки Блуд', price: 15, emoji: '🍒' },
    { id: 18, name: 'Кислые вишневые червячки', brand: 'Подонки Блуд', price: 15, emoji: '🍒' },
    { id: 19, name: 'Банан клубника', brand: 'Подонки Блуд', price: 15, emoji: '🍌' },
    { id: 20, name: 'Клубника ежевика', brand: 'Подонки Блуд', price: 15, emoji: '🍓' },
    // Подонки инферно (17)
    { id: 21, name: 'Клубника грейпфрут малина', brand: 'Подонки инферно', price: 17, emoji: '🍓' },
    { id: 22, name: 'Клубничная шипучка', brand: 'Подонки инферно', price: 17, emoji: '🍓' },
    { id: 23, name: 'Клубника банан', brand: 'Подонки инферно', price: 17, emoji: '🍌' },
    // Anime love zombi (17)
    { id: 24, name: 'Алоэ виноград', brand: 'Anime love zombi', price: 17, emoji: '🍇' },
    { id: 25, name: 'Киви клубника', brand: 'Anime love zombi', price: 17, emoji: '🥝' },
    { id: 26, name: 'Персиковый шейк', brand: 'Anime love zombi', price: 17, emoji: '🍑' },
    { id: 27, name: 'Морозный рэдбул', brand: 'Anime love zombi', price: 17, emoji: '🐂' },
    { id: 28, name: 'Арбузный бабл гам', brand: 'Anime love zombi', price: 17, emoji: '🍉' },
    { id: 29, name: 'Клубничный леденец', brand: 'Anime love zombi', price: 17, emoji: '🍓' },
    { id: 30, name: 'Ананас киви', brand: 'Anime love zombi', price: 17, emoji: '🍍' },
    { id: 31, name: 'Малина с кислинкой', brand: 'Anime love zombi', price: 17, emoji: '🍓' },
    { id: 32, name: 'Фанта маракуйя', brand: 'Anime love zombi', price: 17, emoji: '🍊' },
    { id: 33, name: 'Лесной микс', brand: 'Anime love zombi', price: 17, emoji: '🌲' },
    { id: 34, name: 'Мандариновая фанта', brand: 'Anime love zombi', price: 17, emoji: '🍊' },
    { id: 35, name: 'Вишня лед', brand: 'Anime love zombi', price: 17, emoji: '🍒' },
    { id: 36, name: 'Ежевичный лимонад', brand: 'Anime love zombi', price: 17, emoji: '🍇' },
    { id: 37, name: 'Яблоко персик', brand: 'Anime love zombi', price: 17, emoji: '🍏' },
    { id: 38, name: 'Клубнично-вишневый лимонад', brand: 'Anime love zombi', price: 17, emoji: '🍓' },
    { id: 39, name: 'Клубника банан', brand: 'Anime love zombi', price: 17, emoji: '🍌' },
    { id: 40, name: 'Яблоко виноград', brand: 'Anime love zombi', price: 17, emoji: '🍏' },
    { id: 41, name: 'Энергетик виноград', brand: 'Anime love zombi', price: 17, emoji: '⚡' },
    // Long злой (17)
    { id: 42, name: 'Морс из лесных ягод', brand: 'Long злой', price: 17, emoji: '🫐' },
    { id: 43, name: 'Мандарин персик', brand: 'Long злой', price: 17, emoji: '🍊' },
    { id: 44, name: 'Клюква апельсин', brand: 'Long злой', price: 17, emoji: '🍒' },
    { id: 45, name: 'Виноград арбуз', brand: 'Long злой', price: 17, emoji: '🍇' },
    { id: 46, name: 'Клубника банан', brand: 'Long злой', price: 17, emoji: '🍌' },
    { id: 47, name: 'Фруктовый мармелад', brand: 'Long злой', price: 17, emoji: '🍬' },
    { id: 48, name: 'Виноградный чупа-чупс', brand: 'Long злой', price: 17, emoji: '🍬' },
    { id: 49, name: 'Мята спрайт', brand: 'Long злой', price: 17, emoji: '🌿' },
    { id: 50, name: 'Персик абрикос', brand: 'Long злой', price: 17, emoji: '🍑' },
    { id: 51, name: 'Малиновая газировка', brand: 'Long злой', price: 17, emoji: '🍓' },
    // Rick and Morty & catswill (18)
    { id: 52, name: 'Арбуз морозная черешня', brand: 'Rick and Morty & catswill', price: 18, emoji: '🍉' },
    { id: 53, name: 'Фрутелла лайм лимон малина', brand: 'Rick and Morty & catswill', price: 18, emoji: '🍋' },
    { id: 54, name: 'Малина яблоко лед', brand: 'Rick and Morty & catswill', price: 18, emoji: '🍓' },
    { id: 55, name: 'Кислые ленточки клубника ежевика', brand: 'Rick and Morty & catswill', price: 18, emoji: '🍓' },
    { id: 56, name: 'Голубика арбуз лед', brand: 'Rick and Morty & catswill', price: 18, emoji: '🫐' },
    { id: 57, name: 'Банан дыня мята', brand: 'Rick and Morty & catswill', price: 18, emoji: '🍌' },
];

// =============================================
// ===== 2. КОРЗИНА =====
// =============================================
let cart = [];

// DOM-элементы корзины
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
                <span class="cart-item__name">${item.emoji} ${item.name} × ${item.quantity}</span>
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

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total;
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
// ===== 4. ФИЛЬТРЫ =====
// =============================================
function initFilters() {
    const container = document.getElementById('filterContainer');
    if (!container) return;
    const excludeBrands = ['Подонки', 'Catswill extra'];
    const brands = [...new Set(products.map(p => p.brand))]
        .filter(brand => !excludeBrands.includes(brand));
    
    container.innerHTML = brands.map(b => `
        <button class="filter-btn" data-filter="${b}">${b}</button>
    `).join('');

    const firstBtn = container.querySelector('.filter-btn');
    if (firstBtn) {
        firstBtn.classList.add('active');
        renderProducts(firstBtn.dataset.filter);
    } else {
        renderProducts('Все');
    }

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter);
        });
    });
}

// =============================================
// ===== 5. ОТРИСОВКА ТОВАРОВ =====
// =============================================
function renderProducts(filter) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    const filtered = (filter === 'Все' || !filter) ? products : products.filter(p => p.brand === filter);
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-card__image">${p.emoji}</div>
            <div class="product-card__name">${p.name}</div>
            <div class="product-card__brand">${p.brand}</div>
            <div class="product-card__price">${p.price} BYN</div>
            <button class="product-card__btn" data-id="${p.id}">Добавить в корзину</button>
        </div>
    `).join('');

    // Клик по карточке — раскрытие
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('product-card__btn')) return;
            document.querySelectorAll('.product-card.expanded').forEach(other => {
                if (other !== this) other.classList.remove('expanded');
            });
            this.classList.toggle('expanded');
        });
    });

    // Кнопка "Добавить в корзину"
    document.querySelectorAll('.product-card__btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            addToCart(id);
        });
    });
}

// =============================================
// ===== 6. ФОРМА ЗАКАЗА (с отправкой через Worker) =====
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
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    // Формируем текст сообщения
    let message = `🛒 Новый заказ!\n\n`;
    message += `👤 Имя: ${orderData.name}\n`;
    message += `📱 Telegram: ${orderData.telegram}\n`;
    if (orderData.address) message += `📍 Адрес: ${orderData.address}\n`;
    if (orderData.comment) message += `💬 Комментарий: ${orderData.comment}\n`;
    message += `\n📦 Товары:\n`;
    orderData.items.forEach(item => {
        message += `  • ${item.emoji} ${item.name} × ${item.quantity} = ${item.price * item.quantity} BYN\n`;
    });
    message += `\n💰 Итого: ${orderData.total} BYN`;

    try {
        // ✅ ОТПРАВЛЯЕМ ЗАПРОС НА WORKER (без токена)
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.description || 'Ошибка отправки заказа');
        }

        // Успешно
        orderMessage.style.display = 'block';
        orderMessage.textContent = '✅ Заказ успешно отправлен! Мы свяжемся с вами в Telegram.';
        orderMessage.style.color = '#8aff8a';

        setTimeout(() => {
            cart = [];
            updateCartUI();
            closeCart();
            orderModal.classList.remove('open');
            orderForm.reset();
            orderMessage.style.display = 'none';
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
// ===== 7. КАТЕГОРИИ =====
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

    if (category === 'liquids') {
        categoryContent.innerHTML = `
            <div class="category-content active">
                <div class="catalog__filters" id="filterContainer"></div>
                <div class="catalog__grid" id="productGrid"></div>
            </div>
        `;
        initFilters();
    } else {
        const titles = {
            coils: 'Испарители / Картриджи',
            snus: 'Снюс',
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
// ===== 8. БУРГЕР-МЕНЮ =====
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
// ===== 9. ЗАПУСК =====
// =============================================
switchCategory('liquids');
