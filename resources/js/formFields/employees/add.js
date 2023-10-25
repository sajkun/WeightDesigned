export default {
    computed: {
        addEmployeeFormStructure() {
            return [
                {
                    id: "last_name-new-employee",
                    name: "last_name",
                    label: "Фамилия",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: "[А-Яа-я]{1,}",
                    title: "Допустимы только русские буквы. Удалите пробелы",
                },
                {
                    id: "first_name-new-employee",
                    name: "first_name",
                    label: "Имя",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-lg-4 mt-2 ",
                    pattern: "[А-Яа-я]{1,}",
                    title: "Допустимы только русские буквы. Удалите пробелы",
                },
                {
                    id: "middle_name-new-employee",
                    name: "middle_name",
                    label: "Отчество",
                    type: "text",
                    class: "mt-2 col-lg-4  ",
                    pattern: "[А-Яа-я]{1,}",
                    title: "Допустимы только русские буквы. Удалите пробелы",
                },
                {
                    id: "phone-new-employee",
                    name: "phone",
                    label: "Телефон",
                    type: "text",
                    required: true,
                    class: "mt-2 ",
                    minlength: 6,
                    title: "Допустимы цифры, и символы (, ), +, -",
                    pattern: "[+]{0,1}[0-9\\-\\(\\)]{1,}",
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
    },
};
