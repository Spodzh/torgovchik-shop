// ===== КОРЗИНА =====
let cart = [];

// DOM-элементы корзины (глобальные)
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');

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
    showToast(`✅ ${product.name} добавлен в корзину`, 'success');
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
