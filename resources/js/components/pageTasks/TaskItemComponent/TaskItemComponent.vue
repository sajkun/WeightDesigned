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
            <div class="col-9 px-0"></div>
        </div>

        <TransitionGroup
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
        >
            <div
                class="row m-0 overflow-hidden expandable-content employee-name"
                v-show="expanded"
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
                <div class="col-9 px-0"></div>
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
import moment from "moment";
import { strip, clog } from "@/misc/helpers";

//миксины
import animateExpand from "@/mixins/animateExpand";
import formatName from "@/mixins/formatName";
import icons from "@/mixins/icons";
export default {
    mixins: [animateExpand, formatName, icons],
    watch: {
        _info: {
            handler(info) {
                this.info = info;
            },
            deep: true,
        },

        _displayedPeriod: {
            handler(period) {
                this.displayedPeriod = period;
            },
            deep: true,
        },
    },
    props: {
        _displayedPeriod: {
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
            displayedPeriod: this._displayedPeriod,

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
        };
    },
    methods: {
        /**
         * Инициализирует всплывающее окно с сотрудниками
         *
         * @returns {Void}
         */
        addEmployee() {
            const vm = this;
            vm.$emit("addEmployee", vm.info);
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
