<template>
    <TransitionGroup>
        <input-component
            :_info="info"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
            :_value="info.value"
            @change="change"
            @input="input"
            v-if="mode === 'input'"
        ></input-component>
        <Password
            :_info="info"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
            @change="change"
            @input="input"
            v-if="mode === 'password'"
        ></Password>
        <select-component
            :_info="info"
            :_value="info.value"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
            @change="change"
            @input="input"
            v-if="mode === 'select'"
        ></select-component>
    </TransitionGroup>
</template>

<script>
import passevents from "@/mixins/passevents";
import InputComponent from "@/components/inputs/InputComponent";
import SelectComponent from "@/components/inputs/SelectComponent";
import PasswordInputComponent from "@/components/inputs/PasswordInputComponent";
export default {
    mixins: [passevents],
    components: {
        InputComponent,
        SelectComponent,
        Password: PasswordInputComponent,
    },
    props: ["_info"],
    data() {
        return {
            info: this._info,
        };
    },

    watch: {
        _info: {
            handler: function (val) {
                this.info = val;
            },
            deep: true,
        },
    },

    computed: {
        mode() {
            const vm = this;
            const inputTypes = ["text", "email", "number"];
            if (inputTypes.indexOf(vm.info.type) >= 0) {
                return "input";
            }

            return vm.info.type;
        },

        template() {},
    },
    methods: {},
};
</script>
