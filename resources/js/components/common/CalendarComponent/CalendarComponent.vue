<!-- Компонент отображения календаря

    если режим работы дата
    @emit selectedDate: {
                date: string,
             }

    если режим работы период
    @emit selectedPeriod: {
                start:  string,
                end:  string,
             }
-->
<template>
    <div class="w-100 calendar" :class="{ disabled: disabled }">
        <div class="d-flex flex-column w-100">
            <!-- НАЧАЛО БЛОКА
                 кнопки управления месяцами -->
            <div class="d-flex py-3">
                <button
                    class="btn btn-controls"
                    type="button"
                    @click="changeMonth(-1)"
                    :disabled="disabled"
                    v-if="showButtons.prevMonth"
                >
                    <i class="fa fa-solid fa-arrow-circle-left"></i>
                </button>
                <div
                    class="flex-grow-1 col text-center fs-4 align-self-center fw-bold"
                >
                    {{ monthName }}
                    {{ currentYear }}
                </div>
                <button
                    class="btn btn-controls"
                    type="button"
                    @click="changeMonth(1)"
                    :disabled="disabled"
                    v-if="showButtons.nextMonth"
                >
                    <i class="fa fa-solid fa-arrow-circle-right"></i>
                </button>
            </div>
            <!-- КОНЕЦ БЛОКА
                кнопки управления месяцами -->

            <!-- НАЧАЛО БЛОКА
                 дни недели -->
            <div class="d-flex">
                <div
                    class="flex-grow-1 text-center day-name"
                    v-for="(d, key) in days"
                    :key="'day' + key"
                >
                    {{ d }}
                </div>
            </div>
            <!-- КОНЕЦ БЛОКА
                 дни недели -->

            <!-- НАЧАЛО БЛОКА
                дни календаря -->
            <div class="d-flex w-100 flex-wrap">
                <div
                    class="day-cell"
                    v-for="(day, key) in month"
                    :key="'date' + key"
                    :class="{
                        active: day.selected,
                        first: day.first,
                        last: day.last,
                        marked: detectDayMark(day),
                    }"
                >
                    <button
                        class="btn"
                        type="button"
                        v-if="day"
                        :disabled="disabled"
                        @click="selectDay(day.date)"
                    >
                        {{ day.day }}
                    </button>
                </div>
            </div>
            <!-- КОНЕЦ БЛОКА
                 дни календаря -->

            <!-- НАЧАЛО БЛОКА
                кнопки управления -->
            <div class="d-flex pb-2 justify-content-end flex-wrap">
                <button
                    class="btn btn-link"
                    type="button"
                    :disabled="disabled"
                    v-if="showButtons.clear"
                    @click="clearDates"
                >
                    Очистить даты
                </button>
            </div>

            <!-- КОНЕЦ БЛОКА
                 кнопки управления -->
        </div>
    </div>
</template>

