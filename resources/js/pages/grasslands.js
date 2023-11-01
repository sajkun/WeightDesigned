/**
 *
 */

//хэлперы
import { strip, clog, getFormData } from "@/misc/helpers";
import { kml } from "@/../../node_modules/@tmcw/togeojson";
import { readBinaryShapeFile, getPointsForGrassland } from "@/misc/dbf";

// миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import grasslandFormStructure from "@/formFields/grassland";
import drawGrassland from "@/mixins/drawGrassland";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";

//компоненты
import FileInputComponent from "@/components/inputs/FileInputComponent";
import FormComponent from "@/components/inputs/FormComponent/";
import MessagesComponent from "@/components/common/MessagesComponent/";

/**
 * глобальня переменная для объекта яндекс карта
 *
 * @param {ymaps}
 */
let grasslandMap;

/**
 * объект для экспорта по умолчанию. Компонент VUE
 */
const appPublicGrasslands = {
    mixins: [
        axiosRequests,
        crud,
        drawGrassland,
        grasslandFormStructure,
        messages,
        publicAuthData,
    ],

    components: {
        file: FileInputComponent,
        MessagesComponent,
        TheForm: FormComponent,
    },

    data() {
        return {
            /**
             * список полей организации
             *
             * @param {Array}
             */
            grasslands: [],

            /**
             * данные редактируемого или создаваемого поля
             *
             * @param {Object}
             */
            grasslandToEdit: {},

            /**
             * ключ, определяющий отображать
             * - список полей или
             * - форму редактирования выбранного поля или
             * - форму создания нового поля
             *
             * @param {Enum} : list | edit | create
             */
            mode: "list",

            /**
             * Признак отображения карты. Нужен для ее интерактивного обновления
             *
             * @param {Boolean}
             */
            showMap: true,

            /**
             * источник данных о границах поля
             * загрузка из файла или выбор вручную кликами на карте
             *
             * @param {Enum} : file | map
             */
            geoJsonSource: "file",

            /**
             * Координаты точек, заданных вручную
             */
            tempCoordinates: [],
        };
    },

    mounted() {
        const vm = this;
        // vm.observer = vm.initObserver();

        /**
         * Запрос полей организации
         */
        vm.getGrasslands().then((r) => {
            vm.grasslands = r.grasslands;
        });

        /**
         * обновление полей организации
         */
        document.addEventListener("updateList", () => {
            vm.getGrasslands().then((r) => {
                vm.grasslands = r.grasslands;
            });
        });
    },

    watch: {
        grasslandToEdit: {
            handler(data) {
                clog(strip(data));
            },

            deep: true,
        },

        /**
         * @param {String} geoJsonSource
         */
        geoJsonSource(geoJsonSource) {
            if (geoJsonSource == "map") {
                this.clearMap();
            }

            // отрисовка контура поля, если есть сохраненные точки
            if (geoJsonSource == "file") {
                const vm = this;
                const grassland = vm.grasslandToEdit;
                if (
                    Boolean(grassland.geo_json) ||
                    vm.tempCoordinates.length > 0
                ) {
                    const points =
                        vm.tempCoordinates.length > 0
                            ? vm.tempCoordinates
                            : JSON.parse(grassland.geo_json);
                    grasslandMap.geoObjects.removeAll();
                    if (points.length > 2) {
                        vm.grasslandToEdit.size = vm.drawGrassland(
                            points,
                            grasslandMap
                        );
                    }
                }
            }
        },

        /**
         * режим работы страницы
         *
         * @param {Enum} mode  list|create|edit
         */
        mode(mode) {
            const vm = this;
            if (["list", "create"].indexOf(mode) >= 0) {
                vm.$nextTick(() => {
                    vm.grasslandToEdit = {};
                    vm.$refs.createGrasslandForm?.clear();
                    vm.$refs.editGrasslandForm?.clear();
                });
            }

            /**
             * отслеживание изменений размера окна и перезапуск карты
             */
            if (["edit", "create"].indexOf(mode) >= 0) {
                vm.$nextTick(() => {
                    const observeEl = vm.$refs["map-container"];
                    vm.forceRerenderMap();
                });
            }
        },

        /**
         * отслеживания состояния отображения или скрытия карты
         *
         * @param {Boolean} showMap
         */
        showMap(showMap) {
            if (showMap) {
                const vm = this;
                vm.$nextTick(() => {
                    grasslandMap = vm.initMap("map-container");
                    const grassland = vm.grasslandToEdit;
                    if (Boolean(grassland.geo_json)) {
                        const points = JSON.parse(grassland.geo_json);
                        grasslandMap.geoObjects.removeAll();
                        vm.drawGrassland(points, grasslandMap);
                    }
                });
            }
        },
    },

    computed: {
        /**
         * список объектов, описывающих поля
         * формы создания объекта "Поле(grassland)"
         *
         * @returns {Array<Object>}
         */
        addFormStructure() {
            const vm = this;
            // данные о поле
            const grasslandProps = strip(vm.grasslandToEdit);

            //структура формы
            let structure = vm
                .getFormStructure(
                    vm.grasslandFormStructure,
                    grasslandProps,
                    true
                )
                .map((f) => {
                    f.id = `add-${f.id}`;
                    return f;
                });

            return structure;
        },

        /**
         * список объектов, описывающих поля
         * формы редактирования объекта "Поле(grassland)"
         *
         * @returns {Array<Object>}
         */
        editFormStructure() {
            const vm = this;
            // данные о поле
            const grasslandProps = strip(vm.grasslandToEdit);

            //структура формы
            let structure = vm
                .getFormStructure(
                    vm.grasslandFormStructure,
                    grasslandProps,
                    false
                )
                .map((f) => {
                    f.id = `edit-${f.id}`;
                    return f;
                });
            return structure;
        },

        /**
         * Класс контейнера списка полей
         * скрывает и отображает поля
         *
         * @returns {String} строка с классами Bootstrap
         */
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

        /**
         * Список культур
         *
         * @returns {Array<String>}
         */
        cultures() {
            return {
                Пшеница: "Пшеница",
                Рожь: "Рожь",
                Лен: "Лен",
                Хмель: "Хмель",
                Семечка: "Семечка",
            };
        },
    },

    methods: {
        /**
         * Отображает форму добавления поля
         */
        addGrassland() {
            const vm = this;
            vm.mode = "create";

            vm.$nextTick(() => {
                vm.forceRerenderMap();
            });
        },

        /**
         * Отрисовка контура карты по вручную заданным точкам
         */
        async applyMannualMap() {
            const vm = this;

            if (vm.tempCoordinates.length < 3) {
                vm.messages.error =
                    "Должно быть задано 3 или более точки поля.";
                return;
            }
            vm.geoJsonSource = "file";
            await vm.$nextTick();
            vm.$refs.geo_json.value = JSON.stringify(vm.tempCoordinates);
            await vm.$nextTick();
            vm.tempCoordinates = [];
        },

        /**
         * Удаляет все контуры и объекты с карты
         */
        clearMap() {
            const vm = this;
            grasslandMap?.geoObjects.removeAll();
            vm.tempCoordinates = [];
            if (vm.$refs?.geo_json?.value) {
                vm.$refs.geo_json.value = null;
            }
        },

        /**
         *Обработчик события подтверждения формы создания объекта "Поле"
         *
         * @param {Object} data
         *
         * @returns {Promise}
         */
        createGrassland(grasslandData) {
            const vm = this;
            grasslandData.geo_json = grasslandData.geo_json
                ? JSON.parse(grasslandData.geo_json)
                : "";
            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                grassland_data: grasslandData,
            };

            vm.createEntity(postData, "/grasslands/store").then(() => {
                vm.grasslandToEdit = {};
                vm.$refs.createGrasslandForm.clear();
            });
        },

        /**
         * обработчик удаления поля
         *
         * @param {Object} item объект "Поле(grassland)"
         */
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

        /**
         * принудительное обновление карты
         */
        async forceRerenderMap() {
            const vm = this;

            // Remove MyComponent from the DOM
            vm.showMap = false;

            // Wait for the change to get flushed to the DOM
            await vm.$nextTick();

            // Add the component back in
            vm.showMap = true;
        },

        /**
         *
         * @param {Object} structure
         * @param {Object} grasslandProps
         * @param {Boolean} loadShape обязателен файл границ поля
         */
        getFormStructure(structure, grasslandProps = {}, loadShape = true) {
            let _structure = structure;
            _structure.size.required = loadShape;
            _structure = Object.values(_structure);

            _structure = _structure.map((item) => {
                const value = grasslandProps[item.name];

                if (value) {
                    item.value = value;
                }

                return item;
            });

            return _structure;
        },

        /**
         * Инициализация яндекс карты
         *
         * @param {String} selector html селектор
         *
         * @returns {Map} объект яндекс карта
         */
        initMap(selector) {
            const vm = this;
            let map = new ymaps.Map(
                selector,
                {
                    center: [45, 45],
                    zoom: 13,
                    type: "yandex#hybrid",
                },
                {
                    searchControlProvider: "yandex#search",
                }
            );

            map.events.add("click", (e) => {
                if (vm.geoJsonSource === "file") {
                    return;
                }

                let coordsClicked = e.get("coords");

                const clickedPoint = new ymaps.Placemark(coordsClicked, {
                    hintContent: "точка контура поля",
                });

                vm.tempCoordinates.push(coordsClicked);
                map.geoObjects.add(clickedPoint);
            });
            return map;
        },

        /**
         * Распознавание файлов карты и вычисления,
         * отрисовка карты, вычисление размера нарисованного полигона
         *
         * @param {Object} data
         */
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
                            const points = getPointsForGrassland(shpData);
                            grasslandMap.geoObjects.removeAll();

                            const size = vm.drawGrassland(points, grasslandMap);
                            vm.grasslandToEdit.size = parseFloat(size);
                        });
                    break;
                case "kml":
                    const reader = new FileReader();
                    let geoJsonObject;
                    reader.addEventListener(
                        "load",
                        () => {
                            geoJsonObject = strip(kml(getDom(reader.result)));

                            const size = vm.drawKmlShape(
                                geoJsonObject,
                                grasslandMap
                            );

                            vm.grasslandToEdit.size = parseFloat(size);
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

                    geoJson.then((geoJsonObject) => {
                        const size = vm.drawKmlShape(
                            geoJsonObject,
                            grasslandMap
                        );
                        vm.grasslandToEdit.size = parseFloat(size);
                    });
                    break;

                default:
                    vm.messages.error = "Неверный тип файла";
                    break;
            }
        },

        /**
         * Отображение формы редактирования поля
         *
         * @param {Object} grassland
         */
        viewGrassland(grassland) {
            clog("%c viewGrassland", "color:blue", grassland);
            const vm = this;
            const points = JSON.parse(grassland.geo_json);
            vm.mode = "edit";
            vm.grasslandToEdit = grassland;

            vm.$nextTick(() => {
                grasslandMap = vm.initMap("map-container");
                grasslandMap.geoObjects.removeAll();
                vm.drawGrassland(points, grasslandMap);
            });
        },

        /**
         * Обработчик редактирования поля
         */
        editGrassland(grasslandData) {
            const vm = this;

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
