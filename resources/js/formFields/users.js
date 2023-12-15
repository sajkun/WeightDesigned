/**
 * Структуры форм добавления и редактирования пользователей
 *
 * @see User в app/Models/User.php
 */

//вспомогательные функции
import { strip } from "@/misc/helpers";
import patternData from "@/formFields/patterns";

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
        viewUserFormStructure() {
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
