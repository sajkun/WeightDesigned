export default {
    methods: {
        change(data) {
            this.$emit("change-data", data);
        },
        input(data) {
            this.$emit("input-data", data);
        },
    },
};
