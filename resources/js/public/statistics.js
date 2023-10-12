/**
 * приложение отображение статистики публичного раздела
 */

//хэлперы
import { strip, clog } from "../misc/helpers";
import moment from "moment";

//миксины
import axiosRequests from "../mixins/axiosRequests";
import crud from "../mixins/crud";
import messages from "../mixins/messages";
import publicAuthData from "../mixins/publicAuthData";

// компоненты
import MessagesComponent from "../components/MessagesComponent";
import MonthPickerComponent from "../components/inputs/MonthPickerComponent";

const appPublicStatistics = {
    mixins: [axiosRequests, crud, messages, publicAuthData],

    components: {
        MessagesComponent,
        MonthPicker: MonthPickerComponent,
    },

    data() {
        return {
            bvsData: [], // данные о транзакциях БВC
            employees: [], // перечень сотрудников организации
            vehicles: [], // перечень техники
        };
    },

    watch: {},

    computed: {},

    mounted() {
        const vm = this;
        // выбор начального значения из вариантов рейтинга

        vm.$el.parentNode.classList.add("d-flex");
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
