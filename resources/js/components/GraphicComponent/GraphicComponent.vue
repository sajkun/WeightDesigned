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
import { strip, clog, polyline, getRoundedValue } from "@/misc/helpers";

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
         * Минимально визуально распозноваемая длина отрезка на оси
         *
         * @returns {Object} {x<Int>, y<Int>}
         */
        minStep() {
            return {
                x: 20,
                y: 20,
            };
        },

        /**
         * координаты точки отсчёта
         *
         * @returns {Object} {x<Int>, y<Int>}
         */
        zero() {
            return {
                x: 0,
                y: 40,
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
        drawAxises() {
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
            const step = vm.getStepsData();

            let _points = Object.values(points).map((d) => [
                (d.y / step.perStepY) * step.y + vm.zero.y,
                (d.x / step.perStepX) * step.x + vm.zero.x,
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
         * @returns {Void}
         */
        drawGrid() {
            const vm = this;
            const [cnvs, ctx] = vm.getCnv;
            const zero = strip(vm.zero);
            const step = strip(vm.getStepsData());
            const info = strip(vm.info);

            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 0.5;

            for (var i = step.x; i < cnvs.width; i += step.x) {
                //вертикальные
                polyline(ctx, [
                    [zero.y, i + zero.x],
                    [cnvs.height, i + zero.x],
                ]);
            }

            for (var i = step.y; i < cnvs.height; i += step.y) {
                //Горизонтальные
                polyline(ctx, [
                    [i + zero.y, zero.x],
                    [i + zero.y, cnvs.width],
                ]);
            }

            return;
        },

        /**
         * Возвращает шаг сетки
         *
         * @returns {Object}
         */
        getStepsData() {
            const vm = this;
            const info = strip(vm.info);

            if (!info) {
                return vm.minStep;
            }
            const [cnvs] = vm.getCnv;

            /**
             *  Вычислить максимальное количество отрезков по осям
             */
            // длина оси абсцисс
            const lengthX = cnvs.width;
            // длина оси ординат
            const lengthY = cnvs.height;
            // минимально возможный шаг сетки по оси ОХ
            let maxStepsNumberX = Math.ceil(lengthX / vm.minStep.x);
            // минимально возможный шаг сетки по оси ОУ
            let maxStepsNumberY = Math.ceil(lengthY / vm.minStep.y);

            /**
             * Вычислить максимальное округленное значение  отрезков по осям
             */

            // максимальное округленное значение оси OX
            const maxX = getRoundedValue(vm.info.axis.x.maxValue, "ceil");
            const maxY = getRoundedValue(vm.info.axis.y.maxValue, "ceil");

            maxStepsNumberX = Math.min(maxStepsNumberX, maxX);
            maxStepsNumberY = Math.min(maxStepsNumberY, maxY);

            let lengthPartX = Math.floor(lengthX / maxStepsNumberX);
            let lengthPartY = Math.floor(lengthY / maxStepsNumberY);

            lengthPartX = Math.max(lengthPartX, 20);
            lengthPartY = Math.max(lengthPartY, 20);

            const perStepX = Math.ceil((maxX * lengthPartX) / lengthX);
            const perStepY = Math.ceil((maxY * lengthPartY) / lengthY);

            const _return = {
                x: lengthPartX,
                y: lengthPartY,
                perStepX,
                perStepY,
            };

            clog(_return);

            return _return;
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
            const info = strip(vm.info);
            vm.prepareCanvas();
            vm.drawGrid();
            vm.drawAxises();
            vm.drawGraph(info.points);
        }, 1000);
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
