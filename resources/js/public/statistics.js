/**
 * приложение отображение статистики публичного раздела
 */

//хэлперы
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";
import sortAnimation from "@/mixins/sortAnimation";
import professions from "@/mixins/professions";
import statData from "@/mixins/statData";
import vehicleTypes from "@/mixins/vehicleTypes";

// компоненты
import MessagesComponent from "@/components/MessagesComponent";
import MonthPickerComponent from "@/components/inputs/MonthPickerComponent";
import DatepickerComponent from "@/components/inputs/DatepickerComponent";

const appPublicStatistics = {
    mixins: [
        axiosRequests,
        crud,
        messages,
        professions,
        publicAuthData,
        statData,
        sortAnimation,
        vehicleTypes,
    ],

    components: {
        MessagesComponent,
        MonthPicker: MonthPickerComponent,
        Datepicker: DatepickerComponent,
    },

    data() {
        return {};
    },

    watch: {},

    computed: {},

    mounted() {
        const vm = this;
        vm.$el.parentNode.classList.add("d-flex");
    },

    methods: {},
};

export default appPublicStatistics;
