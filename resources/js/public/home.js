/**
 * Домашняя страница
 */

import messages from "../mixins/messages";
import publicAuthData from "../mixins/publicAuthData";
import MessagesComponent from "../components/MessagesComponent/";
import BvsMapComponent from "../components/BvsMapComponent/";
import SwitcherComponent from "../components/SwitcherComponent";
import CalendarComponent from "../components/CalendarComponent";
import { strip, clog } from "../misc/helpers";
import crud from "../mixins/crud";
import moment from "moment";

const axios = require("axios");

const homePage = {
    mixins: [messages, crud, publicAuthData],

    components: {
        MessagesComponent,
        SwitcherComponent,
        Calendar: CalendarComponent,
        BvsMap: BvsMapComponent,
    },

    data() {
        return {
            // редим выбора даты
            mode: "day", // day | period | all
            display: "calendar", // calendar | list | bunker
            bvsData: [],
            period: {
                start: null,
                end: null,
            },
        };
    },

    mounted() {
        const vm = this;
        vm.getBvsData();
    },

    watch: {
        mode(mode) {
            const vm = this;
            if (mode === "all") {
                vm.period.start = null;
                vm.period.end = null;
            }
        },
    },

    computed: {
        /**
         * отфильтрованные значения данных от БВС
         *
         * @returns {Array} массив данных о БВС
         */
        bvsDataFiltered() {
            const vm = this;
            let data = strip(vm.bvsData);

            if (vm.period.start && vm.period.end) {
                const start = new Date(vm.period.start);
                const end = new Date(vm.period.end);

                data = data.filter((d) => {
                    const date = new Date(d.operation_time);
                    return start <= date && date <= end;
                });
            }

            return data;
        },

        /**
         * Признак активности календаря
         *
         * @returns {Boolean}
         */
        calendarState() {
            return this.mode === "all";
        },

        /**
         * Форматированная строка текущей даты
         *
         * @returns String D-m-y
         */
        today() {
            return moment().format("YYYY-MM-DD");
        },

        // режимы выбора даты
        modes() {
            const modes = {
                all: "За все время",
                day: "За день",
                period: "За период",
            };
            return modes;
        },

        selectPeriod() {
            return this.mode === "period";
        },
    },

    methods: {
        /**
         * смена видимости колонки с БВС
         *
         * @param {Enum} display :// calendar | list | bunker
         */
        changeDisplay(display) {
            this.display = display;
        },

        /**
         * смена режима выбора отображения даты
         *
         * @param {Enum} display :// all | day | period
         */
        changeMode(data) {
            this.mode = data.mode;
        },

        // запрос данных БВС
        getBvsData() {
            const vm = this;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
            };

            axios
                .post(`/bvsdata/list`, postData)
                .then((response) => {
                    clog("%c getBvsData response", "color:green", response);

                    vm.bvsData = response.data.bvs_data;
                    // vm.messages[response.data.type] = response?.data?.message;
                })
                .catch((e) => {
                    clog("%c getBvsData error", "color: red", e.response);
                    // vm.messages.error = e.response.data.message;
                });
        },

        /**
         * обработчик события календаря. Выбор 1 даты
         *
         * @param {Object} data {date: ISO date string}
         */
        selectDateCb(data) {
            clog("%c selectDateCb", "color: blue", data);
            const vm = this;
            vm.period.start = `${data.date}T00:00:00`;
            vm.period.end = `${data.date}T23:59:59`;
        },

        /**
         * обработчик события календаря. Выбор диапазона дат
         *
         * @param {Object} data
         *   {
         *      start: ISO date string,
         *      end: ISO date string
         *   }
         */
        selectPeriodCb(data) {
            clog("%c selectPeriodCb", "color: blue", data);
            const vm = this;
            vm.period.start = `${data.start}T00:00:00`;
            vm.period.end = `${data.end}T23:59:59`;
        },
    },
};

export default homePage;
