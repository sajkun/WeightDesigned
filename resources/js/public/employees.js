import { strip } from "./functions";

if (document.getElementById("public-employees")) {
    const appPublicEmployees = new Vue({
        el: "#public-employees",

        data: {
            organisationId: -1,
            userId: -1,
            editMode: false,
            showForm: false,
            employees: [],
            popup: null,
            vehicleGroupType: "bunker",
            group: [],
            activeTab: "info", // info | activity | settings
            editedEmployee: {
                id: -1,
                first_name: null,
                last_name: null,
                middle_name: null,
                phone: null,
                organisation_id: null,
                specialisation: null,
            },
            specialisations: {
                "Водитель Зерновоза": "Водитель Зерновоза",
                "Водитель Комбайна": "Водитель Комбайна",
                "Водитель Трактора": "Водитель Трактора",
            },
            messages: {
                error: null,
                info: null,
                success: null,
                confirm: null,
            },

            vehicles: [],

            validationMessages: {
                deleteEmployee: "Вы уверены, что хотите удалить сотрудника",
            },
        },

        watch: {
            editMode(editMode) {
                const vm = this;
                if (!editMode) {
                    vm.showForm = false;
                }

                if (editMode && vm.editedEmployee.id < 0) {
                    vm.showForm = true;
                }
            },

            "editedEmployee.id"(val) {
                const vm = this;
                if (val < 0) {
                    vm.showForm = true;
                } else {
                    vm.showForm = false;
                }
            },
        },

        computed: {
            listClass() {
                const editClass = "col-12 col-lg-6 d-sm-none d-lg-block";
                const displayClass = "col-12 ";
                return this.editMode ? editClass : displayClass;
            },

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

            vehiclesGrouped() {
                const vm = this;
                let vehicles = Object.values(
                    vm.vehicles[`${vm.vehicleGroupType}s`]
                );

                vehicles = vehicles.filter((el) => {
                    return (
                        !el.employee_id ||
                        el.employee_id === vm.editedEmployee.id
                    );
                });

                return vehicles;
            },
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;
            vm.getEmployees();
            vm.getVehicles();

            vm.$el.addEventListener("click", (e) => {
                if (e.target.type !== "button") {
                    vm.clearMessages();
                }
            });
        },

        methods: {
            applyGroup() {
                const vm = this;
                vm.editedEmployee.vehicles = strip(vm.group);
                vm.popup = null;
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

            addEmployee() {
                const vm = this;
                vm.editMode = true;
                vm.clearEmployee();
            },

            clearEmployee() {
                const vm = this;
                vm.editedEmployee = {
                    id: -1,
                    first_name: null,
                    last_name: null,
                    middle_name: null,
                    phone: null,
                    organisation_id: null,
                    specialisation: null,
                };
            },

            confirmActionCb() {
                document.dispatchEvent(new CustomEvent("submitConfirmEvent"));
            },

            cancelConfirmActionCb() {
                document.dispatchEvent(new CustomEvent("cancelConfirmEvent"));
            },

            clearMessages(confirm) {
                this.messages = {
                    error: null,
                    info: null,
                    success: null,
                    confirm: this.messages.confirm,
                };

                if (confirm) {
                    this.messages.confirm = null;
                }
            },

            deleteEmployee(person) {
                const vm = this;

                let handlerSubmit = null;
                let handlerCancel = null;
                vm.editMode = false;

                handlerSubmit = () => {
                    vm.deleteEmployeeCb(person);
                    document.removeEventListener(
                        "submitConfirmEvent",
                        handlerSubmit,
                        false
                    );

                    vm.$nextTick(() => {
                        vm.clearMessages(true);
                    });
                };

                handlerCancel = () => {
                    document.removeEventListener(
                        "submitConfirmEvent",
                        handlerSubmit,
                        false
                    );

                    document.removeEventListener(
                        "cancelConfirmEvent",
                        handlerCancel,
                        false
                    );

                    vm.$nextTick(() => {
                        vm.clearMessages(true);
                    });
                };

                if (!vm.messages.confirm) {
                    document.addEventListener(
                        "submitConfirmEvent",
                        handlerSubmit
                    );

                    document.addEventListener(
                        "cancelConfirmEvent",
                        handlerCancel
                    );

                    vm.messages.confirm = `${vm.validationMessages.deleteEmployee} ${person.last_name} ?`;
                } else {
                    document.removeEventListener(
                        "confirmEvent",
                        handlerSubmit,
                        false
                    );

                    document.removeEventListener(
                        "submitConfirmEvent",
                        handlerCancel,
                        false
                    );

                    vm.$nextTick(() => {
                        vm.clearMessages(true);
                    });
                }
            },

            getDate(dateString) {
                const date = new Date(dateString);
                return date.getFullYear();
            },

            getVehicles() {
                const vm = this;
                axios
                    .get("/vehicles/list")
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

            deleteEmployeeCb(person) {
                const vm = this;
                axios
                    .post(`./employees/delete`, {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        delete_employee_id: person.id,
                    })
                    .then((response) => {
                        console.log(response);
                        vm.getEmployees();
                    })
                    .catch((e) => {
                        console.log(e.response);
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    });
            },

            edit(person, showForm) {
                console.log("%c edit", "color:blue", person);
                const vm = this;
                vm.editMode = true;
                vm.editedEmployee = strip(person);
                vm.group = strip(person.vehicles);
                vm.$nextTick(() => {
                    vm.showForm = Boolean(showForm);
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
                        console.log(
                            "%c getEmployees",
                            "color: green",
                            response
                        );
                        vm.employees = response.data.employees;
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

            patchEmployee() {
                const vm = this;

                const postData = {
                    user_id: vm.userId,
                    organisation_id: vm.organisationId,
                    edited_employee: vm.editedEmployee,
                };

                console.log("%c patchEmployee", "color:blue", postData);
                axios
                    .post(`/employees/update`, postData)
                    .then((response) => {
                        console.log(response);
                        vm.getEmployees();
                    })
                    .catch((e) => {
                        console.log(e.response);
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    });
            },

            storeEmployee() {
                const vm = this;
                axios
                    .post(`/employees/store`, {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        edited_employee: vm.editedEmployee,
                    })
                    .then((response) => {
                        console.log(response);
                        vm.getEmployees();
                        vm.clearEmployee();
                        vm.messages[response.data.type] = response.data.message;
                    })
                    .catch((e) => {
                        console.log(e);
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    });
            },

            submitForm() {
                const vm = this;
                if (vm.editedEmployee.id === -1) {
                    vm.storeEmployee();
                } else {
                    vm.patchEmployee();
                }
            },

            removeFromGroup(item, save) {
                const vm = this;
                const group = Object.values(vm.group);
                const index = group.findIndex((el) => {
                    return el.id === item.id;
                });

                if (index >= 0) {
                    group.splice(index, 1);
                    vm.group = strip(group);

                    if (save) {
                        vm.editedEmployee.vehicles = strip(group);
                    }
                }
            },
        },
    });
}
