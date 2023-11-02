<!-- шаблон для отображения столбцов рейтинга -->
<template>
    <div class="columns-wrapper d-flex flex-column">
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
                <transition-group name="sort" :css="false">
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
import { strip, clog } from "@/misc/helpers";

export default {
    watch: {
        _maxValue(val) {
            const vm = this;
            vm.maxValue = val;
            vm.rating = vm.calculateRating();
            return null;
        },
        _info(info) {
            const vm = this;
            vm.info = Object.values(info).slice(0, 5);
            vm.rating = vm.calculateRating();
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
            rating: [],
            diagramHeight: 0,
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
            return this.rating;
        },
    },

    created() {
        const vm = this;
        for (let i = 0; i < 5; i++) {
            vm.rating.push(strip(vm.emptyColumn));
        }
    },

    mounted() {
        const vm = this;
        vm.info = Object.values(vm._info).slice(0, 5);

        // фиксация высот для того, чтобы избежать превышения блоком высоты экрана
        vm.$nextTick(() => {
            vm.fitHeight();
            vm.rating = vm.calculateRating();
        });

        let ratingUpdateAction;

        window.addEventListener("resize", () => {
            if (ratingUpdateAction) {
                clearTimeout(ratingUpdateAction);
            }
            vm.fitHeight();

            ratingUpdateAction = setTimeout(() => {
                vm.rating = vm.calculateRating();
            }, 100);
        });
    },

    methods: {
        /**
         * Вычмисляет данные рейтинга
         *
         * @returns {Array} массив объектов с высотой колонок и соответсвующим объектом рейтинга
         */
        calculateRating() {
            const vm = this;
            let data = strip(vm.info);

            // создание массива пустых элементов для сохранения анимаций
            if (!data.length) {
                data = [];
                for (let i = 0; i < 5; i++) {
                    data.push(strip(vm.emptyColumn));
                }
                return data;
            }

            /**
             * вычисление размеров столбцов диаграммы
             */

            /**
             * массив данных для отображения диаграммы рейтинга
             *
             * @returns [
             * ...{
             *    height {Integer}: высота колонки в пикселях
             *    item {Object}:  строка рейтинга на основании   которой сделаны вычисления
             * }
             * ]
             */
            data = data.map((item) => {
                const height =
                    (((item.amount * 100) / vm.maxValue) * vm.diagramHeight) /
                    100;

                return {
                    height: isNaN(height) ? 0 : height,
                    item: item,
                };
            });

            // заполнение результирующего массива пустыми элемиентами до 5. В целях сохранения анимации
            for (let i = data.length; i < 5; i++) {
                data.push(vm.emptyColumn);
            }

            return data;
        },

        /**
         * фиксация высот всего блока и контейнера с диаграммой.
         * явно задаёт высоту $el.parentNode и $refs["columns-holder"]
         *
         * @returns {Void}
         */
        fitHeight() {
            const vm = this;
            const unit = "px";
            const root = vm.$el.parentNode;
            const diagram = vm.$refs["columns-holder"];
            const delta = 40;

            root.style.height = "auto";
            diagram.style.height = "auto";

            const rootHeight = Math.max(root.scrollHeight, 400);
            vm.diagramHeight = diagram.scrollHeight - delta;

            vm.$nextTick(() => {
                root.style.height = `${rootHeight}${unit}`;
                diagram.style.height = `${vm.diagramHeight}${unit}`;
            });

            return;
        },
        /**
         * @param {Object} item информация о строке рейтинга
         *
         * @return {String} название техники или ФИО
         */
        parseName(item) {
            // если техника, возвращает имя
            if (["vehicle", "-"].indexOf(item.model) >= 0) {
                return item.name;
            }

            //если работник, то возвращает фамимлию и инициалы
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
