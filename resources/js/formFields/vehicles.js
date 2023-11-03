const vehicleFormStructures = {
    computed: {
        /**
         * Структура формы добавление RFID
         *
         * @returns {Object<Object>}
         */
        rfidAddFormStructure() {
            const vm = this;
            let structure = [
                {
                    id: "rfid-lable",
                    name: "label",
                    label: "Название",
                    type: "text",
                    required: true,
                    class: "col-12 col-md-6 mt-3",
                },
                {
                    id: "rfid-value",
                    name: "value",
                    label: "Данные",
                    type: "text",
                    required: true,
                    class: "col-12 col-md-6 mt-3",
                },
            ];

            return structure;
        },
    },
};

export default vehicleFormStructures;
