import messages from "../mixins/messages";
if (document.getElementById("public-vehicles")) {
    const appPublicBunkers = new Vue({
        el: "#public-vehicles",

        mixins: [messages],

        data: {
            organisationId: -1,
            userId: -1,
            mode: "list", // list | edit | create
            vehicleType: null, // bunkers | transporters | tractors | harvesters
        },

        computed: {
            vehicleTypesList() {
                return {
                    bunkers: {
                        name: "Бункер перегрузчик",
                    },
                    transporters: {
                        name: "Грузовик",
                    },
                    tractors: {
                        name: "Трактор",
                    },
                    harvesters: {
                        name: "Комбайн",
                    },
                };
            },

            bunkerModels() {
                return [
                    "БП-16/20",
                    "БП-22/28",
                    "БП-22/28 габаритный",
                    "БП-22/28 (8 колес)",
                    "БП-22/31",
                    "БП-22/31 хоппер",
                    "БП-22/31 габаритный",
                    "БП-22/31 8 колес",
                    "БП-33/42 хоппер",
                    "БП-33/42 8 колес",
                    "БП-40/50",
                ];
            },
        },

        watch: {
            mode(mode) {
                const vm = this;
                if (mode !== "create") {
                    vm.vehicleType = null;
                }

                if (mode === "create") {
                    vm.$nextTick(() => {
                        const inputs = document.querySelectorAll(
                            ".form-control-custom input"
                        );

                        inputs.forEach((el) => {
                            el.addEventListener("input", (e) => {
                                if (e.target.value) {
                                    e.target.nextElementSibling.classList.add(
                                        "active"
                                    );
                                } else {
                                    e.target.nextElementSibling.classList.remove(
                                        "active"
                                    );
                                }
                            });
                        });
                    });
                }
            },

            vehicleType() {
                const vm = this;
                vm.$nextTick(() => {
                    // vm.$refs.formCreateVehicle?.reset();
                });
            },
        },

        mounted() {
            const vm = this;
            vm.$el.classList.remove("d-none");
            vm.organisationId = vm.$refs.organisationId.value;
            vm.userId = vm.$refs.userId.value;
        },

        methods: {
            addVehicle(type) {
                const vm = this;
                vm.mode = "create";
                vm.vehicleType = type;
            },

            createVehicle() {
                const vm = this;
                const formData = new FormData(vm.$refs.formCreateVehicle);

                let postData = {};

                for (const [key, value] of formData) {
                    postData[key] = value;
                }

                console.log(postData);
            },

            submitCreate() {
                this.$refs.formCreateVehicle.requestSubmit();
            },
        },
    });
}
