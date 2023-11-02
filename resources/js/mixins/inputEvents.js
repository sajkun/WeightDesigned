/**
 * События для ввода и изменения в полях ввода, выпадающих списках
 */
export default {
    methods: {
        change() {
            const vm = this;
            vm.$emit("change", { value: vm.value, name: vm.name, id: vm.id });
        },
        input() {
            const vm = this;
            vm.$emit("input", { value: vm.value, name: vm.name, id: vm.id });
        },
    },
};
