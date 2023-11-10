/**
 * приложение отображение статистики публичного раздела
 *
 */

//хэлперы
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

//классы
// import { BvsData } from "@/misc/BvsDataClass";

class BvsData {
    /**
     * данные от БВС в виде полученном от сервера
     * {Array}
     */
    #data;

    /**
     * даты начала и конца периода отображения в формаите ISO
     * {Object}
     */
    #dates;

    /**
     * Конструктор класса
     *
     * @param {Array} data массив данных от бвс @see Laravel model BvsData
     * @param {Object} dates даты начала и конца
     */
    constructor(data, dates) {
        this.#data = data;
        this.#dates = dates;
    }

    /**
     * Выдача  данных по дням, годам и месяца
     *
     * @returns {Object}
     */
    get parsedData() {
        return {
            data: this.#getGroupDataByPeriods(),
            periods: this.#parseDiffDates(),
        };
    }

    /**
     * Рассчитывает:
     * Общее количество собранного зерна за период
     * Количество отработанных дней
     * Дату в которую собрано максимальное количество зерна
     *
     * @returns {Object}
     */
    get statistics() {
        const rawData = Object.fromEntries(this.#parseData().day?.items);

        return this.#getStatisticsData(rawData, this.#dates);
    }

    /**
     * Форматирует вес
     * Добавляет единицы измерения киллограммы или тонны
     * делит значение на 1000, если это тонны
     *
     * @param {Number} number
     *
     * @returns {String}
     */
    #formatWeight(number) {
        return number > 1000 ? `${number / 1000}т.` : `${number}кг.`;
    }

    /**
     * Рассчитывает:
     * Общее количество собранного зерна за период
     * Количество рабочих дней
     * Дату в которую собрано максимальное количество зерна
     *
     * @param {Object} dates данные о временном диапазоне
     * @param {Object} rawData данные статистики
     *
     * @returns {Object}
     */
    #getStatisticsData(rawData, dates) {
        //начальные данные переменных для результирующего ответа
        let _result = {
            collected: 0,
            daysCount: 0,
            bestDay: {
                collected: 0,
                date: "-",
            },
        };

        // ранний выход, если не хватает данных
        if (!this.#validate(rawData, dates)) {
            return _result;
        }

        // начальные значения искомых данных
        const start = moment(dates.start);
        const end = moment(dates.end);

        // получение искомы данных
        Object.entries(rawData).forEach(([dateStr, value]) => {
            const date = moment(dateStr);
            if (date <= end && date >= start) {
                _result.collected += value;
                _result.daysCount++;

                if (_result.bestDay.collected < value) {
                    _result.bestDay.collected = value;
                    _result.bestDay.date = date.format("DD MMM");
                }
            }
        });

