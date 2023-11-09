<!-- Элемент форма -->
<template>
    <form @submit.prevent="submit" ref="form" v-if="renderComponent">
        <div class="row">
            <Field
                v-for="(info, key) in fields"
                :key="'input' + key + info.id"
                :_info="info"
                :_forceRender="info.value"
                @change-field="changedHandler"
                @input-field="inputHandler"
            ></Field>
        </div>
        <slot></slot>
        <div class="row">
            <div class="col-12 col-md-6 mt-2">
                <button
                    type="button"
                    class="w-100 btn btn-borders-grey"
                    @click="cancelForm"
                >
                    Отмена
                </button>
            </div>
            <div class="col-12 col-md-6 mt-2">
                <button type="submit" class="w-100 btn btn-primary-alt">
                    Сохранить
                </button>
            </div>
        </div>
    </form>
</template>

<script>
//вспомогательные функции
import { clog } from "@/misc/helpers";

//миксины
import { getFormData } from "@/misc/helpers";

//компоненты
import FieldComponent from "@/components/inputs/FieldComponent";

export default {
    props: {
        // массив содержащий описание всех полей ввода формы
        _structure: Array,
    },
    data() {
        return {
            // массив содержащий описание всех полей ввода формы
            structure: this._structure,
            renderComponent: true,
        };
    },

    watch: {
        /**
         * интерактивное обновление элментов формы
         */
        _structure: {
            handler: function (val) {
                this.structure = val;
            },
            deep: true,
        },
    },

    components: {
        Field: FieldComponent,
    },

    computed: {
        fields() {
            return this.structure;
        },
    },

    emits: ["fileChanged", "execSubmit", "cancelForm", "formDataChanged"],

    methods: {
        /**
         * Обработчик события отмены действий в форме
         *
         * @returns {Void}
         */
        cancelForm() {
            this.$emit("cancelForm");
            return;
        },

        /**
         * обработчик событий изменения в полях ввода
         * передаёт на уровень выше сведения об измененном файле
         *
         * @param {Object|Event} data
         *
         * @returns {Void}
         */
        changedHandler(data) {
            const vm = this;
            if (data?.file) {
                vm.$emit("fileChanged", data);
            } else {
                this.$emit("formDataChanged", data);
            }

            return;
        },

        /**
         * Очистка всех полей формы
         *
         * @returns {Void}
         */
        clear() {
            clog("clear form");
            this.structure = this.structure.map((el) => {
                el.value = "";
                return el;
            });

            this.$refs.form.reset();
            this.resertForm();
            return;
        },

        /**
         * обработчик события ввода в поля формы
         *
         * @param {Object} data
         *
         * @returns {Void}
         */
        inputHandler(data) {
            // this.$emit("formDataChanged", data);
        },

        async resertForm() {
            this.renderComponent = false;
            await this.$nextTick();
            this.renderComponent = true;
        },

        /**
         * Отправка данных формы
         *
         * @returns {Void}
         */
        submit() {
            const vm = this;
            const data = getFormData(vm.$refs.form);
            clog("%c Отправка данных формы", "color: green", data);
            vm.$emit("execSubmit", data);
            return;
        },
    },
};
</script>
