/**
 * Домашняя страница
 */

//хэлперы
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import fixedRightCol from "@/mixins/fixedRightCol";
import publicAuthData from "@/mixins/publicAuthData";

//компоненты
import BvsMapComponent from "@/components/Bvs/MapComponent/";
import CalendarComponent from "@/components/CalendarComponent";
import BvsShortComponent from "@/components/Bvs/ShortComponent";
import BvsOperationComponent from "@/components/Bvs/OperationComponent";
import SwitcherComponent from "@/components/SwitcherComponent";

const homePage = {
    mixins: [axiosRequests, crud, fixedRightCol, publicAuthData],

    components: {
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
            showMap: true,
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
            vm.startFixElement("fixposition", "observeResize", true);
        });
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
         * Ключ, определюящий надо ли отображать календарь в зависимости от типа выбранного периода
         *
         * @returns {Boolean}
         */
        calendarState() {
            return this.mode === "all";
        },

        grasslandsData() {
            const vm = this;
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
         *
         * @returns {Array<String>} возвращает массив строк. Строки то даты в формате YYYY-MM-DD (1900-10-23).  Нумерация месмыцев начитнается с 1, т.е.  январь <-> 1 и т.д.
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

        /**
         * режимы выбора даты
         *
         * @returns {Object}
         */

        modes() {
            const modes = {
                all: "За все время",
                day: "За день",
                period: "За период",
            };
            return modes;
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
            const vm = this;
            const idx = vm.selectedOperationsIds.indexOf(data.id);
            if (idx >= 0) {
                vm.selectedOperationsIds.splice(idx, 1);
            } else {
                vm.selectedOperationsIds.push(data.id);
            }
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
