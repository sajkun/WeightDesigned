<!-- Шаблон опционального поля ввода input, file, select, password -->
<template>
    <TransitionGroup v-if="renderComponent">
        <!-- поле text, number или email -->
        <!-- ************** -->
        <input-component
            :_info="info"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
            :_value="info.value"
            @change="changeField"
            @input="inputField"
            :key="'input' + info.id"
            v-if="mode === 'input'"
        ></input-component>
        <!-- поле textarea -->
        <!-- ************** -->
        <textarea-component
            :_info="info"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
            :_value="info.value"
            @change="changeField"
            @input="inputField"
            :key="'textarea' + info.id"
            v-if="mode === 'textarea'"
        ></textarea-component>
        <!-- ************** -->

        <!-- поле ввода пароля -->
        <!-- ************** -->
        <Password
            :_info="info"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
            @change="changeField"
            @input="inputField"
            :key="'password' + info.id"
            v-if="mode === 'password'"
        ></Password>
        <!-- ************** -->

        <!-- Выпадающий список -->
        <!-- ************** -->
        <select-component
            :_info="info"
            :_value="info.value"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
            @change="changeField"
            @input="inputField"
            :key="'select' + info.id"
            v-if="mode === 'select'"
        ></select-component>
        <!-- ************** -->

        <!-- поле выбора файла -->
        <!-- ************** -->
        <File
            v-if="mode === 'file'"
            :_id="info.id"
            :_name="info.name"
            :_accept="info.accept"
            :_required="info.required"
            :class="info.class ? info.class + ' col-12' : 'col-12'"
            :key="'file' + info.id"
            @changed="changeField"
        >
            <span>{{ info.label }}</span></File
        >
        <!-- ************** -->
    </TransitionGroup>
</template>

<script>
// миксины
import passevents from "@/mixins/passevents";

//компоненты
import InputComponent from "@/components/inputs/InputComponent";
import FileInputComponent from "@/components/inputs/FileInputComponent";
import PasswordInputComponent from "@/components/inputs/PasswordInputComponent";
import SelectComponent from "@/components/inputs/SelectComponent";
import TextareaComponent from "@/components/inputs/TextareaComponent";

export default {
    mixins: [passevents],
    components: {
        InputComponent,
        SelectComponent,
        Password: PasswordInputComponent,
        File: FileInputComponent,
        TextareaComponent,
    },
    props: {
        _forceRender: {
            type: [String, Number],
            default: "",
            required: false,
        },
        _info: {
            type: Object,
            default: {},
            required: true,
        },
    },
    data() {
        return {
            info: this._info,
            renderComponent: true,
        };
    },

    watch: {
        // интерактиваное обновление параметроd
        _info: {
            handler: function (val) {
                this.info = val;
            },
            deep: true,
        },

        _forceRender() {
            this.forceRerender();
        },
    },

    computed: {
        /**
         * Параметр, определяющий какой типа поля ввода отображать
         *
         * @returns {String}
         */
        mode() {
            const vm = this;
            const inputTypes = ["text", "email", "number"];
            if (inputTypes.indexOf(vm.info.type) >= 0) {
                return "input";
            }
            return vm.info.type;
        },
    },
    emits: ["changeField", "inputField"],
    methods: {
        /**
         * Обработчик события изменения в поле ввода
         *
         * @param {Object} data
         *
         *  @returns {Void}
         */
        changeField(data) {
            this.$emit("changeField", data);
        },

        /**
         * Обработчик события ввода значений в поле ввода
         *
         * @param {Object} data
         *
         *  @returns {Void}
         */
        inputField(data) {
            this.$emit("inputField", data);
        },

        /**
         * принудительная перерисовка компонента
         */
        async forceRerender() {
            this.renderComponent = false;
            await this.$nextTick();
            this.renderComponent = true;
        },
    },
};
</script>
