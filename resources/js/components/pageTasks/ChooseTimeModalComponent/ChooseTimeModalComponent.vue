<!-- Всплывающее окно с календарем сменных заданий -->
<template>
    <modal @closed="closeModal" :_show="show" :class="'md'">
        <h3 class="h6">Создать сменное задание</h3>
        <monthPicker v-on:change-date="updateDaysRow" />
        <days
            :_date-range="dateRange"
            :_format="'DD dd'"
            :_can-select-date="true"
            :_current-date="baseDate"
        />

        <div class="text-center">
            <svg
                width="548"
                height="16"
                viewBox="0 0 548 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M262 6L274 10L286 6"
                    stroke="#DFE6FA"
                    stroke-width="2"
                    stroke-linecap="round"
                />
            </svg>
        </div>
    </modal>
</template>

<script>
//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

// компоненты
import DaySelectComponent from "@/components/pageTasks/DaySelectComponent";
import ModalComponent from "@/components/common/ModalComponent";
import MonthPickerComponent from "@/components/common/MonthPickerComponent";
export default {
    watch: {
        _baseDate(baseDate) {
            this.baseDate = baseDate;
        },

        /**
         * реактивность отображения/скрытия окна в зависимости от изменения статуса в родительском компоненте
         */
        _show(show) {
            this.show = show;
        },
    },

    computed: {
        dateRange() {
            const vm = this;
            const start = moment(vm.baseDate).startOf("month").toISOString();
            const end = moment(vm.baseDate).endOf("month").toISOString();
            return { start, end };
        },
    },

    props: {
        /**
         * дата, полученная от родителя в качестве текущей даты
         * @var{ISOString}
         */
        _baseDate: {
            type: String,
            default: new moment().startOf("day").toISOString(),
            required: false,
        },

        /**
         * Признак отображения или скрытия окна, унаследованный от родителя
         */
        _show: {
            type: Boolean,
            default: false,
            required: false,
        },
    },

    components: {
        days: DaySelectComponent,
        modal: ModalComponent,
        monthPicker: MonthPickerComponent,
    },
    data() {
        return {
            /**
             * @var {Boolean}
             * Показывать или не показывать окно
             */
            show: this._show,

            /**
             * @var{ISOString}
             * текущая дата
             */
            baseDate: this._baseDate,
        };
    },
    methods: {
        /**
         * Скрытие модальных окон
         */
        closeModal() {
            this.$emit("closeRequest");
        },

        /**
         *
         * @param {Object} data
         */
        updateDaysRow(data) {
            this.baseDate = data.date;
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
