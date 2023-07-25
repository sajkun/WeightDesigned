/**
 * работа с пользователями публичной зоны
 */

if (document.getElementById("public-users")) {
    /* add icons to the library */

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
                password: null,
                role: null,
            },
            validationMessages: {
                inputOldPassword: "Введите пожалуйста старый пароль",
                inputNewPassword: "Задайте  пожалуйста новый пароль",
                passwordMinimal: "минимальная длина пароля 6 символов",
            },
            passwords: {
                old: null,
                new: null,
            },
            editMode: false,
            messages: {
                error: null,
                info: null,
                success: null,
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
                    vm.messages.error = null;
                    vm.messages.info = null;
                    vm.messages.success = null;
                }
            });
        },

        computed: {
            listClass() {
                const editClass = "col-md-6 d-sm-none d-md-block";
                const displayClass = "col-md-12 ";
                return this.editMode ? editClass : displayClass;
            },
        },

        methods: {
            editUser(user) {
                const vm = this;
                vm.editMode = !vm.editMode;
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
                    .post("./api/public/users/get/" + vm.organisationId, {
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

            pathUser() {
                const vm = this;
                console.log("sudmitForm");
                axios
                    .post(`./api/public/users/set`, {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        edit_user: vm.editedUser,
                    })
                    .then((response) => {
                        vm.editedUser = response.data.patch_user;
                        vm.getUsers();
                    })
                    .catch((e) => {
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
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
                        console.log(e.response);
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    });
            },
        },
    });
}
