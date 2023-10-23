const axios = require("axios");
// хэлперы
import { strip, clog } from "@/misc/helpers";

export default {
    methods: {
        /**
         * запрос данных БВС
         *
         * @return {Promise}
         */
        getBvsData() {
            const vm = this;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
            };

            return axios
                .post(`/bvsdata/list`, postData)
                .then((response) => {
                    clog("%c getBvsData response", "color:green", response);

                    return response.data;
                })
                .catch((e) => {
                    clog("%c getBvsData error", "color: red", e.response);
                    return e.response;
                });
        },

        /**
         * запрос перечня сотрудников
         *
         * @return {Promise}
         */
        getEmployees() {
            const vm = this;

            if (vm.$refs.organisationId < 0) {
                return;
            }
            return axios
                .get("/employees/list", {
                    user_id: vm.userId,
                })
                .then((response) => {
                    clog("%c getEmployees", "color: green", response);

                    return response.data;
                })
                .catch((e) => {
                    clog("%c getVehicles error", "color: red", e.response);

                    return e.response;
                });
        },

        /**
         * запрос перечня полей
         *
         * @return {Promise}
         */
        getGrasslands() {
            const vm = this;
            if (vm.$refs.organisationId < 0) {
                return;
            }
            return axios
                .get("/grasslands/list", {
                    user_id: vm.userId,
                })
                .then((response) => {
                    clog("%c getGrasslands", "color: green", response);
                    vm.grasslands = strip(response.data.grasslands);

                    return strip(response.data);
                })
                .catch((e) => {
                    clog("%c getGrasslands error", "color: red", e.response);

                    vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;

                    return e.response;
                });
        },

        /**
         * запрос перечня техники
         *
         * @return {Promise}
         */
        getVehicles() {
            const vm = this;
            return axios
                .get("/vehicles/list")
                .then((response) => {
                    clog("%c getVehicles", "color: green", response);
                    return response.data;
                })
                .catch((e) => {
                    clog("%c getVehicles error", "color: red", e.response);
                    return e.response;
                });
        },
    },
};
