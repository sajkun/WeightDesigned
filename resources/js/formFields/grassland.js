/**
 * Структура форм создания и редактирования поля (grassland)
 *
 * @see Grassland в app/Models/Grassland.php
 */

import patternData from "@/formFields/patterns";
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
                    pattern: patternData.wordsDigitsSpace.pattern,
                    title: patternData.wordsDigitsSpace.title,
                    minlength: 4,
                    value: "",
                },

                culture: {
                    id: "grassland-culture",
                    name: "culture",
                    label: "Культура",
                    type: "text",
                    class: "col-md-6 col-12 mt-2 ",
                    required: true,
                    pattern: patternData.wordsDigitsSpace.pattern,
                    title: patternData.wordsDigitsSpace.title,
                    minlength: 4,
                    value: "",
                },
                size: {
                    id: "grassland-size",
                    name: "size",
                    label: "Размер поля(га)",
                    type: "number",
                    step: "0.1",
                    required: true,
                    class: "col-md-6 col-12 mt-2 ",
                    pattern: patternData.float.pattern,
                    title: patternData.float.title,
                },

                type: {
                    id: "grassland-file",
                    label: "Файл поля(.shp,.kml,.kmz)",
                    type: "file",
                    class: "col-md-6 col-12 mt-2 ",
                    title: "Загрузите файл поля",
                    accept: ".shp,.kml, .kmz",
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
