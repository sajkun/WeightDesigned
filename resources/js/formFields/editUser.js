import { strip } from "../misc/helpers";

export default {
    computed: {
        editUserFormStructure() {
            const vm = this;
            let structure = [
                {
                    id: "last_name-new-user",
                    name: "last_name",
                    label: "Фамилия",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: "[А-Яа-я]{1,}",
                    title: "Допустимы только русские буквы. Удалите пробелы",
                },
                {
                    id: "first_name-new-user",
                    name: "first_name",
                    label: "Имя",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: "[А-Яа-я]{1,}",
                    title: "Допустимы только русские буквы. Удалите пробелы",
                    minlength: 4,
                },
                {
                    id: "middle_name-new-user",
                    name: "middle_name",
                    label: "Отчество",
                    type: "text",
                    class: "mt-2 col-lg-4  ",
                    pattern: "[А-Яа-я]{1,}",
                    title: "Допустимы только русские буквы. Удалите пробелы",
                },
                {
                    id: "email-new-user",
                    name: "email",
                    label: "E-mail",
                    type: "email",
                    required: true,
                    class: "col-md-6 mt-2 ",
                    pattern: "[a-z0-9]+@[a-z]+\\.[a-z]{2,4}",
                    title: "email в формате <foo@bar.com>, допускаются латинские буквы и цифры. Обязательно наличие символов @ и . после точки допускается от 2х до 4х символов",
                },
                {
                    title: "Допустимы цифры, и символы (, ), +, -",
                    id: "phone-new-user",
                    name: "phone",
                    label: "Телефон",
                    type: "text",
                    required: true,
                    class: "col-md-6 mt-2 ",
                    minlength: 6,
                    pattern: "[+]{0,1}[0-9\\-\\(\\)]{1,}",
                },
            ];

            let rolesField = {
                id: "roles-new-user",
                name: "role",
                label: "Роль",
                type: "select",
                class: "mt-2 ",
                options: this.rolesList,
            };

            if (parseInt(vm.editedUser.id) !== parseInt(vm.userId)) {
                structure.push(rolesField);
            }

            const userData = strip(vm.editedUser);
            structure.map((f) => {
                f.value = userData[f.name];
                return f;
            });

            return structure;
        },
    },
};
