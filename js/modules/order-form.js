import { cart, appliedPromo, discountPercent, getCartTotal, updateCartUI, closeCart } from './cart.js';
import { showToast } from './toast.js';
import { WORKER_URL } from './config.js';

// ===== ФОРМА ЗАКАЗА =====
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

document.getElementById('overlay').addEventListener('click', () => {
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
            // Очищаем корзину и сбрасываем промокод
            cart = [];
            appliedPromo = null;
            discountPercent = 0;
            updateCartUI();
            closeCart();
            orderModal.classList.remove('open');
            orderForm.reset();
            orderMessage.style.display = 'none';
            // Сбрасываем поле промокода
            document.getElementById('promoCode').value = '';
            document.getElementById('promoCode').disabled = false;
            document.getElementById('applyPromoBtn').disabled = false;
            document.getElementById('promoMessage').textContent = '';
            showToast('✅ Заказ оформлен! Спасибо!', 'success');
        }, 2000);

    } catch (error) {
        console.error('Ошибка отправки:', error);
        orderMessage.style.display = 'block';
        orderMessage.textContent = `⚠️ Ошибка: ${error.message}. Попробуйте позже.`;
        orderMessage.style.color = '#ff7777';
    }
});
