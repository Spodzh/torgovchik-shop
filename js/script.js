// =============================================
// ===== КОНФИГУРАЦИЯ =====
// =============================================
const WORKER_URL = 'https://torgovchik-bot.ernest-chanel.workers.dev/';

// =============================================
// ===== 1. ТОВАРЫ (ассортимент с картинками) =====
// =============================================
const products = [
    // -------- Rick and Morty Bad Acid (4 товара) --------
    {
        id: 1,
        name: 'Ананасовый леденец',
        brand: 'Rick and Morty Bad Acid',
        price: 15,
        image: 'https://i.ibb.co/Pv414S0f/image.png'
    },
    {
        id: 2,
        name: 'Киви Лайм',
        brand: 'Rick and Morty Bad Acid',
        price: 15,
        image: 'https://i.ibb.co/wr4btGb7/image.png'
    },
    {
        id: 3,
        name: 'Клюква Лайм',
        brand: 'Rick and Morty Bad Acid',
        price: 15,
        image: 'https://i.ibb.co/M5sYqrWy/image.png'
    },
    {
        id: 4,
        name: 'Вишня Клюква',
        brand: 'Rick and Morty Bad Acid',
        price: 15,
        image: 'https://i.ibb.co/vrtTs55/image.png'
    },

    // -------- Подонки Подгон (3 товара) --------
    {
        id: 5,
        name: 'Апельсин мята',
        brand: 'Подонки Подгон',
        price: 15,
        image: 'https://i.ibb.co/Kpnn3QMB/image.png'
    },
    {
        id: 6,
        name: 'Апельсин',
        brand: 'Подонки Подгон',
        price: 15,
        image: 'https://i.ibb.co/yFg8TvMd/image.png'
    },
    {
        id: 7,
        name: 'Малиновая конфета',
        brand: 'Подонки Подгон',
        price: 15,
        image: 'https://i.ibb.co/BkQGJzy/image.png'
    },

    // -------- Подонки инферно (3 товара) --------
    {
        id: 8,
        name: 'Клубника грейпфрут малина',
        brand: 'Подонки инферно',
        price: 17,
        image: 'https://i.ibb.co/nMdy9kWx/image.png'
    },
    {
        id: 9,
        name: 'Клубничная шипучка',
        brand: 'Подонки инферно',
        price: 17,
        image: 'https://i.ibb.co/b5d7KM0L/image.png'
    },
    {
        id: 10,
        name: 'Клубника банан',
        brand: 'Подонки инферно',
        price: 17,
        image: 'https://i.ibb.co/LXjMvDCC/image.png'
    },

    // -------- Podonki Blood (бывшие Подонки Блуд) — 12 товаров с одной картинкой --------
    {
        id: 11,
        name: 'Черная смородина',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 12,
        name: 'Классический бабл гам',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 13,
        name: 'Яблоко виноград',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 14,
        name: 'Персиковый лимонад',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 15,
        name: 'Скитлс',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 16,
        name: 'Сочная малина',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 17,
        name: 'Виноград черника',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 18,
        name: 'Конфеты смородина мята',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 19,
        name: 'Брусничный морс',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 20,
        name: 'Кислые вишневые червячки',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 21,
        name: 'Банан клубника',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },
    {
        id: 22,
        name: 'Клубника ежевика',
        brand: 'Podonki Blood',
        price: 15,
        image: 'https://i.ibb.co/gbcNGhK0/image.png'
    },

    // -------- Annima Love Zombi (бывшие Anime love zombi) — 18 товаров с одной картинкой --------
    {
        id: 23,
        name: 'Алоэ виноград',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 24,
        name: 'Киви клубника',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 25,
        name: 'Персиковый шейк',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 26,
        name: 'Морозный рэдбул',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 27,
        name: 'Арбузный бабл гам',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 28,
        name: 'Клубничный леденец',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 29,
        name: 'Ананас киви',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 30,
        name: 'Малина с кислинкой',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 31,
        name: 'Фанта маракуйя',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 32,
        name: 'Лесной микс',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 33,
        name: 'Мандариновая фанта',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 34,
        name: 'Вишня лед',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 35,
        name: 'Ежевичный лимонад',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 36,
        name: 'Яблоко персик',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 37,
        name: 'Клубнично-вишневый лимонад',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 38,
        name: 'Клубника банан',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 39,
        name: 'Яблоко виноград',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },
    {
        id: 40,
        name: 'Энергетик виноград',
        brand: 'Annima Love Zombi',
        price: 17,
        image: 'https://i.ibb.co/wFfDBkK7/image.png'
    },

    // -------- Zloy Hard (бывшие Long злой) — 10 товаров с одной картинкой --------
    {
        id: 41,
        name: 'Морс из лесных ягод',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 42,
        name: 'Мандарин персик',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 43,
        name: 'Клюква апельсин',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 44,
        name: 'Виноград арбуз',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 45,
        name: 'Клубника банан',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 46,
        name: 'Фруктовый мармелад',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 47,
        name: 'Виноградный чупа-чупс',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 48,
        name: 'Мята спрайт',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 49,
        name: 'Персик абрикос',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },
    {
        id: 50,
        name: 'Малиновая газировка',
        brand: 'Zloy Hard',
        price: 17,
        image: 'https://i.ibb.co/zHHYpfYR/image.png'
    },

    // -------- Rick and Morty & catswill (6 товаров) --------
    {
        id: 51,
        name: 'Арбуз морозная черешня',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/0R4TwBF3/image.png'
    },
    {
        id: 52,
        name: 'Малина яблоко лед',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/mjssmH8/image.png'
    },
    {
        id: 53,
        name: 'Банан дыня мята',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/Z64thsqD/image.png'
    },
    {
        id: 54,
        name: 'Кислые ленточки клубника ежевика',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/My9syDsC/image.png'
    },
    {
        id: 55,
        name: 'Фрутелла лайм лимон малина',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/fVNgQ30K/image.png'
    },
    {
        id: 56,
        name: 'Голубика арбуз лед',
        brand: 'Rick and Morty & catswill',
        price: 18,
        image: 'https://i.ibb.co/KjqwSZkD/image.png'
    }
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
    // Исключаем бренды, которые были удалены (Catswill extra и Подонки) — они уже не в массиве, поэтому не нужны
    const excludeBrands = []; // теперь не нужно ничего исключать, т.к. этих брендов нет
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
// ===== 5. ОТРИСОВКА ТОВАРОВ (с картинками) =====
// =============================================
function renderProducts(filter) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    const filtered = (filter === 'Все' || !filter) ? products : products.filter(p => p.brand === filter);
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card" data-id="${p.id}">
            <img src="${p.image}" alt="${p.name}" class="product-card__image">
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
        message += `  • ${item.name} × ${item.quantity} = ${item.price * item.quantity} BYN\n`;
    });
    message += `\n💰 Итого: ${orderData.total} BYN`;

    try {
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
