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

    mounted() {
        const vm = this;
        document.body.addEventListener("click", (e) => {
            if (e.target.type !== "button") {
                vm.clearMessages();
            }
        });
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
