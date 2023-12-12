<!-- Компонент выбора месяца-->
<template>
    <div class="month-picker" v-click-outside="close">
        <!-- отображение выбранного месяца и года -->
        <button
            type="button"
            class="btn btn-borders"
            @click="showDropdown = true"
        >
            {{ monthName }} {{ year }}
            <i class="fa-calendar-o fa"></i>
        </button>
        <!-- ------------------------------------- -->

        <Transition name="fade">
            <!-- выпадающий элемент -->
            <div class="month-picker__dropdown" v-if="showDropdown">
                <!-- выбор года  -->
                <div class="d-flex align-content-between w-100">
                    <button class="btn" type="button" @click="chaYear(-1)">
                        <i class="fa fa-caret-left"></i>
                    </button>
                    <div class="align-self-center flex-grow-1 text-center">
                        <button class="btn" type="button" @click="setMonth(0)">
                            {{ year }}
                        </button>
                    </div>
                    <button
                        class="btn"
                        type="button"
                        :disabled="disableNextYear"
                        @click="chaYear(1)"
                    >
                        <i class="fa fa-caret-right"></i>
                    </button>
                </div>

                <!-- список месяцев -->
                <div class="row">
                    <div
                        class="col-4"
                        v-for="(monthName, key) in months"
                        :key="'month' + key"
                    >
                        <button
                            class="btn w-100 p-2"
                            type="button"
                            @click="setMonth(key + 1)"
                        >
                            {{ monthName }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
//  вспомогательные функции
import moment from "moment";

// директивы
import clickOutside from "@/directives/click-outside";
export default {
    directives: { clickOutside },
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
            if (!vm.year) return false;
            const dateRaw = new Date().toISOString().slice(0, 19);
            const date = moment(dateRaw);
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
            const dateRaw = new Date(`${vm.year}-${vm.month}-01T00:00:00`);
            const date = moment(dateRaw);
            return date.format("MMMM");
        },
    },

    mounted() {
        const today = new Date();
        const vm = this;
        // назначение текущего месяца и года выбранными при инициализации
        vm.month = parseInt(moment(today).format("M"));
        vm.year = parseInt(moment(today).format("Y"));

        vm.$emit("selected", { month: vm.month, year: vm.year });
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

        close() {
            this.showDropdown = false;
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
            let fixedIndex = index < 0 ? 0 : index > 12 ? 12 : index;

            vm.showDropdown = false;

            vm.month =
                fixedIndex === 0 ? null : fixedIndex.toString().padStart(2, 0);

            vm.$emit("selected", { month: fixedIndex, year: vm.year });
            return;
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
