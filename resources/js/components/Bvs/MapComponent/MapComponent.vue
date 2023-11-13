<!-- МИодуль отобраения данных от бвс на яндекс карте -->
<template>
    <div class="d-flex flex-column">
        <div id="placemarks"></div>
        <div class="w-100 flex-grow-1 fix-map" :id="id"></div>
    </div>
</template>

<script>
import { strip, clog } from "@/misc/helpers";
import bvs from "@/mixins/icons";

import drawGrassland from "@/mixins/drawGrassland";

// переменная для хранения карты
let grasslandMap;

export default {
    data() {
        return {
            id: this._id, // HTML id атрибут
            bvsData: this._bvsData, // данные от бвс
            grasslandsData: this._grasslandsData, // данные о полях
        };
    },

    mixins: [bvs, drawGrassland],
    watch: {
        // обновление данных от родителя
        _bvsData(data) {
            const vm = this;
            vm.bvsData = data;
        },

        // добавление данных на карту при их изменении
        bvsData(data) {
            const vm = this;
            vm.drawMapObjects(grasslandMap, strip(data));
        },

        // обновление данных от родителя
        _grasslandsData(data) {
            const vm = this;
            vm.grasslandsData = data;
        },

        grasslandsData(data) {
            const vm = this;
            vm.drawMapObjects(grasslandMap, strip(vm.bvsData));
        },
    },

    props: {
        // данные от бвс
        _bvsData: {
            type: Array,
            default: [],
            required: false,
        },
        // данные о полях
        _grasslandsData: {
            type: Array,
            default: [],
            required: false,
        },
        // HTML id атрибут
        _id: {
            type: String,
            default: "wow-map",
            required: true,
        },
    },

    mounted() {
        const vm = this;
        vm.id = vm._id;

        vm.$nextTick(() => {
            ymaps.ready(function () {
                grasslandMap = vm.initMap(vm.id);
                vm.drawMapObjects(grasslandMap, strip(vm.bvsData));
            });
        });
    },
    methods: {
        /**
         * инициализация яндекс карты
         *
         * @param {String} selector для блока карты
         *
         * @returns {Object} ymap - объект яндекс карт
         */
        initMap(selector) {
            let map = new ymaps.Map(
                selector,
                {
                    center: [45, 45],
                    zoom: 12,
                    type: "yandex#hybrid",
                },
                {
                    searchControlProvider: "yandex#search",
                }
            );

            return map;
        },

        /**
         * Добавляет на карту метки с данными от бвс
         *
         * @param {Array} data массив объектов данных от БВС
         */
        drawBvsData(data) {
            if (!data || !data.length || !grasslandMap) {
                return;
            }
            clog("drawBvsData", data);
            clog(grasslandMap);
            const vm = this;

            const placemarksHTML = document.getElementById("placemarks");
            const clusterIconContentLayout =
                ymaps.templateLayoutFactory.createClass(
                    '<div class="cluster-icon">{{ properties.geoObjects.length }}</div>'
                );
            const clusterer = new ymaps.Clusterer({
                // Зададим массив, описывающий иконки кластеров разного размера.
                clusterIcons: [
                    {
                        href: "images/svg/bvs.svg",
                        size: [50, 50],
                        offset: [-20, -20],
                    },
                ],

                clusterNumbers: [strip(data).length],
                clusterIconContentLayout: clusterIconContentLayout,
                clusterDisableClickZoom: true,
            });

            let placemarks = [];
            for (let bvsData of strip(data)) {
                // вычисление размера метки
                const newDiv = document.createElement("div");
                newDiv.setAttribute("id", "check");
                newDiv.classList.add("bvs_preview");
                newDiv.innerText = bvsData.bvs_name;
                placemarksHTML.append(newDiv);
                const rect = newDiv.getBoundingClientRect();
                document.getElementById("check").remove();

                // формирование метки
                const bvsIcon =
                    bvsData.rfid_status === 1 && bvsData.has_check
                        ? vm.bvsIcon
                        : vm.bvsIconError;

                const html = `<div>
                        <div class="bvs_preview">${bvsIcon} <span>${bvsData.bvs_name}</span></div>
                    </div>`;

                const placemarkLayout =
                    ymaps.templateLayoutFactory.createClass(html);

                const coordinates = bvsData.coordinates
                    .split(",")
                    .map((i) => parseFloat(i));

                const operation =
                    bvsData.from === bvsData.bvs_name
                        ? `Передал в ${bvsData.to}`
                        : `Получил от ${bvsData.from}`;
                const checkStatus = bvsData.has_check
                    ? "чек распечатан"
                    : "чек не распечатан";
                const amount = `${bvsData.amount_transfered}кг`;
                const amountLeft = bvsData.amount_in_bunker
                    ? `остаток в бункере ${bvsData.amount_in_bunker}кг<br>`
                    : "";

                let rfid;

                switch (bvsData.rfid_status) {
                    case 1:
                        rfid = "RFID карта идентифицирована";
                        break;
                    case 10:
                        rfid = "RFID ошибка считывателя";
                        break;
                    case 2:
                        rfid = "RFID карта обнаружена, но не идентифицирована";
                        break;
                    case 0:
                        rfid = "RFID карта не обнаружена";
                        break;
                }

                const point = new ymaps.Placemark(
                    coordinates,
                    {
                        balloonContentHeader: `<span class="description">БП ${bvsData.bvs_name} </span>`,
                        balloonContentBody:
                            `${operation} ` +
                            `${amount} <br>` +
                            amountLeft +
                            `${checkStatus} <br>` +
                            rfid,
                        balloonContentFooter: `Операция произведена: ${bvsData.operation_time}`,

                        hintContent:
                            bvsData.bvs_name + " " + operation + " " + amount,
                    },
                    {
                        iconLayout: placemarkLayout,
                        iconShape: {
                            type: "Rectangle",
                            coordinates: [
                                [0, 0],
                                [
                                    Math.floor(rect.width + 32),
                                    Math.floor(rect.height),
                                ],
                            ],
                        },
                    }
                );
                placemarks.push(point);
                grasslandMap.geoObjects.add(point);
            }

            clusterer.add(placemarks);
            grasslandMap.geoObjects.add(clusterer);

            const objectState = clusterer.getObjectState(placemarks);

            if (objectState.isClustered) {
                // Если метка находится в кластере, выставим ее в качестве активного объекта.
                // Тогда она будет "выбрана" в открытом балуне кластера.
                objectState.cluster.state.set("activeObject", placemarks[2]);
                clusterer.balloon.open(objectState.cluster);
            } else if (objectState.isShown) {
                // Если метка не попала в кластер и видна на карте, откроем ее балун.
                // placemarks[2].balloon.open();E
            }

            grasslandMap.setBounds(clusterer.getBounds(), {
                checkZoomRange: true,
            });
        },

        /**
         * Определяет центр области где находятся бункера
         *
         * @param {Array} data массив объектов данных от БВС
         *
         * @returns {Array} [lat, lang]
         */
        getMapCenter(data) {
            if (!data || !data.length) {
                return [45, 45];
            }

            let bvsCoords = data.map((e) => {
                let coords = e.coordinates.split(",").map((i) => parseFloat(i));
                return coords;
            });

            if (bvsCoords.length === 1) {
                return bvsCoords;
            }

            const initialValue = bvsCoords.pop();
            const totalSum = bvsCoords.reduce((accumulator, val) => {
                return [
                    (accumulator[0] + val[0]) / 2,
                    (accumulator[1] + val[1]) / 2,
                ];
            }, initialValue);

            return totalSum;
        },

        /**
         * рисует все объекты на карте
         *
         * @param {Map} grasslandMap  яндекс карта
         * @param {Object} bvsData данные от БВС
         */
        drawMapObjects(grasslandMap, bvsData) {
            if (!grasslandMap || !bvsData.length) return;
            const vm = this;
            // clog(grasslandMap.geoObjects);
            grasslandMap.geoObjects.removeAll();
            // return;
            vm.drawBvsData(bvsData);

            if (grasslandMap.geoObjects.getLength() > 0) {
                grasslandMap.setBounds(grasslandMap.geoObjects.getBounds());
            } else {
                grasslandMap.setZoom(9);
            }

            // vm.$nextTick(() => {
            //     for (const _grassland of vm.grasslandsData) {
            //         const points = JSON.parse(_grassland.geo_json);
            //         vm.drawGrassland(points, grasslandMap);
            //     }
            // });
        },
    },
};
</script>

<style src="./style/index.scss" lang="scss"></style>
