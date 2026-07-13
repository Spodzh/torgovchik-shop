// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';

// =============================================
// ===== 1. ТОВАРЫ (с категориями) =====
// =============================================
const products = [
    // -------- ЖИДКОСТИ (category: 'liquids') --------
    // Rick and Morty Bad Acid (4)
    {
        id: 1,
        name: 'Ананасовый леденец',
        brand: 'Rick and Morty Bad Acid',
        price: 15,
        image: 'https://i.ibb.co/Pv414S0f/image.png',
        category: 'liquids'
    },
    {
        id: 2,
        name: 'Киви Лайм',
        brand: 'Rick and Morty Bad Acid',
        price: 15,
        image: 'https://i.ibb.co/wr4btGb7/image.png',
        category: 'liquids'
    },
    {
        id: 3,
        name: 'Клюква Лайм',
        brand: 'Rick and Morty Bad Acid',
        price: 15,
        image: 'https://i.ibb.co/M5sYqrWy/image.png',
        category: 'liquids'
    },
    {
        id: 4,
        name: 'Вишня Клюква',
        brand: 'Rick and Morty Bad Acid',
        price: 15,
        image: 'https://i.ibb.co/vrtTs55/image.png',
        category: 'liquids'
    },

    // Подонки Подгон (3)
    {
        id: 5,
        name: 'Апельсин мята',
        brand: 'Подонки Подгон',
        price: 15,
        image: 'https://i.ibb.co/Kpnn3QMB/image.png',
        category: 'liquids'
    },
    {
        id: 6,
        name: 'Апельсин',
        brand: 'Подонки Подгон',
        price: 15,
        image: 'https://i.ibb.co/yFg8TvMd/image.png',
        category: 'liquids'
    },
    {
        id: 7,
        name: 'Малиновая конфета',
        brand: 'Подонки Подгон',
        price: 15,
        image: 'https://i.ibb.co/BkQGJzy/image.png',
        category: 'liquids'
    },

    // Подонки инферно (3)
    {
        id: 8,
        name: 'Клубника грейпфрут малина',
        brand: 'Подонки инферно',
        price: 17,
        image: 'https://i.ibb.co/nMdy9kWx/image.png',
        category: 'liquids'
    },
    {
        id: 9,
        name: 'Клубничная шипучка',
        brand: 'Подонки инферно',
        price: 17,
        image: 'https://i.ibb.co/b5d7KM0L/image.png',
        category: 'liquids'
    },
    {
        id: 10,
        name: 'Клубника банан',
        brand: 'Подонки инферно',
        price: 17,
        image: 'https://i.ibb.co/LXjMvDCC/image.png',
        category: 'liquids'
    },

    // Podonki Blood (12)
    {
        id: 11,
        name: 'Черная смородина',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 12,
        name: 'Классический бабл гам',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 13,
        name: 'Яблоко виноград',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 14,
        name: 'Персиковый лимонад',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 15,
        name: 'Скитлс',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 16,
        name: 'Сочная малина',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 17,
        name: 'Виноград черника',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 18,
        name: 'Конфеты смородина мята',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 19,
        name: 'Брусничный морс',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 20,
        name: 'Кислые вишневые червячки',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 21,
        name: 'Банан клубника',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },
    {
        id: 22,
        name: 'Клубника ежевика',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png',
        category: 'liquids'
    },

    // Annima Love Zombi (18)
    {
        id: 23,
        name: 'Алоэ виноград',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 24,
        name: 'Киви клубника',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 25,
        name: 'Персиковый шейк',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 26,
        name: 'Морозный рэдбул',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 27,
        name: 'Арбузный бабл гам',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 28,
        name: 'Клубничный леденец',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 29,
        name: 'Ананас киви',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 30,
        name: 'Малина с кислинкой',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 31,
        name: 'Фанта маракуйя',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 32,
        name: 'Лесной микс',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 33,
        name: 'Мандариновая фанта',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 34,
        name: 'Вишня лед',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 35,
        name: 'Ежевичный лимонад',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 36,
        name: 'Яблоко персик',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 37,
        name: 'Клубнично-вишневый лимонад',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 38,
        name: 'Клубника банан',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 39,
        name: 'Яблоко виноград',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },
    {
        id: 40,
        name: 'Энергетик виноград',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png',
        category: 'liquids'
    },

    // Zloy Hard (10)
    {
        id: 41,
        name: 'Морс из лесных ягод',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 42,
        name: 'Мандарин персик',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 43,
        name: 'Клюква апельсин',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 44,
        name: 'Виноград арбуз',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 45,
        name: 'Клубника банан',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 46,
        name: 'Фруктовый мармелад',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 47,
        name: 'Виноградный чупа-чупс',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 48,
        name: 'Мята спрайт',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 49,
        name: 'Персик абрикос',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },
    {
        id: 50,
        name: 'Малиновая газировка',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png',
        category: 'liquids'
    },

    // Rick and Morty & catswill (6)
    {
        id: 51,
        name: 'Арбуз морозная черешня',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/0R4TwBF3/image.png',
        category: 'liquids'
    },
    {
        id: 52,
        name: 'Малина яблоко лед',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/mjssmH8/image.png',
        category: 'liquids'
    },
    {
        id: 53,
        name: 'Банан дыня мята',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/Z64thsqD/image.png',
        category: 'liquids'
    },
    {
        id: 54,
        name: 'Кислые ленточки клубника ежевика',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/My9syDsC/image.png',
        category: 'liquids'
    },
    {
        id: 55,
        name: 'Фрутелла лайм лимон малина',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/fVNgQ30K/image.png',
        category: 'liquids'
    },
    {
        id: 56,
        name: 'Голубика арбуз лед',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/KjqwSZkD/image.png',
        category: 'liquids'
    },

    // -------- ИСПАРИТЕЛИ / КАРТРИДЖИ (category: 'coils') --------
    {
        id: 57,
        name: 'Испар Хиро 50-58 W, 0.2 Ом',
        brand: 'Hiro',
        price: 12,
        image: 'https://i.ibb.co/XMCFVwD/image.png',
        category: 'coils'
    },
    {
        id: 58,
        name: 'Испар 0.3 Ом, 50-65 W',
        brand: 'Испаритель',
        price: 12,
        image: 'https://i.ibb.co/21YMfYVD/image.png',
        category: 'coils'
    },
    {
        id: 59,
        name: 'VooPoo 0.7 Ом',
        brand: 'VooPoo',
        price: 12,
        image: 'https://i.ibb.co/DPrMb7P5/image.png',
        category: 'coils'
    },
    {
        id: 60,
        name: 'Картридж 0.4 Ом',
        brand: 'Картридж',
        price: 12,
        image: 'https://i.ibb.co/6R04Z3st/image.png',
        category: 'coils'
    },
    {
        id: 61,
        name: 'Картридж 0.6 Ом',
        brand: 'Картридж',
        price: 12,
        image: 'https://i.ibb.co/MD9X53XD/image.png',
        category: 'coils'
    }
];

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

