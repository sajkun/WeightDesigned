const mobileMenuToggler = document.getElementById("mobile-menu-toggle");

mobileMenuToggler?.addEventListener("click", () => {
    document.getElementById("main-menu").classList.toggle("shown");
    mobileMenuToggler.classList.toggle("active");
});
