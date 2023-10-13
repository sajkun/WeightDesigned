<!-- Поле ввода с выпадающим выбором календаря -->
<template>
    <div
        class="component-holder"
        @keydown.esc="
            setFocus(false);
            showDropdown = false;
        "
    >
        <Transition name="fade">
            <div class="comment p-2" v-if="focused">
                Вводите пожалуйста данные в виде:<b
                    >{{ format }},для выбора из календаря нажмите ctrl+пробел</b
                >
                <br />
                <div class="mt-2"></div>
                <p
                    class="m-0"
                    v-for="(text, key) in formatComment"
                    :key="'comment' + key"
                >
                    {{ key }}:{{ text }}
                </p>
            </div>
        </Transition>
        <div class="wrapper-input pe-2" :class="{ shifted: focused }">
            <input
                type="text"
                :value="dateFormatted"
                :placeholder="format"
                :size="inputSize"
                @focus="setFocus(true)"
                @input="fixInput($event, false)"
                @blur="
                    fixInput($event, true);
                    setFocus(false);
                "
                @keydown.space.ctrl.prevent="toggleDropdown(true)"
            />
            <button class="btn p-0" type="button" @click="toggleDropdown(true)">
                <i class="fa fa-calendar"></i>
            </button>
        </div>
        <Transition name="fade" v-show="showDropdown">
            <div class="calendar-dropdown p-2">
                <Calendar
                    @selected-date="selectDateCb"
                    :_initial-date="date"
                ></Calendar>
            </div>
        </Transition>
    </div>
</template>

<script>
//хэлперы
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import momentFormats from "@/mixins/momentFormats";

//компоненты
import CalendarComponent from "@/components/CalendarComponent";
export default {
    watch: {
        /**
         * Наследование параметра от родителя при смене свойства (props)
         *
         * @param {String} date
         */
        _date(date) {
            this.date = new Date(date).toISOString();
        },

        /**
         * Наследование параметра от родителя при смене свойства (props)
         *
         * @param {String} format
         */
        _format(format) {
            this.format = format;
        },

        /**
         * Отслеживание состояния параметра date
         *
         * @param {String} date Iso format
         */
        date(date) {
            const vm = this;
            // передает на уровень родительского элемента изменившуюся дату
            vm.$emit("dateChanged", { date: date });
        },
    },
    props: {
        /**
         * Начальная дата от родителя
         */
        _date: {
            type: String,
            default: null,
            required: false,
        },
        /**
         * Формат отображения данных.
         * Используется синтаксис библиотеки moment.js
         */
        _format: {
            type: String,
            default: "DD.MM.YYYY",
            required: false,
        },
    },

    created() {
        const vm = this;
        // формируется начальное значение даты, если не задано, то сегодняшняя
        const date = Boolean(vm._date) ? new Date(vm._date) : new Date();
        vm.date = date.toISOString();
    },

    computed: {
        /**
         * форматированный вид даты
         *
         * @returns {String} дата на основе формата
         */
        dateFormatted() {
            const vm = this;
            const date = new Date(vm.date);
            const helper = moment(date);
            return helper.format(vm.format);
        },

        /**
         * Вычисляет длину строки даты для того, чтобы
         * задать атрибут size поля ввода календаря размера
         * Точки не учитываются в вычилсении длины
         *
         * @returns {Integer}
         */
        inputSize() {
            const vm = this;
            const date = strip(vm.dateFormatted);
            const size = date
                .split("")
                .filter((symbol) => symbol !== ".").length;

            return size - 1;
        },

        formatComment() {
            const vm = this;
            const formatDescription = strip(vm.momentJsFormats);
            const data = new Map();
            const format = strip(vm.format);

            for (let part in formatDescription) {
                if (1 === format.split(part).length - 1) {
                    data.set(part, formatDescription[part]);
                }
            }
            return Object.fromEntries(data);
        },
    },
    data() {
        return {
            date: "", //дата в формате ISO
            format: this._format, // формат данных в синтаксисе moment.js
            focused: false,
            showDropdown: false,
        };
    },

    methods: {
        /**
         * Коллбэк для ввода в поле редактирования даты
         *
         *
         * @param {InputEvent} event
         * @param {Boolean} fix вносить ли правки если поле ввода неверно
         *
         * @returns {String} date последняя корректно введенная дата
         */
        fixInput(event, fix) {
            const vm = this;
            const text = event.target.value;
            const mayBeDate = moment(text, vm.format, true);
            let date = vm.date;

            vm.showDropdown = false;
            vm.focused = true;

            /**
             * обновление даты, если ввод корректен
             */
            if (mayBeDate.isValid()) {
                date = mayBeDate.toISOString();
            }

            /**
             * Откат на последюю валидную дату
             */
            if (fix) {
                event.target.value = moment(date).format(vm.format);
            }

            /**
             * обновление значение данных, если менялось
             */
            if (date !== vm.date) {
                vm.date = date;
            }

            return date;
        },

        selectDateCb(data) {
            const vm = this;
            const newDate = moment(data.date).toISOString();

            if (vm.date !== newDate && vm.showDropdown) {
                vm.showDropdown = false;
                vm.date = newDate;
            }
        },

        /**
         * Явно задает признак есть ли фокус на поле ввода даты
         *
         * @param {Boolean} focused
         *
         * @return {Void}
         */
        setFocus(focused) {
            const vm = this;
            vm.focused = focused;
            vm.showDropdown = false;
            return;
        },

        /**
         * Показывает или скрывает календарь в выпадающем
         *
         * @param {Boolean} toggle
         *
         * @return {Void}
         */
        toggleDropdown(toggle) {
            const vm = this;
            vm.showDropdown = toggle;

            if (toggle) {
                vm.focused = false;
            }

            return;
        },
    },

    components: {
        Calendar: CalendarComponent,
    },

    mixins: [momentFormats],
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>

<style lang="scss">
.calendar-dropdown {
    .btn {
        padding: 0 !important;
    }
}
</style>
