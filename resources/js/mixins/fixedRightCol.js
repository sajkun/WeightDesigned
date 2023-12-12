/**
 *
 */

//вспомогательные функции
import { clog, strip, getStyle, getDocHeight } from "@/misc/helpers";
export default {
    data() {
        return {
            /**
             *  Объект наблюдатель за изменением ширины
             *
             * @param {Object: ResizeObserver}
             */
            observer: null,

            /**
             * Элементы перед фиксируемым, которые нужно учесть при рассчете местоположения
             *
             * @param {Array<HTMLElement>}
             */
            extraElements: [],

            // {String} названия ref для фиксируемового объекта
            targetRef: null,

            // данные изменение расположения фиксируемового объекта
            fixData: {
                top: "initial",
                left: "initial",
                width: "initial",
                maxWidth: "initial",
                position: "fixed",
            },

            scrollData: {
                prev: 0,
                direction: 0,
            },

            shiftY: 0,
            controllHeight: false,
            applyFixData: false,
            stickyTrigger: false,
        };
    },

    computed: {
        mobileBreakPoint() {
            return 768;
        },
    },

    watch: {
        // обновление положение элемента при изменении данных
        fixData: {
            handler: function (fixData) {
                const vm = this;
                if (window.innerWidth < vm.mobileBreakPoint) {
                    vm.resertFixedElement();
                    return;
                }

                const el = vm?.$refs[vm?.targetRef];

                if (!el || !vm.applyFixData) {
                    vm.resertFixedElement();
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
            if (!vm.ifEnoughHeight()) {
                vm.resertFixedElement();
                return;
            }
            const shiftVelocity = 30;
            const scrollY = window.scrollY;
            const leftToBottomEdge =
                getDocHeight() - scrollY - window.innerHeight;

            // целевой фиксируемый элемент
            const el = vm.$refs[vm.targetRef];

            if (!el) {
                return;
            }
            const elHeight = el.offsetHeight;

            // Внутренние отступы родительского элемента
            const paddingsParent = vm.getParentPaddings(el);

            // переменная показывающая какая часть хэддера еще в зоне видимости страницы

            let deltaY = vm.getHeightBefore() - scrollY;
            deltaY = Math.max(0, deltaY);

            // максимальная видимая высота элемента
            const maxHeight = window.innerHeight - paddingsParent.y() - deltaY;

            //*************** */
            //сдвиг необходимый для смещения зафиксированного элемента в случаях, если его высота больше видимой высоты окна
            let minShiftY = Math.min(maxHeight - el.offsetHeight, 0);
            let shiftY = vm.shiftY;

            if (vm.getScrollDirection() === "down") {
                shiftY -= shiftVelocity;
                shiftY = Math.max(minShiftY, shiftY);
            } else {
                shiftY += shiftVelocity;
                shiftY = Math.min(0, shiftY);
            }

            //*************** */
            const parentRect = el.parentElement.getBoundingClientRect();

            // максимальная доступная ширина элемента
            vm.fixData.width = vm.fixData.maxWidth =
                parentRect.width - paddingsParent.x();

            if (vm.controllHeight) {
                let height = maxHeight;
                height -= getStyle(el, "padding-bottom", true);
                vm.fixData.maxHeight = height;
                vm.fixData.height = height;
            }

            // отступы сверху и слева
            const totalShiftTop = deltaY + paddingsParent.top + shiftY;

            // высота элемента ниже нижнего края экрана
            const elPartSizeBelowBottomEdge =
                elHeight + totalShiftTop - paddingsParent.bottom - maxHeight;

            // сдвиг если нижняя граница фиксируемого элемента выступает нижней части экрана
            const fixBottomEdgeShift =
                elPartSizeBelowBottomEdge > 0 &&
                leftToBottomEdge < elPartSizeBelowBottomEdge &&
                vm.getScrollDirection() === "down"
                    ? leftToBottomEdge - elPartSizeBelowBottomEdge
                    : 0;

            vm.fixData.top = totalShiftTop + fixBottomEdgeShift;
            vm.fixData.left = parentRect.left + paddingsParent.left;

            vm.stickyTrigger =
                window.scrollY >= this.getHeightBefore()
                    ? 0
                    : vm.stickyTrigger === 1
                    ? -1
                    : 1;

            vm.shiftY = shiftY;
            return;
        },

        /**
         * Получает суммарную высоту предшествующих зафиксированному элементу
         *
         * @returns {Number}
         */
        getHeightBefore() {
            const vm = this;
            const header = document.querySelector(".public-header");
            let height = header.offsetHeight;

            vm.extraElements.forEach((el) => {
                height += el.offsetHeight;
                height += getStyle(el, "margin-top", true);
                height += getStyle(el, "margin-bottom", true);
            });

            return height;
        },

        /**
         * определяет направление скролла
         *
         * @returns {Enum} up / down
         */
        getScrollDirection() {
            const vm = this;
            const pos = window.scrollY;
            const delta = vm.scrollData.prev - pos;
            if (delta === 0) {
                return vm.scrollData.direction;
            }
            vm.scrollData.prev =
                vm.scrollData.prev !== pos ? pos : vm.scrollData.prev;
            vm.scrollData.direction = delta > 0 ? "up" : "down";
            return vm.scrollData.direction;
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
         * проверка хватает ли высоты фиксируемого окна, чтобы поместиться в документе
         *
         * @returns {Boolean}
         */
        ifEnoughHeight() {
            const vm = this;
            const targetElement = vm.$refs[vm.targetRef];

            if (!targetElement) {
                return true;
            }
            const compareHeight =
                targetElement.offsetHeight + vm.getHeightBefore();

            const ifEnoughHeight = compareHeight <= getDocHeight();

            return ifEnoughHeight;
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
            const el = vm?.$refs[vm?.targetRef];

            if (!el) {
                return;
            }

            const capitalLetters = new RegExp("[A-Z]", "gu");

            Object.keys(vm.fixData).forEach((propertyName) => {
                const prop = propertyName.replace(
                    capitalLetters,
                    (letter) => `-${letter.toLowerCase()}`
                );
                el.style.removeProperty(prop);
            });

            window.removeEventListener("scroll", vm.calculatePositionData);

            vm.$nextTick(() => {
                vm.observer.disconnect();
            });
            return;
        },

        /**
         * инициализация процесса фиксирования элемента
         *
         * @param {String} targetRef ref фиксируемового HTML элемента
         * @param {String} observeRef ref контейнера фиксируемового HTML элемента
         * @param {Boolean} fixHeight  нужно ли фиксировать высоту блока
         * @param {Array<HTMLElement>} extraElements дополнительные элементы перед фиксируемым элементом
         *
         * @returns {Void}
         */
        startFixElement(
            targetRef,
            observeRef,
            controllHeight = false,
            extraElements = []
        ) {
            const vm = this;
            const observeEl = vm.$refs[observeRef];
            const targetElement = vm.$refs[targetRef];
            vm.applyFixData = true;
            vm.observer = vm.initObserver();
            vm.targetRef = targetRef;
            vm.fixData.position = "fixed";
            vm.controllHeight = controllHeight;
            vm.extraElements = extraElements;

            if (controllHeight) {
                vm.fixData.height = getDocHeight() - vm.getHeightBefore();
                vm.fixData.maxHeight = getDocHeight() - vm.getHeightBefore();
            }

            vm.updateFixElement(targetElement, vm.fixData);

            vm.$nextTick(() => {
                vm.observer.observe(observeEl);
                vm.observer.observe(targetElement);
                window.addEventListener("scroll", vm.calculatePositionData);
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
                const prop =
                    typeof data[styleProp] === "number"
                        ? `${parseInt(data[styleProp])}px`
                        : data[styleProp];

                element.style[styleProp] = prop;
            }

            return;
        },
    },
};
