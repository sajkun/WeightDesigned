<!-- Всплывающее окно с календарем сменных заданий -->
<template>
    <modal @closed="closeModal" :_show="show">
        <h3 class="h6">Создать сменное задание</h3>
        <monthPicker v-on:change-date="updateDaysRow" />
        <days
            :_date-range="dateRange"
            :_format="'DD dd'"
            :_can-select-date="true"
            :_current-date="baseDate"
            :_size-modificator="7"
        />

        <div class="text-center">
            <svg
                width="548"
                height="16"
                viewBox="0 0 548 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M262 6L274 10L286 6"
                    stroke="#DFE6FA"
                    stroke-width="2"
                    stroke-linecap="round"
                />
            </svg>
        </div>
        <form ref="form" @submit.prevent="submit">
            <h4 class="label">Начало и конец смены</h4>
            <div class="row mt-2">
                <div class="col-6">
                    <div class="d-flex align-items-center">
                        <label for="startTaskTime" class="me-2">c</label>
                        <input
                            type="time"
                            id="startTaskTime"
                            required
                            class="flex-grow-1"
                            name="start"
                            v-model="start"
                        />
                    </div>
                </div>
                <div class="col-6">
                    <div class="d-flex align-items-center">
                        <label for="endTaskTime" class="me-2">по</label>
                        <input
                            type="time"
                            id="endTaskTime"
                            required
                            class="flex-grow-1"
                            name="end"
                            v-model="end"
                        />
                    </div>
                </div>
            </div>

            <h4 class="label mt-2">комментарий</h4>
            <textarea name="comment" id="" class="w-100 mt-2"></textarea>

            <div class="row mt-2">
                <div class="col-6">
                    <button
                        class="btn btn-borders-danger w-100"
                        type="button"
                        @click="closeModal"
                    >
                        Удалить
                    </button>
                </div>
                <div class="col-6">
                    <button class="btn btn-primary-alt w-100" type="submit">
                        Сохранить
                    </button>
                </div>
            </div>
        </form>
    </modal>
</template>

<script>
//вспомогательные функции
import { clog, getFormData } from "@/misc/helpers";
import moment from "moment";

// компоненты
import DaySelectComponent from "@/components/pageTasks/DaySelectComponent";
import ModalComponent from "@/components/common/ModalComponent";
import MonthPickerComponent from "@/components/common/MonthPickerComponent";
import { _colorStringFilter } from "gsap/gsap-core";
export default {
    watch: {
        _baseDate(baseDate) {
            this.baseDate = baseDate;
        },

        /**
         * реактивность отображения/скрытия окна в зависимости от изменения статуса в родительском компоненте
         */
        _show(show) {
            this.show = show;
        },
    },

    computed: {
        dateRange() {
            const vm = this;
            const start = moment(vm.baseDate).startOf("month").toISOString();
            const end = moment(vm.baseDate).endOf("month").toISOString();
            return { start, end };
        },
    },

    props: {
        /**
         * дата, полученная от родителя в качестве текущей даты
         * @var{ISOString}
         */
        _baseDate: {
            type: String,
            default: new moment().startOf("day").toISOString(),
            required: false,
        },

        /**
         * Признак отображения или скрытия окна, унаследованный от родителя
         */
        _show: {
            type: Boolean,
            default: false,
            required: false,
        },
    },

    components: {
        days: DaySelectComponent,
        modal: ModalComponent,
        monthPicker: MonthPickerComponent,
    },
    data() {
        return {
            /**
             * @var {Boolean}
             * Показывать или не показывать окно
             */
            show: this._show,

            /**
             * @var{ISOString}
             * текущая дата
             */
            baseDate: this._baseDate,

            start: null,
            end: null,
        };
    },
    methods: {
        /**
         * Скрытие модальных окон
         */
        closeModal() {
            this.$emit("closeRequest");
        },

        /**
         * Хэндлер действия пожтверждения формы
         * эмитит родителю событие submited с данными периода времени и комментарием
         *
         * @returns {Void}
         */
        submit() {
            const vm = this;
            const data = getFormData(vm.$refs.form);
            const date = moment(vm.baseDate);
            const dateString = date.format("YYYY-MM-DD");
            const timeZone = date.format("ZZ");
            const start = `${dateString}T${data.start}:00${timeZone}`;
            const end = `${dateString}T${data.end}:00${timeZone}`;
            vm.$emit("submited", { start, end, comment: data.comment });
        },

        /**
         * передает родителю сообщение
         *
         * @param {Enum} type  error|info|success
         * @param {String} text
         */
        emitMessage(type, text) {
            this.$emit("messageRequest", { type, text });
        },

        /**
         *
         * @param {Object} data
         */
        updateDaysRow(data) {
            this.baseDate = data.date;
        },
    },
};
</script>

