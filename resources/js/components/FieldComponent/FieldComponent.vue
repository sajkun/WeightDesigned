<template>
    <transition>
        <input-component
            :_info="info"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
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
    </transition>
</template>

<script>
import passevents from "../../mixins/passevents";
import InputComponent from "../InputComponent";
import PasswordInputComponent from "../PasswordInputComponent";
export default {
    mixins: [passevents],
    components: {
        InputComponent,
        Password: PasswordInputComponent,
    },
    props: ["_info"],
    data() {
        return {
            info: this._info,
        };
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
