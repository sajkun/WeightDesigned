import { clog } from "@/misc/helpers";
const axios = require("axios");
const crud = {
    methods: {
        confirmActionCb() {
            clog("confirmActionCb");
            document.dispatchEvent(new CustomEvent("submitConfirmEvent"));
        },

        cancelConfirmActionCb() {
            clog("cancelConfirmActionCb");
            document.dispatchEvent(new CustomEvent("cancelConfirmEvent"));
        },

        createEntity(postData, url) {
            return this.sendRequest(postData, url);
        },

        deleteEntity(postData, url) {
            const vm = this;
            let handlerSubmit = null;
            let handlerCancel = null;

            handlerSubmit = () => {
                vm.deleteEntityCb(postData, url);

                document.removeEventListener(
                    "submitConfirmEvent",
                    handlerSubmit,
                    false
                );

                vm.$nextTick(() => {
                    vm.clearMessages(true);
                });
            };

            handlerCancel = () => {
                document.removeEventListener(
                    "submitConfirmEvent",
                    handlerSubmit,
                    false
                );

                document.removeEventListener(
                    "cancelConfirmEvent",
                    handlerCancel,
                    false
                );

                vm.$nextTick(() => {
                    vm.clearMessages(true);
                });
            };

            if (!vm.messages.confirm) {
                document.addEventListener("submitConfirmEvent", handlerSubmit);
                document.addEventListener("cancelConfirmEvent", handlerCancel);
                vm.messages.confirm = `Вы уверены, что хотите удалить ${postData?.name}?`;
            } else {
                document.removeEventListener(
                    "submitConfirmEvent",
                    handlerSubmit,
                    false
                );

                document.removeEventListener(
                    "cancelConfirmEvent",
                    handlerCancel,
                    false
                );

                vm.$nextTick(() => {
                    vm.clearMessages(true);
                });
            }
        },

        deleteEntityCb(postData, url) {
            return this.sendRequest(postData, url);
        },

        editEntity(postData, url) {
            return this.sendRequest(postData, url);
        },

        sendRequest(postData, url) {
            clog("%c sendRequest fire", "color:blue", url, postData);
            const vm = this;
            return axios
                .post(url, postData)
                .then((response) => {
                    vm.messages[response.data.type] = response.data.message;
                    clog("%c sendRequest success", "color:green", response);
                    return response;
                })
                .then((response) => {
                    document.dispatchEvent(new CustomEvent("updateList"));
                    return response;
                })
                .catch((e) => {
                    clog("%c sendRequest error", "color:red", e.response);
                    vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    return e.response;
                });
        },
    },
};

export default crud;
