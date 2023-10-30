/**
 * Техника
 * Отображает список техники и позволяет
 * добавлять, удалять и редактировать технику
 */

//хэлперы
import { strip, clog } from "@/misc/helpers";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import crud from "@/mixins/crud";
import fixedRightCol from "@/mixins/fixedRightCol";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";

//компоненты
import MessagesComponent from "@/components/MessagesComponent/";
import BvsOperationComponent from "@/components/BvsOperationComponent";

const axios = require("axios");
const appPublicVehicles = {
    mixins: [axiosRequests, crud, fixedRightCol, publicAuthData, messages],

    components: { MessagesComponent, BvsOperation: BvsOperationComponent },

    data() {
        return {
            /**
             * активная вкладка в правой колонке при режиме редактирования техники
             * @param {Enum} : info | activity | settings
             */
            activeTab: "info",

            /**
             * данные от весовой системы БП
             * @param {Array}
             */
            bvsData: new Map(),

            /**
             * Выбранная к просмотру единица техники
             * @param {Object}
             */
            editedVehicle: {},

            /**
             * Список сотрудников организации
             * @param {Array}
             */
            employees: [],

            /**
             * Строка поиска по сотрудникам организации
             * @param {String}
             */
            employeeSearch: "",

            /**
             * Группы техники, для объединения комбайна и БП
             * @param {Array}
             */
            group: [],

            /**
             * Временная переменная для создания группы техники
             * @param {Array}
             */
            mayBeGroupedVehicles: [],

            /**
             * Режим отображения форм добавления/редактирования техники и списка техники
             * @param {Enum} // list | edit | create | details
             */
            mode: "list",

            /**
             * Временная переменная для назначения ответственного лица
             *  @param {Object}
             */
            mayBeResponsiblePerson: null,

            /**
             * Ключ для отображения всплывающий окон со списком сотрудников и техники
             * @param {Enum} // employees | vehicles
             */
            popup: null,

            /**
             * Введенный пинкод
             * @param {Number} 10e4
             */
            pincode: null,

            /**
             * Списко RFID меток организации
             * @param {Array}
             */
            rfids: [],

            /**
             * Тип добавляемой техники, используется для переключателей техники в форме добавления техники
             * @param {Enum} // bunker | transporter | tractor | harvester
             */
            vehicleAddType: null,

            /** */
            vehicleGroupType: null,

            /**
             * Перечень техники организации, сгруппированной по типам
             * @param {Object}
             */
            vehicles: {
                bunkers: [],
                transporters: [],
                tractors: [],
                harvesters: [],
            },

            /**
             * Тип техники которая сейчас просматривается
             * @param {Enum} // bunker | transporter | tractor | harvester
             */
            vehicleType: null,
        };
    },

    computed: {
        /**
         * HTML класс колонки, содержащей список техники
         *
         * @returns {String}
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
         * отфильтрованный список сотрудников.
         * Зависит от введенной строки поиска по сотрудникам
         *
         * @returns {Array}
         */
        employeesList() {
            const vm = this;
            if (vm.employeeSearch.length < 3) {
                return vm.employees;
            }

            return vm.employees.filter((e) => {
                return (
                    e.first_name
                        .toLowerCase()
                        .search(vm.employeeSearch.toLowerCase()) >= 0 ||
                    e.last_name
                        .toLowerCase()
                        .search(vm.employeeSearch.toLowerCase()) >= 0 ||
                    e.middle_name
                        .toLowerCase()
                        .search(vm.employeeSearch.toLowerCase()) >= 0 ||
                    e.phone
                        .toLowerCase()
                        .search(vm.employeeSearch.toLowerCase()) >= 0 ||
                    e.specialisation
                        .toLowerCase()
                        .search(vm.employeeSearch.toLowerCase()) >= 0
                );
            });
        },

        bvsOperations() {
            const vm = this;
            const key = vm.editedVehicle.id;

            if (!key) {
                return [];
            }

            if (!vm.bvsData.has(key)) {
                return [];
            }

            return vm.bvsData.get(key);
        },

        /**
         * Список моделей БП Лилиани
         *
         * @returns {Array<string>}
         */
        bunkerModels() {
            return [
                "БП-16/20",
                "БП-22/28",
                "БП-22/28 габаритный",
                "БП-22/28 (8 колес)",
                "БП-22/31",
                "БП-22/31 хоппер",
                "БП-22/31 габаритный",
                "БП-22/31 8 колес",
                "БП-33/42 хоппер",
                "БП-33/42 8 колес",
                "БП-40/50",
            ];
        },

        /**
         * Человеко понятные имена типов техники
         *
         * @returns {Object}
         */
        vehicleTypesList() {
            return {
                bunker: {
                    name: "Бункер перегрузчик",
                },
                transporter: {
                    name: "Грузовик",
                },
                tractor: {
                    name: "Трактор",
                },
                harvester: {
                    name: "Комбайн",
                },
            };
        },

        /**
         * Название типа техники
         * @returns {String}
         */
        vehicleName() {
            return this.vehicleTypesList[this.vehicleType]?.name;
        },

        /**
         * Текущий список техники
         *
         * @returns {Array}
         */
        vehiclesCurrent() {
            const vehicles = this.vehicles[`${this.vehicleType}s`]
                ? this.vehicles[`${this.vehicleType}s`]
                : {};

            return Object.values(vehicles);
        },

        /**
         * перечень не сгруппированной техники
         * или техники в одной группе с выбранной единицей техники
         *
         * @returns {Array}
         */
        vehiclesGrouped() {
            const vm = this;
            let vehicles = Object.values(
                vm.vehicles[`${vm.vehicleGroupType}s`]
            );

            vehicles = vehicles.filter((el) => {
                return (
                    !el.group_id || el.group_id === vm.editedVehicle.group_id
                );
            });

            vehicles = Boolean(vm.editedVehicle.id)
                ? vehicles.filter((item) => {
                      return item.id !== vm.editedVehicle.id;
                  })
                : vehicles;

            return vehicles;
        },

        /**
         * список РФИд  меток
         *
         * @returns {Array}
         */
        rfidsComputed() {
            return this.rfids;
        },
    },

    watch: {
        /**
         * отправка запроса при выборе закладки  активность
         *
         * @param {Enum} activeTab info | activity | settings
         */
        activeTab(activeTab) {
            const vm = this;
            clog({ activeTab });
            vm.$nextTick(() => {
                vm.enableInputs();
            });

            if (activeTab === "activity") {
                vm.getBvsDataBy(
                    vm.editedVehicle.id,
                    vm.editedVehicle.type
                ).then((e) => {
                    if (!vm.bvsData.has(e.owner_id)) {
                        vm.bvsData.set(e.owner_id, e.bvs_data);
                    }
                });
            }
        },

        bvsData(bvsData) {
            clog(bvsData);
        },

        /**
         * @param {Object} vehicle
         */
        editedVehicle(vehicle) {
            const vm = this;
            if (vm.activeTab === "activity") {
                vm.getBvsDataBy(
                    vm.editedVehicle.id,
                    vm.editedVehicle.type
                ).then((e) => {
                    if (!vm.bvsData.has(e.owner_id)) {
                        vm.bvsData.set(e.owner_id, e.bvs_data);
                    }
                });
            }
        },

        /**
         * @param {Enum} mode  // list | edit | create | details
         */
        mode(mode) {
            const vm = this;
            if (mode !== "details") {
                // обнуление фиксированного положение правой колонки
                vm.stopFixElement();
            }

            vm.$nextTick(() => {
                if (mode === "details") {
                    // применение sticky поведения для правой колонки
                    vm.startFixElement("fixposition", "observeResize", false, [
                        vm.$refs.beforeStickyPosition,
                    ]);
                }
            });

            if (mode === "create") {
                vm.reset();
                vm.$nextTick(() => {
                    vm.enableInputs();
                });
            }
        },

        popup() {
            const vm = this;
            vm.$nextTick(() => {
                vm.enableInputs();
            });
        },

        /**
         * обнуление форм при смене типа добавляемой техники
         */
        vehicleAddType() {
            const vm = this;
            vm.reset();
            vm.$refs.formCreateVehicle?.reset();
            vm.$nextTick(() => {
                vm.enableInputs();
                vm.pincode = null;
            });
        },

        vehicleType(vehicleType) {
            this.vehicleAddType = vehicleType;
            this.vehicleGroupType = vehicleType;
            const vm = this;
            vm.reset();
        },
    },

    mounted() {
        const vm = this;
        vm.vehicleType = vm.$refs.vehicleType.value;
        vm.getEmployees().then((e) => {
            vm.employees = e.employees;
        });

        vm.getVehicles().then((vehicles) => {
            vm.vehicles = vehicles;
        });

        document.addEventListener("updateList", () => {
            vm.getEmployees().then((e) => {
                clog(e);
                vm.employees = e.employees;
            });

            vm.getVehicles().then((vehicles) => {
                vm.vehicles = vehicles;
            });
        });
    },

    methods: {
        addVehicle(type) {
            const vm = this;
            vm.mode = "create";
            vm.vehicleType = type;
        },

        addVehicleToGroup(item) {
            const vm = this;
            let group = Object.values(vm.group);
            const index = group.findIndex((el) => {
                return el.id === item.id;
            });

            if (index < 0) {
                group.push(item);
            } else {
                group.splice(index, 1);
            }

            vm.group = strip(group);
        },

        applyGroup() {
            const vm = this;
            vm.mayBeGroupedVehicles = strip(vm.group);
            vm.popup = null;
        },

        checkPin(createOrEdit) {
            const vm = this;
            const pin = vm.pincode;
            const name =
                createOrEdit === "edit"
                    ? vm.editedVehicle.name
                    : vm.$refs.bunkerName.value;

            if (!Boolean(pin)) {
                vm.messages.error = "Пинкод не задан";
                return;
            }
            if (!Boolean(name)) {
                vm.messages.error = "Имя техники не задано";
                return;
            }

            if (pin.length !== 5) {
                vm.messages.error = "Пинкод должен быть из 5 символов";
                return;
            }

            axios
                .post("/vehicles/pincode", {
                    user_id: vm.userId,
                    name: name,
                    pin: pin,
                })
                .then((response) => {
                    clog(strip(response));
                    vm.messages[response.data.type] = response.data.message;
                })
                .catch((e) => {
                    clog(e.response);
                    vm.messages.error = e.response.data.message;
                });
        },

        checkRfid() {
            const vm = this;

            const formData = new FormData(vm.$refs.addRfid);
            let postData = {};

            for (const [key, value] of formData) {
                postData[key] = value;
            }
            postData["organisation_id"] = vm.organisation_id;
            axios
                .post(`/rfids/test`, postData)
                .then((response) => {
                    clog("%c checkRfid response", "color:green", response);
                    vm.messages[response.data.type] = response?.data?.message;
                })
                .catch((e) => {
                    clog("%c checkRfid error", "color: red", e.response);
                    vm.messages.error = e.response.data.message;
                });
        },

        createVehicle() {
            const vm = this;
            const formData = new FormData(vm.$refs.formCreateVehicle);

            let postData = {};

            for (const [key, value] of formData) {
                postData[key] = value;
            }

            const sendData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                employee_id: vm.mayBeResponsiblePerson?.id,
                post_data: postData,
                rfids: vm.rfids,
                group: Object.values(vm.mayBeGroupedVehicles).map((e) => e.id),
            };
            clog("createVehicle: ", vm.vehicleType);
            clog("createVehicle data: ", sendData);

            axios
                .post(`/vehicles/store`, sendData)
                .then((response) => {
                    clog("%c createVehicle response", "color:green", response);
                    vm.messages[response.data.type] = response?.data?.message;
                    vm.$refs.formCreateVehicle?.reset();
                    vm.reset();
                    vm.getVehicles();
                })
                .catch((e) => {
                    clog("%c createVehicle error", "color: red", e.response);
                    vm.messages.error = e.response.data.message;
                });
        },

        deleteVehicle(item) {
            clog("%c deleteVehicle", "color: blue", item);
            const vm = this;

            vm.mode = "list";

            const sendData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                delete_item: item,
            };

            axios
                .post(`/vehicles/delete`, sendData)
                .then((response) => {
                    clog("%c deleteVehicle", "color:green", response);
                    vm.messages[response.data.type] = response?.data?.message;
                    vm.getVehicles();
                })
                .catch((e) => {
                    clog("%c deleteVehicle error", "color: red", e.response);
                    vm.messages.error = e.response.data.message;
                });
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

        /**
         * запрашивает данные бункера весовой по переданной id и типу техники
         *
         * @param {Number} id техники
         * @param {Enum} type
         *
         * @returns {False|Object}
         */
        async getBvsDataBy(id, type) {
            const vm = this;

            if (vm.bvsData.has(id)) {
                clog(vm.bvsData);
                return false;
            }

            return vm.getBvsDataFiltered(id, type);
        },

        removeRfid(rfid) {
            const vm = this;
            const index = Object.values(vm.rfids).findIndex((item) => {
                return rfid.label === item.label && rfid.value === item.value;
            });

            vm.rfids.splice(index, 1);
        },

        removeFromGroup(item, save) {
            const vm = this;
            const group = Object.values(vm.group);
            const index = group.findIndex((el) => {
                return el.id === item.id;
            });

            if (index >= 0) {
                group.splice(index, 1);
                vm.group = group;
            }

            if (save) {
                vm.mayBeGroupedVehicles = strip(vm.group);
            }
        },

        reset() {
            const vm = this;
            vm.mayBeResponsiblePerson = null;
            vm.popup = null;
            vm.editedVehicle = {};
            vm.mayBeGroupedVehicles = [];
            vm.rfids = [];
            vm.group = [];
        },

        selectResponsiblePerson(person) {
            const vm = this;
            vm.mayBeResponsiblePerson = person;
            vm.popup = null;
            clog("%c selectResponsiblePerson", "color: blue", strip(person));
        },

        submitCreate() {
            this.$refs.formCreateVehicle.requestSubmit();
        },

        submitRfid() {
            const vm = this;

            const formData = new FormData(vm.$refs.addRfid);
            let postData = {};

            for (const [key, value] of formData) {
                postData[key] = value;
            }

            clog(postData);

            vm.rfids.push(postData);

            // vm.$refs.addRfid?.reset();
            vm.popup = null;
        },

        updateVehicle() {
            const vm = this;
            clog("%c updateVehicle", "color: blue", strip(vm.editedVehicle));

            const formData = new FormData(vm.$refs.editVehicleForm);
            let postData = {};

            for (const [key, value] of formData) {
                postData[key] = value;
            }

            const sendData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                employee_id: vm.mayBeResponsiblePerson?.id,
                post_data: postData,
                rfids: vm.rfids,
                group: Object.values(vm.mayBeGroupedVehicles).map((e) => e.id),
            };

            axios
                .post(`/vehicles/update`, sendData)
                .then((response) => {
                    clog("%c updateVehicle", "color:green", response);
                    vm.messages[response.data.type] = response?.data?.message;
                    vm.getVehicles();
                })
                .catch((e) => {
                    clog("%c updateVehicle error", "color: red", e.response);
                    vm.messages.error = e.response.data.message;
                });
        },

        viewVehicle(item) {
            clog("%c viewVehicle", "color: blue", strip(item));
            const vm = this;
            this.mode = "details";
            vm.editedVehicle = strip(item);
            vm.mayBeResponsiblePerson = strip(item).employee;
            vm.rfids = strip(item).rfids;
            vm.mayBeGroupedVehicles = strip(item).group;
            vm.group = strip(item).group;
        },
    },
};

export default appPublicVehicles;
