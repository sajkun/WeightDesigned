// изменяет урл без перезагрузки страницы

//хэлперы
import { getPropFromUrl, replaceUrlState } from "@/misc/helpers";
const changeDisplayMode = {
    mounted() {
        const vm = this;
        vm.applyPropsFromUrl();
    },

    methods: {
        applyPropsFromUrl() {
            const props = ["mode", "activeTab"];
            const vm = this;

            props.forEach((prop) => {
                const value = getPropFromUrl(prop);
                if (value && vm[prop]) {
                    vm[prop] = value;
                }
            });
        },

        /**
         * Обновляет урл при изменении режима просмотра приложения
         */
        updateUrlParams(item = null) {
            const vm = this;
            // обновление данные по переданному урл
            let newUrlParams = [{ prop: "mode", value: vm.mode }];
            let mayBeId = item ? item.id : getPropFromUrl("id");

            //добавление id к урл если выбрана сущность
            if (mayBeId && vm.mode === "details") {
                newUrlParams.push({
                    prop: "id",
                    value: mayBeId,
                });
            }

            if (vm.activeTab)
                newUrlParams.push({
                    prop: "activeTab",
                    value: vm.activeTab,
                });

            //обновляет урл без перезагрузки при смене страниц
            replaceUrlState(newUrlParams);
        },
    },
};

export default changeDisplayMode;
