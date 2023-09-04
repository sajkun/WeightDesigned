export default {
    methods: {
        change(data) {
            this.$emit("change", data);
        },
        input(data) {
            this.$emit("input", data);
        },
    },
};
