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
            editedUser: {},
            editMode: false,
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;
            vm.getUsers();
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
                        console.log(e);
                    });
            },
        },
    });
}
