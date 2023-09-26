/**
 * Домашняя страница
 */

import messages from "../mixins/messages";
import MessagesComponent from "../components/MessagesComponent/";
import SwitcherComponent from "../components/SwitcherComponent";
import CalendarComponent from "../components/CalendarComponent";
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
            mode: "",
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
        modes() {
            const modes = {
                all: "За все время",
                day: "За день",
                period: "За период",
            };
            return modes;
        },
    },

    methods: {
        changeMode(mode) {
            console.log(mode);
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
    },
};

export default homePage;
