/**
 *
 */

//хэлперы
import { clog, getStyle } from "@/misc/helpers";
let test;
export default {
    data() {
        return {
            /**
             *  Объекь наблюдатель за изменением ширины
             *
             * @param {Object: ResizeObserver}
             */
            observer: null,

            // {String} названия ref для фиксируемового объекта
            targetRef: null,

            // данные изменение расположения фиксируемового объекта
            fixData: {
                top: "initial",
                left: "initial",
                width: "initial",
                maxWidth: "initial",
                maxHeight: "initial",
                position: "fixed",
            },

            prevScrollY: 0,
            shiftY: 0,
            controllHeight: false,

            applyFixData: false,
        };
    },

    watch: {
        // обновление положение элемента при изменении данных
        fixData: {
            handler: function (fixData) {
                const vm = this;
                const el = vm?.$refs[vm?.targetRef];
                if (!el || !vm.applyFixData) {
                    return;
                }
                vm.updateFixElement(el, fixData);
            },
            deep: true,
        },
    },

    methods: {
        /**
         * вычисляет размеры и положение фикируемового блока
         *
         * @returns {Void}
         */
        calculatePositionData() {
            const vm = this;
            const scrollY = window.scrollY;

            // целевой фиксируемый элемент
            const el = vm.$refs[vm.targetRef];

            // Внутренние отступы родительского элемента
            const paddingsParent = vm.getParentPaddings(el);

            // Хэддер сайта
            const header = document.querySelector(".public-header");

            // переменная показывающая какая часть хэддера еще в зоне видимости страницы

            let deltaY = header.offsetHeight - scrollY;
            deltaY = Math.max(0, deltaY);

            // максимальная видимая высота элемента
            const maxHeight = window.innerHeight - paddingsParent.y() - deltaY;
            //*************** */

            let minShiftY = Math.min(maxHeight - el.offsetHeight, 0);
            let shiftY = vm.shiftY;

            if (vm.getScrolldirection() === "down") {
                shiftY -= 10;
                shiftY = Math.max(minShiftY, shiftY);
            } else {
                shiftY += 10;
                shiftY = Math.min(0, shiftY);
            }

            //*************** */
            const parentRect = el.parentElement.getBoundingClientRect();

            // максимальная доступная ширина элемента
            vm.fixData.width = vm.fixData.maxWidth =
                parentRect.width - paddingsParent.x();

            if (vm.controllHeight) {
                vm.fixData.maxHeight = maxHeight;
            }

            // отступы сверху и слева
            vm.fixData.top = deltaY + paddingsParent.top + shiftY;
            vm.fixData.left = parentRect.left + paddingsParent.left;

            vm.shiftY = shiftY;
            return;
        },

        /**
         * определяет направление скролла
         *
         * @returns {Enum} up / down
         */
        getScrolldirection() {
            const vm = this;
            const pos = window.scrollY;
            const delta = vm.prevScrollY - pos;
            vm.prevScrollY = pos;
            return delta < 0 ? "down" : "up";
        },

        /**
         * Отступы родительского элемента для el
         *
         * @param {HTMLElement} el
         *
         * @returns {Object}
         */
        getParentPaddings(el) {
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

            return paddingsParent;
        },

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
         * Отменяет все назначенные свойства
         *
         * @returns {Void}
         */
        resertFixedElement() {
            const vm = this;
            const fixData = {
                top: "initial",
                left: "initial",
                width: "initial",
                maxWidth: "initial",
                maxHeight: "initial",
                position: "relative",
            };
            const el = vm?.$refs[vm?.targetRef];
            vm.updateFixElement(el, fixData);
            return;
        },

        /**
         * инициализация процесса фиксирования элемента
         *
         * @param {String} targetRef // ref фиксируемового HTML элемента
         * @param {String} observeRef // ref контейнера фиксируемового HTML элемента
         * @param {Boolean} fixHeight // нужно ли фиксировать высоту блока
         *
         * @returns {Void}
         */
        startFixElement(targetRef, observeRef, controllHeight) {
            const vm = this;
            const observeEl = vm.$refs[observeRef];
            vm.applyFixData = true;
            vm.observer = vm.initObserver();
            vm.targetRef = targetRef;
            vm.fixData.position = "fixed";
            vm.controllHeight = controllHeight;

            clog(controllHeight);

            vm.$nextTick(() => {
                vm.observer.observe(observeEl);
            });

            window.addEventListener("scroll", () => {
                vm.calculatePositionData();
            });

            return;
        },

        /**
         * отключает отслеживание привязывания элемента
         *
         * @returns {Void}
         */
        stopFixElement() {
            const vm = this;
            vm.applyFixData = false;
            vm.$nextTick(() => {
                vm.resertFixedElement();
            });

            return;
        },

        /**
         * Применение стилей к переданному объекту
         *
         * @param {HTMLElement} element
         * @param {Object instanceof this.fixData } data
         *
         * @returns {Void}
         */
        updateFixElement(element, data) {
            for (const styleProp in data) {
                element.style[styleProp] =
                    typeof data[styleProp] === "number"
                        ? `${data[styleProp]}px`
                        : data[styleProp];
            }

            return;
        },
    },
};