<style scoped lang="scss">
.label,
label {
    color: var(--grey-medium);
    font-size: var(--text-smaller);
    margin: 0;
}

input {
    border: 1px solid var(--grey-light-medium);
    border-radius: var(--brs-small);
    padding: 0.25em 0.25em;
    background-color: var(--grey-light-medium);
    transition: border var(--fast), outline var(--fast);

    &::-webkit-calendar-picker-indicator {
        width: 1.25em;
        height: 1.25em;
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iNDAwLjAwMDAwMHB0IiBoZWlnaHQ9IjQwMC4wMDAwMDBwdCIgdmlld0JveD0iMCAwIDQwMC4wMDAwMDAgNDAwLjAwMDAwMCIKIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIG1lZXQiPgoKPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsNDAwLjAwMDAwMCkgc2NhbGUoMC4xMDAwMDAsLTAuMTAwMDAwKSIKZmlsbD0iIzA4NzBlMiIgc3Ryb2tlPSIjMDg3MGUyIj4KPHBhdGggZD0iTTE3OTAgMzU2NSBjLTU5NiAtODIgLTEwOTcgLTQ5NSAtMTI4NSAtMTA1OSAtNjQgLTE5MCAtNzkgLTI4OCAtNzkKLTUwNiAwIC0xNjQgNCAtMjEyIDIzIC0zMDAgMTA2IC00OTcgNDA3IC04OTIgODQ2IC0xMTEyIDUwNSAtMjUzIDExMTEgLTIxNQoxNTgwIDk4IDM1MSAyMzQgNTg1IDU4NSA2NzYgMTAxNCAzMyAxNTIgMzMgNDQ4IDAgNjAwIC0xMDYgNDk3IC00MDcgODkyIC04NDYKMTExMiAtMjgwIDE0MSAtNjA3IDE5NSAtOTE1IDE1M3ogbTQ1NyAtMTgxIGMyNzIgLTQ3IDUyNCAtMTc3IDczMCAtMzc3IDI4MQotMjcyIDQyNiAtNjE3IDQyNiAtMTAwNyAwIC0zNzggLTEzMyAtNzA2IC0zOTYgLTk3NyAtMjcyIC0yODEgLTYxNyAtNDI2Ci0xMDA3IC00MjYgLTM5MCAwIC03MzUgMTQ1IC0xMDA3IDQyNiAtMjYzIDI3MSAtMzk2IDU5OSAtMzk2IDk3NyAwIDM3OCAxMzMKNzA2IDM5NiA5NzcgMjM0IDI0MSA1MjcgMzg0IDg2MyA0MjMgOTggMTEgMjgwIDQgMzkxIC0xNnoiLz4KPHBhdGggZD0iTTE5ODIgMjkyMCBjLTQ5IC0yMCAtNTIgLTQ2IC01MiAtNTAyIDAgLTM4MyAyIC00MjYgMTggLTQ1NyAxNCAtMjgKNzIgLTY2IDM1MiAtMjMyIDIzOSAtMTQyIDM0NCAtMTk4IDM2NiAtMTk5IDM4IDAgODQgNDIgODQgNzYgMCA1NSAtMTkgNjkKLTMzMSAyNTQgbC0zMDggMTgzIC0zIDQxOSAtMyA0MjAgLTI4IDI0IGMtMjkgMjUgLTU2IDI5IC05NSAxNHoiLz4KPC9nPgo8L3N2Zz4K");
    }

    &:hover {
        outline: 0;
        border-color: var(--blue);
    }

    &:focus {
        outline: 1px solid var(--blue);
    }
}

textarea {
    resize: none;
    border: 1px solid var(--grey-light-medium);
    border-radius: var(--brs-small);
    padding: 0.25em 0.25em;
    background-color: var(--grey-light-medium);
    transition: border var(--fast), outline var(--fast);

    &:hover {
        outline: 0;
        border-color: var(--blue);
    }

    &:focus {
        outline: 1px solid var(--blue);
    }
}

.row {
    --bs-gutter-x: 0.5em;
}
</style>
