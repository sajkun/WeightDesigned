<template>
    <div class="component-wrapper">
        <div class="d-flex align-items-center">
            <button
                class="btn"
                ref="btnPrev"
                @click="shiftPeriod('-1')"
                v-if="showNavigation"
            >
                <i v-html="arrowLeftIcon"></i>
            </button>
            <div class="row flex-grow-1" ref="wrapper">
                <TransitionGroup :css="false" name="sort">
                    <div
                        class="col text-center"
                        v-for="(date, key) in selectedDates"
                        :key="'day' + date + key"
                    >
                        {{ date.formatted }}
                    </div>
                </TransitionGroup>
            </div>
            <button
                class="btn"
                ref="btnNext"
                @click="shiftPeriod('1')"
                v-if="showNavigation"
            >
                <i v-html="arrowRightIcon"></i>
            </button>
        </div>
    </div>
</template>

<script>
//вспомогательные функции
import moment from "moment";
import { strip, clog } from "@/misc/helpers";

//миксины
import icons from "@/mixins/icons";

export default {
    mixins: [icons],

    watch: {
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
            }
        },
    },

    computed: {
        /**
         * отображаемые дни
         */
        selectedDates() {
            const vm = this;
            if (!vm.mounted) {
                return [];
            }

            vm.shift = vm.getCellsCount();
            const visibleDates = vm.getVisibleDates();

            const start = visibleDates.shift().isoString;
            const end = visibleDates.length
                ? visibleDates.pop().isoString
                : start;

            vm.$emit("showDates", {
                start: start,
                end: end,
            });

            return vm.getVisibleDates();
        },

        /**
         * Признак отображать или нет навигационные стрелки
         *
         * @return {Boolean}
         */
        showNavigation() {
            const vm = this;
            if (!vm.mounted) {
                return false;
            }
            const start = moment(vm.dateRange.start);
            const end = moment(vm.dateRange.end);
            return end.diff(start, "days") > vm.getCellsCount();
        },
    },

    props: {
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
        return {
            /**
             *  @see _dateRange
             */
            dateRange: this._dateRange,

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

            /**
             * На сколько дней сдвинута дата
             *
             * @var{Integer}
             */
            step: 0,
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
         * Вычисляет максимальное количество ячеек
         *
         * @returns {Integer} >=1
         */
        getCellsCount() {
            const vm = this;
            const cellWidth = vm.getSingleCellWidth();
            const wrapperWidth = vm.getTotalWidth();
            let count = Math.floor(wrapperWidth / cellWidth);

            const start = moment(vm.dateRange.start);
            const end = moment(vm.dateRange.end);
            const diff = end.diff(start, "days");
            count = Math.max(count, 1);
            return Math.min(count, diff);
        },

        /**
         * Генерирует ряд видимых дат
         */
        getVisibleDates() {
            const vm = this;
            let days = [];
            // вычислить количество ячеек
            const cellsCount = vm.getCellsCount();

            // получить дату начала отображения
            let start = moment(vm.dateRange.start);
            start.add(vm.step, "days");

            days.push({
                formatted: start.format("DD.MM"),
                isoString: start.toISOString(),
            });

            // сформировать массив отображаемых дат
            for (let shift = 0; shift < cellsCount; shift++) {
                const day = start.add(1, "days");
                days.push({
                    formatted: day.format("DD.MM"),
                    isoString: day.toISOString(),
                });
            }

            return days;
        },

        /**
         * Вычисляет ширину ячейким с датой в зависимости от размера шрифта
         *
         * @returns {AbsInt}
         */
        getSingleCellWidth() {
            const vm = this;
            if (!vm.mounted) return;
            const fontSize = window
                .getComputedStyle(vm.$refs.wrapper, null)
                .getPropertyValue("font-size");

            return parseInt(fontSize) * 6;
        },

        /**
         * Вычисляется доступная ширина для компонента
         */
        getTotalWidth() {
            const vm = this;
            if (!vm.mounted) return;
            const wrapperWidth = parseInt(vm.$refs?.wrapper.offsetWidth);
            const fontSize = window
                .getComputedStyle(vm.$refs.wrapper, null)
                .getPropertyValue("font-size");
            return wrapperWidth - 3 * parseInt(fontSize);
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
    },
};
</script>

<style scoped lang="scss">
.btn {
    &:hover {
        background-color: var(--grey-ultralight);
    }
}
</style>
