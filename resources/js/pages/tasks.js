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
import formatName from "@/mixins/formatName";
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
    mixins: [
        axiosRequests,
        crud,
        formatName,
        messagesMixin,
        publicAuthData,
        vehicleTypes,
    ],

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
         * Возвращает отфильтрованный в зависимости от типа выбранной техники массив сотрудников
         *
         * @returns {Array<Object>}
         * @see App\Models\Employee
         */
        employeesByPoffesion() {
            const vm = this;
            let employees = vm.employees;
            employees = employees.filter((e) => {
                return (
                    e.specialisation ===
                    vm.vehiclesProfessions[vm.vehicleSelected.type]
                );
            });
            return employees;
        },

        /**
         * Список комбайнов  вместе с сотрудниками, назначенными для них
         *
         * @returns {Array}
         */
        harvesters() {
            const vm = this;
            let items = this.vehicles?.harvesters;

            if (!items) {
                return [];
            }

            items = items.map((h) => {
                h["employees"] = vm.vehiclesEmployeesDeps[h.id]
                    ? Array.from(vm.vehiclesEmployeesDeps[h.id])
                    : [];
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
            const vm = this;
            let items = this.vehicles?.transporters;

            if (!items) {
                return [];
            }

            items = items.map((h) => {
                h["employees"] = vm.vehiclesEmployeesDeps[h.id]
                    ? Array.from(vm.vehiclesEmployeesDeps[h.id])
                    : [];
                return h;
            });

            return items;
        },

        /**
         * Соответствие типа техники и профессии механизатора, который может на ней работать
         *
         * @returns {Object}
         */
        vehiclesProfessions() {
            const data = {
                bunker: "Водитель Трактора",
                tractor: "Водитель Трактора",
                transporter: "Водитель Зерновоза",
                harvester: "Водитель Комбайна",
                group: "Водитель Трактора",
            };

            return data;
        },
    },

    data() {
        return {
            /**
             * Имя модального окна для отображения или false если окно не нужно отображать
             * @var {String | false}
             */
            activeModal: false,

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
             * @var {Object}
             */
            employees: {},

            /**
             * список групп техники организации
             * @var {Object}
             */
            groups: {},

            /**
             * признак смонтированности приложения
             * @var {Boolean}
             */
            mounted: false,

            /**
             * список техники организации
             * @var {Object}
             */
            vehicles: {},

            /**
             * Зависимости между сотрудником и техникой для формирования расписания
             * Ключ объекта это id единицы техники, значение это массив сотрудников
             */
            vehiclesEmployeesDeps: {},

            /**
             * Экзепляр техники для которого происходит добавления работника из модального окна
             *
             * @var {Object}
             */
            vehicleSelected: {},
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
         * Показывает всплывающее окно со списком сотрудников
         * задает единицу техники для которой будет осуществляться выбор сотрудника
         *
         * @param {Object} vehicle
         * @see App\Models\Vehicle
         */
        addEmployeeHandler(vehicle) {
            clog("addEmployeeHandler", strip(vehicle));
            const vm = this;
            vm.activeModal = "employees";
            vm.vehicleSelected = vehicle;
        },

        /**
         * Добавляет сотрудника к технике, для формирования сменного задания
         *
         * @param {Object} employee
         * @see App\Models\Employee
         */
        applyEmployee(employee) {
            const vm = this;
            clog("applyEmployee", strip(employee));
            clog("vehicleSelected", strip(vm.vehicleSelected));

            if (!vm.vehiclesEmployeesDeps[vm.vehicleSelected.id]) {
                vm.vehiclesEmployeesDeps[vm.vehicleSelected.id] = new Set();
            }

            vm.vehiclesEmployeesDeps[vm.vehicleSelected.id].add(employee);
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
