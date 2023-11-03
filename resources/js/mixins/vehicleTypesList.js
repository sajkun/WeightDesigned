export default {
    computed: {
        /**
         * Человеко понятные названия алиасов техники
         *
         * @returns {Object}
         */
        vehicleTypesList() {
            return {
                bunker: {
                    name: "Бункер перегрузчик",
                },
                transporter: {
                    name: "Грузовик",
                },
                tractor: {
                    name: "Трактор",
                },
                harvester: {
                    name: "Комбайн",
                },
            };
        },
    },
};
