<!-- шаблон для отображения столбцов рейтинга -->
<template>
    <div class="columns-wrapper p-4 d-flex flex-column">
        <!-- столбцы рейтинга -->
        <div class="d-flex flex-grow-1 align-items-end" ref="columns-holder">
            <div class="column-5 place-1"></div>
            <div class="column-5 place-2"></div>
            <div class="column-5 place-3"></div>
            <div class="column-5 place-4"></div>
            <div class="column-5 place-5"></div>
        </div>

        <!-- список наименования -->
        <div class="d-flex mt-4 align-items-end">
            <div
                class="column-5 text-start"
                v-for="(item, idx) in info"
                :key="'col' + idx"
            >
                {{ parseName(item) }}
            </div>
        </div>

        <!-- Метки порядкового номера и звездочка  -->
        <div class="d-flex columns-wrapper__footer mt-4">
            <div class="column-5 place-1">
                <div class="column-5__inner">1 <i class="fa fa-star"></i></div>
            </div>
            <div class="column-5 place-2">
                <div class="column-5__inner">2 <i class="fa fa-star"></i></div>
            </div>
            <div class="column-5 place-3">
                <div class="column-5__inner">3 <i class="fa fa-star"></i></div>
            </div>
            <div class="column-5 place-4">
                <div class="column-5__inner">4</div>
            </div>
            <div class="column-5 place-5">
                <div class="column-5__inner">5</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    watch: {
        _info(info) {
            this.info = Object.values(info).slice(0, 5);
            return null;
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
            info: Object.values(this._info).slice(0, 5),
        };
    },

    computed: {},

    mounted() {
        this.info = Object.values(this._info).slice(0, 5);
    },
    methods: {
        /**
         * @param {Object} item информация о строке рейтинга
         *
         * @return {String} название техники или ФИО
         */
        parseName(item) {
            if (item.model == "vehicle") {
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
