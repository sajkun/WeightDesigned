/**
 * Структуры форм добавления и редактирования пользователей
 *
 * @see User в app/Models/User.php
 */

//хэлперы
import { strip } from "@/misc/helpers";

const patternData = {
    russianLetter: {
        pattern: "[А-Яа-я]{1,}",
        title: "Допустимы только русские буквы. Удалите пробелы",
    },

    email: {
        pattern: "[a-z0-9]+@[a-z]+\\.[a-z]{2,4}",
        title: "email в формате <foo@bar.com>, допускаются латинские буквы и цифры. Обязательно наличие символов @ и . после точки допускается от 2х до 4х символов",
    },

    phone: {
        pattern: "[+]{0,1}[0-9\\-\\(\\)\\s]{1,}",
        title: "Допустимы цифры, и символы (, ), +, -",
    },
};

export default {
    data() {
        return {
            /**
             * Редактируемый пользователь, необъходимо переопределить в месте применения миксина
             *
             * @param {Object}
             */
            editedUser: {},
        };
    },

    computed: {
        /**
         * Список ролей, необъходимо переопределить в месте применения миксина
         *
         * @returns {Array}
         */
        rolesList() {
            return [];
        },

        /**
         * Структура формы добавления пользователя
         *
         * @returns {Object<Object>}
         */
        addUserFormStructure() {
            return [
                {
                    id: "login-new-user",
                    name: "login",
                    label: "Имя учетной записи",
                    type: "text",
                    required: true,
                    class: "mt-2",
                    minlength: 5,
                },
                {
                    id: "last_name-new-user",
                    name: "last_name",
                    label: "Фамилия",
                    type: "text",
                    minlength: 2,
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "first_name-new-user",
                    name: "first_name",
                    label: "Имя",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "middle_name-new-user",
                    name: "middle_name",
                    label: "Отчество",
                    type: "text",
                    class: "mt-2 col-lg-4  ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "email-new-user",
                    name: "email",
                    label: "E-mail",
                    type: "email",
                    required: true,
                    class: " mt-2 ",
                    pattern: patternData.email.pattern,
                    title: patternData.email.title,
                },
                {
                    id: "phone-new-user",
                    name: "phone",
                    label: "Телефон",
                    type: "text",
                    required: true,
                    class: "mt-2 ",
                    minlength: 6,
                    pattern: patternData.phone.pattern,
                    title: patternData.phone.title,
                },
                {
                    id: "password-new-user",
                    name: "password",
                    label: "Пароль",
                    type: "password",
                    class: "mt-2 ",
                    mode: "generate",
                    required: true,
                },
                {
                    id: "roles-new-user",
                    name: "role",
                    label: "Роль",
                    type: "select",
                    class: "mt-2 ",
                    required: true,
                    options: this.rolesList,
                },
            ];
        },

        /**
         * Структура формы редактирования пользователя
         *
         * @returns {Object<Object>}
         */
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
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                    minlength: 2,
                },
                {
                    id: "first_name-new-user",
                    name: "first_name",
                    label: "Имя",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "middle_name-new-user",
                    name: "middle_name",
                    label: "Отчество",
                    type: "text",
                    class: "mt-2 col-lg-4  ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "email-new-user",
                    name: "email",
                    label: "E-mail",
                    type: "email",
                    required: true,
                    class: "col-md-6 mt-2 ",
                    pattern: patternData.email.pattern,
                    title: patternData.email.title,
                },
                {
                    id: "phone-new-user",
                    name: "phone",
                    label: "Телефон",
                    type: "text",
                    required: true,
                    class: "col-md-6 mt-2 ",
                    minlength: 6,
                    pattern: patternData.phone.pattern,
                    title: patternData.phone.title,
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
