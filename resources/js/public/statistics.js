/**
 * приложение отображение статистики публичного раздела
 */

//хэлперы
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";
import sortAnimation from "@/mixins/sortAnimation";
import professions from "@/mixins/professions";
import statData from "@/mixins/statData";
import vehicleTypes from "@/mixins/vehicleTypes";

// компоненты
import MessagesComponent from "@/components/MessagesComponent";
import GraphicComponent from "@/components/GraphicComponent";
import MonthPickerComponent from "@/components/inputs/MonthPickerComponent";
import DatepickerComponent from "@/components/inputs/DatepickerComponent";

const appPublicStatistics = {
    mixins: [
        axiosRequests,
        crud,
        messages,
        professions,
        publicAuthData,
        statData,
        sortAnimation,
        vehicleTypes,
    ],

    components: {
        MessagesComponent,
        MonthPicker: MonthPickerComponent,
        Datepicker: DatepickerComponent,
        Graph: GraphicComponent,
    },

    data() {
        return {};
    },

    watch: {},

    computed: {
        testInfo() {
            const info = {
                axis: {
                    x: {
                        maxValue: 7,
                        label: "",
                    },

                    y: {
                        maxValue: 4000,
                        label: "",
                    },
                },
                points: [
                    { x: 1, y: 2000 },
                    { x: 2, y: 2500 },
                    { x: 3, y: 1650 },
                    { x: 4, y: 1300 },
                    { x: 5, y: 1200 },
                    { x: 7, y: 4000 },
                ],
            };

            return info;
        },
    },

    mounted() {
        const vm = this;
        vm.$el.parentNode.classList.add("d-flex");
        const today = new Date();
        vm.dateRange.start = moment(today).set("date", 1).toISOString();
        vm.dateRange.end = moment(today).toISOString();
    },

    methods: {
        setDate(type, event) {
            this.dateRange[type] = event.date;
        },

        setPeriod(type) {
            const vm = this;
            const today = new Date();

            switch (type) {
                case "month":
                    vm.dateRange.start = moment(today)
                        .startOf("month")
                        .toISOString();
                    vm.dateRange.end = moment(today)
                        .endOf("month")
                        .toISOString();
                    break;
                case "quarter":
                    vm.dateRange.start = moment(today)
                        .startOf("quarter")
                        .toISOString();
                    vm.dateRange.end = moment(today)
                        .endOf("quarter")
                        .toISOString();
                    break;
                case "year":
                    vm.dateRange.start = moment(today)
                        .startOf("year")
                        .toISOString();
                    vm.dateRange.end = moment(today)
                        .endOf("year")
                        .toISOString();
                    break;
            }
        },
    },
};

export default appPublicStatistics;
