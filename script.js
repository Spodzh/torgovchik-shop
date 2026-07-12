// ===== ТОВАРЫ =====
const products = [
    { id: 1, name: 'Клубничный лёд', brand: 'PodKing', price: 590, category: 'fruit', emoji: '🍓' },
    { id: 2, name: 'Манго-маракуйя', brand: 'VapeLab', price: 650, category: 'fruit', emoji: '🥭' },
    { id: 3, name: 'Карамельный чизкейк', brand: 'SweetCloud', price: 720, category: 'dessert', emoji: '🍰' },
    { id: 4, name: 'Мятный холодок', brand: 'Frosty', price: 540, category: 'menthol', emoji: '❄️' },
    { id: 5, name: 'Виноград-яблоко', brand: 'PodKing', price: 610, category: 'fruit', emoji: '🍇' },
    { id: 6, name: 'Ванильный крем', brand: 'SweetCloud', price: 690, category: 'dessert', emoji: '🍦' },
    { id: 7, name: 'Эвкалипт-мята', brand: 'Frosty', price: 560, category: 'menthol', emoji: '🌿' },
    { id: 8, name: 'Персик-нектарин', brand: 'VapeLab', price: 630, category: 'fruit', emoji: '🍑' },
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

// ===== ОТРИСОВКА ТОВАРОВ =====
function renderProducts(filter = 'all') {
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-card__image">${p.emoji}</div>
            <div class="product-card__name">${p.name}</div>
            <div class="product-card__brand">${p.brand}</div>
            <div class="product-card__price">${p.price} ₽</div>
            <button class="product-card__btn" data-id="${p.id}">В корзину</button>
        </div>
    `).join('');

    // Вешаем обработчики на кнопки "В корзину"
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
    // Счётчик в шапке
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Содержимое панели
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        cartTotal.textContent = '0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item__info">
                <span class="cart-item__name">${item.emoji} ${item.name} × ${item.quantity}</span>
                <span class="cart-item__price">${item.price} ₽</span>
            </div>
            <button class="cart-item__remove" data-id="${item.id}">✕</button>
        </div>
    `).join('');

    // Обработчики на кнопки удаления
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });

    // Итого
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

// ===== ФИЛЬТРЫ =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// ===== ОФОРМЛЕНИЕ ЗАКАЗА =====
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert(`✅ Заказ оформлен!\nСумма: ${total} ₽\nСпасибо за покупку!`);
    cart = [];
    updateCartUI();
    closeCart();
});

// ===== СТАРТ =====
renderProducts('all');