<template>
    <div class="component-wrapper" :class="{ expanded: expanded }">
        <div class="row m-0">
            <div class="col-3 px-0 border-right">
                <button
                    class="btn-switcher px-2"
                    type="button"
                    @click="toggleExpand()"
                >
                    <p
                        class="m-0 d-flex justify-content-between align-items-center"
                    >
                        <span>{{ info.name }}</span>
                        <i class="fa fa-chevron-down"></i>
                    </p>
                </button>
            </div>
            <div class="col-9 px-0"></div>
        </div>

        <Transition
            :css="false"
            v-on:before-enter="beforeEnter"
            v-on:enter="enter"
            v-on:leave="leave"
        >
            <div
                class="row m-0 overflow-hidden expandable-content"
                v-show="expanded"
            >
                <div class="col-3 text-left border-right ps-3">
                    <button type="button" class="button-add my-2">
                        + Добавить механизатора
                    </button>
                </div>
                <div class="col-9 px-0"></div>
            </div>
        </Transition>
    </div>
</template>

<script>
//вспомогательные функции
import moment from "moment";
import { strip, clog } from "@/misc/helpers";

//миксины
import animateExpand from "@/mixins/animateExpand";
import icons from "@/mixins/icons";
export default {
    mixins: [animateExpand, icons],
    watch: {
        _info: {
            handler(info) {
                this.info = info;
            },
            deep: true,
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
            /**
             * Данные о компоненте
             *
             * @var{Object}
             */
            info: this._info,

            /**
             * Признак отображения или скрытия компонента
             *
             * @var {Boolean}
             */
            expanded: false,
        };
    },
    methods: {
        /**
         * сворачивает и разорачивает содержимое блока
         *
         * @param {Boolean} mode
         *
         * @returns {Void}
         */
        toggleExpand(mode) {
            const vm = this;
            vm.expanded = mode ? mode : !vm.expanded;
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
