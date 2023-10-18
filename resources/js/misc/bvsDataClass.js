import moment from "moment";

class BvsDataClass {
    #data;
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
     * Выдача  данных по дням
     *
     * @returns {Map}
     */
    get parsedData() {
        return {
            data: this.#groupDataByPeriods(),
            periods: this.#parseDiffDates(),
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

        let groupedData = {
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

        if (!diff.days) {
            return groupedData;
        }

        for (let i = 0; i <= diff.days; i++) {
            for (let period in groupedData) {
                const idx = date.format(groupedData[period].format);

                if (!groupedData[period].items.has(idx)) {
                    groupedData[period].items.set(idx, 0);
                }

                if (parsedData[groupedData[period].format]?.items.has(idx)) {
                    const value =
                        parsedData[groupedData[period].format].items.get(idx);
                    groupedData[period].items.set(idx, value);
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

export default (data, dates) => {
    return new BvsDataClass(data, dates);
};
