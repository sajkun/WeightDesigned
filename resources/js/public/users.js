/**
 * работа с пользователями публичной зоны
 */

if (document.getElementById("public-users")) {
    const appPublicUsers = new Vue({
        el: "#public-users",

        data: {
            organisationId: -1,
            userId: -1,
            users: [],
            roles: [],
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
            messages: {
                error: null,
                info: null,
                success: null,
                confirm: null,
            },
            editPassword: false,
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;
            vm.getUsers();

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
        },

        methods: {
            addUser() {
                this.clearUser();
                this.editMode = true;
                this.editPassword = false;
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

            confirmActionCb() {
                document.dispatchEvent(new CustomEvent("submitConfirmEvent"));
            },

            deleteUser(user) {
                const vm = this;

                let handlerSubmit = null;
                let handlerCancel = null;
                vm.editMode = false;

                handlerSubmit = () => {
                    vm.deleteUserCb(user);
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

                    vm.messages.confirm = `${vm.validationMessages.deleteUser} ${user.login} ?`;
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

            deleteUserCb(user) {
                console.log("deleteUserCb");
                const vm = this;
                axios
                    .post(`./api/public/users/destroy`, {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        delete_user_id: user.id,
                    })
                    .then((response) => {
                        vm.getUsers();
                    })
                    .catch((e) => {
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    });
            },

            editUser(user) {
                const vm = this;
                vm.editMode = true;
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
                    .post("./api/public/users/list/" + vm.organisationId, {
                        _token: token,
                        user_id: vm.userId,
                    })
                    .then((response) => {
                        vm.users = response.data.users;
                        vm.roles = response.data.roles;
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },

            patchUser() {
                const vm = this;
                axios
                    .post(`./api/public/users/patch`, {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        edit_user: vm.editedUser,
                    })
                    .then((response) => {
                        vm.editedUser = response.data.patch_user;
                        vm.messages.success = "Успешно сохранен";
                        vm.getUsers();
                    })
                    .catch((e) => {
                        console.log(e.response);
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    });
            },

            storeUser() {
                const vm = this;
                console.log();
                axios
                    .post(`./api/public/users/store`, {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        new_user: vm.editedUser,
                        password: vm.passwords.new,
                    })
                    .then((response) => {
                        console.log(response);
                        vm.editedUser = response.data.new_user;
                        vm.getUsers();
                    })
                    .catch((e) => {
                        console.log(e.response);
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    });
            },

            submitForm() {
                const vm = this;
                console.log(vm.editedUser.id);
                if (vm.editedUser.id == -1) {
                    vm.storeUser();
                } else {
                    vm.patchUser();
                }
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
                    .post(`./api/public/users/spw`, {
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