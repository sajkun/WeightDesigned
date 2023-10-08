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
            employees: [], // перечень сотрудников организации
            vehicles: [], // перечень техники
            ratingBy: "", // по ком или чем отображать рейтинг
        };
    },

    watch: {},

    computed: {
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
    },

    mounted() {
        const vm = this;
        // выбор начального значения из вариантов рейтинга
        vm.ratingBy = Object.keys(strip(vm.ratingOptions))[0];
        // запрос и получение списка сотрудников
        vm.getEmployees().then((e) => (vm.employees = e.employees));
        // запрос и получение списка техники
        vm.getVehicles().then((e) => (vm.vehicles = e.vehicles));
    },

    methods: {},
};

export default appPublicStatistics;
