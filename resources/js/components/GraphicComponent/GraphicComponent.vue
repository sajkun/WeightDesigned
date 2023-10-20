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

let drawTimeout;
export default {
    watch: {
        // Интерактивность обновления базовых данных длдя графика
        _info(newValue) {
            this.info = newValue;
            return null;
        },

        info(info, oldVal) {
            const vm = this;
            if (drawTimeout) {
                clearTimeout(drawTimeout);
            }

            if (!info || info === oldVal) return;
            vm.prepareCanvas();
            vm.draw();
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
        draw() {
            const vm = this;
            const info = strip(vm.info);

            if (drawTimeout) {
                clearTimeout(drawTimeout);
            }

            vm.prepareCanvas();
            vm.drawGrid();
            vm.drawAxises();

            drawTimeout = setTimeout(() => {
                vm.drawGraph(info.points);
            }, 250);
        },

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
            ctx.strokeStyle = "#E1F3EA55";
            const endPoint = _points[_points.length - 1];
            _points.push([vm.zero.y, endPoint[1]]);
            polyline(ctx, _points);
            ctx.fillStyle = "#E1F3EA55";
            ctx.fill();

            _points.pop();

            ctx.strokeStyle = "#007e3c";
            ctx.lineWidth = 2;
            polyline(ctx, _points, true);

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

            ctx.font = "0.7rem sans-serif";
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "#ccc";
            ctx.fillStyle = "#999";

            let label = 0;

            if (step.x) {
                //вертикальные линии и метки к ним
                for (var i = 0; i < cnvs.width; i += step.x) {
                    polyline(ctx, [
                        [zero.y, i + zero.x],
                        [cnvs.height, i + zero.x],
                    ]);

                    if (i) {
                        label += step.perStepX;

                        const text = info.labels.x[label]
                            ? info.labels.x[label]
                            : "";
                        const textWidth = ctx.measureText(text).width;
                        ctx.rotate(Math.PI / 2);
                        ctx.fillText(text, i + zero.x - textWidth / 2, -15);
                        ctx.rotate(-Math.PI / 2);
                    }
                }
            }

            label = 0;

            if (step.y) {
                //Горизонтальные линии и метки к ним
                for (let i = 0; i < cnvs.height; i += step.y) {
                    polyline(ctx, [
                        [i + zero.y, zero.x],
                        [i + zero.y, cnvs.width],
                    ]);
                    if (i) {
                        label += step.perStepY;
                        const text = `${label}${info.axis.x.after}`;
                        ctx.rotate(Math.PI / 2);
                        ctx.fillText(text, 0, -1 * (i + zero.y));
                        ctx.rotate(-Math.PI / 2);
                    }
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
             * @param {Boolean} every признак чтто нужно учитывать каждый элемент, не нужно укрупнять
             *
             * @returns {Array[lengthPart, perStepX ]} длина шага сетки, количествое единиц графика в шаге сетки
             */
            const getAxisData = (type, every) => {
                // длина оси
                const _length =
                    type === "x"
                        ? cnvs.width - vm.zero[type]
                        : cnvs.height - vm.zero[type];

                // максимальное округленное значение
                const _max = vm.info.axis[type].maxValue;

                // максимальное количество разбиение
                let _maxStepsNumber = Math.ceil(_length / vm.minStep[type]);

                // проверка, чтобы количество
                _maxStepsNumber = Math.min(_maxStepsNumber, _max);

                let _orderValue = _max.toString().length - 1;
                _orderValue = Math.max(0, _orderValue);
                _orderValue = every ? 0 : _orderValue;

                const _perStepX = Math.pow(10, _orderValue);

                const _lengthPart = (_perStepX * _length) / _max;

                return [_lengthPart, _perStepX, _max];
            };

            const [lengthPartX, perStepX, maxX] = getAxisData("x", true);
            const [lengthPartY, perStepY, maxY] = getAxisData("y");

            const _return = {
                x: parseInt(lengthPartX),
                y: parseInt(lengthPartY),
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
            ctx.clearRect(0, 0, cnvs.width, cnvs.height);

            return;
        },
    },

    mounted() {
        const vm = this;
        vm.prepareCanvas();
        vm.draw();
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
