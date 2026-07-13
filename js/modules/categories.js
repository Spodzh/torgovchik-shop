import { initFilters, renderProducts } from './filters.js';

// ===== КАТЕГОРИИ =====
const categoryBtns = document.querySelectorAll('.category-btn');
const categoryBtnsMobile = document.querySelectorAll('.category-btn-mobile');
const categoryContent = document.getElementById('categoryContent');

export function switchCategory(category) {
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

// Обработчики
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchCategory(btn.dataset.category);
    });
});

categoryBtnsMobile.forEach(btn => {
    btn.addEventListener('click', () => {
        switchCategory(btn.dataset.category);
        // Закрываем бургер (импорт burger из burger.js будет, но тут мы не можем импортировать, чтобы избежать цикличности.
        // Лучше вызвать через событие или использовать отдельный модуль, но здесь оставим просто закрытие через DOM.
        document.getElementById('burgerBtn').classList.remove('active');
        document.getElementById('mobileMenu').classList.remove('open');
    });
});
