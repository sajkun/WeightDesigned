// Анимация ракрывающегося контента

export default {
    methods: {
        beforeEnter: function (el) {
            el.style.height = 0;
        },

        enter: function (el, done) {
            el.style.height = `${el.scrollHeight}px`;
            done();
        },

        leave: function (el, done) {
            el.style.height = 0;
            // done();
        },
    },
};
