export default {
    computed: {
        /**
         * Список моделей БП Лилиани
         *
         * @returns {Array<string>}
         */
        bunkerModels() {
            return [
                "БП-16/20",
                "БП-22/28",
                "БП-22/28 габаритный",
                "БП-22/28 (8 колес)",
                "БП-22/31",
                "БП-22/31 хоппер",
                "БП-22/31 габаритный",
                "БП-22/31 8 колес",
                "БП-33/42 хоппер",
                "БП-33/42 8 колес",
                "БП-40/50",
            ];
        },

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
