<!-- Отображение всплывающих сообщений
аналог alert() и confirm() -->
<template>
    <div class="container">
        <Transition
            :key="'msg' + key"
            name="bounce"
            v-for="(msg, key) in messages"
        >
            <div :class="key + '-message'" v-click-outside="close" v-if="msg">
                {{ msg }}
                <div class="row" v-if="key === 'confirm'">
                    <div class="col-12 col-md-6 mt-2">
                        <button
                            class="btn btn-borders-grey w-100"
                            @click="cancel"
                            type="button"
                        >
                            Отмена
                        </button>
                    </div>
                    <div class="col-12 col-md-6 mt-2">
                        <button
                            class="btn btn-borders w-100"
                            type="button"
                            @click="confirm"
                        >
                            Подтведить
                        </button>
                    </div>
                </div>
                <button
                    class="btn btn-close"
                    type="button"
                    @click="clear()"
                    v-if="key != 'confirm'"
                ></button>
            </div>
        </Transition>
    </div>
</template>

<script>
//хэлперы
import { strip, clog } from "@/misc/helpers";

//диррективы
import clickOutside from "@/directives/click-outside";
let timeout;
export default {
    directives: {
        clickOutside,
    },
    data() {
        return {
            messages: this._messages,
            blockClose: 0,
        };
    },
    props: ["_messages"],

    watch: {
        _messages: {
            handler(m) {
                const vm = this;
                vm.blockClose = 1;
                vm.messages = m;

                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(() => {
                    vm.blockClose = 0;
                }, 150);
            },
            deep: true,
        },
    },

    methods: {
        cancel() {
            this.$emit("cancel-msg", {});
        },

        clear() {
            this.$emit("clear-msg", {});
        },

        close() {
            const vm = this;
            if (vm.blockClose) return;
            vm.clear();
        },

        confirm() {
            this.$emit("confirm-msg", {});
        },
    },
};
</script>
