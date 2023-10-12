<!-- шаблон для отображения столбцов рейтинга -->
<template>
    <div
        class="columns-wrapper d-flex flex-column"
        :class="{ vh: info.length === 0 }"
    >
        <div class="p-1 p-4-md d-flex flex-column flex-grow-1">
            <!-- столбцы рейтинга -->
            <div class="d-flex flex-grow-1" ref="columns-holder">
                <div
                    class="column-5 d-flex flex-column justify-content-end"
                    v-for="(col, idx) in columns"
                    :key="'val' + idx"
                >
                    <div
                        class="rating-column flex-shrink-0 align"
                        :class="'rating-' + (idx + 1)"
                        :style="{
                            height: col.height + 'px',
                            transitionDelay: 0.2 * idx + 's',
                        }"
                    >
                        <b
                            class="p-2"
                            v-if="parseName(col.item) && col.height"
                            >{{ col.item.amount }}</b
                        >
                    </div>
                </div>
            </div>

            <!-- список наименования -->
            <div class="d-flex mt-4 align-items-end">
                <transition-group name="sort" v-on:leave="onLeave" :css="false">
                    <div
                        class="column-5 text-start"
                        v-for="item in info"
                        :key="'col' + item.pid"
                    >
                        {{ parseName(item) }}
                    </div>
                </transition-group>
            </div>

            <!-- Метки порядкового номера и звездочка  -->
            <div class="d-flex columns-wrapper__footer mt-4">
                <div class="column-5 place-1">
                    <div class="column-5__inner">
                        1 <i class="fa fa-star"></i>
                    </div>
                </div>
                <div class="column-5 place-2">
                    <div class="column-5__inner">
                        2 <i class="fa fa-star"></i>
                    </div>
                </div>
                <div class="column-5 place-3">
                    <div class="column-5__inner">
                        3 <i class="fa fa-star"></i>
                    </div>
                </div>
                <div class="column-5 place-4">
                    <div class="column-5__inner">4</div>
                </div>
                <div class="column-5 place-5">
                    <div class="column-5__inner">5</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { strip, clog } from "../../misc/helpers";

import sortAnimation from "../../mixins/sortAnimation";
export default {
    mixins: [sortAnimation],
    watch: {
        _maxValue(val) {
            this.maxValue = val;
            return null;
        },
        _info(info) {
            this.info = Object.values(info).slice(0, 5);
            return null;
        },
    },
    props: {
        _maxValue: {
            type: Number,
            default: 0,
            required: false,
        },

        _info: {
            type: Object,
            default: {},
            required: true,
        },
    },
    data() {
        return {
            info: Object.values(this._info).slice(0, 5),
            maxValue: this._maxValue,
        };
    },

    computed: {
        emptyColumn() {
            return {
                height: 0,
                item: {
                    amount: 0,
                    name: "",
                    model: "-",
                },
            };
        },
        /**
         * @returns {Array} массив объектов с высотой колонок и соответсвующим объектом рейтинга
         */
        columns() {
            const vm = this;
            let data = strip(vm.info);

            if (!data.length) {
                data = [
                    strip(vm.emptyColumn),
                    strip(vm.emptyColumn),
                    strip(vm.emptyColumn),
                    strip(vm.emptyColumn),
                    strip(vm.emptyColumn),
                ];
                return data;
            }

            const parentheight = vm.$refs["columns-holder"].clientHeight - 40;

            data = data.map((item) => {
                const height =
                    (((item.amount * 100) / vm.maxValue) * parentheight) / 100;
                return {
                    height: isNaN(height) ? 0 : height,
                    item: item,
                };
            });

            for (let i = data.length; i < 5; i++) {
                data.push(vm.emptyColumn);
            }

            return data;
        },
    },

    mounted() {
        const vm = this;
        vm.info = Object.values(vm._info).slice(0, 5);

        vm.$nextTick(() => {
            vm.$el.parentNode.style.height =
                vm.$el.parentNode.scrollHeight + "px";
            vm.$refs["columns-holder"].style.height =
                vm.$refs["columns-holder"].scrollHeight - 40 + "px";
        });
    },

    methods: {
        /**
         * @param {Object} item информация о строке рейтинга
         *
         * @return {String} название техники или ФИО
         */
        parseName(item) {
            if (["vehicle", "-"].indexOf(item.model) >= 0) {
                return item.name;
            }

            const parts = item.name.split(" ");
            let name = parts.shift();

            for (const part of parts) {
                name = `${name.trim()} ${part.substring(0, 1)}.`;
            }

            return name;
        },
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
