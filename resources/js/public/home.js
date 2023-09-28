/**
 * Домашняя страница
 */

import messages from "../mixins/messages";
import publicAuthData from "../mixins/publicAuthData";
import MessagesComponent from "../components/MessagesComponent/";
import BvsMapComponent from "../components/BvsMapComponent/";
import SwitcherComponent from "../components/SwitcherComponent";
import CalendarComponent from "../components/CalendarComponent";
import { strip, clog } from "../misc/helpers";
import crud from "../mixins/crud";
const axios = require("axios");

var grasslandMap;

const homePage = {
    mixins: [messages, crud, publicAuthData],

    components: {
        MessagesComponent,
        SwitcherComponent,
        Calendar: CalendarComponent,
        BvsMap: BvsMapComponent,
    },

    data() {
        return {
            mode: "day",
            bvsData: [],
        };
    },

    mounted() {
        const vm = this;
        vm.getBvsData();
    },

    computed: {
        calendarState() {
            return this.mode === "all";
        },

        modes() {
            const modes = {
                all: "За все время",
                day: "За день",
                period: "За период",
            };
            return modes;
        },

        selectPeriod() {
            return this.mode === "period";
        },
    },

    watch: {
        // bvsData(data) {
        //     clog(strip(data));
        // },
    },

    methods: {
        changeMode(data) {
            this.mode = data.mode;
        },

        getBvsData() {
            const vm = this;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
            };

            axios
                .post(`/bvsdata/list`, postData)
                .then((response) => {
                    clog("%c getBvsData response", "color:green", response);

                    vm.bvsData = response.data.bvs_data;
                    // vm.messages[response.data.type] = response?.data?.message;
                })
                .catch((e) => {
                    clog("%c getBvsData error", "color: red", e.response);
                    // vm.messages.error = e.response.data.message;
                });
        },

        selectDateCb(data) {
            clog("%c selectDateCb", "color: blue", data);
        },

        selectPeriodCb(data) {
            clog("%c selectDateCb", "color: blue", data);
        },
    },
};

export default homePage;
