<template>
    <div class="component-wrapper" :class="{ expanded: expanded }">
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

        <TransitionGroup
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
            v-if="expanded"
            tag="div"
        >
            <div
                class="row m-0 overflow-hidden expandable-content employee-name align-items-center"
                v-for="(employee, key) in info.employees"
                :key="'empl' + key"
            >
                <div class="col-3 text-left border-right ps-3">
                    {{
                        formatName(
                            employee.last_name,
                            employee.first_name,
                            employee.middle_name
                        )
                    }}
                </div>
                <div class="col-9 px-0">
                    <div class="time-component">
                        <div class="row">
                            <div
                                class="col"
                                v-for="(date, key) in selectedDates"
                                :key="'date' + key"
                            >
                                <button
                                    class="btn btn-borders w-100 p-1 btn-sm"
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
        </TransitionGroup>

        <Transition
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
        >
            <div
                class="row m-0 overflow-hidden expandable-content"
                v-show="expanded"
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

//миксины
import animateExpand from "@/mixins/animateExpand";
import calcWidth from "@/components/pageTasks/mixins/calcWidth";
import formatName from "@/mixins/formatName";
import icons from "@/mixins/icons";
export default {
    mixins: [animateExpand, calcWidth, formatName, icons],
    watch: {
        _info: {
            handler(info) {
                this.info = info;
            },
            deep: true,
        },

        _dateRange: {
            handler(period) {
                this.dateRange = period;
            },
            deep: true,
        },
    },
    props: {
        _dateRange: {
            type: Object,
            default: {
                start: null,
                end: null,
            },
            required: true,
        },

        _info: {
            type: Object,
            default: {},
            required: true,
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
             * признак показывающий, что компонент смонтирован
             *
             *  @var{Boolean}
             */
            mounted: false,
        };
    },

    mounted() {
        const vm = this;

        vm.$nextTick(() => {
            vm.mounted = true;
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
         * @param {Object} date - данные о дате {formatted: xx.xx, iso: isoString}
         * @param {Object} employee
         * @see App\Models\Employee
         *
         * @returns {Void}
         */
        chooseTime(date, employee) {
            const vm = this;
            vm.$emit("chooseTimeRequest", {
                date,
                employee: strip(employee),
                vehicle: strip(vm.info),
            });
        },

        /**
         * сворачивает и разорачивает содержимое блока
         *
         * @param {Boolean} mode
         *
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
