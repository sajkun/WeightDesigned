const crud = {
    methods: {
        confirmActionCb() {
            document.dispatchEvent(new CustomEvent("submitConfirmEvent"));
        },

        cancelConfirmActionCb() {
            document.dispatchEvent(new CustomEvent("cancelConfirmEvent"));
        },

        createEntity(postData, url) {
            const vm = this;
            return axios
                .post(url, postData)
                .then((response) => {
                    console.log("%c createEntity", "color: green", response);
                    vm.messages[response.data.type] = response.data.message;
                })
                .then(() => {
                    document.dispatchEvent(new CustomEvent("updateList"));
                })
                .catch((e) => {
                    console.log(
                        "%c createEntity error",
                        "color: red",
                        e.response
                    );
                    vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                });
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
                    document.dispatchEvent(new CustomEvent("updateList"));
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
                    "confirmEvent",
                    handlerSubmit,
                    false
                );

                document.removeEventListener(
                    "submitConfirmEvent",
                    handlerCancel,
                    false
                );

                vm.$nextTick(() => {
                    vm.clearMessages(true);
                });
            }
        },

        deleteEntityCb(postData, url) {
            return axios
                .post(url, postData)
                .then((response) => {
                    console.log(response);
                })
                .catch((e) => {
                    console.log(e.response);
                    vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                });
        },
    },
};

export default crud;
