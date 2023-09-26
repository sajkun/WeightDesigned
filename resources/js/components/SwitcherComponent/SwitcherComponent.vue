<template>
    <div class="d-flex mt-2 button-holder">
        <button
            class="btn flex-grow-1"
            type="button"
            v-for="(btn, key) in buttons"
            @click="trigger(key)"
            :key="'btn' + key"
        >
            {{ btn }}
        </button>
    </div>
</template>

<script>
export default {
    props: {
        _buttons: {
            type: Object,
            default: [],
            required: true,
        },
    },

    data() {
        return {
            buttons: this._buttons,
        };
    },
    methods: {
        trigger(key) {
            this.$emit("clicked", { mode: key });
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
