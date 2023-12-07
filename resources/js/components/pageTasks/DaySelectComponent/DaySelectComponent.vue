<template>
    <div class="component-wrapper row align-items-center" ref="wrapper">
        <TransitionGroup :css="false" name="sort">
            <div
                class="col text-center"
                v-for="(date, key) in selectedDates"
                :key="'day' + date + key"
            >
                <button
                    class="btn px-1"
                    ref="btnPrev"
                    @click="shiftPeriod('-1')"
                    v-if="showNavigation(key, 'start')"
                >
                    <i v-html="arrowLeftIcon"></i>
                </button>
                <span v-if="!canSelectDate">
                    {{ date.formatted }}
                </span>
                <button
                    v-else
                    class="btn"
                    v-on:click="selectDate(date)"
                    :class="{ selected: date.isoString === currentDate }"
                >
                    {{ date.formatted }}
                </button>
                <button
                    class="btn px-1"
                    ref="btnNext"
                    @click="shiftPeriod('1')"
                    v-if="showNavigation(key, 'end')"
                >
                    <i v-html="arrowRightIcon"></i>
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
//вспомогательные функции
import moment from "moment";
import { strip, clog } from "@/misc/helpers";

//миксины
import icons from "@/mixins/icons";
import calcWidth from "@/components/pageTasks/mixins/calcWidth";

export default {
    mixins: [icons, calcWidth],

    watch: {
        /**
         * Обновления значения текущей даты от родительского элемента
         *
         * @param {String} currentDate
         */
        _currentDate(currentDate) {
            const vm = this;
            vm.currentDate = currentDate;
        },

        /**
         * Обновления значения диапазона дат от родительского элемента
         *
         * @param {Object} dateRange
         */
        _dateRange: {
            handler(dateRange) {
                this.dateRange = dateRange;
            },
            deep: true,
        },

        /**
         * Отслеживания состояния компонента
         *
         * @param {Boolean} mounted
         */
        mounted(mounted) {
            const vm = this;

            if (mounted) {
                vm.shift = vm.getCellsCount();
                vm.updateStepByDate();
            }
        },
    },

    props: {
        _currentDate: {
            type: String,
            default: "",
            required: false,
        },

        /**
         * Признак можно ли выбирать дату по клику
         */
        _canSelectDate: {
            type: Boolean,
            default: false,
            required: false,
        },

        /**
         * Диапазон предельных значений дат компонента
         */
        _dateRange: {
            type: Object,
            default: {
                start: null,
                end: null,
            },
            required: true,
        },
    },
    data() {
        const vm = this;

        return {
            /**
             * @var{Boolean}
             */
            canSelectDate: vm._canSelectDate,

            /**
             * @var {ISOString}
             */
            currentDate: vm._currentDate,

            /**
             *  @see _dateRange
             */
            dateRange: vm._dateRange,

            /**
             * признак показывающий, что компонент смонтирован
             *
             *  @var{Boolean}
             */
            mounted: false,

            /**
             * На сколько дней сдвигать отображаемую дату
             *
             * @var{Integer}
             */
            shift: 0,
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
         * Эмитит переданную дату
         *
         * @param {Object} date
         */
        selectDate(date) {
            const vm = this;
            vm.currentDate = date.isoString;
            vm.$emit("selectDate", { date });
        },

        /**
         *
         * @param {Enum} modificator  1 |-1
         */
        shiftPeriod(modificator) {
            const vm = this;
            let mayBeStep = strip(vm.step);
            mayBeStep += vm.shift * modificator;
            mayBeStep = Math.max(0, mayBeStep);

            const start = moment(vm.dateRange.start);
            const end = moment(vm.dateRange.end);
            const diff = end.diff(start, "days");

            const maxValue = diff - vm.shift;
            mayBeStep = Math.min(maxValue, mayBeStep);

            vm.step = mayBeStep;
        },

        /**
         * Признак отображать или не отображать навигационные стрелки
         *
         * @param {key} integer
         * @param {Enum} type start|end
         *
         * @return {Boolean}
         */
        showNavigation(key, type) {
            const vm = this;
            if (!vm.mounted) {
                return false;
            }
            const start = moment(vm.dateRange.start);
            const end = moment(vm.dateRange.end);

            const datesParam = end.diff(start, "days") > vm.getCellsCount();
            const typeParam =
                (key === 0 && type === "start") ||
                (key === vm.selectedDates.length - 1 && type === "end");

            return typeParam && datesParam;
        },

        updateStepByDate() {
            const vm = this;
            if (!vm.currentDate) return;
            const start = moment(vm.dateRange.start);
            const end = moment(vm.currentDate);
            const delta = Math.floor(vm.getCellsCount() / 2);
            const step = end.diff(start, "days") - delta;

            vm.step = Math.max(0, step);
        },
    },
};
</script>

<style scoped lang="scss">
.btn {
    &:hover {
        background-color: var(--grey-ultralight);
    }
}

.row {
    --bs-gutter-x: 0.5em;
}

.btn.selected {
    --bs-btn-border-color: var(--green);
}
</style>
