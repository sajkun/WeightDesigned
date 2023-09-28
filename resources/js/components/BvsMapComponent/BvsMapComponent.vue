<!-- МИодуль отобраения данных от бвс на яндекс карте -->
<template>
    <div class="h-100 w-100" :id="id"></div>
</template>

<script>
import { strip, clog } from "../../misc/helpers";
import bvs from "../svg/bvs.js";

// переменная для хранения карты
let grasslandMap;

export default {
    data() {
        return {
            id: this._id, // HTML id атрибут
            bvsData: this._bvsData, // данные от бвс
        };
    },

    mixins: [bvs],
    watch: {
        // обновление данных от родителя
        _bvsData(data) {
            const vm = this;
            vm.bvsData = data;
        },

        // добавление данных на карту при их изменении
        bvsData(data) {
            const vm = this;

            if (!grasslandMap) {
                grasslandMap = vm.initMap(vm.id);
            }

            grasslandMap.geoObjects.removeAll();
            vm.drawBvsData(data);
            grasslandMap.setBounds(grasslandMap.geoObjects.getBounds());
        },
    },
    props: {
        // данные от бвс
        _bvsData: {
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
            const vm = this;

            let map = new ymaps.Map(
                selector,
                {
                    center: [45, 45],
                    zoom: 12,
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
                // clusterHideIconOnBalloonOpen: false,
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

                const bvsIcon =
                    bvsData.rfid_status === 1 && bvsData.has_check
                        ? vm.bvsIcon
                        : vm.bvsIconError;

                // формирование метки
                const html = `<div>
                        <div class="bvs_preview">${bvsIcon} <span>${bvsData.bvs_name}</span></div>
                    </div>`;

                const circleLayout =
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

                let point = new ymaps.Placemark(
                    coordinates,
                    {
                        // Зададим содержимое заголовка балуна.
                        balloonContentHeader: `<span class="description">БП ${bvsData.bvs_name} </span>`,
                        // Зададим содержимое основной части балуна.
                        balloonContentBody:
                            `${operation} ` +
                            `${amount} <br>` +
                            amountLeft +
                            `${checkStatus} <br>` +
                            rfid,
                        // Зададим содержимое нижней части балуна.
                        balloonContentFooter: `Операция произведена: ${bvsData.operation_time}`,

                        hintContent:
                            bvsData.bvs_name + " " + operation + " " + amount,
                    },
                    {
                        iconLayout: circleLayout,
                        // Описываем фигуру активной области "Прямоугольник".
                        iconShape: {
                            type: "Rectangle",
                            // Прямоугольник описывается в виде двух точек - верхней левой и нижней правой.
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
            }

            clusterer.add(placemarks);

            grasslandMap.geoObjects.add(clusterer);
            var objectState = clusterer.getObjectState(placemarks[2]);
            if (objectState.isClustered) {
                // Если метка находится в кластере, выставим ее в качестве активного объекта.
                // Тогда она будет "выбрана" в открытом балуне кластера.
                objectState.cluster.state.set("activeObject", placemarks[2]);
                clusterer.balloon.open(objectState.cluster);
            } else if (objectState.isShown) {
                // Если метка не попала в кластер и видна на карте, откроем ее балун.
                placemarks[2].balloon.open();
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
    },
};
</script>

<style src="./style/index.scss" lang="scss"></style>
