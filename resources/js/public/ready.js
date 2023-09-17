const mobileMenuToggler = document.getElementById("mobile-menu-toggle");

mobileMenuToggler?.addEventListener("click", () => {
    document.getElementById("main-menu").classList.toggle("shown");
    mobileMenuToggler.classList.toggle("active");
});

const formFields = document.querySelectorAll(
    ".form-auth .form-control-custom input"
);

formFields?.forEach((el) => {
    el.addEventListener("focus", (event) => {
        event.target.closest(".form-control-custom").classList.add("active");
    });
    el.addEventListener("input", (event) => {
        event.target.closest(".form-control-custom").classList.add("active");
    });
    el.addEventListener("blur", (event) => {
        event.target.closest(".form-control-custom").classList.remove("active");
    });
});

function generatePassword() {
    console.log("generatePassword");
}
