if (document.getElementById("public-employees")) {
    const appPublicEmployees = new Vue({
        el: "#public-employees",

        data: {
            organisationId: -1,
            userId: -1,
            editMode: false,
            editedEmployee: {
                id: -1,
                first_name: null,
                last_name: null,
                middle_name: null,
                phone: null,
                organisation_id: null,
                specialisation: null,
            },
            specialisations: [],
        },

        computed: {
            listClass() {
                const editClass = "col-12 col-lg-6 d-sm-none d-lg-block";
                const displayClass = "col-12 ";
                return this.editMode ? editClass : displayClass;
            },
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;
            vm.getEmployees();

            vm.$el.addEventListener("click", (e) => {
                if (e.target.type !== "button") {
                    vm.clearMessages();
                }
            });
        },

        methods: {
            addEmployee() {
                const vm = this;
                vm.editMode = true;
            },

            clearMessages() {},
            getEmployees() {},

            patchEmployee() {},

            storeEmployee() {
                const vm = this;
                axios
                    .post(`./employees/store`, {
                        user_id: vm.userId,
                        organisation_id: vm.organisationId,
                        edited_employee: vm.editedEmployee,
                    })
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((e) => {
                        console.log(e.response);
                        vm.messages.error = `${e.response.status} ${e.response.statusText} : ${e.response.data.message}`;
                    });
            },

            submitForm() {
                const vm = this;
                if (vm.editedEmployee.id === -1) {
                    vm.storeEmployee();
                } else {
                    vm.patchEmployee();
                }
            },
        },
    });
}
