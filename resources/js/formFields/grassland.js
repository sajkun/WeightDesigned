/**
 * Структура форм создания и редактирования поля (grassland)
 */
export default {
    computed: {
        /**
         * Список культур, нужно переопределять в классе где импортируется
         *
         * @returns {Array<String>}
         */
        cultures() {
            return [];
        },

        /**
         * Структура формы создания и редактирования поля
         *
         * @returns {Array<Object>}
         */
        grasslandFormStructure() {
            const structure = [
                {
                    id: "add-grassland-name",
                    name: "name",
                    label: "Название",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-12 mt-2 ",
                    pattern: "[a-zA-Zа-яёА-ЯЁ\\d\\s]{1,}",
                    title: "Допустимы буквы, цифры и пробелы",
                    minlength: 4,
                    value: "",
                },

                {
                    id: "add-grassland-culture",
                    name: "culture",
                    label: "Культура",
                    type: "select",
                    class: "col-md-6 col-12 mt-2 ",
                    required: true,
                    options: this.cultures,
                    value: "",
                },
                {
                    id: "add-grassland-size",
                    name: "size",
                    label: "Размер поля(га)",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-12 mt-2 ",
                    pattern: "\\d*\\.?\\d{1}",
                    title: "Допустимы только цифры и разделитель регистра (.) После точки должна быть строго 1 цифра",
                },
                {
                    id: "add-grassland-file",
                    label: "Файл поля(.shp,.kml,.kmz)",
                    type: "file",
                    required: true,
                    class: "col-md-6 col-12 mt-2 ",
                    title: "Загрузите файл поля",
                    accept: ".shp,.kml,kmz",
                    value: "",
                },
            ];

            return structure;
        },
    },
};
