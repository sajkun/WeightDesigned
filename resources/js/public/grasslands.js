/**
 *
 */

//хэлперы
import { strip, clog, getFormData } from "@/misc/helpers";
import { kml } from "@/../../node_modules/@tmcw/togeojson";
import { readBinaryShapeFile, getPointsForGrassland } from "@/public/dbf";

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
import MessagesComponent from "@/components/MessagesComponent/";

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

    data: {
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
    },

    mounted() {
        const vm = this;

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
        mode(mode) {
            if (mode == "create") {
                this.grasslandToEdit = {};
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
            let structure = vm.grasslandFormStructure;

            const grasslandProps = strip(vm.grasslandToEdit);

            structure = structure.map((item) => {
                const value = grasslandProps[item.name];

                if (value) {
                    item.value = value;
                }

                return item;
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
                grasslandMap = vm.initMap("map-container");
            });
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
         * Инициализация яндекс карты
         *
         * @param {String} selector html селектор
         *
         * @returns {Map} объект яндекс карта
         */
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
