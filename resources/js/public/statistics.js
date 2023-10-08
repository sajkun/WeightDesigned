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

const appPublicStatistics = {
    mixins: [axiosRequests, crud, messages, publicAuthData],

    components: { MessagesComponent },

    data() {
        return {
            employees: [],
            vehicles: [],
            ratingBy: "",
        };
    },

    watch: {},

    computed: {
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
        vm.ratingBy = Object.keys(strip(vm.ratingOptions))[0];
        vm.getEmployees().then((e) => (vm.employees = e.employees));
        vm.getVehicles().then((e) => (vm.vehicles = e.vehicles));
    },

    methods: {},
};

export default appPublicStatistics;
