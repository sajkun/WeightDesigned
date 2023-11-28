//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import messagesMixin from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";

// компоненты
import DatepickerComponent from "@/components/inputs/DatepickerComponent";
import DaySelectComponent from "@/components/pageTasks/DaySelectComponent";
import MessagesComponent from "@/components/common/MessagesComponent";
import SearchComponent from "@/components/common/SearchComponent";

const task = {
    mixins: [axiosRequests, crud, publicAuthData, messagesMixin],

    components: {
        messages: MessagesComponent,
        datepicker: DatepickerComponent,
        days: DaySelectComponent,
        search: SearchComponent,
    },

    data() {
        return {
            // диапазон дат для фильтрации данных
            dateRange: {
                //отображаемый
                display: {
                    start: null,
                    end: null,
                },
                // выбранный максимальный
                selected: {
                    start: null,
                    end: null,
                },
            },
        };
    },

    created() {
        const vm = this;
        const today = new Date();
        const helper = moment(today);

        vm.dateRange.selected = clog(helper);
    },

    mounted() {
        clog("%c Сменные задания", "font-size: 48px");
        const vm = this;

        /**
         * Получение списка техники
         */
        vm.getVehicles().then((vehicles) => {
            clog(vehicles);
        });
    },

    methods: {
        execSearch(data) {
            console.log("execSearch", data);
        },

        /**
         * Обработчик события изменения дата компонента datepicker
         *
         * @param {Enum} type  start | end
         * @param {Object} passedData переданные данные от дочернего элемента
         */
        setDate(type, passedData) {
            this.dateRange[type] = passedData.date;
        },
    },
};

export default task;
