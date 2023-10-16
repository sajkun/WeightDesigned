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
import { strip, clog } from "@/misc/helpers";

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
            info: {},
            zeroX: 20,
            zeroY: 20,
        };
    },
    methods: {
        drawGrid(step) {
            const vm = this;
            const cnvs = vm.$refs.canvas;
            const ctx = cnvs.getContext("2d");
            ctx.translate(0, cnvs.height);
            ctx.rotate(-Math.PI / 2);
            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 0.5;

            for (var i = step; i < cnvs.width; i += step) {
                //вертикальные
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, cnvs.height);
                ctx.closePath();
                ctx.stroke();
            }

            for (var i = step; i < cnvs.height; i += step) {
                //Горизонтальные
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(cnvs.width + step, i);
                ctx.closePath();
                ctx.stroke();
            }
        },
    },

    mounted() {
        clog("mounted");
        const vm = this;

        const polyline = (color, pts) => {
            const vm = this;
            let cnvs = vm.$refs.canvas;
            let ctx = cnvs.getContext("2d");
            ctx.strokeStyle = color;
            ctx.beginPath();
            pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
            ctx.stroke();
        };

        setTimeout(() => {
            let cnvs = vm.$refs.canvas;
            const step = 20;
            cnvs.width =
                vm.$refs.root.offsetWidth -
                (vm.$refs.root.offsetWidth % step) +
                step;
            clog();
            cnvs.height =
                vm.$refs.root.offsetHeight -
                (vm.$refs.root.offsetHeight % step) +
                step;

            vm.drawGrid(step);
        }, 1000);
    },
};
</script>

<style scoped src="./style/index.scss" lang="scss"></style>
