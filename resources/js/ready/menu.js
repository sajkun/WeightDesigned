/**
 * обработчики событий для главного меню сайта
 */

class menuActions {
    /**
     * @param {HTMLElement} главное меню
     */
    #menu;

    /**
     * @param {HTMLElement} мобильный переключатель меню
     */
    #mobileSwitcher;

    /**
     * состояние мобильного меню
     * @param {Enum} : hidden|shown
     */
    #menuStateOnMobile;

    /**
     * @param {HTMLElement} все ссылки у которых есть субменю
     */
    #submenuSwitchers;

    /**
     * @param {String} menu уникальный HTML селектор
     * @param {String} mobileSwitcher ХТМЛ селектор для переключателя меню
     */
    constructor(menu, mobileSwitcher) {
        if (!menu || !mobileSwitcher) {
            return;
        }

        this.#menu = document.querySelector(menu);
        this.#mobileSwitcher = document.querySelector(mobileSwitcher);
        this.#submenuSwitchers = this.#getSubmenuSwitchers();
        this.#menuStateOnMobile = "hidden";
        this.#bindEvents();
    }

    /**
     * Добавляет слушатель событий для
     * - клика на переключатель мобильного меню
     * - клика на ссылку у которое есть под меню
     *
     * @returns {Void}
     */
    #bindEvents() {
        this.#initMobileMenuSwitcher();
        this.#bindSubmenuToggleByClick();
        this.#hideOnClickOutside();
        return;
    }

    /**
     * Добавляет слушатель событий для
     * - клика на ссылку у которое есть под меню
     *
     * отображение выпадающего списка меню
     * при клике на ссылку уровнем выше
     *
     * @returns {Void}
     */
    #bindSubmenuToggleByClick() {
        const t = this;

        t.#submenuSwitchers.forEach((el) => {
            const submenu = el.nextSibling;
            if (Boolean(submenu)) {
                el.addEventListener("click", (e) => {
                    e.preventDefault();
                    t.#hideAllSubmenues();
                    e.target.closest("li").classList.add("selected");
                });
            }
        });

        return;
    }

    /**
     * скрывает все отображенные меню
     *
     * @returns {Void}
     */
    #hideAllSubmenues() {
        this.#submenuSwitchers.forEach((el) => {
            el.closest("li").classList.remove("selected");
        });

        return;
    }

    /**
     * Сворачивание и скрытие меню и сабменю по клику вне
     *
     * @returns {Void}
     */
    #hideOnClickOutside() {
        const t = this;
        document.addEventListener("click", (e) => {
            if (!t.#menuClicked(e)) {
                t.#hideAllSubmenues();
                t.#setMenuState("hidden");
            }
        });

        return;
    }

    /**
     * Добавляет слушатель событий для
     * клика на переключатель мобильного меню
     *
     * @returns {Void}
     */
    #initMobileMenuSwitcher() {
        const t = this;
        t.#mobileSwitcher.addEventListener("click", () => {
            const state = t.#menuStateOnMobile === "shown" ? "hidden" : "shown";
            t.#setMenuState(state);
        });

        return;
    }

    /**
     * формирует селектор ХТМЛ элемента
     *
     * @param {HTMLElement} el
     *
     * @returns {String}
     */
    #getHtmlElementSelector(el) {
        // имя ХТМЛ тага меню
        const tagName = el.tagName;
        // все классы меню
        const classNames = el.getAttribute("class").split(" ");
        //ID меню
        const idName = el.getAttribute("id");

        // формирование селектора
        const idSelectorPart = idName ? `#${idName}` : "";
        const classesSelectorPart = classNames.length
            ? `.${classNames.join(".")}`
            : "";

        const selector =
            `${tagName}${idSelectorPart}${classesSelectorPart}`.toLowerCase();

        return selector;
    }

    /**
     * получает массив ссылок, у которых есть субменю
     *
     * @returns {Array<HTMLElement>} submenuSwitchers
     */
    #getSubmenuSwitchers() {
        const submenuSwitchers = Array.from(
            this.#menu.querySelectorAll("a")
        ).filter((el) => {
            return Boolean(el.nextSibling);
        });

        return submenuSwitchers;
    }

    /**
     * определяет кликнуто ли меню
     *
     * @param {PointerEvent} e
     *
     * @return {Boolean}
     */
    #menuClicked(e) {
        const selector = this.#getHtmlElementSelector(this.#menu);
        const menuClicked = e.target.closest(selector) === this.#menu;
        return menuClicked;
    }

    /**
     * Меняет статус мобильного меню
     *
     * @param {Enum} state shown | hidden
     *
     * @returns {Void}
     */
    #setMenuState(state) {
        const t = this;
        t.#menuStateOnMobile = state;
        if (state === "shown") {
            t.#menu.classList.add("shown");
            t.#mobileSwitcher.classList.add("active");
        } else {
            t.#menu.classList.remove("shown");
            t.#mobileSwitcher.classList.remove("active");
        }

        return;
    }
}

new menuActions(".main-menu", "#mobile-menu-toggle");
