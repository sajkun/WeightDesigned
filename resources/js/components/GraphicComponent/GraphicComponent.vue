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
                y: 40,
                x: 50,
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
            ctx.fillStyle = "#000";
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

            const endPoint = _points[_points.length - 1];
            _points.push([vm.zero.y, endPoint[1]]);
            polyline(ctx, _points);
            ctx.fillStyle = "#E1F3EA55";
            ctx.fill();

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

            ctx.font = "0.75rem sans-serif";
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "#ccc";
            ctx.fillStyle = "#999";

            let label = 0;
            for (var i = 0; i < cnvs.width; i += step.x) {
                //вертикальные
                polyline(ctx, [
                    [zero.y, i + zero.x],
                    [cnvs.height, i + zero.x],
                ]);

                if (i) {
                    label += step.perStepX;
                    ctx.rotate(Math.PI / 2);
                    ctx.fillText(label, i + zero.x, -15);
                    ctx.rotate(-Math.PI / 2);
                }
            }

            label = 0;
            for (let i = 0; i < cnvs.height; i += step.y) {
                //Горизонтальные
                polyline(ctx, [
                    [i + zero.y, zero.x],
                    [i + zero.y, cnvs.width],
                ]);

                if (i) {
                    clog(label);
                    label += step.perStepY;
                    ctx.rotate(Math.PI / 2);
                    ctx.fillText(label, 0, -1 * (i + zero.y));
                    ctx.rotate(-Math.PI / 2);
                }
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
             *
             * @param {Enum} type x | y
             *
             * @returns {Array[lengthPart, perStepX ]} длина шага сетки, количествое единиц графика в шаге сетки
             */
            const getAxisData = (type) => {
                // длина оси
                const _length =
                    type === "x"
                        ? cnvs.width - vm.zero[type]
                        : cnvs.height - vm.zero[type];

                // максимальное округленное значение
                const _max = getRoundedValue(
                    vm.info.axis[type].maxValue,
                    "ceil"
                );

                // максимальное количество разбиение
                let _maxStepsNumber = Math.ceil(_length / vm.minStep[type]);

                _maxStepsNumber = Math.min(_maxStepsNumber, _max);

                let _orderValue = _max.toString().length - 1;
                _orderValue = Math.max(0, _orderValue);

                const _perStepX = Math.pow(10, _orderValue);

                const _lengthPart = (_perStepX * _length) / _max;

                return [_lengthPart, _perStepX, _max];
            };

            const [lengthPartX, perStepX, maxX] = getAxisData("x");
            const [lengthPartY, perStepY, maxY] = getAxisData("y");

            const _return = {
                x: lengthPartX,
                y: lengthPartY,
                perStepX,
                perStepY,
                maxX,
                maxY,
            };

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
