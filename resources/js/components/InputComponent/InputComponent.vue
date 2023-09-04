:
<template>
    <div class="form-control-custom">
        <input
            :type="type"
            :name="name"
            autocomplete="off"
            :class="{ active: value }"
            :id="id"
            :required="required"
            v-model="value"
            @change="change"
            @input="input"
        />
        <label :for="id">{{ label }}</label>
    </div>
</template>

<script>
export default {
    props: ["_info", "_value"],
    data() {
        return {
            value: this._value,
            id: this._info?.id,
            name: this._info?.name,
            required: this._info?.required,
            label: this._info?.label,
            type: this._info?.type,
        };
    },

    watch: {
        _value(v) {
            this.value = v;
        },
    },

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
</script>
