// Анимация ракрывающегося контента

//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
export default {
    methods: {
        afterEnter(el) {
            const vm = this;
            const timeout = vm.getAnimationDelay(el);
            setTimeout(() => {
                el.style.removeProperty("height");
            }, timeout);
        },

        beforeEnter(el) {
            el.style.height = 0;
        },

        beforeLeave(el) {
            el.style.height = `${el.scrollHeight}px`;
        },

        enter(el, done) {
            const vm = this;
            vm.$nextTick(() => {
                el.style.height = `${el.scrollHeight}px`;
                done();
            });
        },

        leave: function (el, done) {
            const vm = this;
            vm.$nextTick(() => {
                el.style.height = 0;
            });
            const timeout = vm.getAnimationDelay(el);
            setTimeout(() => {
                done();
            }, timeout);
        },

        /**
         * Вычисляет длительность анимации высоты элемента, заданной в css
         *
         * @param {HTMLElement} el
         * @returns {Number}
         */
        getAnimationDelay(el) {
            const transition = window
                .getComputedStyle(el)
                .transition.split(",");

            const heightTransition = transition
                .filter((el) => {
                    return el.indexOf("height") >= 0;
                })
                .pop();

            if (!heightTransition) {
                return 0;
            }

            const timeout = parseFloat(heightTransition.split(" ")[1]) * 1000;

            return timeout;
        },
    },
};
