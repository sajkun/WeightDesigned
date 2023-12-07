<!-- Компонент отображения заданного месяца и года. Модицирует дату на +1 или -1 месяц и эмитит в родителя -->
<template>
    <div class="component-wrapper d-flex justify-content-between" ref="wrapper">
        <button class="btn" v-on:click="changeMonth(-1)">
            <i class="fa fa-solid fa-chevron-left"></i>
        </button>
        <span>{{ month }} {{ year }}</span>
        <button class="btn" v-on:click="changeMonth(1)">
            <i class="fa fa-solid fa-chevron-right"></i>
        </button>
    </div>
</template>

<script>
//вспомогательные функции
import moment from "moment";

export default {
    watch: {
        _baseDate(baseDate) {
            this.baseDate = baseDate;
        },
    },
    computed: {
        /**
         * Определяет имя месяца по заданной дате
         *
         * @returns {ENUM} имя месяца
         */
        month() {
            const vm = this;
            const month = moment(vm.baseDate).format("MMMM");
            return month;
        },

        /** Определяет год по заданной дате
         *
         * @returns {String} номер года
         */
        year() {
            const vm = this;
            const year = moment(vm.baseDate).format("YYYY");
            return year;
        },
    },
    props: {
        /**
         * Опорная дата, в зависимости от которой отображается месяц и год
         * Унаследована от родителя
         *
         * @var {ISOString}
         */
        _baseDate: {
            type: String,
            default: new moment().startOf("day").toISOString(),
            required: false,
        },
    },
    data() {
        return {
            /**
             * Опорная дата, в зависимости от которой отображается месяц и год
             *
             * @var {ISOString}
             */
            baseDate: this._baseDate,
        };
    },
    methods: {
        /**
         * Модифицирует парамет baseDate на заданное количество месяцев
         *
         * @param {Number} delta  Количество месяцев для добавление или отнимания от текущей даты
         *
         * @returns {Void}
         */
        changeMonth(delta) {
            const vm = this;
            let date = moment(vm.baseDate);
            date.add(delta, "M");
            vm.baseDate = date.toISOString();

            vm.$nextTick(() => {
                vm.$emit("changeDate", { date: vm.baseDate });
            });
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
