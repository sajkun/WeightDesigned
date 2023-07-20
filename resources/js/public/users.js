/**
 * работа с пользователями публичной зоны
 */

if (document.getElementById("public-users")) {
    /* add icons to the library */

    const appPublicUsers = new Vue({
        el: "#public-users",

        data: {
            organisationId: -1,
            users: [],
            roles: [],
            editedUser: {},
            editMode: false,
        },

        mounted() {
            const vm = this;
            vm.organisationId = vm.$refs.organisationId.value;
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
                    })
                    .then((response) => {
                        vm.users = response.data.users;
                        vm.roles = response.data.roles;
                        console.log(response.data);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            },

            sudmitForm() {
                console.log("sudmitForm");
            },
        },
    });
}
