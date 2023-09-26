/**
 * Домашняя страница
 */

import messages from "../mixins/messages";
import MessagesComponent from "./../components/MessagesComponent/";
var grasslandMap;
const homePage = {
    mixins: [messages],

    componentsa: {
        MessagesComponent,
    },

    mounted() {
        const vm = this;
        vm.$nextTick(() => {
            ymaps.ready(function () {
                grasslandMap = vm.initMap("map");
            });
        });
    },

    methods: {
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
