<!-- отображение данных об операции бвс -->
<template>
    <div
        class="root-wrapper bvs-operation"
        :class="{ selected: info.selected }"
        :title="'Операция №' + info.id"
    >
        <div class="bvs-operation__header">
            <div class="row">
                <div class="col-4">
                    <h5 class="bvs-operation__name">Операция №{{ info.id }}</h5>
                </div>
                <div class="col-4">
                    <div class="bvs-operation__object">
                        <i class="icon" v-html="operationInfo.icon"></i>
                        <span class="bvs-operation__object-name">{{
                            operationInfo.object
                        }}</span>
                        <button
                            class="btn p-0"
                            type="button"
                            @click="clickCb"
                            :class="clickedClass"
                        >
                            <i class="icon" v-html="locationIcon"></i>
                        </button>
                    </div>
                </div>
                <div class="col-4 text-end">
                    <span class="bvs-operation__date">{{ operationTime }}</span>
                </div>
            </div>
        </div>
        <div class="bvs-operation__body">
            <div class="row">
                <div class="col-12 col-sm-6 col-lg-3">
                    <h6 class="bvs-operation__label">Количество</h6>
                    <p class="bvs-operation__data">
                        {{ operationInfo.transfered }}
                    </p>
                </div>
                <div class="col-12 col-sm-6 col-lg-3">
                    <h6 class="bvs-operation__label">Вес в бункере</h6>
                    <p class="bvs-operation__data">
                        {{ operationInfo.ammountInBunker }}
                    </p>
                </div>
                <div
                    class="col-12 col-sm-6 col-lg-3"
                    :title="status.check.text"
                >
                    <h6 class="bvs-operation__label">Статус чека</h6>
                    <p
                        class="bvs-operation__data bvs-operation__data-state"
                        :class="status.check.status"
                    >
                        {{ status.check.text }}
                    </p>
                </div>
                <div class="col-12 col-sm-6 col-lg-3" :title="status.rfid.text">
                    <h6 class="bvs-operation__label">RFID метка</h6>
                    <p
                        class="bvs-operation__data bvs-operation__data-state"
                        :class="status.rfid.status"
                    >
                        <span class="bvs-operation__data-inner">
                            {{ status.rfid.text }}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import "moment/locale/ru";
// вспомогательные функции
import { strip, clog } from "@/misc/helpers";

//миксины
import icons from "@/mixins/icons";

let clickedTimeout;
export default {
    mixins: [icons],
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
        clickedClass() {
            return this.btnClicked ? "clicked" : "";
        },

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
            const type =
                vm.info.to === vm.info.bvs_name
                    ? "загружено из"
                    : "выгружено в";

            let transfered = parseFloat(vm.info.amount_transfered);
            let units = transfered > 1000 ? "т" : "кг";
            transfered = transfered > 1000 ? transfered / 1000 : transfered;
            const transferedformatted = `${type} ${transfered}${units}`;

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

            const operationInfo = {
                transfered: transferedformatted,
                type: type,
                object: object,
                ammountInBunker: `${ammountInBunker}${units}`,
                icon: type === "загружено из" ? vm.downloadIcon : vm.uploadIcon,
            };

            return operationInfo;
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
                    rfid = "Карта не обнаружена";
                    break;
                case 1:
                    rfid = "Карта идентифицирована";
                    break;
                case 2:
                    rfid = "Карта обнаружена, но не идентифицирована";
                    break;
                case 10:
                    rfid = "Ошибка считывателя";
                    break;
            }

            const rfidStatus =
                vm.info.rfid_status === 1
                    ? "success"
                    : vm.info.rfid_status === 10
                    ? "error"
                    : "notification";

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
            btnClicked: false,
        };
    },
    methods: {
        async clickCb() {
            const vm = this;
            const data = strip(vm.info);

            if (clickedTimeout) {
                clearTimeout(clickedTimeout);
            }

            vm.btnClicked = false;
            await vm.$nextTick();
            vm.btnClicked = true;

            clickedTimeout = setTimeout(() => {
                if (vm.btnClicked) {
                    vm.$emit("selected", data);
                }

                vm.btnClicked = false;
            }, 600);
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
