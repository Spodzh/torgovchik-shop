import { setPromoData, updateCartUI, getCartTotal } from './cart.js';
import { showToast } from './toast.js';

// ===== ПРОМОКОДЫ =====
const promoInput = document.getElementById('promoCode');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const promoMessage = document.getElementById('promoMessage');

// Список валидных промокодов (ключ: промокод, значение: процент скидки)
export const validPromos = {
    // Пример: 'WELCOME10': 10,
    // 'SUMMER20': 20,
    // 'BLACKFRIDAY': 25
};

export let appliedPromo = null;
export let discountPercent = 0;

export function applyPromo() {
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
        discountPercent = validPromos[code];
        appliedPromo = code;
        promoMessage.textContent = `✅ Промокод "${code}" применён! Скидка ${discountPercent}%`;
        promoMessage.style.color = '#8aff8a';
        promoInput.disabled = true;
        applyPromoBtn.disabled = true;
        setPromoData(appliedPromo, discountPercent);
        updateCartUI();
        showToast(`✅ Промокод "${code}" применён!`, 'success');
    } else {
        // Для теста любой промокод даёт 10% скидку (можно заменить на проверку по validPromos)
        discountPercent = 10;
        appliedPromo = code;
        promoMessage.textContent = `✅ Промокод "${code}" применён! Скидка 10%`;
        promoMessage.style.color = '#8aff8a';
        promoInput.disabled = true;
        applyPromoBtn.disabled = true;
        setPromoData(appliedPromo, discountPercent);
        updateCartUI();
        showToast(`✅ Промокод "${code}" применён!`, 'success');
    }
}

// Обработчики
applyPromoBtn.addEventListener('click', applyPromo);
promoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyPromo();
    }
});
