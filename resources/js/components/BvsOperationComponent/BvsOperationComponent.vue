<!-- отображение данных об операции бвс -->
<template>
    <div class="row">
        <div class="col-4">
            <span class="name">
                {{ info.bvs_name }}
            </span>
        </div>
        <div class="col-4"></div>
        <div class="col-4"></div>
        <div class="col-4"></div>
        <div class="col-4"></div>
        <div class="col-4"></div>
        <div class="col-4"></div>
        <div class="col-4"></div>
        <div class="col-4"></div>
    </div>
</template>

<script>
export default {
    watch: {
        _info(val) {
            console.log(val);
            this.info = val;
            return null;
        },
    },
    props: {
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
    methods: {},
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
