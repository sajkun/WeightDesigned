// Анимация ракрывающегося контента

//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
export default {
    methods: {
        afterEnter(el) {
            // вычисляем есть ли в css заданное время анимации высоты, и если есть по таймауту удаляем фиксированное значение высоты

            const transition = window
                .getComputedStyle(el)
                .transition.split(",");

            const heightTransition = transition
                .filter((el) => {
                    return el.indexOf("height") >= 0;
                })
                .pop();

            if (!heightTransition) {
                return;
            }

            const timeout = parseFloat(heightTransition.split(" ")[1]) * 1000;

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
            el.style.height = `${el.scrollHeight}px`;
            done();
        },

        leave: function (el, done) {
            el.style.height = 0;
            // done();
        },
    },
};
