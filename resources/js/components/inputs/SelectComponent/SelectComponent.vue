<!-- Компонент выпадающего списка -->
<template>
    <div class="form-control-custom">
        <select
            :name="name"
            autocomplete="off"
            :class="{ active: value }"
            :id="id"
            :required="required"
            v-model="value"
            @change="change"
            @input="input"
        >
            <option key="default" hidden :selected="!value"></option>
            <option
                v-for="(name, key) in options"
                :key="'options' + key"
                :value="key"
            >
                {{ name }}
            </option>
        </select>
        <label :for="id" class="{active: value}">{{ label }}</label>
    </div>
</template>

<script>
//хэлперы
import { clog, strip } from "@/misc/helpers";

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
        };
    },
    watch: {
        _value(v) {
            clog(v);
            this.value = v;
        },

        value() {
            clog(
                `Select updated. Id: ${this.id}, name: ${this.name}`,
                `Value: ${this.value}`
            );
        },
    },

    created() {
        clog(
            `Select created. Id: ${this.id}, name: ${this.name}`,
            `Value: ${this.value}`
        );
    },

    computed: {
        options() {
            return this._info?.options ? this._info.options : [];
        },
    },
    methods: {},
};
</script>
