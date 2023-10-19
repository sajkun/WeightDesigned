//хэлперы
import { strip, clog } from "@/misc/helpers";
import moment from "moment";

/**
 * Форматирование массива данных от бвс
 */
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
     * Начальные значения сгруппированных данных
     */
    #groupedDataEmpty = {
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
            data: this.#groupDataByPeriods(),
            periods: this.#parseDiffDates(),
        };
    }

    /**
     * Рассчитывает:
     * Общее количество собранного зерна за период
     * Количество рабочих дней
     * Дату в которую собрано максимальное количество зерна
     *
     * @returns {Object}
     */
    get statistics() {
        const rawData = Object.fromEntries(
            this.#parseData()["YYYY-MM-DD"]?.items
        );
        const dates = this.#dates;

        // ранний выход, если не хватает данных
        if (!rawData || !dates) {
            return {
                collected: "-",
                daysCount: 0,
                bestDay: {
                    collected: "-",
                    date: "-",
                },
            };
        }

        //начальные данные переменных для результирующего ответа
        let collected = 0;
        let daysCount = 0;
        let bestDay = {
            collected: 0,
            date: "",
        };

        const start = moment(dates.start);
        const end = moment(dates.end);

        // получение искомы данных
        Object.entries(rawData).forEach(([dateStr, value]) => {
            const date = moment(dateStr);
            if (date <= end && date >= start) {
                collected += value;
                daysCount++;

                if (bestDay.collected < value) {
                    bestDay.collected = value;
                    bestDay.date = date.format("DD MMM");
                }
            }
        });

        // форматирование значений количества собранного зерна
        collected =
            collected > 1000 ? `${collected / 1000}т.` : `${collected}кг.`;

        bestDay.collected =
            bestDay.collected > 1000
                ? `${bestDay.collected / 1000}т.`
                : `${bestDay.collected}кг.`;

        return {
            collected,
            daysCount,
            bestDay,
        };
    }

    /**
     * Группировка имеющихся данных о собранном урожае
     * с разбивкой по дням, месяцам и годам
     *
     * @returns {Object}
     */
    #parseData() {
        let harvestData = {
            YYYY: {
                format: "YYYY",
                items: new Map(),
            },
            "YYYY-MM": {
                format: "YYYY-MM",
                items: new Map(),
            },
            "YYYY-MM-DD": {
                format: "YYYY-MM-DD",
                items: new Map(),
            },
        };

        for (const _harvestData of this.#data) {
            const date = moment(_harvestData.operation_time);

            for (const period in harvestData) {
                const _data = harvestData[period];
                const idx = date.format(_data.format);

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
     * Заполнение пустых элементов в объекте полученном через #parseData в зависимости от заданного периода
     *
     * @returns {Object}
     */
    #groupDataByPeriods() {
        const parsedData = this.#parseData();
        const diff = this.#parseDiffDates();
        const date = moment(this.#dates.start);
        let groupedData = this.#groupedDataEmpty;

        if (!diff.days) {
            return groupedData;
        }
        /**
         *
         */
        for (let i = 0; i <= diff.days; i++) {
            for (const period in groupedData) {
                const idxDate = date.format(groupedData[period].format);
                if (!groupedData[period].items.has(idxDate)) {
                    groupedData[period].items.set(idxDate, 0);
                }

                const idxPeriod = groupedData[period].format;
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
}

export { BvsData };
