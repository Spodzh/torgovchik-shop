import { products } from './products.js';
import { addToCart } from './cart.js';

// ===== ФИЛЬТРЫ И ОТРИСОВКА =====
export function initFilters() {
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

export function renderProducts(category, filter = 'Все') {
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
    `).join();

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
