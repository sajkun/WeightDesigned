<!-- Двухмерный график, отрисованный по точкам
    Входные данные:
    axis:
        x:
           label: string
           maxValue:int
        y:
           label: string
           maxValue:int
    values: [
       [ int (x), int (y)]
    ]
-->
<template>
    <div class="w-100 h-100 component-root" ref="root">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
// хэлперы
import { strip, clog, polyline } from "@/misc/helpers";

export default {
    watch: {
        // Интерактивность обновления базовых данных длдя графика
        _info(newValue) {
            this.info = newValue;
            return null;
        },
    },
    props: {
        // Базовые данные для графика
        _info: {
            type: Object,
            default: {},
            required: true,
        },
    },
    data() {
        return {
            info: this._info,
        };
    },

    computed: {
        /**
         * Шаг сетки
         *
         * @returns {Object}
         */
        step() {
            return {
                x: 20,
                y: 20,
            };
        },

        /**
         * подготовочные данны для канвас
         *
         * @returns {Array}
         */
        getCnv() {
            const vm = this;
            const cnvs = vm.$refs.canvas;
            const ctx = cnvs.getContext("2d");

            return [cnvs, ctx];
        },

        /**
         * координаты точки отсчёта
         *
         * @returns {Object} {x<Int>, y<Int>}
         */
        zero() {
            return {
                x: this.step.x * 2,
                y: this.step.y * 2,
            };
        },
    },

    methods: {
        /**
         * Рисует оси абсцисс и ординат
         * Координаты задавать в формате (y, x)
         *
         * @returns  {Void}
         */
        drawAxis() {
            const vm = this;
            const cnvs = vm.$refs.canvas;
            const ctx = cnvs.getContext("2d");
            const zeroPoint = strip(vm.zero);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 0.5;

            //ось обсциc
            polyline(ctx, [
                [zeroPoint.y, zeroPoint.x],
                [zeroPoint.y, cnvs.width],
            ]);

            //ось ординат

            polyline(ctx, [
                [zeroPoint.y, zeroPoint.x],
                [cnvs.height, zeroPoint.x],
            ]);

            //стрелка оси ординат
            polyline(ctx, [
                [cnvs.height, zeroPoint.x],
                [cnvs.height - 15, zeroPoint.x - 5],
                [cnvs.height - 15, zeroPoint.x + 5],
                [cnvs.height, zeroPoint.x],
            ]);
            ctx.fill();

            //стрелка оси обсциc
            polyline(ctx, [
                [zeroPoint.y, cnvs.width],
                [zeroPoint.y - 5, cnvs.width - 15],
                [zeroPoint.y + 5, cnvs.width - 15],
                [zeroPoint.y, cnvs.width],
            ]);
            ctx.fill();

            return;
        },

        /**
         * Отрисовка графика
         *
         * @param {Array<Object>} points
         *
         * @returns {Void}
         */
        drawGraph(points) {
            const vm = this;
            const [cnvs, ctx] = this.getCnv;
            const step = strip(vm.step);

            let _points = Object.values(points).map((d) => [
                d.y * step.y + vm.zero.y,
                d.x * step.x + vm.zero.x,
            ]);

            ctx.strokeStyle = "#007e3c";
            ctx.lineWidth = 2;

            _points.unshift(Object.values(vm.zero));

            clog(_points);

            polyline(ctx, _points);
            return;
        },

        /**
         * Рисует сетку
         * Координаты задавать в формате (y, x)
         * из-за поворота канваc
         *
         * @param {Integer} step шаг отрисовки
         *
         * @returns {Void}
         */
        drawGrid(step) {
            const [cnvs, ctx] = this.getCnv;

            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 0.5;

            for (var i = step.y; i < cnvs.width; i += step.y) {
                //вертикальные
                polyline(ctx, [
                    [0, i],
                    [cnvs.height, i],
                ]);
            }

            for (var i = step.x; i < cnvs.height; i += step.x) {
                //Горизонтальные
                polyline(ctx, [
                    [i, 0],
                    [i, cnvs.width],
                ]);
            }

            return;
        },

        /**
         * Задает размер и стартовую точку канвас
         *
         * @returns {Void}
         */
        prepareCanvas() {
            const vm = this;
            const [cnvs, ctx] = this.getCnv;
            cnvs.width = vm.$refs.root.offsetWidth;
            cnvs.height = vm.$refs.root.offsetHeight - 50;
            ctx.translate(0, cnvs.height);
            ctx.rotate(-Math.PI / 2);

            return;
        },
    },

    mounted() {
        const vm = this;

        setTimeout(() => {
            const step = vm.step;
            const info = strip(vm.info);

            vm.prepareCanvas();
            vm.drawGrid(step);
            vm.drawAxis();
            vm.drawGraph(info.points);
        }, 1000);
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
