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
    <div class="w-100 h-100 component-root not-ready" ref="root">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
// вспомогательные функции
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
            const [cnvs, ctx] = vm.getCnv;

            ctx.clearRect(0, 0, cnvs.width, cnvs.height);

            vm.prepareCanvas();
            vm.drawGrid();
            vm.drawAxises();
            vm.drawGraph(info.points);
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
         * Получение методов отрисовки графика
         */
        getDrawMethods() {
            const vm = this;
            const [cnvs, ctx] = vm.getCnv;
            /**
             * Приводит массив точек к виду, необходимому для отрисовки
             * @param {Array} points
             */
            const preparePoints = (points, zero) => {
                const step = vm.getStepsData();

                let _points = Object.values(points).map((d) => [
                    (d.y / step.perStepY) * step.y + vm.zero.y,
                    (d.x / step.perStepX) * step.x + vm.zero.x,
                ]);

                _points.unshift(zero);

                return _points;
            };

            /**
             * Крайняя точка для области залития
             * @param {Array} points
             * @param {Array} zero zero[1] == vm.zero.x , zero[0] = vm.zero.x
             *
             * @returns {Array}
             */
            const generateLastPoint = (points, zero) => {
                const endPoint = points[points.length - 1];
                return [zero[0], endPoint[1]];
            };

            /**
             * Отрисовка графика
             *
             * @param {Array} points массив подготовленных для отрисовки точек
             * @param {String} strokeStyle строка hex код цвета
             * @param {Integer} lineWidth ширина линии
             * @param {Boolean} animate анимировать ли отрисовку
             *
             * @returns {Void}
             */
            const drawGraph = (points, strokeStyle, lineWidth, animate) => {
                const _points = points;
                ctx.strokeStyle = strokeStyle ? strokeStyle : "#000";
                ctx.lineWidth = lineWidth ? lineWidth : 1;

                polyline(ctx, _points, animate);
                return;
            };

            /**
             * Отрисовывает график с залитым фоном
             *
             * @param {Array} points массив подготовленных для отрисовки точек
             * @param {String} strokeStyle строка hex код цвета
             * @param {Integer} lineWidth ширина линии
             * @param {Boolean} animate анимировать ли отрисовку
             * @param {Array} zero zero[1] == vm.zero.x , zero[0] = vm.zero.x
             *
             * @returns {Void}
             */
            const drawShape = (
                points,
                strokeStyle,
                lineWidth,
                animate,
                zero
            ) => {
                let _points = points;
                _points.push(generateLastPoint(_points, zero));
                ctx.fillStyle = strokeStyle;
                drawGraph(_points, strokeStyle, lineWidth, animate);
                ctx.fill();
            };

            return [preparePoints, drawGraph, drawShape];
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
            const zero = Object.values(vm.zero);
            const [preparePoints, drawGraph, drawShape] = vm.getDrawMethods();

            let _points = preparePoints(points, zero);
            drawShape(_points, "#E1F3EA55", 1, false, zero);
            drawGraph(_points, "#007e3c", 2, true);
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

            const maxWidth = Math.min(window.innerWidth, 800);
            const rootWidth = vm.$refs.root.offsetWidth
                ? vm.$refs.root.offsetWidth
                : maxWidth;

            cnvs.width = rootWidth;
            cnvs.height = parseInt((rootWidth * 11) / 16);

            vm.$refs.root.classList.remove("not-ready");

            ctx.translate(0, cnvs.height);
            ctx.rotate(-Math.PI / 2);

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
