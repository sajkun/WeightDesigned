/**
 * Отображение статистики по предприятию
 */

//хэлперы
import { strip, clog } from "../misc/helpers";

//миксины
import axiosRequests from "../mixins/axiosRequests";
import crud from "../mixins/crud";
import messages from "../mixins/messages";
import publicAuthData from "../mixins/publicAuthData";

// компоненты
import MessagesComponent from "../components/MessagesComponent/";
import MonthPickerComponent from "../components/inputs/MonthPickerComponent/";

const appPublicStatistics = {
    mixins: [axiosRequests, crud, messages, publicAuthData],

    components: { MessagesComponent, MonthPicker: MonthPickerComponent },

    data() {
        return {
            bvsData: [],
            employees: [], // перечень сотрудников организации
            vehicles: [], // перечень техники
            ratingBy: "", // по ком или чем отображать рейтинг
        };
    },

    watch: {
        ratingBy(ratingBy) {
            console.log(ratingBy);
        },
    },

    computed: {
        /**
         * Вычисляет итоговое собранное количество зерна в разрезе техники
         *
         * @return {Void|Array}
         */
        bvsTransferedAmounts() {
            const vm = this;

            if (!vm.bvsData.length) return;
            let data = strip(vm.bvsData);
            let parsedData = {};

            // перебор массива данных бвс
            for (const _data of data) {
                /**
                 * если загрузка от комбайна (bvs_name === to), то данные добавляются и для БВС
                 * Если загрузка от БВС (bvs_name === from), то значение переданное плюсуется только для грузовика
                 */

                if (_data.bvs_name === _data.to) {
                    if (!parsedData[_data.from]) {
                        parsedData[_data.from] = 0;
                    }
                    parsedData[_data.from] += parseFloat(
                        _data.amount_transfered
                    );
                }

                if (!parsedData[_data.to]) {
                    parsedData[_data.to] = 0;
                }
                parsedData[_data.to] += parseFloat(_data.amount_transfered);
            }

            return parsedData;
        },

        /**
         * Сформированные данные для рейтинга
         *
         * @return {Array}
         */
        ratingData() {
            const vm = this;
        },

        /**
         * Список доступных вариантов рейтинга
         *
         * @returns {Object} В качестве ключа профессия сотрудника либо тип техники
         * @see Laravel Models Employee | Vehicle
         */
        ratingOptions() {
            const options = {
                "Водитель Трактора": "Трактористов",
                "Водитель Комбайна": "Комбайнеров",
                "Водитель Зерновоза": "Водителей",
                "-": "----",
                bunker: "Бункеров Перегрузчиков",
                harvester: "Комбайнов",
                transporter: "Зерновозов",
            };
            return options;
        },

        /**
         * отфильтрованный список техники в зависимости от значения ratingBy
         *
         * @return {Array} техники
         */
        vehiclesFiltered() {
            const vm = this;
            const vehicleTypes = ["bunker", "transporter", "harvester"];
            let vehicles = strip(vm.vehicles);

            if (vehicleTypes.indexOf(vm.ratingBy) < 0) return vehicles;
            vehicles = vehicles.filter((v) => {
                return v.type === vm.ratingBy;
            });

            return vehicles;
        },
    },

    mounted() {
        const vm = this;
        // выбор начального значения из вариантов рейтинга
        vm.ratingBy = Object.keys(strip(vm.ratingOptions))[0];
        // запрос и получение списка сотрудников
        vm.getEmployees().then((e) => (vm.employees = e.employees));
        // запрос и получение списка техники, присвоение списка
        vm.getVehicles().then((e) => {
            vm.vehicles = [
                ...Object.values(e.bunkers),
                ...Object.values(e.harvesters),
                ...Object.values(e.tractors),
                ...Object.values(e.transporters),
            ];
        });
        //запрос данных от БВС
        vm.getBvsData().then((e) => (vm.bvsData = e.bvs_data));
    },

    methods: {},
};

export default appPublicStatistics;
