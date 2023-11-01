/**
 * Структуры форм добавления и редактирования сотрудников
 *
 * @see Employee в app/Models/Employee.php
 */

import { strip } from "@/misc/helpers";
import patternData from "@/formFields/patterns";

export default {
    data() {
        return {
            editedEmployee: {},
        };
    },

    computed: {
        /**
         * Специализации сотрудников
         *
         * @returns {Object}
         */
        specialisations() {
            return {
                "Водитель Зерновоза": "Водитель Зерновоза",
                "Водитель Комбайна": "Водитель Комбайна",
                "Водитель Трактора": "Водитель Трактора",
            };
        },

        /**
         * Структура формы добавления сотрудника
         *
         * @returns {Object<Object>}
         */
        addEmployeeFormStructure() {
            return [
                {
                    id: "last_name-new-employee",
                    name: "last_name",
                    label: "Фамилия",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "first_name-new-employee",
                    name: "first_name",
                    label: "Имя",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "middle_name-new-employee",
                    name: "middle_name",
                    label: "Отчество",
                    type: "text",
                    class: "mt-2 col-lg-4  ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "phone-new-employee",
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
                    id: "specialisation-new-employee",
                    name: "specialisation",
                    label: "Роль",
                    type: "select",
                    class: "mt-2 ",
                    required: true,
                    options: this.specialisations,
                },
            ];
        },

        /**
         * Структура формы редактирования сотрудника
         *
         * @returns {Object<Object>}
         */
        editEmployeeFormStructure() {
            const vm = this;
            let structure = [
                {
                    id: "last_name-new-employee",
                    name: "last_name",
                    label: "Фамилия",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "first_name-new-employee",
                    name: "first_name",
                    label: "Имя",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "middle_name-new-employee",
                    name: "middle_name",
                    label: "Отчество",
                    type: "text",
                    class: "mt-2 col-lg-4  ",
                    pattern: patternData.russianLetter.pattern,
                    title: patternData.russianLetter.title,
                },
                {
                    id: "phone-new-employee",
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
                    id: "specialisation-new-employee",
                    name: "specialisation",
                    label: "Роль",
                    type: "select",
                    class: "mt-2 ",
                    required: true,
                    options: vm.specialisations,
                },
            ];

            const employeeData = strip(vm.editedEmployee);
            structure.map((f) => {
                f.value = employeeData[f.name];
                return f;
            });
            return structure;
        },
    },
};
