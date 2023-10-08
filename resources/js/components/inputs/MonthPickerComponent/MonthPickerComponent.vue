<!-- Компонент выбора месяца-->

<template>
    <div class="month-picker">
        <button
            type="button"
            class="btn btn-borders"
            @click="showDropdown = true"
        >
            {{ monthName }} {{ year }} <i class="fa-calendar-o fa"></i>
        </button>

        <div class="month-picker__dropdown" v-if="showDropdown">
            <div class="d-flex align-content-between w-100">
                <button class="btn" type="button" @click="chaYear(-1)">
                    <i class="fa fa-caret-left"></i>
                </button>
                <span class="align-self-center flex-grow-1 text-center">
                    {{ year }}
                </span>
                <button
                    class="btn"
                    type="button"
                    :disabled="disableNextYear"
                    @click="chaYear(1)"
                >
                    <i class="fa fa-caret-right"></i>
                </button>
            </div>

            <div class="row">
                <div
                    class="col-4"
                    v-for="(month, key) in months"
                    :key="'month' + key"
                >
                    <button
                        class="btn w-100 p-2"
                        type="button"
                        @click="setMonth(key + 1)"
                    >
                        {{ month }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//  хэлперы
import moment from "moment";
export default {
    data() {
        return {
            year: null, // выбранный год
            month: null, // номер выбранного месяца начиная с 1
            showDropdown: false, // отображение выпадающего спика
        };
    },

    computed: {
        /**
         *проверка возможножности выбрать следующий год после активного
         *
         * @return {Boolean}
         */

        disableNextYear() {
            const vm = this;
            if (!vm.year || !vm.month) return false;
            const date = moment();
            const currentYear = parseInt(date.format("Y"));

            return currentYear <= vm.year;
        },

        /**
         * Перечень имён месяцев
         *
         * @return {Array}
         */
        months() {
            const localeData = moment.localeData();
            return localeData.months();
        },

        /**
         * Имя месяца по индексу this.month
         *
         * @return {String} имя месяца
         */
        monthName() {
            const vm = this;
            if (!vm.month) return "";
            const date = moment(`${vm.year}-${vm.month}-01`);
            return date.format("MMMM");
        },
    },

    mounted() {
        const today = new Date();
        const vm = this;

        // назначение текущего месяца и года выбранными при инициализации
        vm.month = moment(today).format("M");
        vm.year = parseInt(moment(today).format("Y"));
    },
    methods: {
        /**
         * Изменение значения выбранного года
         *
         * @param {Integer} delta - размер изменения года. Для уменьшения использовать отрицательные значения
         *
          @return {Void}
         */
        chaYear(delta) {
            this.year += delta;
            return;
        },

        /**
         * Задает значение месяца
         * и передает родителю данные о месяце и годе
         * Закрывает выпадающий список месяцев
         *
         * @param {Integer} index индекс месяца от 1 до 12
         *
         * @return {Void}
         */
        setMonth(index) {
            const vm = this;
            let fixedIndex = index < 1 ? 1 : index > 12 ? 12 : index;
            vm.month = fixedIndex;
            vm.$emit("selected", { month: fixedIndex, year: vm.year });
            vm.showDropdown = false;
            return;
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
