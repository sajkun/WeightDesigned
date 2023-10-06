/**
 * Домашняя страница
 */

import messages from "../mixins/messages";
import publicAuthData from "../mixins/publicAuthData";
import MessagesComponent from "../components/MessagesComponent/";
import BvsMapComponent from "../components/BvsMapComponent/";
import SwitcherComponent from "../components/SwitcherComponent";
import CalendarComponent from "../components/CalendarComponent";
import BvsShortComponent from "../components/BvsShortComponent";
import BvsOperationComponent from "../components/BvsOperationComponent";
import { strip, clog } from "../misc/helpers";
import crud from "../mixins/crud";
import moment from "moment";

const axios = require("axios");

const homePage = {
    mixins: [messages, crud, publicAuthData],

    components: {
        MessagesComponent,
        BvsShortComponent,
        SwitcherComponent,
        Calendar: CalendarComponent,
        BvsMap: BvsMapComponent,
        BvsOperation: BvsOperationComponent,
    },

    data() {
        return {
            // режим выбора даты
            mode: "day", // day | period | all

            // тип детализации отображенния данных
            display: "calendar", // calendar | list | items
            bvsData: [],
            period: {
                start: null,
                end: null,
            },
            selectedBvs: [],
            selectedOperationsIds: [],
        };
    },

    mounted() {
        const vm = this;
        vm.getBvsData();
    },

    watch: {
        /**
         * Обработка зависимостей переменных оттипа детализации отображения данных БВС
         *
         * @param {Enum} display calendar | list | items
         *
         * @return null
         */
        display(display) {
            const vm = this;

            if (display === "calendar") {
                vm.selectedBvs = [];
                vm.selectedOperationsIds = [];
            }

            return null;
        },

        /**
         * Обработка зависимостей переменных от режима отображения календаря
         *
         * @param {Enum} mode all|period|day
         *
         * @return null
         */
        mode(mode) {
            const vm = this;
            // сброс дат
            if (mode === "all") {
                vm.period.start = null;
                vm.period.end = null;
                vm.display = "list";
            }

            return null;
        },
    },

    computed: {
        /**
         * отфильтрованные значения данных от БВС по дате и по выбранным бункерам
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
         * отфильтрованные значения данных от БВС в разрезе бункеров
         *
         * @returns {Array} массив данных о БВС
         */
        bsvFilteredByUnit() {
            const vm = this;
            const dataRaw = strip(vm.bvsDataFiltered);
            const initialValue = {};
            const data = dataRaw.reduce((accumulator, val) => {
                const idx = val.bvs_name;

                if (!accumulator[idx]) {
                    accumulator[idx] = {
                        name: idx,
                        items: [],
                        selected: false,
                    };
                }
                accumulator[idx].selected =
                    strip(vm.selectedBvs).indexOf(idx) >= 0;
                accumulator[idx].items.push(val);

                return accumulator;
            }, initialValue);

            return data;
        },

        bvsFilteredByOperations() {
            const vm = this;
            let data = strip(vm.bvsOperations);

            if (vm.selectedOperationsIds.length) {
                const items = strip(vm.selectedOperationsIds);
                data = data.filter((d) => {
                    return items.indexOf(d.id) >= 0;
                });
            }

            return data;
        },

        /**
         * Отфильтровывает все операции по выбранным бункерам
         *
         * @returns {Array} массив данных конкретных операций
         */
        bvsOperations() {
            const vm = this;
            const dataRaw = strip(vm.bvsDataFiltered);
            const names = strip(vm.selectedBvs);
            let data;
            data =
                names.length > 0
                    ? dataRaw.filter((d) => {
                          return names.indexOf(d.bvs_name) >= 0;
                      })
                    : dataRaw;

            const operations = strip(vm.selectedOperationsIds);
            data = data.map((d) => {
                d.selected = operations.indexOf(d.id) >= 0;
                return d;
            });

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
            const vm = this;

            if (vm.period.start) {
                const date = new Date(vm.period.start);
                return moment(date).format("YYYY-MM-DD");
            }
            return moment().format("YYYY-MM-DD");
        },

        markedDays() {
            const vm = this;
            let data = strip(vm.bvsData);

            const dates = data.map((d) => {
                const day = moment(d.operation_time);
                return day.format("YYYY-MM-DD");
            });

            return dates;
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

        // признак режима работы календаря выбор периода или нет
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
            const vm = this;
            vm.mode = data.mode;
            vm.display = vm.mode === "all" ? "list" : "calendar";
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
         * обработчик события выбора БВС
         *
         * @param {Object} data
         */
        selectBvsCb(data) {
            const vm = this;
            const idx = strip(vm.selectedBvs).indexOf(data.name);
            if (idx >= 0) {
                vm.selectedBvs.splice(idx, 1);
            } else {
                vm.selectedBvs.push(data.name);
            }
        },

        /**
         * обработчик события календаря. Выбор 1 даты
         *
         * @param {Object} data {date: ISO date string}
         *
         */
        selectDateCb(data) {
            clog("%c selectDateCb", "color: blue", data);
            const vm = this;
            vm.period.start = `${data.date}T00:00:00`;
            vm.period.end = `${data.date}T23:59:59`;
        },

        /**
         * обработчик события выбора операции БВС
         *
         * @param {Object} data BvsData object @see BvsData Laravel Model BvsData
         *
         */
        selectOperationCb(data) {
            const vm = this;
            const idx = vm.selectedOperationsIds.indexOf(data.id);
            if (idx >= 0) {
                vm.selectedOperationsIds.splice(idx, 1);
            } else {
                vm.selectedOperationsIds.push(data.id);
            }
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