<script>
import moment from "moment";
import { strip, clog } from "@/misc/helpers";
export default {
    props: {
        _period: {
            type: Object,
            default: {
                start: null,
                end: null,
            },
            required: false,
        },

        // дни календаря, которые будут выделены как активные
        _markedDays: {
            type: Array,
            default: [],
            required: false,
        },

        // начальная дата для отображения календаря
        _initialDate: {
            type: String,
            default: "",
            required: true,
        },

        // режим работы если true - период, если false дата
        _selectPeriod: {
            type: Boolean,
            default: false,
            required: false,
        },

        //отключение календаря
        _disabled: {
            type: Boolean,
            default: false,
            required: false,
        },
    },

    data() {
        return {
            /**
             * @see _disabled
             */
            disabled: this._disabled,
            /**
             * @see _selectPeriod
             */
            selectPeriod: this._selectPeriod,
            /**
             * @see _initialDate
             */
            initialDate: "",
            startDate: false, // начальная дата для периода или выбранная дата для selectPeriod=false
            endDate: false, // завершающая дата периода
            clickMode: "startDate", //какую дату выбираем, нужен для чередования при selectPeriod=true

            markedDays: this._markedDays,
        };
    },

    mounted() {
        const vm = this;

        // если режим работы дата, задается начальная дата

        const helper = moment(vm._initialDate);
        vm.initialDate = helper.format("YYYY-MM-DD");
        vm.startDate = vm.initialDate;
        vm.endDate = vm.selectPeriod
            ? helper.format("YYYY-MM-DDT23:59:59")
            : false;
    },

    watch: {
        // отслеживание состояние свойства активности,
        _disabled(disabled) {
            this.disabled = disabled;
        },

        // отслеживание состояние свойства начальной даты,
        _initialDate(date) {
            const vm = this;
            const helper = moment(date);
            vm.initialDate = helper.format("YYYY-MM-DD");
            vm.startDate = vm.initialDate;
            clog(date);
        },

        // отслеживание дат
        _period(period) {
            clog(period);
            if (!vm.startDate) {
                const date = new Date(period.start);
                vm.startDate = moment(date).format("YYYY-MM-DD");
            }
            if (!vm.endDate) {
                const date = new Date(period.end);
                vm.endDate = moment(date).format("YYYY-MM-DD");
            }
        },

        // отслеживание изменение дней активности,
        _markedDays(markedDays) {
            this.markedDays = markedDays;
        },

        // отслеживание состояние свойства выбора периода,
        _selectPeriod(select) {
            this.selectPeriod = select;
        },

        selectPeriod() {
            const vm = this;
            //обнуление даты при смене режима выбора периода/даты,
            vm.startDate = false;
            vm.endDate = false;
            vm.clickMode = "startDate";
        },

        endDate(newDate, oldDate) {
            const date = newDate;
            const vm = this;

            if (!date) {
                return;
            }

            if (newDate === oldDate) return;

            //активация событие выбора периода
            vm.$emit("selectedPeriod", {
                start: vm.startDate,
                end: vm.endDate,
            });
        },

        startDate(newDate, oldDate) {
            if (!newDate) return;
            if (newDate === oldDate) return;

            const vm = this;
            if (!vm.selectPeriod) {
                //активация событие выбора даты
                vm.$emit("selectedDate", { date: newDate });
            }
        },
    },

    computed: {
        // дни недели
        days() {
            return ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
        },

        // текущий год
        currentYear() {
            const vm = this;
            let date = !vm.initialDate ? new Date() : new Date(vm.initialDate);
            return date.getFullYear();
        },

        // текущий месяц
        month() {
            return this.getMonthMap();
        },

        //название выбранного месяца
        monthName() {
            const vm = this;
            let date = !vm.initialDate ? new Date() : new Date(vm.initialDate);
            const idx = date.getMonth();
            return this.months[idx];
        },

        // название месяцев
        months() {
            return [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь",
            ];
        },

        //маркер отображения кнопок интерфейса
        showButtons() {
            const vm = this;
            const showClearButton = vm.startDate && vm.endDate;

            return {
                clear: showClearButton,
                nextMonth: true,
                prevMonth: true,
            };
        },
    },

    methods: {
        //смена начальной даты, как результат месяца отображения
        changeMonth(delta) {
            const vm = this;

            if (vm.disabled) {
                return;
            }

            const date = new Date(vm.initialDate);
            date.setMonth(date.getMonth() + delta);
            vm.initialDate = vm.formatDate(date);
        },

        //обнуление выбранных дат
        clearDates() {
            const vm = this;
            vm.startDate = false;
            vm.endDate = false;
        },

        /**
         *форматирование переданной строки или объекта
         *
         * @param {String|Date} _date -
         *
         * @returns {String} "Y-m-d"
         */
        formatDate(_date) {
            const date = new Date(_date);
            const monthFormatted = (date.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const dayFormatted = date.getDate().toString().padStart(2, "0");
            return `${date.getFullYear()}-${monthFormatted}-${dayFormatted}`;
        },

        /**
         * Получает информаци о текущем месяце для формирования календаря
         *
         * @returns {Object}
         */
        getMonthData() {
            const vm = this;
            const date = new Date(vm.initialDate);
            const monthLength = vm.getDaysInMonths(date);
            const weeksNumber = Math.ceil(monthLength / 7) + 1;
            date.setDate(1);

            return {
                length: monthLength, // дней в месяце
                weeks: weeksNumber, // количество дней в неделе
                startOn: date.getDay() === 0 ? 7 : date.getDay(), // номер дня в неделе с которого начинается месяц
                year: date.getFullYear(), // текущий год
                index: date.getMonth(), // индекс месяца 0 - 11
            };
        },

        /**
         * Формирует данные о месяце
         *
         * @returns [{
                *           day: <int|string>день в месяце,
            date: <String> стрка даты Y-m-d,
            last: <boolean>признак последнего выбранного дня,
            first: <boolean>признак первого выбранного дня,
            selected: <boolean>признак выбранного дня,
         * }]
         */

        getMonthMap() {
            const vm = this;
            const data = vm.getMonthData();
            let month = [];

            for (let week = 1; week <= data.weeks; week++) {
                for (let day = 1; day <= 7; day++) {
                    let mayBedate = (week - 1) * 7 + day - data.startOn + 1;
                    mayBedate =
                        mayBedate <= 0 || mayBedate > data.length
                            ? false
                            : mayBedate;

                    if (!mayBedate) {
                        month.push(false);
                    } else {
                        const monthFormatted = (data.index + 1)
                            .toString()
                            .padStart(2, "0");
                        const dayFormatted = mayBedate
                            .toString()
                            .padStart(2, "0");
                        const dateFormatted = `${data.year}-${monthFormatted}-${dayFormatted}`;

                        let selected = vm.startDate
                            ? dateFormatted === vm.startDate
                            : false;

                        let first = false;
                        let last = false;

                        first = vm.startDate
                            ? dateFormatted === vm.startDate
                            : false;

                        if (vm.selectPeriod && vm.endDate && vm.startDate) {
                            const date = new Date(dateFormatted);
                            const start = new Date(vm.startDate);
                            const end = new Date(vm.endDate);
                            selected = date >= start && date <= end;
                            last = vm.endDate === dateFormatted;
                        }

                        if (!vm.selectPeriod || !vm.endDate) {
                            last = first;
                        }
                        month.push({
                            day: mayBedate,
                            date: dateFormatted,
                            last: last,
                            first: first,
                            selected: selected,
                        });
                    }
                }
            }

            return month;
        },

        /**
         * Получает количество дней в месяце
         *
         * @param {String|Date} date
         *
         * @returns {Integer}
         */
        getDaysInMonths(date) {
            const _date = new Date(date);
            const month = _date.getMonth();
            _date.setMonth(month + 1);
            _date.setDate(0);
            return _date.getDate();
        },

        /**
         * Задает дату. Обработчик клика на дату в календаре
         *
         * @param {String} date  Y-m-d
         */
        selectDay(date) {
            const vm = this;
            if (vm.disabled) {
                return;
            }

            if (vm.clickMode === "startDate") {
                vm.startDate = date;
                vm.endDate = false;
            }

            if (vm.clickMode === "endDate") {
                const eDate = new Date(date);
                const sDate = new Date(vm.startDate);

                if (sDate > eDate) {
                    vm.startDate = vm.formatDate(eDate);
                    vm.endDate = vm.formatDate(sDate);
                } else {
                    vm.endDate = date;
                }
            }

            if (vm.selectPeriod) {
                vm.clickMode =
                    vm.clickMode === "startDate" ? "endDate" : "startDate";
            }
        },

        /**
         * Определяет присваивать ли ячейке класс 'marked' по тому заданны дням активности переменная markedDays.  Если массив markedDays пуст, всегда возвращается true
         *
         * @param {Integer} day 1 - 31
         *
         * @return {Boolean} marked
         */
        detectDayMark(day) {
            const vm = this;
            const dates = strip(vm.markedDays);
            let marked = true;

            if (!vm.markedDays.length) {
                return marked;
            }

            if (!day?.date) {
                marked = false;
            }

            return dates.indexOf(day.date) >= 0;
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
