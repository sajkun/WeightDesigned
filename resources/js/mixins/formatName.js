export default {
    methods: {
        /**
         * форматирует имя
         *
         * @param  {...String} names Фамилия Имя Отчество
         *
         * @returns {String} Фамилия И.О.
         */
        formatName(...names) {
            if (!names || !names.length) {
                return;
            }

            let name = names.shift();

            if(!name) return
            for (const part of names) {
                name =
                    window.innerWidth < 992
                        ? `${name.trim()} ${part.substring(0, 1)}.`
                        : `${name.trim()} ${part}`;
            }
            return name;
        },
    },
};
