import { strip, clog, getFormData } from "@/misc/helpers";
import publicAuthData from "@/mixins/publicAuthData";

import {
    readBinaryShapeFile,
    getShapeFileCenter,
    getPointsForGrassland,
    getCenterByPoints,
} from "./dbf";
import messages from "@/mixins/messages";
import crud from "@/mixins/crud";
import FileInputComponent from "@/components/FileInputComponent";
import { kml } from "@/../../node_modules/@tmcw/togeojson";

let grasslandMap;
const axios = require("axios");
const appPublicGrasslands = {
    mixins: [messages, crud, publicAuthData],
    components: {
        file: FileInputComponent,
    },

    data: {
        mode: "list",
        grasslands: [],
        grassalndToEdit: {},
    },

    mounted() {
        const vm = this;

        vm.getGrasslands();
        document.addEventListener("updateList", () => {
            vm.getGrasslands();
        });
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

        createGrassland() {
            const vm = this;

            let grasslandData = getFormData(vm.$refs.formCreateGrassland);

            grasslandData.geo_json = grasslandData.geo_json
                ? JSON.parse(grasslandData.geo_json)
                : "";

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                grassland_data: grasslandData,
            };

            vm.createEntity(postData, "/grasslands/store");
        },

        drawGrassland(points) {
            const vm = this;
            const center = getCenterByPoints(points);

            if (vm.$refs?.geo_json) {
                vm.$refs.geo_json.value = JSON.stringify(points);
            }

            grasslandMap.setCenter(center);
            grasslandMap.geoObjects.removeAll();

            vm.drawGrasslandCb(points, grasslandMap);
        },

        drawGrasslandCb(coordinates, map) {
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

        drawKmlShape(geoJsonObject) {
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

            vm.drawGrassland(points);
        },

        deleteGrassland(item) {
            const vm = this;
            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                delete_grassland_id: item.id,
                name: item.name,
            };
            vm.deleteEntity(postData, `/grasslands/delete`);
        },

        enableInputs() {
            const inputs = document.querySelectorAll(
                ".form-control-custom input"
            );

            inputs.forEach((el) => {
                el.addEventListener("input", (e) => {
                    if (e.target.value) {
                        e.target.nextElementSibling.classList.add("active");
                    } else {
                        e.target.nextElementSibling.classList.remove("active");
                    }
                });
            });
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
                    clog("%c getGrasslands", "color: green", response);
                    vm.grasslands = strip(response.data.grasslands);
                })
                .catch((e) => {
                    clog("%c getGrasslands error", "color: red", e.response);
                    vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                });
        },

        initMap(selector) {
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

            return map;
        },

        parseShapeFile(data) {
            const vm = this;

            const ext = data.file.name.split(".").pop();
            let getDom = (xml) =>
                new DOMParser().parseFromString(xml, "text/xml");

            let getExtension = (fileName) => fileName.split(".").pop();

            let getKmlDom = (kmzFile) => {
                var zip = new JSZip();
                return zip.loadAsync(kmzFile).then((zip) => {
                    let kmlDom = null;
                    zip.forEach((relPath, file) => {
                        if (
                            getExtension(relPath) === "kml" &&
                            kmlDom === null
                        ) {
                            kmlDom = file.async("string").then(getDom);
                        }
                    });

                    return kmlDom || Promise.reject("No kml file found");
                });
            };
            switch (ext) {
                case "shp":
                    readBinaryShapeFile(data.file)
                        .catch((error) => {
                            console.error(`Error reading file:`, error);
                        })

                        .then((shpData) => {
                            clog(shpData);
                            const center = getShapeFileCenter(shpData);
                            const points = getPointsForGrassland(shpData);
                            vm.drawGrassland(points);
                        });
                    break;
                case "kml":
                    const reader = new FileReader();
                    let geoJsonObject;
                    reader.addEventListener(
                        "load",
                        () => {
                            geoJsonObject = strip(kml(getDom(reader.result)));
                            vm.drawKmlShape(geoJsonObject);
                        },
                        false
                    );
                    reader.readAsText(data.file);
                    break;
                case "kmz":
                    let geoJson = getKmlDom(data.file).then((kmlDom) => {
                        let geoJsonObject = kml(kmlDom);
                        return geoJsonObject;
                    });

                    geoJson.then((gj) => {
                        vm.drawKmlShape(gj);
                    });
                    break;

                default:
                    vm.messages.error = "Неверный тип файла";
                    break;
            }
        },

        viewGrassland(grassland) {
            clog("%c viewGrassland", "color:blue", grassland);
            const vm = this;
            const points = JSON.parse(grassland.geo_json);
            vm.mode = "edit";
            vm.grassalndToEdit = grassland;

            vm.$nextTick(() => {
                vm.enableInputs();
                grasslandMap = vm.initMap("map-container");
                vm.drawGrassland(points);
            });
        },

        editGrassland() {
            const vm = this;

            let grasslandData = getFormData(vm.$refs.formEditGrassland);

            grasslandData.geo_json = grasslandData.geo_json
                ? JSON.parse(grasslandData.geo_json)
                : "";

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                grassland_data: grasslandData,
            };

            vm.editEntity(postData, "/grasslands/update/");
        },
    },
};
export default appPublicGrasslands;
