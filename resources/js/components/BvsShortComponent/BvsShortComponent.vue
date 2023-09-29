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
            <div class="col-4">{{ received }}</div>
            <div class="col-4">{{ delivered }}</div>
        </div>
    </div>
</template>

<script>
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
        // всего получено
        received() {
            return "999 тонн";
        },

        // всего выгружено
        delivered() {
            return "999 тонн";
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
