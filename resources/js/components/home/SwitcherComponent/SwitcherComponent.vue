<!-- Несколько кнопок выбора, по нажатию на любую эмитит строку.
Используется:
- на главной странице
 -->
<template>
    <div class="d-flex button-holder">
        <button
            class="btn flex-grow-1 btn-switcher"
            type="button"
            :class="{ active: activeMode === key }"
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
        // текущий режим работы родителя
        _activeMode: {
            type: String,
            default: "",
            required: false,
        },
        // список кнопок
        _buttons: {
            type: Object,
            default: [],
            required: true,
        },
    },

    watch: {
        // интерактивность изменения режима работы
        _activeMode(mode) {
            this.activeMode = mode;
        },
    },

    data() {
        return {
            buttons: this._buttons,
            activeMode: this._activeMode,
        };
    },
    methods: {
        // обработчик выбора кнопки
        trigger(key) {
            this.$emit("clicked", { mode: key });
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
