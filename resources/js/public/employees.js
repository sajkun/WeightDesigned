/**
 *
 * Приложение отвечающее за внешний вид и отправку
 * запросов CRUD раздела "Сотрудники"
 */

//хэлперы
import { strip, clog, getFormData } from "@/misc/helpers";

//миксины
import addEmployeeForm from "@/formFields/employees/add";
import crud from "@/mixins/crud";
import editEmployeeForm from "@/formFields/employees/edit";
import fixedRightCol from "@/mixins/fixedRightCol";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";

//компоненты
import FieldComponent from "@/components/inputs/FieldComponent";
import FormComponent from "@/components/inputs/FormComponent/";
import InputComponent from "@/components/inputs/InputComponent";
import MessagesComponent from "@/components/MessagesComponent/";

const axios = require("axios");
const appPublicEmployees = {
    mixins: [
        addEmployeeForm,
        crud,
        editEmployeeForm,
        fixedRightCol,
        publicAuthData,
        messages,
    ],
    components: {
        FieldComponent,
        Field: InputComponent,
        TheForm: FormComponent,
        MessagesComponent,
    },
    data() {
        return {
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

            vehicles: [],

            validationMessages: {
                deleteEmployee: "Вы уверены, что хотите удалить сотрудника",
            },
        };
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
    },

    computed: {
        listClass() {
            const editClass = "col-12 col-lg-6 d-none d-lg-block";
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
                    !el.employee_id || el.employee_id === vm.editedEmployee.id
                );
            });

            return vehicles;
        },
    },

    mounted() {
        const vm = this;
        vm.getEmployees();
        vm.getVehicles();

        document.addEventListener("updateList", () => {
            vm.getEmployees();
            vm.getVehicles();
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
            vm.showForm = true;
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

        deleteEmployee(person) {
            const vm = this;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                delete_employee_id: person.id,
                name: `${person.specialisation} ${person.last_name}`,
            };

            vm.deleteEntity(postData, `./employees/delete`);
        },

        getDate(dateString) {
            const date = new Date(dateString);
            return date.getFullYear();
        },

        edit(person, showForm) {
            clog("%c edit", "color:blue", person);
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
                    clog("%c getEmployees", "color: green", response);
                    vm.employees = response.data.employees;
                })
                .catch((e) => {
                    clog("%c getVehicles error", "color: red", e.response);
                    vm.messages.error = e.response.data.message;
                });
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

        patchEmployee() {
            const vm = this;
            const form = vm.$refs.submitFormEdit;
            const data = getFormData(form);

            for (const key in data) {
                vm.editedEmployee[key] = data[key];
            }

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                edited_employee: vm.editedEmployee,
            };

            vm.editEntity(postData, `/employees/update`);
        },

        storeEmployee(data) {
            const vm = this;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                edited_employee: data,
            };

            vm.createEntity(postData, `/employees/store`).then((e) => {
                if (e.status === 200) {
                    vm.$refs.createEmployeeForm.reset();
                    vm.clearEmployee();
                }
            });
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
};

export default appPublicEmployees;
