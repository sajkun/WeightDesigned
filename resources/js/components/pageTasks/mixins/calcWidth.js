//вспомогательные функции
import moment from "moment";

export default {
    props: {
        _format: {
            type: String,
            default: "DD.MM",
            required: false,
        },
    },

    watch: {
        _format(format) {
            this.format = format;
        },
    },

    data() {
        return {
            /**
             * На сколько дней сдвинута дата
             *
             * @var{Integer}
             */
            step: 0,

            format: this._format,
        };
    },

    computed: {
        /**
         * отображаемые дни
         *
         * @param {String} format формат даты в синтаксисе moment.js
         */
        selectedDates() {
            const vm = this;
            return vm.getSelectedDates(this.format);
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
         *
         * @param {String} format формат даты в синтаксисе moment.js
         *
         * @returns {Array<Object}
         */
        getSelectedDates(format = "DD.MM") {
            const vm = this;
            if (!vm.mounted) {
                return [];
            }

            vm.shift = vm.getCellsCount();
            const visibleDates = vm.getVisibleDates(format);

            const start = visibleDates.shift().isoString;
            const end = visibleDates.length
                ? visibleDates.pop().isoString
                : start;

            vm.$emit("showDates", {
                start: start,
                end: end,
            });

            return vm.getVisibleDates(format);
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
         *
         * @param {String} format формат даты в синтаксисе moment.js
         *
         * @returns {Array<Object>}
         */
        getVisibleDates(format = "DD.MM") {
            const vm = this;
            let days = [];
            // вычислить количество ячеек
            const cellsCount = vm.getCellsCount();

            // получить дату начала отображения
            let start = moment(vm.dateRange.start);
            start.add(vm.step, "days");

            days.push({
                formatted: start.format(format),
                isoString: start.toISOString(),
            });

            // сформировать массив отображаемых дат
            for (let shift = 0; shift < cellsCount; shift++) {
                const day = start.add(1, "days");
                days.push({
                    formatted: day.format(format),
                    isoString: day.toISOString(),
                });
            }

            return days;
        },
    },
};
