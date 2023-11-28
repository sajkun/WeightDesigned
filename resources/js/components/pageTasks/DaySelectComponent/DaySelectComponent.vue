<template>
    <div>123</div>
</template>

<script>
import moment from "moment";
import { strip, clog } from "@/misc/helpers";

export default {
    created() {
        // const today = new Date();
        // const helper = moment(today);
        // clog(helper);
    },

    watch: {},

    props: {
        _dateRange: {
            type: Object,
            default: {
                start: null,
                end: null,
            },
            required: true,
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