        _result.collected = this.#formatWeight(_result.collected);
        _result.bestDay.collected = this.#formatWeight(
            _result.bestDay.collected
        );

        return _result;
    }

    /**
     * Заполнение пустых элементов в объекте полученном через #parseData в зависимости от заданного периода
     *
     * @returns {Object}
     */
    #getGroupDataByPeriods() {
        const parsedData = this.#parseData();
        const diff = this.#parseDiffDates();
        const date = moment(this.#dates.start);
        let groupedData = this.#groupedDataEmpty();

        if (!this.#validate(diff.days)) {
            return groupedData;
        }
        /**
         * по каждому дню начиная с this.#dates.start добавляется
         * элемент в Map каждой группы день, месяц год.
         * Если существует ненулевое значение собранного зерна в этот день,
         * добавляется значение
         *
         * @param diff.days - количество дней
         * @param groupedData - объект с незаполненными данными
         * @param parsedData - имеющиеся данные о собранной культуре
         * @param {Enum} period day|month|year
         */
        for (let i = 0; i <= diff.days; i++) {
            for (const period in groupedData) {
                const idxDate = date.format(groupedData[period].format);
                if (!groupedData[period].items.has(idxDate)) {
                    groupedData[period].items.set(idxDate, 0);
                }

                const idxPeriod = period;
                if (parsedData[idxPeriod]?.items.has(idxDate)) {
                    const value = parsedData[idxPeriod].items.get(idxDate);
                    groupedData[period].items.set(idxDate, value);
                }
            }

            date.add(1, "days");
        }
        return groupedData;
    }

    /**
     * Структура данных сгруппированных данных о весе с
     * заполненными периодами в которых не было сбора
     * Начальные значения
     *
     * @see this.#getGroupDataByPeriods
     */
    #groupedDataEmpty() {
        return {
            year: {
                format: "YYYY",
                items: new Map(),
            },
            month: {
                format: "YYYY-MM",
                items: new Map(),
            },
            day: {
                format: "YYYY-MM-DD",
                items: new Map(),
            },
        };
    }

    /**
     * Структура данных о весе
     * Начальные значения
     *
     * @see this.#parseData
     */
    #harvestDataEmpty() {
        return {
            year: {
                format: "YYYY",
                items: new Map(),
            },
            month: {
                format: "YYYY-MM",
                items: new Map(),
            },
            day: {
                format: "YYYY-MM-DD",
                items: new Map(),
            },
        };
    }

    /**
     * Группировка имеющихся данных о собранном урожае
     * с разбивкой по дням, месяцам и годам
     *
     * @returns {Object}
     */
    #parseData() {
        let harvestData = this.#harvestDataEmpty();

        for (const _harvestData of this.#data) {
            const date = moment(_harvestData.operation_time);

            for (const period in harvestData) {
                const _data = harvestData[period];
                const idx = date.format(_data.format);

                if (_harvestData.bvs_name !== _harvestData.to) {
                    continue;
                }

                if (!_data.items.has(idx)) {
                    _data.items.set(idx, 0);
                }
                const newValue =
                    _data.items.get(idx) + _harvestData.amount_transfered;
                harvestData[period].items.set(idx, newValue);
            }
        }

        return harvestData;
    }

    /**
     * выдает разницу между датами в днях, месяцах и годах
     *
     * @returns {Object}
     */
    #parseDiffDates() {
        const start = moment(this.#dates.start);
        const end = moment(this.#dates.end);

        return {
            days: end.diff(start, "days"),
            months: end.diff(start, "months"),
            years: end.diff(start, "years"),
        };
    }

    /**
     * валидатор существования данных
     *
     * @param  {...any} данные которые нужно проверить на существование
     *
     * @returns {Boolean}
     */
    #validate(...items) {
        let isValid = true;
        [...items].forEach((val) => {
            switch (typeof val) {
                case "object":
                    isValid = !Boolean(Object.keys(val).length)
                        ? false
                        : isValid;

                    break;
                default:
                    isValid = !Boolean(val) ? false : isValid;
                    break;
            }
        });

        return isValid;
    }
}

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import fixedRightCol from "@/mixins/fixedRightCol";
import messages from "@/mixins/messages";
import professions from "@/mixins/professions";
import publicAuthData from "@/mixins/publicAuthData";
import statData from "@/mixins/statData";
import vehicleTypes from "@/mixins/vehicleTypes";

// компоненты
import MessagesComponent from "@/components/common/MessagesComponent";
import GraphicComponent from "@/components/common/GraphicComponent";
import MonthPickerComponent from "@/components/inputs/MonthPickerComponent";
import DatepickerComponent from "@/components/inputs/DatepickerComponent";

const appPublicStatistics = {
    mixins: [
        axiosRequests,
        crud,
        fixedRightCol,
        messages,
        professions,
        publicAuthData,
        statData,
        vehicleTypes,
    ],

    components: {
        MessagesComponent,
        MonthPicker: MonthPickerComponent,
        Datepicker: DatepickerComponent,
        Graph: GraphicComponent,
    },

    data() {
        return {
            initialized: false,
        };
    },

    watch: {
        bvsData() {
            const vm = this;

            if (!vm.initialized) {
                vm.$refs.emptyMessage.classList.remove("d-none");
                setTimeout(() => {
                    vm.startFixElement("fixposition", "observeResize", false, [
                        vm.$refs.beforeStickyPosition,
                    ]);
                }, 400);
                vm.initialized = true;
            }
        },
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
        vm.dateRange.start = moment(today).startOf("month").toISOString();
        vm.dateRange.end = moment(today).endOf("day").toISOString();
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
         * Название выбранного периода отображения результатов фборки
         *
         * @param {Object} dateRange
         *
         * @returns {String} год, имя месяца, диапазон дат
         */
        getPeriodName(dateRange) {
            if (!dateRange.start || !dateRange.end) {
                return "-";
            }
            const start = moment(dateRange.start);
            const end = moment(dateRange.end);
            const periodLength = end.diff(start, "days") + 1;
            // начальное значение периода
            let periodName = `период с ${start.format(
                "D MMMM YYYY"
            )}г по ${end.format("D MMMM YYYY")}г`;

            // является ли период одним месяцем
            periodName =
                start.format("MMMM") === end.format("MMMM") &&
                periodLength === start.daysInMonth()
                    ? start.format("MMMM YYYY года")
                    : periodName;

            // является ли период одним годом
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
                info.axis.y.maxValue = parseInt(
                    Math.max(info.axis.y.maxValue, newValue)
                );

                // метки по оси Х задаются в зависимости от выбранного периода, они могу быть и строка и число
                info.labels.x[parseInt(xValue)] = format;

                info.points[format] = {
                    x: parseInt(xValue),
                    y: newValue,
                };
            });

            info.axis.y.maxValue = Math.ceil(info.axis.y.maxValue * 1.05);

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
