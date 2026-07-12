// ===== МОДАЛЬНОЕ ОКНО ФОРМЫ ЗАКАЗА =====
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

orderForm.addEventListener('submit', (e) => {
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

    console.log('✅ Заказ оформлен:', orderData);

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
});
