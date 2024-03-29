/**
 * Отображение рейтинга по предприятию
 */

//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import fixedRightCol from "@/mixins/fixedRightCol";
import messages from "@/mixins/messages";
import professions from "@/mixins/professions";
import publicAuthData from "@/mixins/publicAuthData";
import statData from "@/mixins/statData";
import vehicleTypes from "@/mixins/vehicleTypes";

// компоненты
import MessagesComponent from "@/components/common/MessagesComponent";
import MonthPickerComponent from "@/components/inputs/MonthPickerComponent";
import RatingColumsComponent from "@/components/pageRating/ColumsComponent";

const appPublicRating = {
    mixins: [
        axiosRequests,
        crud,
        fixedRightCol,
        messages,
        professions,
        publicAuthData,
        statData,
        vehicleTypes,
    ],

    components: {
        MessagesComponent,
        MonthPicker: MonthPickerComponent,
        Columns: RatingColumsComponent,
    },

    data() {
        return {
            maxValue: 0,
        };
    },

    computed: {
        ratingMaxValue() {
            return this.getMaxValue();
        },
    },

    watch: {
        employees() {
            this.maxValue = this.getMaxValue();
        },

        vehicles() {
            this.maxValue = this.getMaxValue();
        },

        bvsData() {
            this.maxValue = this.getMaxValue();
        },
    },

    mounted() {
        const vm = this;
        vm.$el.parentNode.classList.add("d-flex");

        setTimeout(() => {
            vm.startFixElement("fixposition", "observeResize", true, [
                vm.$refs.beforeStickyPosition,
            ]);
        });
    },

    methods: {
        /**
         *
         * @returns {Integer} максимальное значение переданного зерна
         */
        getMaxValue() {
            const vm = this;
            const data = strip(vm.ratingDataRaw);
            const maxValue = data.reduce((accumulator, item) => {
                return Math.max(item.amount, accumulator);
            }, 0);
            return Math.max(vm.maxValue, maxValue);
        },

        /**
         * Задает значение отображаемого периода
         *
         * @param {Object} data {month: int от 0 до 12, year: int}
         *
         * @returns {Void}
         */
        setDisplayedPeriod(data) {
            const vm = this;
            let date, start, end;
            const month = data.month === 0 ? data.month : data.month - 1;

            date = new Date(data.year, month);

            start =
                data.month === 0
                    ? moment(date).startOf("year")
                    : moment(date).startOf("month");
            end =
                data.month === 0
                    ? moment(date).endOf("year")
                    : moment(date).endOf("month");
            vm.dateRange.start = start.format("YYYY-MM-DDTHH:mm:ss");
            vm.dateRange.end = end.format("YYYY-MM-DDTHH:mm:ss");

            return;
        },
    },
};

export default appPublicRating;
