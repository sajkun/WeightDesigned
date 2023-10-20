//хэлперы
import { strip, clog } from "@/misc/helpers";

export default {
    data() {
        return {
            bvsData: [], // данные о транзакциях БВC

            employees: [], // перечень сотрудников организации

            vehicles: [], // перечень техники

            ratingBy: "", // по ком или чем отображать рейтинг

            dateRange: {
                // диапазон дат для фильтрации данных бвс
                start: null,
                end: null,
            },
        };
    },

    computed: {
        /**
         * Вычисляет итоговое собранное количество зерна в разрезе техники
         *
         * @return {Void|Array}
         */
        bvsTransferedAmounts() {
            const vm = this;

            if (!vm.bvsData?.length) return;
            // сортировка данных по временному периоду
            let data = strip(vm.bvsData).filter((d) => {
                let validatedStart = true;
                let validatedEnd = true;
                const operationDate = new Date(d.operation_time);

                if (vm.dateRange.start) {
                    const start = new Date(vm.dateRange.start);
                    validatedStart = start <= operationDate;
                }

                if (vm.dateRange.end) {
                    const end = new Date(vm.dateRange.end);
                    validatedEnd = end >= operationDate;
                }

                return validatedStart && validatedEnd;
            });

            let parsedData = {};

            // перебор массива данных бвс
            for (const _data of data) {
                /**
                 * если загрузка от комбайна (bvs_name === to), то данные добавляются и для БВС
                 * Если загрузка от БВС (bvs_name === from), то значение переданное плюсуется только для грузовика
                 */

                if (_data.bvs_name === _data.to) {
                    if (!parsedData[_data.from]) {
                        parsedData[_data.from] = 0;
                    }
                    parsedData[_data.from] += parseFloat(
                        _data.amount_transfered
                    );
                }

                if (!parsedData[_data.to]) {
                    parsedData[_data.to] = 0;
                }
                parsedData[_data.to] += parseFloat(_data.amount_transfered);
            }

            return parsedData;
        },

        /**
         * Сформированные данные для рейтинга
         *
         * @return {Array}
         */
        ratingDataRaw() {
            const vm = this;
            // список отфильтрованной по ratingBy техники
            const vehicles = strip(vm.vehicles);

            // список отфильтрованных по ratingBy сотрудников с назначенной техникой
            const employees = strip(vm.employees);

            // количество полученной техникой культуры
            const transfered = strip(vm.bvsTransferedAmounts);

            // перечень типов техники
            const vehicleTypes = strip(Object.keys(vm.vehicleTypes));
            let output = [];
            let idx = 1;

            // формирование рейтинга в разрезе техники
            for (const _vehicle of vehicles) {
                const _temp = {
                    name: "",
                    type: "",
                    amount: 0,
                    object: _vehicle,
                    type: vm.vehicleTypes[_vehicle.type],
                    sort: _vehicle.type,
                    pid: idx,
                    model: "vehicle",
                };
                _temp.name = _vehicle.name;
                _temp.id = _vehicle.id;
                if (transfered[_vehicle.name]) {
                    _temp.amount += transfered[_vehicle.name];
                }
                output.push(_temp);
                idx++;
            }
            // формирование рейтинга в разрезе сотрудников
            for (const _employee of employees) {
                const _key = `${_employee.last_name} ${_employee.first_name} ${_employee.middle_name}`;
                const _temp = {
                    name: "",
                    type: "",
                    amount: 0,
                    object: _employee,
                    type: _employee.specialisation,
                    sort: _employee.specialisation,
                    pid: idx,
                    model: "employee",
                };
                _temp.name = _key;
                _temp.id = _employee.id;
                const _vehicles = _employee.vehicles.map((v) => v.name);

                for (const __name of _vehicles) {
                    if (!transfered[__name]) continue;
                    _temp.amount += transfered[__name];
                }
                output.push(_temp);
                idx++;
            }

            return output;
        },

        /**
         * отсортированныей массив данных для рейтинга
         *
         * @returns {Array}
         */
        ratingData() {
            const vm = this;
            const output = strip(vm.ratingDataRaw).filter((i) => {
                return i.sort === vm.ratingBy;
            });

            // сортировка рейтинга по убыванию
            output.sort((itemA, itemB) => {
                if (itemA.amount === itemB.amount) return 0;

                return itemA.amount < itemB.amount ? 1 : -1;
            });

            return output;
        },

        /**
         * Список доступных вариантов рейтинга
         *
         * @returns {Object} В качестве ключа профессия сотрудника либо тип техники
         * @see Laravel Model Employee | Vehicle
         */
        ratingOptions() {
            const vm = this;
            let options = {};
            const separator = { "-": "-----------" };
            Object.assign(options, vm.vehicleTypes, separator, vm.professions);
            return options;
        },
    },

    mounted() {
        const vm = this;
        // выбор начального значения из вариантов статистики
        vm.ratingBy = Object.keys(strip(vm.ratingOptions))[0];

        // запрос и получение списка сотрудников
        vm.getEmployees().then((e) => (vm.employees = e.employees));

        // запрос и получение списка техники, присвоение списка
        vm.getVehicles().then((e) => {
            vm.vehicles = [
                ...Object.values(e.bunkers),
                ...Object.values(e.harvesters),
                ...Object.values(e.tractors),
                ...Object.values(e.transporters),
            ];
        });

        //запрос данных от БВС
        vm.getBvsData().then((e) => (vm.bvsData = e.bvs_data));
    },
};
