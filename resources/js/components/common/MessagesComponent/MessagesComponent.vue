<!-- Отображение всплывающих сообщений
аналог alert() и confirm() -->
<template>
    <div class="container" v-click-outside="close">
        <Transition
            :key="'msg' + key"
            name="bounce"
            v-for="(msg, key) in messages"
        >
            <div :class="key + '-message'" v-if="msg">
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
export default {
    directives: {
        clickOutside,
    },
    data() {
        return {
            messages: this._messages,
            clicksOutside: 0,
        };
    },
    props: ["_messages"],

    watch: {
        _messages: {
            async handler(m) {
                const vm = this;
                vm.clicksOutside = 0;
                vm.messages = m;
            },
            deep: true,
        },
    },
    methods: {
        confirm() {
            this.$emit("confirm-msg", {});
        },

        cancel() {
            this.$emit("cancel-msg", {});
        },

        clear() {
            this.$emit("clear-msg", {});
        },

        close() {
            const vm = this;
            if (vm.clicksOutside) {
                vm.clear();
            }

            vm.clicksOutside++;
        },
    },
};
</script>
