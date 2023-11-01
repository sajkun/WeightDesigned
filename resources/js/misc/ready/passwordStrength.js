/**
 * Проверка надежности пароля
 */

const detectPasswordStrength = (password) => {
    const s_letters = "qwertyuiopasdfghjklzxcvbnm"; // Буквы в нижнем регистре
    const b_letters = "QWERTYUIOPLKJHGFDSAZXCVBNM"; // Буквы в верхнем регистре
    const digits = "0123456789"; // Цифры
    const specials = "!@#$%^&*()_-+=|/.,:;[]{}"; // Спецсимволы
    let is_s = false; // Есть ли в пароле буквы в нижнем регистре
    let is_b = false; // Есть ли в пароле буквы в верхнем регистре
    let is_d = false; // Есть ли в пароле цифры
    let is_sp = false; // Есть ли в пароле спецсимволы
    for (let i = 0; i < password.length; i++) {
        /* Проверяем каждый символ пароля на принадлежность к тому или иному типу */
        if (!is_s && s_letters.indexOf(password[i]) != -1) is_s = true;
        else if (!is_b && b_letters.indexOf(password[i]) != -1) is_b = true;
        else if (!is_d && digits.indexOf(password[i]) != -1) is_d = true;
        else if (!is_sp && specials.indexOf(password[i]) != -1) is_sp = true;
    }
    let rating = 0;
    let text = "";
    if (is_s) rating++; // Если в пароле есть символы в нижнем регистре, то увеличиваем рейтинг сложности
    if (is_b) rating++; // Если в пароле есть символы в верхнем регистре, то увеличиваем рейтинг сложности
    if (is_d) rating++; // Если в пароле есть цифры, то увеличиваем рейтинг сложности
    if (is_sp) rating++; // Если в пароле есть спецсимволы, то увеличиваем рейтинг сложности
    /* Далее идёт анализ длины пароля и полученного рейтинга, и на основании этого готовится текстовое описание сложности пароля */
    if (password.length < 6 && rating < 3) text = "Простой";
    else if (password.length < 6 && rating >= 3) text = "Средний";
    else if (password.length >= 8 && rating < 3) text = "Средний";
    else if (password.length >= 8 && rating >= 3) text = "Сложный";
    else if (password.length >= 6 && rating == 1) text = "Простой";
    else if (password.length >= 6 && rating > 1 && rating < 4) text = "Средний";
    else if (password.length >= 6 && rating == 4) text = "Сложный";
    return text; // Форму не отправляем
};

// поле ввода пароля
const passwordField = document.getElementById("password");

// инициализация события на ввод пароля
passwordField?.addEventListener("input", (e) => {
    const password = e.target.value;
    const strength = detectPasswordStrength(password);

    let className;
    switch (strength) {
        case "Простой":
            className = "weak";
            break;
        case "Средний":
            className = "neutral";
            break;
        case "Сложный":
            className = "strong";
            break;
    }
    const strengthHTML = document.getElementById("passwordStrength");

    if (!strengthHTML) return;
    const wrapper = strengthHTML.closest(".password-strength");

    ["weak", "neutral", "strong"].forEach((name) => {
        wrapper.classList.remove(name);
    });

    strengthHTML.innerText = strength.toLowerCase();

    if (password.length > 0) {
        wrapper.classList.add(className);
    }
});

// кнопка сменя режима пароля
const passwordModeSwitcher = document.getElementById("show-password");

// отображения значения в поле пароля
passwordModeSwitcher?.addEventListener("click", () => {
    passwordModeSwitcher.classList.toggle("toggled");
    const passwordInputs = document.querySelectorAll("[data-mode]");
    passwordInputs.forEach((el) => {
        const type = el.dataset.mode;
        const newType = type === "password" ? "text" : "password";

        el.setAttribute("type", newType);
        el.setAttribute("data-mode", newType);
    });
});
