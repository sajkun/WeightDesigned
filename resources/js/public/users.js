/**
 * работа с пользователями публичной зоны
 */
import publicAuthData from "../mixins/publicAuthData";
import messages from "../mixins/messages";
import MessagesComponent from "./../components/MessagesComponent/";
import crud from "../mixins/crud";
import { strip, clog } from "../misc/helpers";
import addUserForm from "../formFields/addUser";
import editPasswordForm from "../formFields/editPwd";
import editUserForm from "../formFields/editUser";
import InputComponent from "../components/inputs/InputComponent";
import FormComponent from "./../components/inputs/FormComponent/";
const axios = require("axios");

const appPublicUsers = {
    mixins: [
        messages,
        crud,
        addUserForm,
        editUserForm,
        editPasswordForm,
        publicAuthData,
    ],

    components: {
        Field: InputComponent,
        TheForm: FormComponent,
        MessagesComponent,
    },

    data() {
        return {
            users: [],
            roles: [],
            activeTab: "info",
            editedUser: {
                id: -1,
                email: null,
                first_name: null,
                last_name: null,
                middle_name: null,
                phone: null,
                organisation_id: null,
                role: null,
                email: null,
                login: null,
            },

            validationMessages: {
                inputOldPassword: "Введите пожалуйста старый пароль",
                inputNewPassword: "Задайте  пожалуйста новый пароль",
                passwordMinimal: "минимальная длина пароля 6 символов",
                deleteUser: "Вы уверены, что хотите удалить пользователя",
            },

            confirmAction: null,
            editMode: false,
            showForm: false,
            editPassword: false,
        };
    },

    mounted() {
        const vm = this;
        vm.getUsers();

        document.addEventListener("updateList", () => {
            vm.getUsers();
        });

        vm.$el.addEventListener("click", (e) => {
            if (e.target.type !== "button") {
                vm.clearMessages();
            }
        });
    },

    computed: {
        listClass() {
            const editClass = "col-12 col-lg-6 d-sm-none d-lg-block";
            const displayClass = "col-12 ";
            return this.editMode ? editClass : displayClass;
        },

        rolesList() {
            return this.roles;
        },
    },

    watch: {
        editForm() {
            this.reset();
        },

        editMode() {
            this.reset();
        },

        activeTab() {
            this.reset();
        },
    },

    methods: {
        addUser() {
            this.clearUser();
            this.editMode = true;
            this.showForm = true;
            this.editPassword = false;
        },

        clearUser() {
            this.editedUser = {
                id: -1,
                email: null,
                first_name: null,
                last_name: null,
                middle_name: null,
                phone: null,
                organisation_id: null,
                role: null,
                email: null,
                login: null,
                role: null,
            };
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
            vm.editMode = true;
            vm.showForm = false;
            vm.editPassword = false;
            vm.editedUser = JSON.parse(JSON.stringify(user));
        },

        getUsers() {
            const vm = this;

            if (vm.$refs.organisationId < 0) {
                return;
            }
            axios
                .get("/users/list")
                .then((response) => {
                    clog("%c getUsers успех", "color:green", response);
                    vm.users = response.data.users;
                    vm.roles = response.data.roles;
                })
                .catch((e) => {
                    clog("%c getUsers ошибка", "color:red", e.response);
                });
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
                    vm.$refs.createUserForm.reset();
                    vm.clearUser();
                    vm.reset();
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
    },
};

export default appPublicUsers;
