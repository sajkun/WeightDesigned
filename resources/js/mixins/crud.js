/**
 * методы для чтения, записи, удаления сущностей
 */

import { clog } from "@/misc/helpers";
const axios = require("axios");
const crud = {
    methods: {
        /**
         * Событие при подтверждении запроса
         * во всплывающем окне: "вы уверены что..."
         *
         * @returns {Void}
         */
        confirmActionHandler() {
            document.dispatchEvent(new CustomEvent("submitConfirmEvent"));
        },

        /**
         * Событие при отмене запроса
         * во всплывающем окне: "вы уверены что..."
         *
         * @returns {Void}
         */
        cancelConfirmActionHandler() {
            clog("cancelConfirmActionHandler");
            document.dispatchEvent(new CustomEvent("cancelConfirmEvent"));
        },

        /**
         * Запрос на создание новой сущности
         *
         * @param {Object} postData тело запроса
         * @param {String} url адрес запроса
         * @returns {Promise}
         */
        createEntity(postData, url) {
            return this.sendRequest(postData, url);
        },

        /**
         * Запрос на удаление новой сущности
         * Вызывает всплывающее  окно, если еще нет такого, иначе
         * отменяет все назначеные Event Listeners
         *
         * @param {Object} postData тело запроса
         * @param {String} url адрес запроса
         * @returns {Void}
         */
        deleteEntity(postData, url) {
            const vm = this;
            let handlerSubmit = null;
            let handlerCancel = null;

            /**
             * действия в случае, если пользователь подтвердит выбор
             */
            handlerSubmit = () => {
                vm.deleteEntityHandler(postData, url);

                document.removeEventListener(
                    "submitConfirmEvent",
                    handlerSubmit,
                    false
                );

                vm.$nextTick(() => {
                    vm.clearMessages(true);
                });
            };

            /**
             * действия в случае, если пользователь отменит выбор
             */
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

            /**
             * Если еще не всплывающего  окна с запросом на подтверждение действия, показать его и назначить handlerSubmit и handlerCancel в слушатели событий (addEventListener)
             * Иначе отмена действия
             */
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

        /**
         * Запрос на удаление новой сущности
         *
         * @param {Object} postData тело запроса
         * @param {String} url адрес запроса
         * @returns {Promise}
         */
        deleteEntityHandler(postData, url) {
            return this.sendRequest(postData, url);
        },

        /**
         * Запрос на редактирование сущности
         *
         * @param {Object} postData тело запроса
         * @param {String} url адрес запроса
         * @returns {Promise}
         */
        editEntity(postData, url) {
            return this.sendRequest(postData, url);
        },

        /**
         * функция отправки запроса
         * так же логирует в консоль полученные и отправленные данные
         *
         * @param {Object} postData тело запроса
         * @param {String} url адрес запроса
         * @returns {Promise}
         */
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
