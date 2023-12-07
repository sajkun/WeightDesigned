<!-- Всплывающее окно с календарем сменных заданий -->
<template>
    <modal @closed="closeModal" :_show="show" :class="'md'">
        <h3 class="h6">Создать сменное задание</h3>
        <monthPicker></monthPicker>
    </modal>
</template>

<script>
//вспомогательные функции
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

// компоненты
import ModalComponent from "@/components/common/ModalComponent";
import MonthPickerComponent from "@/components/common/MonthPickerComponent";
export default {
    watch: {
        _show(show) {
            this.show = show;
        },
    },
    props: {
        _show: {
            type: Boolean,
            default: false,
            required: false,
        },
    },

    components: {
        modal: ModalComponent,
        monthPicker: MonthPickerComponent,
    },
    data() {
        return {
            show: this._show,
        };
    },
    methods: {
        /**
         * Скрытие модальных окон
         */
        closeModal() {
            this.$emit("closeRequest");
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
