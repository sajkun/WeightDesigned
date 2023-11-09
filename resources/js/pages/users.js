/**
 * работа с пользователями публичной зоны
 */

//вспомогательные функции
import { strip, clog, getFormData, getPropFromUrl } from "@/misc/helpers";

//миксины
import axiosRequests from "@/mixins/axiosRequests";
import changeDisplayMode from "@/mixins/changeDisplayMode";
import crud from "@/mixins/crud";
import editPasswordForm from "@/formFields/editPwd";
import fixedRightCol from "@/mixins/fixedRightCol";
import formatName from "@/mixins/formatName";
import messages from "@/mixins/messages";
import publicAuthData from "@/mixins/publicAuthData";
import userForms from "@/formFields/users";

//компоненты
import FormComponent from "@/components/inputs/FormComponent/";
import InputComponent from "@/components/inputs/InputComponent";
import MessagesComponent from "@/components/common/MessagesComponent/";

const axios = require("axios");
const appPublicUsers = {
    mixins: [
        axiosRequests,
        changeDisplayMode,
        crud,
        editPasswordForm,
        fixedRightCol,
        formatName,
        messages,
        publicAuthData,
        userForms,
    ],

    components: {
        Field: InputComponent,
        MessagesComponent,
        TheForm: FormComponent,
    },

    data() {
        return {
            /**
             * Значение активной закладки при mode = details
             *
             * @param {Enum} // info | activity | settings
             */
            activeTab: "info",

            editedUser: {},

            /**
             * список ролей пользователей организации
             * @param {Array}
             */
            roles: [],

            validationMessages: {
                inputOldPassword: "Введите пожалуйста старый пароль",
                inputNewPassword: "Задайте  пожалуйста новый пароль",
                passwordMinimal: "минимальная длина пароля 6 символов",
                deleteUser: "Вы уверены, что хотите удалить пользователя",
            },

            confirmAction: null,

            editPassword: false,

            /**
             * ключ, определяющий отображать
             * - список пользователей или
             * - форму редактирования выбранного пользователя или
             * - форму создания нового пользователя
             *
             * @param {Enum} : list | details | create
             */
            mode: "list",

            /**
             * Перечень полдьзователей системы организации
             */
            users: [],
        };
    },

    mounted() {
        const vm = this;
        vm.updateData(true);

        document.addEventListener("updateList", () => {
            vm.updateData();
        });
    },

    computed: {
        /**
         * Режим работы приложения
         *
         * @returns {Boolean}
         */
        editMode() {
            return ["create", "details"].indexOf(this.mode) >= 0;
        },

        listClass() {
            const editClass = "col-12 col-lg-6 d-none d-lg-block";
            const displayClass = "col-12 ";
            return this.editMode ? editClass : displayClass;
        },

        rolesList() {
            return this.roles;
        },

        /**
         * Признак согласного которого нужно отображать форму создания сотрудника или детали выбранного сотрудника
         *
         * @returns {Boolean}
         */
        showForm() {
            return this.mode === "create" && !this.editedUser?.id;
        },
    },

    watch: {
        /**
         * Отслеживание изменений закладки в настройках сотрудника
         * Обновление урл страницы
         */
        activeTab() {
            //обновление урл страницы без перезагрузки
            this.updateUrlParams();
            this.reset();
        },

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

        /**
         * отслеживание изменений режима работы страницы
         * Фиксирование правой колонки
         * Обновление урл страницы
         *
         * @param {Enum} mode
         */
        mode(mode) {
            const vm = this;
            vm.reset();

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

    methods: {
        addUser() {
            this.clearUser();
            this.editPassword = false;
            this.mode = "create";
        },

        clearUser() {
            this.editedUser = {};
        },

        deleteUser(user) {
            const vm = this;

            vm.editMode = false;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                delete_user_id: user.id,
                name: user.login,
            };

            vm.deleteEntity(postData, `/users/delete`);
        },

        editUser(user) {
            const vm = this;
            vm.mode = "details";
            vm.editPassword = false;
            vm.editedUser = JSON.parse(JSON.stringify(user));
            vm.updateUrlParams(user);
        },

        patchUser(data) {
            const vm = this;

            for (let key in data) {
                vm.editedUser[key] = data[key];
            }

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                edit_user: vm.editedUser,
            };

            vm.editEntity(postData, `/users/update`);
        },

        reset() {
            const vm = this;
            vm.editPassword = false;
        },

        storeUser(data) {
            const vm = this;
            const password = strip(data.password);
            delete data.password;

            const postData = {
                user_id: vm.userId,
                organisation_id: vm.organisationId,
                new_user: data,
                password: password,
            };

            vm.createEntity(postData, `/users/store`).then((e) => {
                if (e.status === 200) {
                    vm.clearUser();
                    vm.reset();
                    vm.$nextTick(() => {
                        vm.$refs.createUserForm.clear();
                    });
                }
            });
        },

        showChangePassword() {
            this.editPassword = true;
        },

        submitPassword(data) {
            const vm = this;

            if (!data.oldPassword) {
                vm.messages.error = vm.validationMessages.inputOldPassword;
                return;
            }

            if (!data.newPassword) {
                vm.messages.error = vm.validationMessages.inputNewPassword;
                return;
            }
            if (data.newPassword.length < 6) {
                vm.messages.error = vm.validationMessages.passwordMinimal;
                return;
            }

            axios
                .post(`./users/password`, {
                    user_id: vm.userId,
                    organisation_id: vm.organisationId,
                    edit_user_id: vm.editedUser.id,
                    new_password: data.newPassword,
                    old_password: data.oldPassword,
                })
                .then((response) => {
                    clog(response);
                    vm.editPassword = false;
                    vm.messages.success = response.data.message
                        ? response.data.message
                        : "Пароль успешно изменен";
                })
                .catch((e) => {
                    vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                });
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

            // обновление данных о пользователях и их ролях
            vm.getUsers().then((e) => {
                vm.users = e.data.users;
                vm.roles = e.data.roles;

                /**
                 *  выбрать из полученных пользователей активного по id, переданному в урл
                 */
                if (updateUrl) {
                    const id = parseInt(getPropFromUrl("id"));

                    if (!id) return;

                    const mayBeItem = strip(vm.users)
                        .filter((i) => i.id === id)
                        .pop();
                    vm.editedUser = mayBeItem ? mayBeItem : vm.editedUser;

                    if (vm.editedUser.hasOwnProperty("id")) {
                        return;
                    }

                    vm.$nextTick(() => {
                        vm.mode = "list";
                    });
                }
            });
        },
    },
};

export default appPublicUsers;
