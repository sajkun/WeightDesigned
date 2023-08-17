import messages from "../mixins/messages";
if (document.getElementById("public-vehicles")) {
    const appPublicBunkers = new Vue({
        el: "#public-vehicles",

        mixins: [messages],

        data: {
            organisationId: -1,
            userId: -1,
            mode: "list", // list | edit | create
            vehicleType: null, // bunkers | transporters | tractors | harvesters
            mayBeResponsiblePerson: null,
            mayBeGroupedVehicles: [],
            popup: null, // employees | vehicles
            employees: [],
            employeeSearch: "",
            vehicles: {
                bunkers: [],
                transporters: [],
                tractors: [],
                harvesters: [],
            },
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
        },

        watch: {
            mode(mode) {
                const vm = this;
                if (mode !== "create") {
                    vm.vehicleType = null;
                }

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

            vehicleType() {
                const vm = this;
                vm.reset();
                vm.$nextTick(() => {
                    // vm.$refs.formCreateVehicle?.reset();
                });
            },
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;

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

                axios
                    .post("./bunkers/store", {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        employee_id: vm.mayBeResponsiblePerson?.id,
                        post_data: postData,
                    })
                    .then((response) => {
                        console.log(response);
                        vm.messages[response.data.type] = response.data.message;
                        vm.$refs.formCreateVehicle?.reset();
                        vm.reset();
                    })
                    .catch((e) => {
                        console.log(e.response);
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
                        vm.vehicles = response.data;
                    })
                    .catch((e) => {
                        console.log(e.response);
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
        },
    });
}
