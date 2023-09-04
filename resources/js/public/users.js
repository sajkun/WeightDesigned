/**
 * работа с пользователями публичной зоны
 */
import messages from "../mixins/messages";
import crud from "../mixins/crud";
import InputComponent from "../components/InputComponent";
import FormComponent from "./../components/FormComponent/";

if (document.getElementById("public-users")) {
    const appPublicUsers = new Vue({
        el: "#public-users",
        mixins: [messages, crud],
        components: {
            Field: InputComponent,
            TheForm: FormComponent,
        },
        data: {
            organisationId: -1,
            userId: -1,
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
            passwords: {
                old: null,
                new: null,
            },
            confirmAction: null,
            editMode: false,
            showForm: false,
            editPassword: false,
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;
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

            addUserFormStructure() {
                return [
                    {
                        id: "login-new-user",
                        name: "login",
                        label: "Имя учетной записи",
                        type: "text",
                        required: true,
                        class: "mt-2",
                    },
                    {
                        id: "first_name-new-user",
                        name: "first_name",
                        label: "Имя",
                        type: "text",
                        required: true,
                        class: "col-md-6 col-lg-4 mt-2 ",
                    },
                    {
                        id: "last_name-new-user",
                        name: "last_name",
                        label: "Фамилия",
                        type: "text",
                        required: true,
                        class: "col-md-6 col-lg-4 mt-2 ",
                    },
                    {
                        id: "middle_name-new-user",
                        name: "middle_name",
                        label: "Отчество",
                        type: "text",
                        class: "mt-2 ",
                    },
                    {
                        id: "email-new-user",
                        name: "email",
                        label: "E-mail",
                        type: "email",
                        required: true,
                        class: " mt-2 ",
                    },
                    {
                        id: "phone-new-user",
                        name: "phone",
                        label: "Телефон",
                        type: "text",
                        required: true,
                        class: "mt-2 ",
                    },
                    {
                        id: "password-new-user",
                        name: "password",
                        label: "Пароль",
                        type: "password",
                        class: "mt-2 ",
                        mode: "generate",
                    },
                ];
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

            generatePassword() {
                this.passwords.new = Math.random().toString(36).slice(-12);
            },

            getUsers() {
                const vm = this;
                const token = vm.$refs.token.value;

                if (vm.$refs.organisationId < 0) {
                    return;
                }
                axios
                    .get("/users/list")
                    .then((response) => {
                        console.log(response);
                        vm.users = response.data.users;
                        vm.roles = response.data.roles;
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },

            patchUser() {
                const vm = this;
                const postData = {
                    user_id: vm.userId,
                    organisation_id: vm.organisationId,
                    edit_user: vm.editedUser,
                };

                vm.editEntity(postData, `/users/update`);
            },

            reset() {
                const vm = this;
                vm.passwords = {
                    old: null,
                    new: null,
                };
                vm.editPassword = false;
            },

            storeUser() {
                const vm = this;
                const postData = {
                    user_id: vm.userId,
                    organisation_id: vm.organisationId,
                    new_user: vm.editedUser,
                    password: vm.passwords.new,
                };

                vm.createEntity(postData, `/users/store`).then(() => {
                    vm.$refs.createUserForm.reset();
                    vm.clearUser();
                    vm.reset();
                });
            },

            submitPassword() {
                const vm = this;
                if (!vm.passwords.old) {
                    vm.messages.error = vm.validationMessages.inputOldPassword;
                    return;
                }

                if (!vm.passwords.new) {
                    vm.messages.error = vm.validationMessages.inputNewPassword;
                    return;
                }
                if (vm.passwords.new.length < 6) {
                    vm.messages.error = vm.validationMessages.passwordMinimal;
                    return;
                }

                axios
                    .post(`./users/password`, {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        edit_user_id: vm.editedUser.id,
                        new_password: vm.passwords.new,
                        old_password: vm.passwords.old,
                    })
                    .then((response) => {
                        console.log(response);
                        vm.passwords.new = null;
                        vm.passwords.old = null;
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
    });
}