// Здесь можно добавить свои промокоды и размер скидки
const validPromos = {
       'spodzh': 100
    // Пример: 'WELCOME10': 10,
    // 'SUMMER20': 20,
    // 'BLACKFRIDAY': 25
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

    // Проверяем валидность промокода
    if (validPromos[code] !== undefined) {
        // Применяем скидку
        discountPercent = validPromos[code];
        appliedPromo = code;
        promoMessage.textContent = `✅ Промокод "${code}" применён! Скидка ${discountPercent}%`;
        promoMessage.style.color = '#8aff8a';
        promoInput.disabled = true;
        applyPromoBtn.disabled = true;
        updateCartUI();
        showToast(`✅ Промокод "${code}" применён!`, 'success');
    } else {
        // Пока для теста любой промокод даёт 10% скидку
        // Позже ты сможешь заменить эту логику на проверку из validPromos
        discountPercent = 10;
        appliedPromo = code;
        promoMessage.textContent = `✅ Промокод "${code}" применён! Скидка 10%`;
        promoMessage.style.color = '#8aff8a';
        promoInput.disabled = true;
        applyPromoBtn.disabled = true;
        updateCartUI();
        showToast(`✅ Промокод "${code}" применён!`, 'success');
    }
}

applyPromoBtn.addEventListener('click', applyPromo);
promoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyPromo();
    }
});

// =============================================
// ===== 5. ФИЛЬТРЫ (только для жидкостей) =====
// =============================================
function initFilters() {
    const container = document.getElementById('filterContainer');
    if (!container) return;
    const liquidProducts = products.filter(p => p.category === 'liquids');
    const brands = [...new Set(liquidProducts.map(p => p.brand))];
    
    container.innerHTML = brands.map(b => `
        <button class="filter-btn" data-filter="${b}">${b}</button>
    `).join('');

    const firstBtn = container.querySelector('.filter-btn');
    if (firstBtn) {
        firstBtn.classList.add('active');
        renderProducts('liquids', firstBtn.dataset.filter);
    } else {
        renderProducts('liquids', 'Все');
    }

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts('liquids', btn.dataset.filter);
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
    if (category === 'liquids' && filter !== 'Все') {
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
    // Сбрасываем промокод при открытии формы (опционально)
    // Если хочешь сохранять промокод между открытиями — удали эти строки
    // resetPromo();
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
            // Сбрасываем поле промокода
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

    if (category === 'liquids') {
        categoryContent.innerHTML = `
            <div class="category-content active">
                <div class="catalog__filters" id="filterContainer"></div>
                <div class="catalog__grid" id="productGrid"></div>
            </div>
        `;
        initFilters();
    } else if (category === 'coils') {
        categoryContent.innerHTML = `
            <div class="category-content active">
                <div class="catalog__grid" id="productGrid"></div>
            </div>
        `;
        renderProducts('coils', 'Все');
    } else {
        const titles = {
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
// ===== 10. ЗАПУСК =====
// =============================================
switchCategory('liquids');
