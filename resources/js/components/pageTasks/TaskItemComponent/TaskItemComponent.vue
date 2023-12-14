<!--
Строка сменных задач, ограниченная временным интервалом
Сгруппированная одной единицы техники или группы техник
в качестве дочерних элементов выступаю сотрудники, назначенные на работу с данной техникой
 и сменные задания, выполняемы на этой технике
-->

<template>
    <div class="component-wrapper task-item" :class="{ expanded: expanded }">
        <div class="row m-0">
            <div class="col-3 px-0 border-right">
                <button
                    class="btn-switcher p-2"
                    type="button"
                    @click="toggleExpand()"
                >
                    <p
                        class="m-0 d-flex justify-content-between align-items-center"
                    >
                        <span>{{ info.name }}</span>
                        <i class="fa fa-chevron-down"></i>
                    </p>
                </button>
            </div>
            <div class="col-9 px-0">
                <div class="time-component">
                    <div class="row" ref="wrapper"></div>
                </div>
            </div>
        </div>
        <Transition
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter"
            v-on:before-leave="beforeLeave"
            v-on:leave="leave"
        >
            <div v-if="expanded" class="transition-height overflow-hidden">
                <div
                    class="row m-0 overflow-hidden expandable-content employee-name"
                    v-for="(employee, key) in employees"
                    :key="'empl' + key"
                >
                    <div class="col-3 text-left border-right ps-3">
                        <div class="d-flex h-100 align-items-top">
                            <span class="pt-2">
                                {{
                                    formatName(
                                        employee.last_name,
                                        employee.first_name,
                                        employee.middle_name
                                    )
                                }}
                            </span>
                        </div>
                    </div>
                    <div class="col-9 px-0">
                        <div class="time-component px-1">
                            <div class="row">
                                <div
                                    class="col align-self-top"
                                    v-for="(date, key) in selectedDates"
                                    :key="'date' + key"
                                >
                                    <div v-if="employee.tasks[date.formatted]">
                                        <button
                                            class="btn btn-primary-alt w-100 p-1 btn-sm my-1"
                                            type="button"
                                            @click="
                                                chooseTime(
                                                    date,
                                                    employee,
                                                    task.id
                                                )
                                            "
                                            v-for="(task, key2) in employee
                                                .tasks[date.formatted]"
                                            :key="key + 'task' + key2"
                                        >
                                            {{ task.start }} - {{ task.end }}
                                        </button>
                                    </div>
                                    <button
                                        class="btn btn-borders w-100 p-1 btn-sm my-1"
                                        type="button"
                                        @click="chooseTime(date, employee)"
                                        :title="
                                            'добавить расписание на ' +
                                            date.formatted
                                        "
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <Transition
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:after-enter="afterEnter"
            v-on:before-leave="beforeLeave"
            v-on:leave="leave"
        >
            <div
                class="row m-0 overflow-hidden expandable-content"
                v-show="expanded"
                v-if="employeesAvailable.length > 0"
            >
                <div class="col-3 text-left border-right ps-3">
                    <button
                        type="button"
                        class="button-add my-2"
                        @click="addEmployee"
                    >
                        + Добавить механизатора
                    </button>
                </div>
                <div class="col-9 px-0"></div>
            </div>
        </Transition>
    </div>
</template>

