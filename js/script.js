// ===== ГЛАВНЫЙ ФАЙЛ — ИМПОРТ И ИНИЦИАЛИЗАЦИЯ =====
import { switchCategory } from './modules/categories.js';
import './modules/burger.js';          // сразу вешает обработчики
import './modules/cart.js';            // вешает обработчики открытия/закрытия корзины
import './modules/promo.js';           // вешает обработчики промокодов
import './modules/order-form.js';      // вешает обработчики формы заказа

// Запускаем категорию "Жидкости"
switchCategory('liquids');
