/**
 * Отображение подсказок к полям ввода
 * в форме регистрации
 */

// перечень полей, если есть
const formFields = document.querySelectorAll(
    ".form-auth .form-control-custom input"
);

// сохранение в переменную события разворачивания элемента
const triggerExpand = (el) => {
    document.dispatchEvent(
        new CustomEvent("expandElement", {
            detail: { target: el },
        })
    );
};

// проверка на наличие елемента или соответсвующего класса
const checkTarget = (el) => {
    return el && el.classList.contains("form-control-comment");
};

// сохранение в переменную события свёртывания
const triggerCollapse = (el) => {
    document.dispatchEvent(
        new CustomEvent("collapseElement", {
            detail: { target: el },
        })
    );
};

const clearComments = () => {
    formFields?.forEach((input) => {
        const target = input.closest(".form-control-custom").nextElementSibling;
        if (!checkTarget(target)) {
            return;
        }
        target.style.height = 0;
        target.classList.remove("active");
    });
};

//добавление событий к каждому найденному элементу
formFields?.forEach((el) => {
    // обработка события фокусировки и ввода в поле
    ["input", "focus"].forEach((eventName) => {
        el.addEventListener(eventName, (event) => {
            const target = event.target.closest(
                ".form-control-custom"
            ).nextElementSibling;

            clearComments();

            if (!checkTarget(target)) return;
            triggerExpand(target);
        });
    });
});

// обаботчик события разворачивания элемента
document.addEventListener("expandElement", (event) => {
    const el = event.detail.target;
    const height = el.children[0].offsetHeight;
    el.style.height = `${height}px`;
    el.classList.add("active");
});
