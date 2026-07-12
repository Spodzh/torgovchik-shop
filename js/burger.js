// ===== БУРГЕР-МЕНЮ =====
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__inner')) {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
    }
});
