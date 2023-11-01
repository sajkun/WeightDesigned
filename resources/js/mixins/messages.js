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
        clearMessages(confirm) {
            this.messages = {
                error: null,
                info: null,
                success: null,
                confirm: this.messages.confirm,
            };

            if (confirm) {
                this.messages.confirm = null;
            }
        },
    },
};
