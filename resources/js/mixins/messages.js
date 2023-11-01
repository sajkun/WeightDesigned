/**
 * Массив сообщений и метод очистки сообщений
 * вместе с этитми миксином для отображения сообщений необходимо использовать компонент MessagesComponent
 *
 * @see resourses\js\components\common\MessagesComponent
 */
export default {
    data() {
        return {
            messages: {
                error: null,
                info: null,
                success: null,
                confirm: null,
            },
        };
    },

    methods: {
        /**
         * Очистка сообщений
         *
         * @param {Boolean} confirm было ли подтверждение
         *
         * @returns {Void}
         */
        clearMessages(confirm) {
            const vm = this;

            vm.messages = {
                error: null,
                info: null,
                success: null,
                confirm: vm.messages.confirm,
            };

            if (confirm) {
                vm.messages.confirm = null;
            }
        },
    },
};
