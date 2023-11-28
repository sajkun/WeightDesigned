<template>
    <div class="component-wrapper" ref="wrapper">
        <button class="btn" @click="shiftPeriod('-1')" v-if="showNavigation">
            -
        </button>
        <div class="row">
            <div
                class="col text-center"
                v-for="(date, key) in selectedDates"
                :key="'day' + key"
            >
                {{ date.formatted }}
            </div>
        </div>
        <button class="btn" @click="shiftPeriod('1')" v-if="showNavigation">
            +
        </button>
    </div>
</template>

<script>
import moment from "moment";
import { strip, clog } from "@/misc/helpers";

export default {
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
            return vm.getDiplayDates();
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
            // @see _dateRange
            dateRange: this._dateRange,
            /**
             * признак показывающий, что компонент смонтироваy
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
        getDiplayDates() {
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

<style scoped src="./style/index.scss" lang="scss"></style>
