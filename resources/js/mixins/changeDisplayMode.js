// изменяет урл без перезагрузки страницы

//хэлперы
import { getPropFromUrl } from "@/misc/helpers";
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
    },
};

export default changeDisplayMode;
