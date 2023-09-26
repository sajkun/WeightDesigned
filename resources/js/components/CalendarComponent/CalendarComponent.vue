<template>
    <div class="w-100 calendar">
        <div class="d-flex flex-column w-100">
            <div class="d-flex py-3">
                <button
                    class="btn btn-controls"
                    type="button"
                    @click="changeMonth(-1)"
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
                >
                    <i class="fa fa-solid fa-arrow-circle-right"></i>
                </button>
            </div>
            <div class="d-flex">
                <div
                    class="flex-grow-1 text-center day-name"
                    v-for="(d, key) in days"
                    :key="'day' + key"
                >
                    {{ d }}
                </div>
            </div>
            <div class="d-flex w-100 flex-wrap">
                <div
                    class="week-cell"
                    v-for="(day, key) in month"
                    :key="'date' + key"
                    :class="{ active: day.selected }"
                >
                    <button
                        class="btn"
                        type="button"
                        v-if="day"
                        @click="selectDay(day.date)"
                    >
                        {{ day.day }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { strip, clog } from "../../misc/helpers";
export default {
    props: {
        _startDate: {
            type: String,
            default: "",
            required: true,
        },
    },

    watch: {
        _startDate(date) {
            this.startDate = date;
        },
    },

    computed: {
        days() {
            return ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
        },

        month() {
            return this.getMonthMap();
        },

        currentYear() {
            const vm = this;
            let date = !vm.startDate ? new Date() : new Date(vm.startDate);
            return date.getFullYear();
        },

        monthName() {
            const vm = this;
            let date = !vm.startDate ? new Date() : new Date(vm.startDate);
            const idx = date.getMonth();
            return this.months[idx];
        },

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
    },

    mounted() {
        // this.getMonthMap();
    },

    data() {
        return {
            startDate: this._startDate,
            selectedDate: false,
        };
    },
    methods: {
        changeMonth(delta) {
            const vm = this;
            const date = new Date(vm.startDate);
            date.setMonth(date.getMonth() + delta);

            const monthFormatted = (date.getMonth() + 1)
                .toString()
                .padStart(2, "0");
            const dayFormatted = date.getDate().toString().padStart(2, "0");
            vm.startDate = `${date.getFullYear()}-${monthFormatted}-${dayFormatted}`;
        },

        getMonthData() {
            const vm = this;
            const date = new Date(vm.startDate);
            const monthLength = vm.getDaysInMonths(date);
            const weeksNumber = Math.ceil(monthLength / 7) + 1;
            date.setDate(1);

            return {
                length: monthLength,
                weeks: weeksNumber,
                startOn: date.getDay() === 0 ? 7 : date.getDay(),
                year: date.getFullYear(),
                index: date.getMonth(),
            };
        },

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
                        const selected = vm.selectedDate
                            ? dateFormatted === vm.selectedDate
                            : false;

                        month.push({
                            day: mayBedate,
                            date: dateFormatted,
                            selected: selected,
                        });
                    }
                }
            }

            return month;
        },

        getDaysInMonths(date) {
            const _date = new Date(date);
            const month = _date.getMonth();
            _date.setMonth(month + 1);
            _date.setDate(0);
            return _date.getDate();
        },

        selectDay(date) {
            this.selectedDate = date;
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
