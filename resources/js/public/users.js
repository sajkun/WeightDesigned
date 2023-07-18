/**
 * работа с пользователями публичной зоны
 */

if (document.getElementById("public-users")) {
    /*     Vue.component(
        "users-row",
        require("./components/PublicUsersRowsComponent/*").default
    ); */
    const appPublicUsers = new Vue({
        el: "#public-users",

        data: {
            users: [],
        },

        mounted() {
            console.log("users mounted");
            const vm = this;
            vm.getUsers();
        },

        methods: {
            getUsers() {
                axios.get("./api/public/users/get").then((response) => {
                    console.log(response);
                });
            },
        },
    });
}
