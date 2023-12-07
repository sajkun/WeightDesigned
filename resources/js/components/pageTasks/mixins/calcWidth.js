//вспомогательные функции
import moment from "moment";

export default {
    data() {
        return {
            /**
             * На сколько дней сдвинута дата
             *
             * @var{Integer}
             */
            step: 0,
        };
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
            return parseInt(fontSize) * 8;
        },

        /**
         * Вычисляется доступная ширина для компонента
         *
         * @returns {Integer} > 0
         */
        getTotalWidth() {
            const vm = this;
            if (!vm.mounted || !vm.$refs?.wrapper) return;
            const wrapperWidth = parseInt(vm.$refs.wrapper.offsetWidth);

            const fontSize = window
                .getComputedStyle(vm.$refs.wrapper, null)
                .getPropertyValue("font-size");

            return wrapperWidth - 3 * parseInt(fontSize);
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
    },
};
