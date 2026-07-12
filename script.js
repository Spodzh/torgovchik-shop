// ===== ТОВАРЫ (ассортимент) =====
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

// ===== КОРЗИНА =====
let cart = [];

// ===== DOM-ЭЛЕМЕНТЫ =====
const grid = document.getElementById('productGrid');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');

// ===== ФИЛЬТРЫ (без "Все") =====
function initFilters() {
    const container = document.getElementById('filterContainer');
    // Исключаем бренды, которые не нужны в фильтрах
    const excludeBrands = ['Подонки', 'Catswill extra'];
    
    // Получаем уникальные бренды, исключая ненужные
    const brands = [...new Set(products.map(p => p.brand))]
        .filter(brand => !excludeBrands.includes(brand));
    
    // Создаём кнопки для каждого бренда (без "Все")
    container.innerHTML = brands.map(b => `
        <button class="filter-btn" data-filter="${b}">${b}</button>
    `).join('');

    // По умолчанию активна первая кнопка (первый бренд), либо можно ничего не активировать
    const firstBtn = container.querySelector('.filter-btn');
    if (firstBtn) {
        firstBtn.classList.add('active');
        // Показываем товары первого бренда при загрузке
        renderProducts(firstBtn.dataset.filter);
    } else {
        // Если брендов нет (маловероятно), показываем все
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

// ===== ОТРИСОВКА ТОВАРОВ =====
function renderProducts(filter) {
    // Если filter === 'Все' или filter не задан, показываем все товары
    const filtered = (filter === 'Все' || !filter) ? products : products.filter(p => p.brand === filter);
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-card__image">${p.emoji}</div>
            <div class="product-card__name">${p.name}</div>
            <div class="product-card__brand">${p.brand}</div>
            <div class="product-card__price">${p.price} BYN</div>
            <button class="product-card__btn" data-id="${p.id}">В корзину</button>
        </div>
    `).join('');

    document.querySelectorAll('.product-card__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            addToCart(id);
        });
    });
}

// ===== ДОБАВЛЕНИЕ В КОРЗИНУ =====
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
}

// ===== УДАЛЕНИЕ ИЗ КОРЗИНЫ =====
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// ===== ОБНОВЛЕНИЕ UI КОРЗИНЫ =====
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

// ===== ОТКРЫТЬ/ЗАКРЫТЬ КОРЗИНУ =====
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

// ===== ОФОРМЛЕНИЕ ЗАКАЗА =====
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`✅ Заказ оформлен!\nСумма: ${total} BYN\nСпасибо за покупку!`);
    cart = [];
    updateCartUI();
    closeCart();
});

// ===== СТАРТ =====
initFilters();

// =============================================
// ===== БУРГЕР-МЕНЮ =====
// =============================================
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header__inner')) {
            burger.classList.remove('active');
            mobileMenu.classList.remove('open');
        }
    });
}
