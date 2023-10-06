<template>
    <form @submit.prevent="submit" ref="form">
        <div class="row">
            <Field
                v-for="(data, key) in structure"
                :key="'input' + key"
                :_info="data"
            ></Field>
        </div>
        <slot></slot>
        <div class="row">
            <div class="col-12 col-md-6 mt-2">
                <button
                    type="button"
                    class="w-100 btn btn-borders-grey"
                    @click="cancel"
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
import { getFormData } from "../../../misc/helpers";
import { clog } from "../../../misc/helpers";
import FieldComponent from "../FieldComponent";
export default {
    props: {
        _structure: Array,
    },
    data() {
        return {
            structure: this._structure,
        };
    },

    watch: {
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
    methods: {
        cancel() {
            this.$emit("cancel");
        },
        submit() {
            const vm = this;
            const data = getFormData(vm.$refs.form);
            clog("%c Отправка данных формы", "color: green", data);
            vm.$emit("exec-submit", data);
        },

        reset() {
            this.$refs.form.reset();
        },
    },
};
</script>
