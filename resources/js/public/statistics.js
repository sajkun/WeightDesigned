/**
 * приложение отображение статистики публичного раздела
 *
 * @author Кулешов Вячеслав
 */

//хэлперы
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//классы
import { BvsData } from "@/misc/BvsDataClass";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";
import sortAnimation from "@/mixins/sortAnimation";
import professions from "@/mixins/professions";
import statData from "@/mixins/statData";
import vehicleTypes from "@/mixins/vehicleTypes";

// компоненты
import MessagesComponent from "@/components/MessagesComponent";
import GraphicComponent from "@/components/GraphicComponent";
import MonthPickerComponent from "@/components/inputs/MonthPickerComponent";
import DatepickerComponent from "@/components/inputs/DatepickerComponent";

const appPublicStatistics = {
    mixins: [
        axiosRequests,
        crud,
        messages,
        professions,
        publicAuthData,
        statData,
        sortAnimation,
        vehicleTypes,
    ],

    components: {
        MessagesComponent,
        MonthPicker: MonthPickerComponent,
        Datepicker: DatepickerComponent,
        Graph: GraphicComponent,
    },

    data() {
        return {};
    },

    computed: {
        /**
         * Пустой объект, структура данных для графика отображения урожая по датам
         *
         * @returns {Object}
         */
        bvsInfoBlank() {
            return {
                axis: {
                    x: {
                        maxValue: 0,
                        label: "",
                        after: "кг",
                    },

                    y: {
                        maxValue: 0,
                        label: "",
                        after: "",
                    },
                },
                points: {},

                labels: {
                    x: {},
                },
            };
        },

        /**
         * формирует данные статистики для отображения данных
         *
         * @returns {Object}
         */
        bvsInfo() {
            const vm = this;
            // данные о сборе урожая, сгрупированные по разным типам периодов day|month|year
            const harvestData = new BvsData(
                strip(vm.bvsData),
                strip(vm.dateRange)
            );

            //{Enum}  day|month|year тип периода отображения
            const type = vm.getPeriodType(harvestData.parsedData.periods);

            // выбор набора данных по определенному типу периода
            const rawData = harvestData.parsedData?.data[type];

            // ранний выход
            if (!rawData?.items) {
                return strip(vm.bvsInfoBlank);
            }
            return vm.prepareDataForGraph(rawData, type);
        },

        /**
         * Название выбранного периода статистики
         *
         * @returns {String}
         */
        currentPeriod() {
            const vm = this;
            return vm.getPeriodName(vm.dateRange);
        },

        /**
         * Общее количество собранного зерна за период
         * Количество отработанных дней
         * Дата в которую собрано максимальное количество зерна
         *
         * @returns {Object} статистические данные
         */
        statData() {
            const vm = this;
            const harvestData = new BvsData(
                strip(vm.bvsData),
                strip(vm.dateRange)
            );

            return harvestData.statistics;
        },

        /**
         * Данные для формирования рейтинга лучших 5
         *
         * @returns {Object} данные о лучших пяти сотрудниках / единиц техники и суммарном значении остальных
         */
        top5() {
            const vm = this;

            // начальные данные
            let total = 0; //суммарный сбор за период
            let othersCount = 0; // количество субьектов рейтинга свыше 5
            let othersTotal = 0; // суммарный сбор субьектов рейтинга свыше 5

            // формирование данных топ5
            let top5 = strip(vm.ratingData).reduce((acc, val, key) => {
                total += val.amount;

                if (key < 5) {
                    acc.push(val);
                } else {
                    othersCount++;
                    othersTotal += val.amount;
                }
                return acc;
            }, []);

            // формирование данных о не вошедших в топ5
            if (othersCount) {
                top5.push({
                    name: `остальные(${othersCount})`,
                    amount: othersTotal,
                    pid: 9999999,
                });
            }

            // замена абсолютных значений сбора процентными, если рассчитано суммарное количество
            top5 = top5.map((t) => {
                t.amount = total
                    ? `${((t.amount * 100) / total).toFixed(1)}%`
                    : t.amount;
                return t;
            });

            return top5;
        },

        /**
         * подпись к перечню лучших 5 сборщиков
         *
         * @returns {String}
         */
        top5Title() {
            const vm = this;
            const subject = vm.ratingOptions[vm.ratingBy];
            const period = vm.getPeriodName(vm.dateRange);

            return `${subject}. Лучшие 5 за ${period}`;
        },
    },

    mounted() {
        const vm = this;
        vm.$el.parentNode.classList.add("d-flex");
        const today = new Date();
        vm.dateRange.start = moment(today).set("date", 1).toISOString();
        vm.dateRange.end = moment(today).toISOString();

        setTimeout(() => {
            this.$refs.emptyMessage.classList.remove("d-none");
        }, 1500);
    },

    methods: {
        /**
         * Определение типа периода в зависимости от количества дней в нем
         *
         * @param {Object} periods
         * @returns {String}
         */
        getPeriodType(periods) {
            let type = "year";
            if (periods.days <= 31) {
                type = "day";
            } else if (periods.months < 12) {
                type = "month";
            }
            return type;
        },

        /**
         *
         * @param {*} dateRange
         * @returns {String} год, имя месяца, диапазон дат
         */
        getPeriodName(dateRange) {
            if (!dateRange.start || !dateRange.end) {
                return "-";
            }
            const start = moment(dateRange.start);
            const end = moment(dateRange.end);
            const periodLength = end.diff(start, "days") + 1;
            let periodName = `период с ${start.format(
                "D MMMM YYYY"
            )}г по ${end.format("D MMMM YYYY")}г`;

            periodName =
                start.format("MMMM") === end.format("MMMM") &&
                periodLength === start.daysInMonth()
                    ? start.format("MMMM YYYY года")
                    : periodName;

            periodName =
                start.format("YYYY") === end.format("YYYY") &&
                periodLength === 365
                    ? start.format("YYYY год")
                    : periodName;

            return periodName;
        },

        /**
         * Подготовление данных для отображения на графике
         *
         * @param {Object} rawData исходные данные
         * @param {Enum} periodType  day|month|year тип периода отображения
         *
         * @returns {Object}
         */
        prepareDataForGraph(rawData, periodType) {
            const vm = this;
            let info = strip(vm.bvsInfoBlank);
            // значение по оси OX предполагается увеличивать на 1
            let xValue = 0;

            rawData.items.forEach((value, key, map) => {
                xValue++;
                const date = moment(key, rawData.format);
                const formats = {
                    day: date.format("D"),
                    month: date.format("MMM"),
                    year: date.format("YYYY"),
                };
                const format = formats[periodType];

                // модификация данных в случае, если сбор измеряется в тоннах
                const newValue = value > 1000 ? value / 1000 : value;
                info.axis.x.after = value > 1000 ? "т." : info.axis.x.after;

                // обновление  максимального значения по оси OY
                info.axis.y.maxValue = Math.max(info.axis.y.maxValue, newValue);

                // метки по оси Х задаются в зависимости от выбранного периода, они могу быть и строка и число
                info.labels.x[parseInt(xValue)] = format;

                info.points[format] = {
                    x: parseInt(xValue),
                    y: newValue,
                };
            });

            info.axis.x.maxValue = Object.values(info.points).length + 1;

            return info;
        },

        /**
         * Обработчик события изменения дата компонента datepicker
         *
         * @param {Enum} type  start | end
         * @param {Object} passedData переданные данные от дочернего элемента
         */
        setDate(type, passedData) {
            this.dateRange[type] = passedData.date;
        },

        /**
         * Обработчик кликов на кнопку с заранее заданными типами периодов
         *
         * @param {Enum} type month | quarter | year
         */
        setPeriod(type) {
            const vm = this;
            const today = new Date();

            switch (type) {
                case "month":
                    vm.dateRange.start = moment(today)
                        .startOf("month")
                        .toISOString();
                    vm.dateRange.end = moment(today)
                        .endOf("month")
                        .toISOString();
                    break;
                case "quarter":
                    vm.dateRange.start = moment(today)
                        .startOf("quarter")
                        .toISOString();
                    vm.dateRange.end = moment(today)
                        .endOf("quarter")
                        .toISOString();
                    break;
                case "year":
                    vm.dateRange.start = moment(today)
                        .startOf("year")
                        .toISOString();
                    vm.dateRange.end = moment(today)
                        .endOf("year")
                        .toISOString();
                    break;
            }

            return;
        },
    },
};

export default appPublicStatistics;
