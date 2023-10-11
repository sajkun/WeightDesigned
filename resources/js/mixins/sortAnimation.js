//анимация разворачивания элементов в списке
// обязательно наличие уникального key и
// и атрибута data-index
import { gsap } from "gsap";
export default {
    methods: {
        onBeforeEnter(el) {
            el.style.opacity = 0;
            el.style.height = 0;
        },

        onEnter(el, done) {
            gsap.to(el, {
                opacity: 1,
                height: "auto",
                delay: el.dataset.index * 0.01,
                onComplete: done,
            });
        },

        onLeave(el, done) {
            el.style.opacity = 0;
            el.style.height = 0;
            done();
        },
    },
};
