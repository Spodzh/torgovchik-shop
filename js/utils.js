// =============================================
// ===== ЧИСТЫЕ УТИЛИТЫ (тестируемые) =====
// =============================================
(function (window) {
  'use strict';

  function validateTelegramUsername(raw) {
    if (typeof raw !== 'string') return 'Введите Telegram username';
    const clean = raw.trim().startsWith('@') ? raw.trim().slice(1) : raw.trim();
    if (clean.length === 0) return 'Введите Telegram username';
    if (clean.length < 5) return 'Username должен быть минимум 5 символов';
    if (clean.length > 32) return 'Username должен быть максимум 32 символа';
    if (!/^[a-zA-Z]/.test(clean)) return 'Username должен начинаться с буквы';
    if (!/^[a-zA-Z0-9_]+$/.test(clean)) return 'Только латиница, цифры и _';
    if (clean.endsWith('_')) return 'Username не может заканчиваться на _';
    if (clean.includes('__')) return 'Нельзя использовать __ подряд';
    return null;
  }

  function normalizeTelegramUsername(raw) {
    if (typeof raw !== 'string') return '';
    const trimmed = raw.trim();
    return trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  }

  function generateUUID() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function isValidUUID(uuid) {
    if (typeof uuid !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
  }

  function roundPrice(value) {
    const n = Number(value);
    if (!isFinite(n)) return 0;
    return Number(Math.round(Number(n + 'e2')) + 'e-2');
  }

  function calculateCartTotal(items, discountPercent) {
    if (!Array.isArray(items)) return 0;
    const subtotal = items.reduce(function (sum, item) {
      const price = Number(item && item.price) || 0;
      const qty = parseInt(item && item.quantity, 10) || 0;
      return sum + price * qty;
    }, 0);
    const discount = Number(discountPercent) || 0;
    if (discount > 0) {
      return roundPrice(subtotal * (1 - discount / 100));
    }
    return roundPrice(subtotal);
  }

  function countCartItems(items) {
    if (!Array.isArray(items)) return 0;
    return items.reduce(function (sum, item) {
      return sum + (parseInt(item && item.quantity, 10) || 0);
    }, 0);
  }

  function isFavorite(favorites, productId) {
    if (!Array.isArray(favorites)) return false;
    return favorites.indexOf(productId) !== -1;
  }

  function toggleFavoriteInList(favorites, productId) {
    const arr = Array.isArray(favorites) ? favorites.slice() : [];
    const idx = arr.indexOf(productId);
    if (idx >= 0) {
      arr.splice(idx, 1);
      return { list: arr, added: false };
    }
    arr.push(productId);
    return { list: arr, added: true };
  }

  window.Utils = {
    validateTelegramUsername: validateTelegramUsername,
    normalizeTelegramUsername: normalizeTelegramUsername,
    generateUUID: generateUUID,
    isValidUUID: isValidUUID,
    roundPrice: roundPrice,
    calculateCartTotal: calculateCartTotal,
    countCartItems: countCartItems,
    isFavorite: isFavorite,
    toggleFavoriteInList: toggleFavoriteInList
  };
})(window);