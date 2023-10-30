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
        /**
         * запрашивает данные бункера весовой по переданной id и типу техники
         * или по ответсвенному лицу
         *
         * @param {Number} id техники
         * @param {Enum} type bunker | tractor | harvester | transporter | employee
         *
         * @returns {Promise}
         */
        getBvsDataFiltered(id, type) {
            const vm = this;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                params: {
                    id,
                    type,
                },
            };

            return axios
                .post(`/bvsdata/by-owner`, postData)
                .then((response) => {
                    clog(
                        "%c getBvsDataFiltered response",
                        "color:green",
                        response
                    );

                    return response.data;
                })
                .catch((e) => {
                    clog(
                        "%c getBvsDataFiltered error",
                        "color: red",
                        e.response
                    );
                    return e.response;
                });
        },

        /**
         * запрос списка сотрудников
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
         * запрос списка полей
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
         * запрос списка техники
         *
         * @return {Promise}
         */
        getVehicles() {
            const vm = this;
            if (vm.$refs.organisationId < 0) {
                return;
            }
            return axios
                .get("/vehicles/list")
                .then((response) => {
                    clog("%c getVehicles", "color: green", response);
                    return response.data;
                })
                .catch((e) => {
                    clog("%c getVehicles error", "color: red", e.response);
                    vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    return e.response;
                });
        },
    },
};
