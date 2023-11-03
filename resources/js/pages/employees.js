/**
 *
 * Приложение отвечающее за внешний вид и отправку
 * запросов CRUD раздела "Сотрудники"
 */

//хэлперы
import { strip, clog, getFormData } from "@/misc/helpers";

//миксины
import crud from "@/mixins/crud";
import fixedRightCol from "@/mixins/fixedRightCol";
import formatName from "@/mixins/formatName";
import icons from "@/mixins/icons";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";
import employeeForm from "@/formFields/employees";

//компоненты
import FieldComponent from "@/components/inputs/FieldComponent";
import FormComponent from "@/components/inputs/FormComponent/";
import InputComponent from "@/components/inputs/InputComponent";
import MessagesComponent from "@/components/common/MessagesComponent/";

const axios = require("axios");
const appPublicEmployees = {
    mixins: [
        crud,
        fixedRightCol,
        formatName,
        icons,
        publicAuthData,
        messages,
        employeeForm,
    ],
    components: {
        FieldComponent,
        Field: InputComponent,
        TheForm: FormComponent,
        MessagesComponent,
    },
    data() {
        return {
            /**
             * Значение активной закладки при mode = details
             *
             * @param {Enum} // info | activity | settings
             */
            activeTab: "info",

            /**
             * Перечень сотрудников организации
             */
            employees: [],

            group: [],

            editedEmployee: {
                id: -1,
                first_name: null,
                last_name: null,
                middle_name: null,
                phone: null,
                organisation_id: null,
                specialisation: null,
            },

            /**
             * ключ, определяющий отображать
             * - список сотрудников или
             * - форму редактирования выбранного сотрудника или
             * - форму создания нового сотрудника
             *
             * @param {Enum} : list | details | create
             */
            mode: "list",

            popup: null,

            validationMessages: {
                deleteEmployee: "Вы уверены, что хотите удалить сотрудника",
            },

            vehicleGroupType: "bunker",

            vehicles: [],
        };
    },

    watch: {
        editForm() {
            const vm = this;
            vm.reset();

            if (!vm.editMode) {
                // обнуление фитксированного положение правой колонки
                vm.stopFixElement();
            } else if (vm.editMode) {
                // применение sticky поведения для правой колонки
                vm.startFixElement("fixposition", "observeResize", false, [
                    vm.$refs.beforeStickyPosition,
                ]);
            }
        },

        mode(mode) {
            const vm = this;

            if (mode === "list") {
                // обнуление фитксированного положение правой колонки
                vm.stopFixElement();
            } else {
                // применение sticky поведения для правой колонки
                vm.startFixElement("fixposition", "observeResize", false, [
                    vm.$refs.beforeStickyPosition,
                ]);
            }
        },
    },

    computed: {
        editMode() {
            return ["create", "details"].indexOf(this.mode) >= 0;
        },

        showForm() {
            return this.mode === "create";
        },

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

        mobileBreakPoint() {
            return 992;
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

        /**
         * Добавляет/удаляет технику из группы
         *
         * @param {Object} item
         *
         * @returns {Object} group
         */
        switchVehicleGroupMembership(item) {
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
            vm.mode = "create";
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
            vm.mode = "list";

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

        edit(person) {
            const vm = this;
            vm.mode = "details";
            vm.editedEmployee = strip(person);
            vm.group = strip(person.vehicles);
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
                    vm.clearEmployee();
                    vm.$refs.createEmployeeForm.clear();
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
