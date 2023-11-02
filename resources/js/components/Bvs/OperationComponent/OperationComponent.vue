<!-- отображение данных об операции бвс -->
<template>
    <div
        class="root-wrapper py-2"
        @click="clickCb"
        :class="{ selected: info.selected }"
    >
        <div class="row">
            <div class="col-6">
                <b>Операция №{{ info.id }}</b>
            </div>
            <div class="col-6 text-end">
                <span class="date">{{ operationTime }}</span>
            </div>
            <div class="col-6 col-lg-4">
                <p class="m-0 label">Статус:</p>
                <span>{{ operationInfo.formatted }}</span>
            </div>
            <div class="col-6 col-lg-4">
                <p class="m-0 label">Вес в бункере:</p>
                <span>{{ operationInfo.ammountInBunker }}</span>
            </div>
            <div class="col-6 col-lg-4">
                <p class="m-0 label">Статус чека:</p>
                <span :class="status.check.status">{{
                    status.check.text
                }}</span>
            </div>
            <div class="col-6 col-lg-4">
                <p class="m-0 label">Выгрузил:</p>
                <span>{{ info.from }}</span>
            </div>
            <div class="col-6 col-lg-4">
                <p class="m-0 label">Принял:</p>
                <span>{{ info.to }}</span>
            </div>
            <div class="col-6 col-lg-4">
                <p class="m-0 label">RFID:</p>
                <span style="font-size: 0.75rem" :class="status.rfid.status">{{
                    status.rfid.text
                }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import "moment/locale/ru";
import { strip, clog } from "@/misc/helpers";
export default {
    watch: {
        /**
         * обновления данных оь операций от ролдительского элемента
         *
         * @param {Object} val
         *
         * @returns null
         */
        _info(val) {
            this.info = val;
            return null;
        },
    },

    computed: {
        /**
         * Форматированная дата операции
         *
         * @returns {String}
         */
        operationTime() {
            const dateString = this?.info.operation_time;
            moment.locale("ru");
            const date = moment(dateString).format("D MMMM YYYY в hh:mm");

            return date;
        },

        /**
         * Тип операции передано / принято и количество
         *
         * @returns {Object}
         * {
         *      formatted: string,
                type: string,
                object: string,
         *
         * }
         */
        operationInfo() {
            const vm = this;
            if (!vm.info) {
                return null;
            }

            // данные о количестве переданном принятом
            let type =
                vm.info.to === vm.info.bvs_name ? "принято" : "отгружено";

            let total = parseFloat(vm.info.amount_transfered);
            let units = total > 1000 ? "т" : "кг";
            total = total > 1000 ? total / 1000 : total;
            const formatted = `${type} ${total}${units}`;
            type = type === "принято" ? `принято от` : type;

            // объект относительно бункера
            const object =
                vm.info.bvs_name === vm.info.to ? vm.info.from : vm.info.to;

            // данные об остатках в бункере
            let ammountInBunker = parseFloat(vm.info.amount_in_bunker);
            units = ammountInBunker > 1000 ? "т" : "кг";
            ammountInBunker =
                ammountInBunker > 1000
                    ? ammountInBunker / 1000
                    : ammountInBunker;

            return {
                formatted: formatted,
                type: type,
                object: object,
                ammountInBunker: `${ammountInBunker}${units}`,
            };
        },

        /**
         * статусы чека и считывателя rfid
         *
         * @returns {Object}
         */
        status() {
            const vm = this;
            let rfid;

            switch (vm.info.rfid_status) {
                case 0:
                    rfid = "карта не обнаружена";
                    break;
                case 1:
                    rfid = "карта идентифицирована";
                    break;
                case 2:
                    rfid = "карта обнаружена, но не идентифицирована";
                    break;
                case 10:
                    rfid = "ошибка считывателя";
                    break;
            }

            const rfidStatus = vm.info.rfid_status === 1 ? "success" : "error";

            const checkText = Boolean(vm.info.has_check)
                ? "Распечатан"
                : "Не распечатан";

            const checkStatus = Boolean(vm.info.has_check)
                ? "success"
                : "error";

            return {
                rfid: {
                    text: rfid,
                    status: rfidStatus,
                },

                check: {
                    text: checkText,
                    status: checkStatus,
                },
            };
        },
    },
    props: {
        /**
         * обновление данных от родительского элемента
         */
        _info: {
            type: Object,
            default: {},
            required: true,
        },
    },
    data() {
        return {
            info: this._info,
        };
    },
    methods: {
        clickCb() {
            const vm = this;
            const data = strip(vm.info);
            vm.$emit("selected", data);
        },
    },
};
</script>

<style scoped lang="scss">
.root-wrapper {
    padding-right: calc(0.5 * var(--bs-gutter-x));
    padding-left: calc(0.5 * var(--bs-gutter-x));
    background-color: var(--lightest);
    transition: background-color var(--fast);

    &:hover {
        background-color: var(--grey-light);
    }
    &.selected {
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.3);
    }
}

.date {
    font-size: 0.75rem;
}
.error {
    color: var(--red);
}
.success {
    color: var(--green);
}
</style>