<script>
//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import animateExpand from "@/mixins/animateExpand";
import calcWidth from "@/components/pageTasks/mixins/calcWidth";
import formatName from "@/mixins/formatName";
import icons from "@/mixins/icons";
export default {
    mixins: [animateExpand, calcWidth, formatName, icons],
    watch: {
        /**
         * Наследование значений параметра от родителя
         */
        _info: {
            handler(info) {
                this.info = info;

                if (info.employees.length) {
                    this.expanded = true;
                }
            },
            deep: true,
        },

        /**
         * Наследование значений параметра от родителя
         */
        _dateRange: {
            handler(period) {
                this.dateRange = period;
            },
            deep: true,
        },

        /**
         * Наследование значений параметра от родителя
         */
        _employeesAvailable: {
            handler(employeesAvailable) {
                this.employeesAvailable = employeesAvailable;
            },
            deep: true,
        },

        /**
         * Наследование значений параметра от родителя
         */
        _tasks: {
            handler(tasks) {
                this.tasks = tasks;
            },
            deep: true,
        },
    },

    computed: {
        /**
         * @returns {Array}
         */
        employees() {
            const vm = this;
            let employees = strip(vm.info.employees);

            for (const id in employees) {
                let tasks = {};
                let tasksCount = 0;

                for (const date of vm.selectedDates) {
                    const task = vm.checkTask(date, employees[id]);
                    tasks[date.formatted] = task;
                    tasksCount = task ? tasksCount + 1 : tasksCount;
                }

                employees[id].tasks = tasks;
            }

            return employees;
        },

        /**
         * Задачи  назначенные на технику данного компонента
         *
         * @returns {Array}
         */
        vehicleTasks() {
            const vm = this;
            const task = vm.tasks.filter((t) => {
                return t.vehicle_id === vm.info.id;
            });
            return task;
        },
    },

    props: {
        /**
         * Выбранный диапазон значений для отображения
         * @var {Object<key:ISOString>}
         */
        _dateRange: {
            type: Object,
            default: {
                start: null,
                end: null,
            },
            required: true,
        },

        /**
         * Данные о единице техники
         * @var {Object}
         */
        _info: {
            type: Object,
            default: {},
            required: true,
        },

        /**
         * доступные для назначения работники
         * @see app/Models/Employee
         */
        _employeesAvailable: {
            type: Array,
            default: [],
            required: false,
        },

        /**
         * Массив сменных заданий
         * @var{Array<SessionTask>}
         * @see app/Models/SessionTask
         */
        _tasks: {
            type: Array,
            default: [],
            required: false,
        },
    },

    data() {
        return {
            /**
             * период отображения
             * @var {Object}
             */
            dateRange: this._dateRange,

            /**
             * Данные о компоненте
             *
             * @var{Object}
             */
            info: this._info,

            /**
             * Признак отображения или скрытия компонента
             *
             * @var {Boolean}
             */
            expanded: false,

            /**
             * доступные к назначению рабочие
             * @var {Array}
             */
            employeesAvailable: this._employeesAvailable,

            /**
             * признак показывающий, что компонент смонтирован
             *  @var{Boolean}
             */
            mounted: false,

            /**
             * @var {Array}
             */
            tasks: this._tasks,
        };
    },

    mounted() {
        const vm = this;

        vm.$nextTick(() => {
            vm.mounted = true;
            if (vm.info.employees.length) {
                vm.expanded = true;
            }
        });
    },

    methods: {
        /**
         * Эмитит родителю событие addEmployeeRequest
         *
         * @returns {Void}
         */
        addEmployee() {
            const vm = this;
            vm.$emit("addEmployeeRequest", vm.info);
        },

        /**
         * Эмитит родителю событие chooseTimeRequest
         *
         * @param {Object} date - данные о дате {formatted: this.format, isoString: isoString}
         * @param {Object} employee
         * @see App\Models\Employee
         * @param {number} taskId
         * @see App\Models\SessionTask
         *
         * @returns {Void}
         */
        chooseTime(date, employee, taskId = null) {
            const vm = this;
            vm.$emit("chooseTimeRequest", {
                date,
                employee: strip(employee),
                vehicle: strip(vm.info),
                taskId: taskId,
            });
        },

        /**
         * Определяем наличие задания у рабочего в этот день
         *
         * @param {Object} date - данные о дате {formatted: this.format, isoString: isoString}
         * @param {Object} employee
         * @see App\Models\Employee
         */
        checkTask(date, employee) {
            const vm = this;

            const tasks = vm.vehicleTasks.filter((t) => {
                // проверяем, есть ли среди массива заданий задания по рабочему
                const assignedToEmployee = t.employee_id === employee.id;

                // проверяем разницу во времени между заданной датой и датами задания
                const _date = moment(date.isoString).startOf("day");
                const start = moment(t.start).startOf("day");
                const end = moment(t.end).startOf("day");
                const withinDate =
                    Math.abs(_date.diff(start, "days")) === 0 ||
                    Math.abs(_date.diff(end, "days")) === 0;

                return assignedToEmployee && withinDate;
            });

            const tasksDates = tasks.map((t) => {
                const start = moment(t.start);
                const end = moment(t.end);

                return {
                    start: start.format("HH:mm"),
                    end: end.format("HH:mm"),
                    id: t.id,
                };
            });

            if (!tasksDates.length) {
                return false;
            }

            return tasksDates;
        },

        /**
         * сворачивает и разорачивает содержимое блока
         * @param {Boolean} mode
         * @returns {Void}
         */
        toggleExpand(mode) {
            const vm = this;
            vm.expanded = mode ? mode : !vm.expanded;
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
