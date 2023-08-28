import { strip } from "./functions";
import {
    readBinaryShapeFile,
    getShapeFileCenter,
    getPointsForGrassland,
} from "./dbf";
import messages from "../mixins/messages";
import FileInputComponent from "../components/FileInputComponent";

let grasslandMap;

if (document.getElementById("public-grasslands")) {
    const appPublicGrasslands = new Vue({
        el: "#public-grasslands",

        mixins: [messages],

        components: {
            file: FileInputComponent,
        },

        data: {
            organisationId: -1,
            userId: -1,
            mode: "list",
            grasslands: [],
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;
            vm.getGrasslands();
        },

        computed: {
            columnClass() {
                const vm = this;
                const tableClass =
                    vm.mode === "details"
                        ? "col-12 col-md-6 d-none d-md-block"
                        : "col-12";
                return {
                    tableClass,
                };
            },

            cultures() {
                return ["Пшеница", "Рожь", "Лен", "Хмель"];
            },
        },

        methods: {
            addGrassland() {
                const vm = this;
                vm.mode = "create";

                vm.$nextTick(() => {
                    grasslandMap = vm.initMap("map-container");
                    vm.enableInputs();
                });
            },

            drawGrassland(coordinates, map) {
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
            },

            deleteGrassland() {},

            enableInputs() {
                const inputs = document.querySelectorAll(
                    ".form-control-custom input"
                );

                inputs.forEach((el) => {
                    el.addEventListener("input", (e) => {
                        if (e.target.value) {
                            e.target.nextElementSibling.classList.add("active");
                        } else {
                            e.target.nextElementSibling.classList.remove(
                                "active"
                            );
                        }
                    });
                });
            },

            initMap(selector) {
                const vm = this;
                let map = new ymaps.Map(
                    selector,
                    {
                        center: [45, 45],
                        zoom: 13,
                    },
                    {
                        searchControlProvider: "yandex#search",
                    }
                );
                // let clickedPoint;

                // map.events.add("click", (e) => {
                //     let coordsClicked = e.get("coords");

                //     if (!vm.formData.geo_json) {
                //         return;
                //     }

                //     if (clickedPoint) {
                //         map.geoObjects.remove(clickedPoint);
                //     }

                //     clickedPoint = new ymaps.Placemark(coordsClicked, {
                //         hintContent: "Точка въезда",
                //     });

                //     vm.formData.entry_point = coordsClicked;

                //     map.geoObjects.add(clickedPoint);
                // });

                return map;
            },

            getGrasslands() {
                const vm = this;

                if (vm.$refs.organisationId < 0) {
                    return;
                }

                axios
                    .get("/grasslands/list", {
                        user_id: vm.userId,
                    })
                    .then((response) => {
                        console.log(
                            "%c getGrasslands",
                            "color: green",
                            response
                        );
                        vm.grasslands = strip(response.data.grasslands);
                    })
                    .catch((e) => {
                        console.log(
                            "%c getGrasslands error",
                            "color: red",
                            e.response
                        );
                        vm.messages.error = e.response?.data?.message;
                    });
            },

            parseShapeFile(data) {
                const vm = this;

                const ext = data.file.name.split(".")[1];

                switch (ext) {
                    case "shp":
                        readBinaryShapeFile(data.file)
                            .catch((error) => {
                                console.error(`Error reading file:`, error);
                            })

                            .then((shpData) => {
                                console.log(shpData);
                                const center = getShapeFileCenter(shpData);
                                const points = getPointsForGrassland(shpData);
                                vm.$refs.geo_json.value =
                                    JSON.stringify(shpData);
                                // vm.formData.geo_json = shpData;
                                grasslandMap.setCenter(center);
                                grasslandMap.geoObjects.removeAll();
                                vm.drawGrassland(points, grasslandMap);
                            });
                        break;
                    default:
                        vm.message.error = "Неверный тип файла";
                        break;
                }
            },

            createGrassland() {
                console.log("storeGrassland");
                const vm = this;
                const formData = new FormData(vm.$refs.formCreateGrassland);

                let postData = {};

                for (const [key, value] of formData) {
                    postData[key] = value;
                }

                postData.geo_json = postData.geo_json
                    ? JSON.parse(postData.geo_json)
                    : "";

                const sendData = {
                    user_id: vm.userId,
                    organisation_id: vm.organisationId,
                    grassland_data: postData,
                };

                console.log(sendData);

                axios
                    .post("/grasslands/store", sendData)
                    .then((response) => {
                        console.log(
                            "%c createGrassland",
                            "color: green",
                            response
                        );
                        vm.messages[response.data.type] = response.data.message;
                    })
                    .then(() => {
                        vm.getGrasslands();
                    })
                    .catch((e) => {
                        console.log(
                            "%c createGrassland error",
                            "color: red",
                            e.response
                        );
                        vm.messages.error = e.response.data.message;
                    });
            },
        },
    });
}
