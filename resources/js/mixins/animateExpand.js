// Анимация ракрывающегося контента

//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
export default {
    methods: {
        beforeEnter(el) {
            el.style.height = 0;
        },

        enter(el, done) {
            el.style.height = `${el.scrollHeight}px`;
            done();
        },

        afterEnter(el) {
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
                clog(el);
                clog(timeout);
                el.style.removeProperty("height");
            }, timeout);
        },

        leave: function (el, done) {
            el.style.height = 0;
            // done();
        },
    },
};
