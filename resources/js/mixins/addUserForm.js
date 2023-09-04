export default {
    computed: {
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
                    class: "mt-2 col-lg-4  ",
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
                {
                    id: "roles-new-user",
                    name: "role",
                    label: "Роль",
                    type: "select",
                    class: "mt-2 ",
                    options: this.rolesList,
                },
            ];
        },
    },
};
