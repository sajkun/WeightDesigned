<!-- поле поиска -->
<template>
    <div class="form-wrapper">
        <form @submit.prevent="submit" method="POST" class="search">
            <input
                type="search"
                class="no-style"
                placeholder="Илья муромец"
                v-model="value"
            />
            <button class="btn p-0" type="submit">
                <i v-html="searchIcon"></i>
            </button>
        </form>
    </div>
</template>

<script>
import icons from "@/mixins/icons";
export default {
    mixins: [icons],
    data() {
        return {
            value: null,
        };
    },

    methods: {
        submit() {
            const vm = this;
            vm.$emit("search", { search: vm.value });
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
