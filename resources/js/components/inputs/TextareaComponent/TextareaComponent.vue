:
<template>
    <div class="form-control-custom">
        <textarea
            :minlength="minlength"
            :pattern="pattern"
            :type="type"
            :title="title"
            :name="name"
            autocomplete="off"
            :class="{ active: value }"
            :id="id"
            :required="required"
            v-model="value"
            @change="change"
            @input="input"
            ref="textarea"
        ></textarea>
        <label class="textarea-label" :for="id">{{ label }}</label>
    </div>
</template>

<script>
import inputEvents from "@/mixins/inputEvents";
export default {
    mixins: [inputEvents],
    props: ["_info", "_value"],
    data() {
        return {
            value: this._value,
            id: this._info?.id,
            name: this._info?.name,
            required: this._info?.required,
            label: this._info?.label,
            type: this._info?.type,
            pattern: this._info?.pattern,
            minlength: this._info?.minlength,
            title: this._info?.title,
        };
    },

    watch: {
        _value(v) {
            this.value = v;
        },
    },

    mounted() {
        const vm = this;
        vm.matchHeight();
    },

    methods: {
        matchHeight() {
            const vm = this;
            const el = vm.$refs.textarea;
            el.style.removeProperty("height");
            el.style.height = `${el.scrollHeight}px`;
        },

        input() {
            const vm = this;
            vm.matchHeight();
            vm.$emit("input", { value: vm.value, name: vm.name, id: vm.id });
        },
    },
};
</script>

<style scoped>
textarea {
    overflow: hidden;
    line-height: 1.5;
}
</style>
