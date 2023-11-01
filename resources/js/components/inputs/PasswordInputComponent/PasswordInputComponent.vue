<!-- поле пароля с кнопкой генерации произвольного пароля -->
<template>
    <div>
        <input-component
            :_info="inputInfo"
            :_value="password"
            @change-field="change"
            @input-field="input"
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
import passevents from "@/mixins/passevents";
import { strip } from "@/misc/helpers";
import InputComponent from "@/components/inputs/InputComponent";
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

        /**
         * вариативный тип поля ввода, в случае если надо отображать сгенерированный пароль
         */
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
        /**
         * генерация произвольного пароля
         */
        generatePassword() {
            this.value = Math.random().toString(24).slice(-12);
        },
    },
};
</script>
