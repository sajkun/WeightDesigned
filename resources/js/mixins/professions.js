export default {
    computed: {
        /**
         *  Список профессий
         * ключи объекта совпадают со значениями модели laravel Employee
         * @see Laravel Model Employee
         *
         * @return {Object}
         */
        professions() {
            const profesions = {
                "Водитель Трактора": "Трактористов",
                "Водитель Комбайна": "Комбайнеров",
                "Водитель Зерновоза": "Водителей",
            };

            return profesions;
        },
    },
};
