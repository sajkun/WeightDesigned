/**
 * Домашняя страница
 */

import messages from "../mixins/messages";
import MessagesComponent from "../components/MessagesComponent/";
import SwitcherComponent from "../components/SwitcherComponent";
import CalendarComponent from "../components/CalendarComponent";
import { strip, clog } from "../misc/helpers";
import crud from "../mixins/crud";
var grasslandMap;

const homePage = {
    mixins: [messages, crud],

    components: {
        MessagesComponent,
        SwitcherComponent,
        Calendar: CalendarComponent,
    },

    data() {
        return {
            mode: "day",
        };
    },

    mounted() {
        const vm = this;
        vm.$nextTick(() => {
            ymaps.ready(function () {
                grasslandMap = vm.initMap("map");
            });
        });
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

    methods: {
        changeMode(data) {
            this.mode = data.mode;
        },

        initMap(selector) {
            let map = new ymaps.Map(
                selector,
                {
                    center: [45, 45],
                    zoom: 13,
                },
                {
                    searchControlProvider: "yandex#search",
                }
            );

            return map;
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
