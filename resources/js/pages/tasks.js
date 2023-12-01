/**
 * Страница работ со сменными заданиями
 */

//вспомогательные функции
import { Vue } from "vue";
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import messagesMixin from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";
import vehicleTypes from "@/mixins/vehicleTypes";

// компоненты
import DatepickerComponent from "@/components/inputs/DatepickerComponent";
import DaySelectComponent from "@/components/pageTasks/DaySelectComponent";
import MessagesComponent from "@/components/common/MessagesComponent";
import ModalComponent from "@/components/common/ModalComponent";
import SearchComponent from "@/components/common/SearchComponent";
import TaskItemComponent from "@/components/pageTasks/TaskItemComponent";

const task = {
    mixins: [axiosRequests, crud, publicAuthData, messagesMixin, vehicleTypes],

    components: {
        datepicker: DatepickerComponent,
        days: DaySelectComponent,
        items: TaskItemComponent,
        messages: MessagesComponent,
        modal: ModalComponent,
        search: SearchComponent,
    },

    computed: {
        /**
         * Список комбайнов  вместе с сотрудниками, назначенными для них
         *
         * @returns {Array}
         */
        harvesters() {
            let items = this.vehicles?.harvesters;

            if (!items) {
                return [];
            }

            items = items.map((h) => {
                h["employees"] = [];
                return h;
            });

            return items;
        },

        /**
         * Список грузовозов вместе с сотрудниками, назначенными для них
         *
         * @returns {Array}
         */
        transporters() {
            let items = this.vehicles?.transporters;

            if (!items) {
                return [];
            }

            items = items.map((h) => {
                h["employees"] = [];
                return h;
            });

            return items;
        },
    },

    watch: {},

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

            /**
             * список техники организации
             */
            employees: {},

            /**
             * список групп техники организации
             */
            groups: {},

            /**
             * признак смонтированности приложения
             * @var {Boolean}
             */
            mounted: false,

            /**
             * список техники организации
             */
            vehicles: {},

            activeModal: false,
        };
    },

    created() {
        clog("%c Сменные задания", "font-size: 36px");
        const vm = this;

        //определение начального диапазона дат по умолчанию
        let start = moment().startOf("day");
        let end = moment().endOf("day");

        vm.dateRange.selected = {
            start: strip(start.toISOString()),
            end: strip(end.add(10, "days").toISOString()),
        };
    },

    mounted() {
        const vm = this;
        /**
         * Получение списка техники
         */
        vm.getVehicles().then((vehicles) => {
            for (const vehicleType of Object.keys(vm.vehicleTypes)) {
                vm.vehicles[`${vehicleType}s`] = [
                    ...Object.values(vehicles[`${vehicleType}s`]),
                ];
            }
        });

        /**
         * Получение списка групп
         */
        vm.getGroups().then((e) => {
            vm.groups = e.groups;
        });

        /**
         * Получение списка сотрудников
         */
        vm.getEmployees().then((e) => {
            vm.employees = e.employees;
        });

        vm.$nextTick(() => {
            vm.mounted = true;
        });
    },

    methods: {
        /**
         *
         *
         * @param {Object} data
         */
        addEmployeeHandler(data) {
            clog(data);
            const vm = this;
            vm.activeModal = "employees";
        },

        /**
         * Скрытие модальных окон
         */
        closeModal() {
            this.activeModal = false;
        },

        /**
         * Обработка события поиска
         *
         * @param {String} data
         */
        execSearch(data) {
            clog("execSearch", data);
        },

        /**
         * Задает одну из предельных дат (начала или конца)
         * периода отображения данных
         *
         * @see this.data.dateRange.selected
         *
         * @param {Enum} type  start | end
         * @param {Object} passedData переданные данные от дочернего элемента {date: isoString}
         *
         * @returns {Void}
         */
        setDate(type, passedData) {
            const vm = this;
            if (!vm.mounted) return;

            let start = strip(vm.dateRange.selected.start);
            let end = strip(vm.dateRange.selected.end);

            // ранний выход если не задана одна из дат
            if (!end || !start) {
                vm.dateRange.selected[type] = passedData.date;
                return;
            }

            const compareDate = type === "start" ? end : start;

            // если задается начальная дата, сравнить не превышает ли конечную дату и если да, то поменять
            if (
                type === "start" &&
                new Date(compareDate) < new Date(passedData.date)
            ) {
                vm.dateRange.selected.end = passedData.date;
                vm.dateRange.selected.start = end;
                return;
            }
            // если задается конечная дата, сравнить не меньше ли чем начальная дату и если да, то поменять
            else if (
                type === "end" &&
                new Date(compareDate) > new Date(passedData.date)
            ) {
                vm.dateRange.selected.start = passedData.date;
                vm.dateRange.selected.end = start;
                return;
            }

            vm.dateRange.selected[type] = passedData.date;

            return;
        },

        /**
         * Изменяет выбранный период
         *
         * @see this.data.dateRange.display
         *
         * @param {Object} dates {start: isoString, end: isoString}
         */
        updateDisplayPeriod(dates) {
            this.dateRange.display = dates;
        },
    },
};

export default task;
