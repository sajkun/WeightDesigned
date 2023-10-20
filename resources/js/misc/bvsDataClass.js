/**
 * Класс, принимающий данный о транзакциях бвс
 * и форматирующий их в представление, используемое
 * для отображения графика сбора урожая
 * и статистических данных
 *
 *
 * @author Кулешов Вячеслав
 */

//хэлперы
import moment from "moment";

/**
 * Форматирование массива данных от бвс для страницы статистики
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

export { BvsData };
