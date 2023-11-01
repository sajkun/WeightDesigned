<!-- Отображение краткой информации по бункеру об общем количестве переданного и полученного зерна -->
<template>
    <div
        class="bvs-short"
        @click="toggleSelect"
        :class="{ selected: bvs.selected }"
    >
        <div class="row">
            <div class="col-4">
                <span class="name">{{ bvs.name }}</span>
            </div>
            <div class="col-4">
                <span class="label">Всего принято</span>
            </div>
            <div class="col-4"><span class="label">Всего выгружено</span></div>
            <div class="col-4"></div>
            <div class="col-4">{{ total.received }}</div>
            <div class="col-4">{{ total.delivered }}</div>
        </div>
    </div>
</template>

<script>
import { strip, clog } from "@/misc/helpers";
export default {
    props: {
        // данные от БВС
        _bvs: {
            type: Object,
            default: {},
            required: true,
        },
    },

    computed: {
        items() {
            const vm = this;
            const items = strip(vm.bvs?.items);

            return {
                received: items.filter((item) => {
                    return item.to === item.bvs_name;
                }),

                delivered: items.filter((item) => {
                    return item.from === item.bvs_name;
                }),
            };
        },
        // всего получено
        total() {
            const vm = this;

            let totalReceived = vm.items.received.reduce((total, item) => {
                return total + item.amount_transfered;
            }, 0);

            totalReceived =
                totalReceived > 1000
                    ? `${totalReceived / 1000}т.`
                    : `${totalReceived}кг`;

            let totalDelivered = vm.items.delivered.reduce((total, item) => {
                return total + item.amount_transfered;
            }, 0);

            totalDelivered =
                totalDelivered > 1000
                    ? `${totalDelivered / 1000}т.`
                    : `${totalDelivered}кг`;

            return {
                received: totalReceived,
                delivered: totalDelivered,
            };
        },
    },

    watch: {
        // обновление отобрадения данных
        _bvs(bvs) {
            this.bvs = bvs;
        },
    },
    data() {
        return {
            bvs: this._bvs,
        };
    },
    methods: {
        toggleSelect() {
            const vm = this;
            vm.$nextTick(() => {
                vm.$emit("select", { name: vm.bvs.name });
            });
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
