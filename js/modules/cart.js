import { products } from './products.js';
import { showToast } from './toast.js';

// ===== КОРЗИНА =====
export let cart = [];
export let appliedPromo = null;
export let discountPercent = 0;

export function setPromoData(promo, discount) {
    appliedPromo = promo;
    discountPercent = discount;
}

export function getCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (discountPercent > 0) {
        return subtotal * (1 - discountPercent / 100);
    }
    return subtotal;
}

export function addToCart(productId) {
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

export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

export function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

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

export function openCart() {
    const cartPanel = document.getElementById('cartPanel');
    const overlay = document.getElementById('overlay');
    cartPanel.classList.add('open');
    overlay.classList.add('show');
}

export function closeCart() {
    const cartPanel = document.getElementById('cartPanel');
    const overlay = document.getElementById('overlay');
    cartPanel.classList.remove('open');
    overlay.classList.remove('show');
}

// Инициализация обработчиков открытия/закрытия корзины
document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);
