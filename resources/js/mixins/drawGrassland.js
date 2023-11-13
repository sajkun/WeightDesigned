/**
 * Рисование конуров на яндекс картах
 */
import { getCenterByPoints } from "@/misc/dbf";
import { strip, clog } from "@/misc/helpers";

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
         * Рисует все переданные поля и устанавливает границы поля
         *
         * @param {Arrya<Objects>} grasslands массив полей
         * @param {Object} map объект ymap карта
         * @param {Boolean} fitBounds нужно ли подстраивать размер карты так, чтобы было видно все поля
         *
         * @returns {Void}
         */
        drawAllGrasslands(grasslands = [], map = false, fitBounds = true) {
            if (!grasslands.length || !map) {
                return;
            }

            const vm = this;

            grasslands.forEach((g) => {
                const points = JSON.parse(g.geo_json);
                const { name, size, culture } = g;

                vm.execDrawGrassland(points, map, { name, size, culture });
            });

            if (!fitBounds || !map?.geoObjects) return;

            map.setBounds(map.geoObjects.getBounds(), {
                checkZoomRange: true,
            });
        },

        /**
         * добавление объекта полигона по заданным точкам на карту
         *
         * @param {Arrya<float, float>} coordinates массив точек lat, long
         * @param {Object} map объект ymap карта
         *
         * @returns {Number} площадь поля в гектарах
         */
        execDrawGrassland(coordinates = [], map = false, data = false) {
            if (!coordinates.length || !map) {
                return;
            }

            const hint = data
                ? `Поле ${data.name}, ${data.size}га, ${data.culture}`
                : false;

            const baloon = data
                ? `<b>Поле ${data.name}</b> <br> Площадь поля: ${data.size}га <br> Культура:  ${data.culture}`
                : false;

            let grasslandGeoObject = new ymaps.GeoObject(
                {
                    geometry: {
                        type: "Polygon",
                        coordinates: [coordinates],
                        fillRule: "nonZero",
                    },
                    properties: {
                        // Содержимое балуна.
                        balloonContent: baloon,
                        hintContent: hint,
                    },
                },
                {
                    fillColor: "rgba(143, 113, 43,0.1)",
                    strokeColor: "#c48e1a",
                    // opacity: 0.5,
                    strokeWidth: 3,
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
