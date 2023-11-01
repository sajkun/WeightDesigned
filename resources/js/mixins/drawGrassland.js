/**
 * Рисование конуров на яндекс картах
 */
import { getCenterByPoints } from "@/misc/dbf";

export default {
    mounted() {
        ymaps.ready(["util.calculateArea"]);
    },

    methods: {
        /**
         *
         * @param {*} points
         *
         * @returns {Void}
         */
        drawGrassland(points, grasslandMap) {
            const vm = this;
            const center = getCenterByPoints(points);

            if (vm.$refs?.geo_json) {
                vm.$refs.geo_json.value = JSON.stringify(points);
            }

            grasslandMap.setCenter(center);
            return vm.execDrawGrassland(points, grasslandMap);
        },

        /**
         * отрисовывает контур на яндекс карте по kml файлу
         *
         * @param {Object} geoJsonObject
         *
         * @returns {Void}
         */
        drawKmlShape(geoJsonObject, grasslandMap) {
            const vm = this;
            const geometry = geoJsonObject?.features.pop()?.geometry;

            if (!geometry) {
                vm.messages.error = `В файле не найдена разметка`;
                return;
            }

            const type = geometry?.type;

            const allowedTypes = ["LineString", "Polygon"];

            if (!type || allowedTypes.indexOf(type) < 0) {
                vm.messages.error = `Недопустимая геометрия разметки файла - (${type})`;
                return;
            }
            const points =
                type === "Polygon"
                    ? geometry?.coordinates.shift()
                    : geometry?.coordinates;

            return vm.drawGrassland(points, grasslandMap);
        },

        /**
         * добавление объекта полигона по заданным точкам на карту
         *
         * @param {Arrya<float, float>} coordinates массив точек lat, long
         * @param {Object} map объект ymap карта
         *
         * @returns {Number} площадь поля в гектарах
         */
        execDrawGrassland(coordinates, map) {
            let grasslandGeoObject = new ymaps.GeoObject(
                {
                    // Описываем геометрию геообъекта.
                    geometry: {
                        // Тип геометрии - "Многоугольник".
                        type: "Polygon",
                        // Указываем координаты вершин многоугольника.
                        coordinates: [coordinates],
                        // Задаем правило заливки внутренних контуров по алгоритму "nonZero".
                        fillRule: "nonZero",
                    },
                    // Описываем свойства геообъекта.
                    properties: {
                        // Содержимое балуна.
                        // balloonContent: item.name,
                    },
                },
                {
                    // Описываем опции геообъекта.
                    // Цвет заливки.
                    fillColor: "rgba(143, 113, 43,0.1)",
                    // Цвет обводки.
                    strokeColor: "#c48e1a",
                    // Общая прозрачность (как для заливки, так и для обводки).
                    // opacity: 0.5,
                    // Ширина обводки.
                    strokeWidth: 3,
                    // Стиль обводки.
                    strokeStyle: "solid",
                }
            );

            // Добавляем многоугольник на карту.
            map.geoObjects.add(grasslandGeoObject);

            var grasslandSize = Math.round(
                ymaps.util.calculateArea(grasslandGeoObject)
            );

            return (grasslandSize / 1e4).toFixed(1);
        },
    },
};
