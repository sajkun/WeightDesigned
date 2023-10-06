<template>
    <div>
        <input-component
            :_info="inputInfo"
            :_value="password"
            @change="change"
            @input="input"
        ></input-component>
        <button
            class="btn btn-link"
            type="button"
            v-if="info.mode === 'generate'"
            @click="generatePassword"
        >
            Сгенерировать пароль
        </button>
    </div>
</template>

<script>
import passevents from "../../../mixins/passevents";
import { strip } from "../../../misc/helpers";
import InputComponent from "../InputComponent";
export default {
    mixins: [passevents],
    props: ["_info"],
    components: {
        InputComponent,
    },

    computed: {
        password() {
            return this.value;
        },

        inputInfo() {
            const info = strip(this.info);
            if (info.mode === "generate") {
                info.type = "text";
            }
            return info;
        },
    },
    data() {
        return {
            info: this._info,
            value: null,
        };
    },
    methods: {
        generatePassword() {
            this.value = Math.random().toString(24).slice(-12);
        },
    },
};
</script>
