/**
 *
 * Приложение отвечающее за внешний вид и отправку
 * запросов CRUD раздела "Сотрудники"
 */

//хэлперы
import { strip, clog, getFormData, getPropFromUrl } from "@/misc/helpers";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import changeDisplayMode from "@/mixins/changeDisplayMode";
import crud from "@/mixins/crud";
import employeeForm from "@/formFields/employees";
import fixedRightCol from "@/mixins/fixedRightCol";
import formatName from "@/mixins/formatName";
import icons from "@/mixins/icons";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";
import vehicleTypesList from "@/mixins/vehicleTypesList";

//компоненты
import FieldComponent from "@/components/inputs/FieldComponent";
import FormComponent from "@/components/inputs/FormComponent/";
import InputComponent from "@/components/inputs/InputComponent";
import MessagesComponent from "@/components/common/MessagesComponent/";

const appPublicEmployees = {
    mixins: [
        axiosRequests,
        crud,
        changeDisplayMode,
        employeeForm,
        fixedRightCol,
        formatName,
        icons,
        publicAuthData,
        messages,
        vehicleTypesList,
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

            /**
             *
             */
            group: [],

            /**
             * редактируемый сотрудник
             *
             * @param {Object}
             */
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

            /**
             * Название отображаемого модального окна
             *
             * @param {String}
             */
            popup: null,

            validationMessages: {
                deleteEmployee: "Вы уверены, что хотите удалить сотрудника",
            },

            vehicleGroupType: "bunker",

            /**
             * список техники организации
             *
             * @param {Array}
             */
            vehicles: [],
        };
    },

    watch: {
        /**
         * Отслеживание изменений закладки в настройках сотрудника
         * Обновление урл страницы
         */
        activeTab() {
            //обновление урл страницы без перезагрузки
            this.updateUrlParams();
        },

        /**
         * отслеживание изменений режима работы страницы
         * Фиксирование правой колонки
         * Обновление урл страницы
         *
         * @param {Enum} mode
         */
        mode(mode) {
            const vm = this;

            if (mode === "list") {
                // обнуление фиксированного положение правой колонки
                vm.stopFixElement();
            } else {
                // применение sticky поведения для правой колонки
                vm.startFixElement("fixposition", "observeResize", false, [
                    vm.$refs.beforeStickyPosition,
                ]);
            }

            //обновление урл страницы без перезагрузки
            vm.updateUrlParams();
        },
    },

    computed: {
        /**
         * Режим работы приложения
         *
         * @returns {Boolean}
         */
        editMode() {
            return (
                ["create", "details"].indexOf(this.mode) >= 0 &&
                this.editedEmployee?.id
            );
        },

        /**
         * HTML класс конткейнера списка сотрудников
         *
         * @returns {String}
         */
        listClass() {
            const editClass = "col-12 col-lg-6 d-none d-lg-block";
            const displayClass = "col-12 ";
            return this.editMode ? editClass : displayClass;
        },

        /**
         * От какого значения считать режим работы мобильным приложением
         *
         * @returns {Number}
         */
        mobileBreakPoint() {
            return 992;
        },

        /**
         * Признак согласного которого нужно отображать форму создания сотрудника или детали выбранного сотрудника
         *
         * @returns {Boolean}
         */
        showForm() {
            return this.mode === "create" && this.editedEmployee?.id;
        },

        /**
         * перечень техники без назначенного ответственного лица
         *
         * @returns {Object}
         */
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
        vm.updateData(true);

        document.addEventListener("updateList", () => {
            vm.updateData();
        });
    },

    methods: {
        /**
         * Применение сформированной группы
         */
        applyGroup() {
            const vm = this;
            vm.editedEmployee.vehicles = strip(vm.group);
            vm.popup = null;
        },

        /**
         * Показывает форму создания нового сотрудника
         */
        addEmployee() {
            const vm = this;
            vm.mode = "create";
            vm.clearEmployee();
        },

        /**
         * очистка данных о пользователе
         */
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

        /**
         * Отправка запроса на удаление записи о сотруднике
         *
         * @param {Object} person
         *
         * @returns {Void}
         */
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

        /**
         * получаети год по переданной строке
         *
         * @param {String} dateString
         *
         * @returns {String} Year
         */
        getDate(dateString) {
            const date = new Date(dateString);
            return date.getFullYear();
        },

        /**
         * Отправка запроса на редактирование записи о сотруднике
         *
         * @returns {Void}
         */
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

        /**
         * Удаление техники из перечня техники за которую ответственен пользователь
         *
         * @param {Object} item @see app\Models\Vehicle.php
         *
         * @param {Boolean} save
         */
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

        /**
         * Отображает данные о выбранном сотруднике
         *
         * @param {Object} person @see app\Models\Employee.php
         *
         * @returns {Void}
         */
        showEmployeeDetails(person) {
            const vm = this;
            vm.mode = "details";
            vm.editedEmployee = strip(person);
            vm.group = strip(person.vehicles);
            vm.updateUrlParams(person);
        },

        /**
         * Отправка запроса на создание новой записи о сотруднике
         *
         * @param {Object} person @see app\Models\Employee.php
         *
         * @returns {Void}
         */
        storeEmployee(person) {
            const vm = this;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                edited_employee: person,
            };

            vm.createEntity(postData, `/employees/store`).then((e) => {
                if (e.status === 200) {
                    vm.clearEmployee();
                    vm.$refs.createEmployeeForm.clear();
                }
            });
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

        /**
         * Получает данные о сотрудниках и техники организации
         * обновляет значение переменных employees и  vehicles
         *
         * @param {Boolean} updateUrl
         *
         * @returns {Void}
         */
        async updateData(updateUrl = false) {
            const vm = this;

            // обновление данных о сотрудниках
            vm.getEmployees().then((e) => {
                vm.employees = e.employees;

                /**
                 *  выбрать из полученных сотрудников активного по id, переданному в урл
                 */
                if (updateUrl) {
                    const id = parseInt(getPropFromUrl("id"));

                    if (!id) return;

                    const mayBeItem = strip(vm.employees)
                        .filter((i) => i.id === id)
                        .pop();
                    vm.editedEmployee = mayBeItem
                        ? mayBeItem
                        : vm.editedEmployee;
                }
            });

            // обновление данных о технике
            vm.getVehicles().then((e) => {
                vm.vehicles = {
                    bunkers: Object.values(e.bunkers),
                    harvesters: Object.values(e.harvesters),
                    tractors: Object.values(e.tractors),
                    transporters: Object.values(e.transporters),
                };
            });
        },
    },
};

export default appPublicEmployees;
