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
         * @returns {Object<Object>}
         */
        grasslandFormStructure() {
            const structure = {
                name: {
                    id: "grassland-name",
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

                culture: {
                    id: "grassland-culture",
                    name: "culture",
                    label: "Культура",
                    type: "select",
                    class: "col-md-6 col-12 mt-2 ",
                    required: true,
                    options: this.cultures,
                    value: "",
                },
                size: {
                    id: "grassland-size",
                    name: "size",
                    label: "Размер поля(га)",
                    type: "text",
                    required: true,
                    class: "col-md-6 col-12 mt-2 ",
                    pattern: "\\d*\\.?\\d{1}",
                    title: "Допустимы только цифры и разделитель регистра (.) После точки должна быть строго 1 цифра",
                },
                type: {
                    id: "grassland-file",
                    label: "Файл поля(.shp,.kml,.kmz)",
                    type: "file",
                    class: "col-md-6 col-12 mt-2 ",
                    title: "Загрузите файл поля",
                    accept: ".shp,.kml,kmz",
                    value: "",
                },
                comment: {
                    id: "grassland-comment",
                    name: "comment",
                    label: "Комментарий",
                    type: "textarea",
                    required: false,
                    class: "col-12 mt-2 ",
                },
            };

            return structure;
        },
    },
};
