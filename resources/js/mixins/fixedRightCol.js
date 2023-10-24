/**
 *
 */

//хэлперы
import { strip, clog, getStyle } from "@/misc/helpers";
let test;
export default {
    data() {
        return {
            /**
             *  Объекь наблюдатель за изменением ширины
             *
             * @param {Object: ResizeObserver}
             */
            observer: this.initObserver(),

            // {String} названия ref для фиксируемового объекта
            targetRef: null,

            // данные изменение расположения фиксируемового объекта
            fixData: {
                top: null,
                left: null,
                width: null,
                maxWidth: null,
                height: null,
                maxHeight: null,
            },
        };
    },

    watch: {
        // данные для
        fixData: {
            handler: function (fixData) {
                const vm = this;
                const el = vm?.$refs[vm?.targetRef];

                if (!el) {
                    return;
                }
                vm.updateElementFix(el, fixData);
            },
            deep: true,
        },
    },

    methods: {
        /**
         * Инициализация объекта наблюдения за размерами элемента
         *
         * @returns {Object: ResizeObserver}
         */
        initObserver() {
            const vm = this;
            const observer = new ResizeObserver(vm.calculatePositionData);
            return observer;
        },

        /**
         * вычисляет размеры и положение фикируемового блока
         *
         * @returns {Void}
         */
        calculatePositionData() {
            const vm = this;

            // Хэддер сайта
            const header = document.querySelector(".public-header");

            // целевой фиксируемый элемент
            const el = vm.$refs[vm.targetRef];

            // переменная показывающая какая часть хэддера еще в зоне видимости страницы
            let deltaY = header.offsetHeight - window.scrollY;
            deltaY = Math.max(0, deltaY);

            // Внутренние отступы родительского элемента
            const paddingsParent = {
                top: getStyle(el.parentElement, "padding-bottom", true),
                bottom: getStyle(el.parentElement, "padding-top", true),
                left: getStyle(el.parentElement, "padding-left", true),
                right: getStyle(el.parentElement, "padding-right", true),
                x() {
                    return this.left + this.right;
                },
                y() {
                    return this.top + this.bottom;
                },
            };

            const parentRect = el.parentElement.getBoundingClientRect();

            // максимальная доступная ширина элемента
            vm.fixData.width = vm.fixData.maxWidth =
                parentRect.width - paddingsParent.x();

            // максимальная доступная высота элемента
            const height = window.innerHeight - paddingsParent.y() - deltaY;
            vm.fixData.height = vm.fixData.maxHeight = height;

            // отступы сверху и слева
            vm.fixData.top = deltaY + paddingsParent.top;
            vm.fixData.left = parentRect.left + paddingsParent.left;

            return;
        },

        /**
         * инициализация процесса фиксирования элемента
         *
         * @param {String} targetRef // ref фиксируемового HTML элемента
         * @param {String} observeRef // ref контейнера фиксируемового HTML элемента
         *
         * @returns {Void}
         */
        startFixElement(targetRef, observeRef) {
            const vm = this;
            const observeEl = vm.$refs[observeRef];
            vm.targetRef = targetRef;
            vm.observer.observe(observeEl);

            window.addEventListener("scroll", () => {
                vm.calculatePositionData();
            });
            return;
        },

        /**
         * Применение стилей к переданному объекту
         *
         * @param {HTMLElement} element
         * @param {Object instanceof this.fixData } data
         */
        updateElementFix(element, data) {
            element.style.position = "fixed";

            for (const styleProp in data) {
                element.style[styleProp] = `${data[styleProp]}px`;
            }
        },
    },
};
