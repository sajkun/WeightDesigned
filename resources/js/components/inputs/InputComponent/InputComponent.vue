<!--
    Обёртка для input.
    Метка анимированно уезжает вверх при вводе значения
 -->
<template>
    <div class="form-control-custom">
        <input
            :minlength="minlength"
            :pattern="pattern"
            :type="type"
            :title="title"
            :name="name"
            autocomplete="off"
            :class="{ active: value }"
            :id="id"
            :step="step"
            :required="required"
            v-model="value"
            @change="change"
            @input="input"
        />
        <label :for="id">{{ label }}</label>
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
            step: this._info?.step,
        };
    },

    watch: {
        _value(v) {
            this.value = v;
        },
    },

    methods: {},
};
</script>
