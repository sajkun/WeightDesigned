/**
 * Техника
 * Отображает список техники и позволяет
 * добавлять, удалять и редактировать технику
 */

//хэлперы
import { strip } from "@/misc/helpers";

const clog = () => {};

//миксины
import fixedRightCol from "@/mixins/fixedRightCol";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";

const axios = require("axios");
const appPublicVehicles = {
    mixins: [fixedRightCol, publicAuthData, messages],

    data() {
        return {
            mode: "list", // list | edit | create | details
            vehicleAddType: null,
            vehicleType: null, // bunker | transporter | tractor | harvester
            mayBeResponsiblePerson: null,
            rfids: [],
            mayBeGroupedVehicles: [],
            popup: null, // employees | vehicles
            employees: [],
            employeeSearch: "",
            activeTab: "info",
            pincode: null,
            group: [],
            vehicles: {
                bunkers: [],
                transporters: [],
                tractors: [],
                harvesters: [],
            },
            vehicleGroupType: null,
            editedVehicle: {},
        };
    },

    computed: {
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

        vehicleName() {
            return this.vehicleTypesList[this.vehicleType]?.name;
        },

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

        vehiclesCurrent() {
            return this.vehicles[`${this.vehicleType}s`];
        },

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

        rfidsComputed() {
            return this.rfids;
        },
    },

    watch: {
        mode(mode) {
            const vm = this;
            clog("watch:mode", mode);
            if (mode !== "details") {
                // обнуление фиксированного положение правой колонки
                vm.stopFixElement();
            }

            vm.$nextTick(() => {
                if (mode === "details") {
                    // применение sticky поведения для правой колонки
                    vm.startFixElement("fixposition", "observeResize");
                }
            });

            if (mode === "create") {
                vm.reset();
                vm.$nextTick(() => {
                    vm.enableInputs();
                });
            }
        },

        vehicleAddType() {
            const vm = this;
            vm.reset();
            vm.$refs.formCreateVehicle?.reset();
            vm.$nextTick(() => {
                vm.enableInputs();
            });
        },

        activeTab() {
            const vm = this;
            vm.$nextTick(() => {
                vm.enableInputs();
            });
        },

        popup() {
            const vm = this;
            vm.$nextTick(() => {
                vm.enableInputs();
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
        vm.getEmployees();
        vm.getVehicles();
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

        getEmployees() {
            const vm = this;

            if (vm.$refs.organisationId < 0) {
                return;
            }

            axios
                .get("/employees/list", {
                    user_id: vm.userId,
                })
                .then((response) => {
                    clog("%c getEmployees", "color: green", response);
                    vm.employees = response.data.employees;
                })
                .catch((e) => {
                    clog("%c getVehicles error", "color: red", e.response);
                    vm.messages.error = e.response.data.message;
                });
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

        getVehicles() {
            const vm = this;
            axios
                .get("/vehicles/list")
                .then((response) => {
                    clog("%c getVehicles", "color: green", response);
                    vm.vehicles = response.data;
                })
                .catch((e) => {
                    clog("%c getVehicles error", "color: red", e.response);
                    vm.messages.error = e.response.data.message;
                });
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
    },
};

export default appPublicVehicles;
