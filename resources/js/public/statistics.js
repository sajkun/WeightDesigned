/**
 * приложение отображение статистики публичного раздела
 */

//хэлперы
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//классы
import { BvsData } from "@/misc/BvsDataClass";

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
        /**
         * Пустой объект для формирования данных для графика
         *
         * @returns {Object}
         */
        bvsInfoBlank() {
            const info = {
                axis: {
                    x: {
                        maxValue: 0,
                        label: "",
                        after: "кг",
                    },

                    y: {
                        maxValue: 0,
                        label: "",
                        after: "",
                    },
                },
                points: {},

                labels: {
                    x: {},
                },
            };

            return info;
        },

        /**
         * формирует данные статистики для отображения данных
         *
         * @returns {Object}
         */
        bvsInfo() {
            const vm = this;
            const harvestData = new BvsData(
                strip(vm.bvsData),
                strip(vm.dateRange)
            );

            let type;
            if (harvestData.parsedData.periods.days <= 31) {
                type = "day";
            } else if (harvestData.parsedData.periods.months < 12) {
                type = "month";
            } else {
                type = "year";
            }

            const rawData = harvestData.parsedData.data[type];

            const info = strip(vm.bvsInfoBlank);

            if (!rawData?.items) {
                return info;
            }

            let xValue = 0;
            rawData.items.forEach((value, key, map) => {
                let newKey;
                const date = moment(key, rawData.format);
                xValue++;
                switch (type) {
                    case "day":
                        newKey = date.format("D");
                        break;
                    case "month":
                        newKey = date.format("MMM");
                        break;
                    case "year":
                        newKey = date.format("YYYY");
                        break;
                }

                const newValue = value > 1000 ? value / 1000 : value;

                info.axis.x.after = value > 1000 ? "т." : info.axis.x.after;

                info.axis.y.maxValue = Math.max(info.axis.y.maxValue, newValue);

                info.labels.x[parseInt(xValue)] = newKey;

                info.points[newKey] = { x: parseInt(xValue), y: newValue };
            });

            info.axis.x.maxValue = Object.values(info.points).length + 1;

            return info;
        },

        statData() {
            const vm = this;
            const harvestData = new BvsData(
                strip(vm.bvsData),
                strip(vm.dateRange)
            );
            return harvestData.statistics;
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
