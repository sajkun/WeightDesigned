/**
 * Домашняя страница
 */

//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import fixedRightCol from "@/mixins/fixedRightCol";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";

//компоненты
import BvsMapComponent from "@/components/Bvs/MapComponent/";
import BvsShortComponent from "@/components/Bvs/ShortComponent";
import BvsOperationComponent from "@/components/Bvs/OperationComponent";
import CalendarComponent from "@/components/common/CalendarComponent";
import MessagesComponent from "@/components/common/MessagesComponent/";

import SwitcherComponent from "@/components/pageHome/SwitcherComponent";

const homePage = {
    mixins: [axiosRequests, crud, fixedRightCol, messages, publicAuthData],

    components: {
        BvsShortComponent,
        BvsMap: BvsMapComponent,
        BvsOperation: BvsOperationComponent,
        Calendar: CalendarComponent,
        MessagesComponent,
        SwitcherComponent,
    },

    data() {
        return {
            // режим выбора даты
            mode: "all", // day | period | all

            // тип детализации отображенния данных
            display: "items", // calendar | list | items

            // исходные данные от БВС
            bvsData: [],

            // перечень полей хозяйства
            grasslands: [],

            // период отображения данных
            period: {
                start: null,
                end: null,
            },

            // список выбранных весовых для отображения на карте
            selectedBvs: [],

            // список выбранных операций весовых для отображения на карте
            selectedOperationsIds: [],

            // ширина окна браузера
            windowWidth: window.innerWidth,

            //Признак отображения/скрытия компонента карты
            showMap: false,

            mounted: false,
        };
    },

    mounted() {
        const vm = this;

        vm.$nextTick(() => {
            window.addEventListener("resize", vm.onResize);
        });

        vm.getBvsData().then((response) => {
            vm.bvsData = response.bvs_data;
        });

        vm.getGrasslands((response) => {
            vm.grasslands = response.grasslands;
        });

        vm.$nextTick(() => {
            vm.startFixElement("fixposition", "observeResize", true, [
                vm.$refs.beforeStickyPosition,
            ]);
            vm.mounted = true;
            vm.renderMap();
        });
    },

    watch: {
        /**
         * Обработка зависимостей переменных оттипа детализации отображения данных БВС
         *
         * @return {Void}
         */
        display() {
            const vm = this;

            vm.$nextTick(() => {
                vm.startFixElement("fixposition", "observeResize", true);
            });

            return;
        },

        /**
         * скрытие и отображение карты для мобильных устройств
         *
         * @param {Integer} newWidth
         *
         * @returns {Void}
         */
        windowWidth(newWidth) {
            const vm = this;
            const breakpoint = 768;
            let show = newWidth > breakpoint;
            vm.showMap = show;
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

        /**
         * отфильтрованные значения данных от БВС в разрезе операций
         *
         * @returns {Array} массив данных о БВС
         */
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
         * Обновление данных о полях
         *
         * @returns {Array<Object>}
         */
        grasslandsData() {
            const vm = this;
            if (!vm.mounted) {
                return [];
            }
            const grasslands = strip(vm.grasslands);
            return grasslands;
        },

        /**
         * Форматированная строка текущей даты
         *
         * @returns {String} пример  YYYY-MM-DD (1900-10-23). Нумерация месмыцев начитнается с 1, т.е.  январь <-> 1 и т.д.
         */
        today() {
            const vm = this;

            if (vm.period.start) {
                const date = new Date(vm.period.start);
                return moment(date).format("YYYY-MM-DD");
            }
            return moment().format("YYYY-MM-DD");
        },

        /**
         * возвращает массив строк. Строки то даты в формате YYYY-MM-DD (1900-10-23).  Нумерация месмыцев начитнается с 1, т.е.  январь <-> 1 и т.д.
         *
         * @returns {Array<String>}
         */
        markedDays() {
            const vm = this;
            let data = strip(vm.bvsData);

            const dates = data.map((d) => {
                const day = moment(d.operation_time);
                return day.format("YYYY-MM-DD");
            });

            return dates;
        },

        /** признак режима работы календаря. Включен ли выбор периода или нет
         *
         *  @returns {Boolean}
         */
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
         * @param {Enum} display  all | day | period
         */
        changeMode(data) {
            const vm = this;
            vm.mode = data.mode;
            vm.display = vm.mode === "all" ? "list" : "calendar";
        },

        /**
         * Коллбэк для события изменения размеров окна браузера
         * Обновляет значение переменной ширины окна
         *
         * @returns {Void}
         */
        onResize() {
            this.windowWidth = window.innerWidth;
        },

        /**
         * принудительное обновление карты
         */
        async renderMap() {
            const vm = this;

            vm.showMap = false;
            await vm.$nextTick();
            vm.showMap = true;
        },

        /**
         * обработчик события клика на элемент из списка БВС
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
         * обработчик события выбора единичной даты на  календаре.
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
         * обработчик события клика на элементе из списка операций БВС
         *
         * @param {Object} data BvsData object @see BvsData Laravel Model BvsData
         *
         */
        selectOperationCb(data) {
            clog(data);
            const vm = this;
            vm.selectedOperationsIds = [data.id];

            // await vm.$nextTick();
            // vm.renderMap();
        },

        /**
         * обработчик события выбора диапазона дат на  календаре.
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
