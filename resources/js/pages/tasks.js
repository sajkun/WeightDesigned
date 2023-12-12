/**
 * Страница работ со сменными заданиями
 */

//вспомогательные функции
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
import ChooseTimeModalComponent from "@/components/pageTasks/ChooseTimeModalComponent";
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
        item: TaskItemComponent,
        messages: MessagesComponent,
        modal: ModalComponent,
        modalTime: ChooseTimeModalComponent,
        search: SearchComponent,
    },

    watch: {
        tasks: {
            handler() {
                const vm = this;
                vm.createDeps();
            },
            deep: true,
        },

        dateRange: {
            handler() {
                const vm = this;
                vm.createDeps();
            },
            deep: true,
        },
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
             * @var {Enum | False} :  chooseTime | employee
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
             * @var {Array}
             */
            employees: [],

            /**
             * список групп техники организации
             * @var {Array}
             */
            groups: [],

            /**
             * признак смонтированности приложения
             * @var {Boolean}
             */
            mounted: false,

            /**
             *
             */
            tasks: [],

            /**
             *
             */
            taskDate: null,

            /**
             *
             */
            taskSelected: {},

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

            /**
             * @var {Object}
             */
            mayBeTask: {},
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

        /**
         * Получение списка заданий
         */
        vm.getTasks().then((e) => {
            vm.tasks = e.tasks;
        });

        vm.$nextTick(() => {
            vm.mounted = true;
        });
    },

    methods: {
        /**
         * Добавляет сотрудника к технике, для формирования сменного задания
         *
         * @param {Object} employee
         * @see App\Models\Employee
         */
        applyEmployee(employee) {
            const vm = this;
            vm.setEmployeeVehicleTask(employee, vm.vehicleSelected.id);

            vm.$nextTick(() => {
                vm.closeModal();
            });
        },

        async checkTask() {
            return true;
        },

        /**
         * Скрытие модальных окон
         */
        closeModal() {
            this.activeModal = false;
        },

        /**
         * формирует зависимости между рабочим и
         */
        createDeps() {
            const vm = this;
            const tasks = this.tasks;

            if (!vm.employees.length) {
                return;
            }

            if (!Object.values(vm.vehicles).length) {
                return;
            }

            vm.vehiclesEmployeesDeps = {};

            for (const task of strip(tasks)) {
                const employee = vm.employees
                    .filter((e) => e.id === task.employee_id)
                    .pop();

                vm.setEmployeeVehicleTask(employee, task.vehicle_id);
            }
        },

        /**
         * удаление сменного задания
         *
         * @param {Object} data
         */
        deleteTask(data) {
            const vm = this;

            const sendData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                delete_item_id: data.taskId,
                name: "Сменное задание",
            };

            const doClose = () => {
                vm.closeModal();
                vm.getTasks().then((e) => {
                    vm.tasks = e.tasks;
                });
                document.removeEventListener("updateList", doClose, false);
            };

            document.addEventListener("updateList", doClose);

            vm.deleteEntity(sendData, `/tasks/delete`);
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
         * формирование задания и добавление его в массив заданий
         *
         * @param {Object} data
         */
        setTask(data) {
            const vm = this;

            vm.checkTask().then((checkSucceed) => {
                if (!checkSucceed) {
                    vm.messages.error = "Такое задание создать невозможно";
                    return;
                }

                vm.closeModal();

                const task = {
                    vehicle_id: vm.mayBeTask.vehicle.id,
                    employee_id: vm.mayBeTask.employee.id,
                    start: data.start,
                    end: data.end,
                    comment: data.comment,
                };

                vm.storeTask(task).then((response) => {
                    vm.tasks.push(response.data.new_task);
                });
            });
        },

        /**
         * Устанавливает взаимосвязь между техникой и рабочим для сменного задания
         *
         * @param {Object} employee
         * @param {Number} vehicle_id
         */
        setEmployeeVehicleTask(employee, vehicle_id) {
            if (!employee) {
                return;
            }

            if (!vehicle_id && vehicle_id !== 0) {
                return;
            }

            const vm = this;
            if (!vm.vehiclesEmployeesDeps[vehicle_id]) {
                vm.vehiclesEmployeesDeps[vehicle_id] = new Set();
            }

            vm.vehiclesEmployeesDeps[vehicle_id].add(employee);
        },

        /**
         * Показывает всплывающее окно с возможностью задавать время смены для сотрудника
         *
         * @param {Object} data\
         *
         * @returns {Void}
         */
        showChooseTimeModal(data) {
            clog(
                "%c showChooseTimeModal",
                "color: yellow; font-style:italic",
                data
            );

            const vm = this;
            vm.activeModal = "chooseTime";
            vm.taskDate = data.date.isoString;

            if (data.taskId) {
                vm.taskSelected = vm.tasks
                    .filter((t) => data.taskId === t.id)
                    .pop();
            } else {
                vm.taskSelected = {};
            }

            vm.mayBeTask = {
                employee: data.employee,
                vehicle: data.vehicle,
            };
        },

        /**
         * Показывает всплывающее окно со списком сотрудников
         * задает единицу техники для которой будет осуществляться выбор сотрудника
         *
         * @param {Object} vehicle
         * @see App\Models\Vehicle
         */
        showEmployeesModal(vehicle) {
            clog("addEmployeeHandler", strip(vehicle));
            const vm = this;
            vm.activeModal = "employees";
            vm.vehicleSelected = vehicle;
        },

        /**
         * показывает сообщение
         *
         * @param {Object} message
         */
        showMessage(message) {
            this.messages[message.type] = message.text;
        },

        async storeTask(task) {
            const vm = this;
            const data = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                task: task,
            };

            return vm
                .createEntity(data, "/tasks/store")
                .then((response) => {
                    return response;
                })
                .catch((e) => {
                    return e.response;
                });
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
