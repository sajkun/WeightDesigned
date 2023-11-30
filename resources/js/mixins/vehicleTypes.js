export default {
    computed: {
        /**
         * список типов техники и их человеко-понятных меток
         * ключи массива совпадают с типами техники
         * @see Laravel Model Vehicle
         *
         * @return {Object}
         */
        vehicleTypes() {
            const types = {
                bunker: "Бункер Перегрузчик",
                harvester: "Комбайн",
                transporter: "Зерновоз",
                tractor: "Трактор",
            };

            return types;
        },
    },
};
