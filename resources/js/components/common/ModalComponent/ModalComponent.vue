<!-- Компонент всплывающее окно -->
<template>
    <Transition name="fade">
        <div
            class="modal-window"
            v-if="show"
            @keyup.esc="toggleDisplay(false)"
            tabindex="1"
            ref="wrapper"
            @click="clickWrapperClose($event)"
        >
            <div class="modal-window__content">
                <button
                    class="btn btn-close"
                    type="button"
                    @click="toggleDisplay(false)"
                ></button>
                <slot></slot>
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    props: {
        /**
         * Ключ отвечающий за отображение окна
         */
        _show: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    data() {
        return {
            show: this._show,
        };
    },
    methods: {
        /**
         * Закрытие по клику на фон окна-контейнера
         *
         * @param {ClickEvent} event
         */
        clickWrapperClose(event) {
            const vm = this;
            if (!event.target.closest(".modal-window__content")) {
                vm.toggleDisplay(false);
            }
        },
        /**
         * Метод скрытия или отображения окна
         *
         * @param {Boolean | null} mode
         */
        toggleDisplay(mode = null) {
            this.show = mode !== null ? mode : !this.show;
        },
    },

    watch: {
        _show(show) {
            if (show === this.show) return;
            this.show = show;
        },

        /**
         * Фокусировка на окне, чтобы сработала клавиша esc
         *
         * @param {Boolean} show
         */
        show(show) {
            const vm = this;

            if (show) {
                setTimeout(() => {
                    vm.$refs.wrapper.focus();
                }, 500);
            } else {
                vm.$emit("closed");
            }
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
