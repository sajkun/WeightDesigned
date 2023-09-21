/**
 * Смена режима отображения мобильного меню
 */

// HTML элемент переключающий мобильное меню
const mobileMenuToggler = document.getElementById("mobile-menu-toggle");

// обработчик события мобильного меню
mobileMenuToggler?.addEventListener("click", () => {
    document.getElementById("main-menu").classList.toggle("shown");
    mobileMenuToggler.classList.toggle("active");
});
