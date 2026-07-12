// ===== ФИЛЬТРЫ (без "Все") =====
function initFilters() {
    const container = document.getElementById('filterContainer');
    if (!container) return;
    const excludeBrands = ['Подонки', 'Catswill extra'];
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
