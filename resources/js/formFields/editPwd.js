export default {
    computed: {
        editPasswordFormStructure() {
            return [
                {
                    id: "password-edit-user",
                    name: "oldPassword",
                    label: "Пароль",
                    type: "password",
                    class: "mt-2 ",
                    required: true,
                    mode: "password",
                },
                {
                    id: "password-edit-user-confirm",
                    name: "newPassword",
                    label: "Новый Пароль",
                    type: "password",
                    class: "mt-2 ",
                    mode: "generate",
                    required: true,
                },
            ];
        },
    },
};
