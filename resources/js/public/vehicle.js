import messages from "../mixins/messages";
import { strip } from "./functions";

if (document.getElementById("public-vehicles")) {
    const appPublicBunkers = new Vue({
        el: "#public-vehicles",

        mixins: [messages],

        data: {
            organisationId: -1,
            userId: -1,
            mode: "list", // list | edit | create | details
            vehicleAddType: null,
            vehicleType: null, // bunkers | transporters | tractors | harvesters
            mayBeResponsiblePerson: null,
            mayBeGroupedVehicles: [],
            popup: null, // employees | vehicles
            employees: [],
            employeeSearch: "",
            activeTab: "info",
            vehicles: {
                bunkers: [],
                transporters: [],
                tractors: [],
                harvesters: [],
            },
            editedVehicle: {},
        },

        computed: {
            vehicleTypesList() {
                return {
                    bunkers: {
                        name: "Бункер перегрузчик",
                    },
                    transporters: {
                        name: "Грузовик",
                    },
                    tractors: {
                        name: "Трактор",
                    },
                    harvesters: {
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
                return this.vehicles[this.vehicleType];
            },
        },

        watch: {
            mode(mode) {
                console.log("mode:", mode);
                const vm = this;

                if (mode === "create") {
                    vm.$nextTick(() => {
                        const inputs = document.querySelectorAll(
                            ".form-control-custom input"
                        );

                        inputs.forEach((el) => {
                            el.addEventListener("input", (e) => {
                                if (e.target.value) {
                                    e.target.nextElementSibling.classList.add(
                                        "active"
                                    );
                                } else {
                                    e.target.nextElementSibling.classList.remove(
                                        "active"
                                    );
                                }
                            });
                        });
                    });
                }
            },

            vehicleType(vehicleType) {
                this.vehicleAddType = vehicleType;
                const vm = this;
                vm.reset();
            },
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;
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

            checkPin() {
                const vm = this;
                const pin = vm.$refs.bunkerPin.value;
                const name = vm.$refs.bunkerName.value;

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
                    .post("./bunkers/pincode", {
                        user_id: vm.userId,
                        name: name,
                        pin: pin,
                    })
                    .then((response) => {
                        console.log(JSON.parse(JSON.stringify(response)));
                        vm.messages[response.data.type] = response.data.message;
                    })
                    .catch((e) => {
                        console.log(e.response);
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
                };
                console.log("createVehicle: ", vm.vehicleType);
                console.log("createVehicle data: ", sendData);

                axios
                    .post(`./${vm.vehicleAddType}/store`, sendData)
                    .then((response) => {
                        console.log(
                            "%c createVehicle response",
                            "color:green",
                            response
                        );
                        vm.messages[response.data.type] =
                            response?.data?.message;
                        // vm.$refs.formCreateVehicle?.reset();
                        // vm.reset();
                        vm.getVehicles();
                    })
                    .catch((e) => {
                        console.log(
                            "%c createVehicle error",
                            "color: red",
                            e.response
                        );
                        vm.messages.error = e.response.data.message;
                    });
            },

            deleteVehicle(item) {
                console.log("%c deleteVehicle", "color: blue", item);
                const vm = this;

                const sendData = {
                    user_id: vm.userId,
                    organisation_id: vm.organisationId,
                    delete_item: item,
                };

                axios
                    .post(`./${vm.vehicleType}/delete`, sendData)
                    .then((response) => {
                        console.log(
                            "%c deleteVehicle",
                            "color:green",
                            response
                        );
                        vm.messages[response.data.type] =
                            response?.data?.message;
                        vm.getVehicles();
                    })
                    .catch((e) => {
                        console.log(
                            "%c deleteVehicle error",
                            "color: red",
                            e.response
                        );
                        vm.messages.error = e.response.data.message;
                    });
            },

            getEmployees() {
                const vm = this;

                if (vm.$refs.organisationId < 0) {
                    return;
                }

                axios
                    .post("./api/public/employees/list/" + vm.organisationId, {
                        user_id: vm.userId,
                    })
                    .then((response) => {
                        vm.employees = response.data.employees;
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },

            reset() {
                const vm = this;
                vm.mayBeResponsiblePerson = null;
                vm.popup = null;
                vm.mayBeGroupedVehicles = [];
            },

            getVehicles() {
                const vm = this;
                axios
                    .get("./vehicles")
                    .then((response) => {
                        console.log("%c getVehicles", "color: green", response);
                        vm.vehicles = response.data;
                    })
                    .catch((e) => {
                        console.log(
                            "%c getVehicles error",
                            "color: red",
                            e.response
                        );
                        vm.messages.error = e.response.data.message;
                    });
            },

            selectResponsiblePerson(person) {
                const vm = this;
                vm.mayBeResponsiblePerson = person;
                vm.popup = null;

                console.log(person);
            },

            submitCreate() {
                this.$refs.formCreateVehicle.requestSubmit();
            },

            viewVehicle(item) {
                console.log("%c viewVehicle", "color: blue", strip(item));
                const vm = this;
                this.mode = "details";
                vm.editedVehicle = item;
            },
        },
    });
}
