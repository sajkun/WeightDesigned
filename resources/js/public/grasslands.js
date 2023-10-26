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
import drawGrassland from "@/mixins/drawGrassland";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";

//компоненты
import FileInputComponent from "@/components/FileInputComponent";
import MessagesComponent from "@/components/MessagesComponent/";

let grasslandMap;
const appPublicGrasslands = {
    mixins: [axiosRequests, drawGrassland, crud, messages, publicAuthData],

    components: {
        file: FileInputComponent,
        MessagesComponent,
    },

    data: {
        mode: "list",
        grasslands: [],
        grasslandToEdit: {},
    },

    mounted() {
        const vm = this;

        vm.getGrasslands().then((r) => {
            vm.grasslands = r.grasslands;
        });

        document.addEventListener("updateList", () => {
            vm.getGrasslands().then((r) => {
                vm.grasslands = r.grasslands;
            });
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
                            const points = getPointsForGrassland(shpData);
                            grasslandMap.geoObjects.removeAll();
                            vm.$refs.grasslandSize.value =
                                vm.grasslandToEdit.size = vm.drawGrassland(
                                    points,
                                    grasslandMap
                                );
                        });
                    break;
                case "kml":
                    const reader = new FileReader();
                    let geoJsonObject;
                    reader.addEventListener(
                        "load",
                        () => {
                            geoJsonObject = strip(kml(getDom(reader.result)));
                            vm.$refs.grasslandSize.value =
                                vm.grasslandToEdit.size = vm.drawKmlShape(
                                    geoJsonObject,
                                    grasslandMap
                                );
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
                        vm.$refs.grasslandSize.value = vm.grasslandToEdit.size =
                            vm.drawKmlShape(geoJsonObject, grasslandMap);
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
            vm.grasslandToEdit = grassland;

            vm.$nextTick(() => {
                vm.enableInputs();
                grasslandMap = vm.initMap("map-container");
                grasslandMap.geoObjects.removeAll();
                vm.drawGrassland(points, grasslandMap);
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
