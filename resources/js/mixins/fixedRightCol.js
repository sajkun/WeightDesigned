/**
 *
 */

//хэлперы
import { strip, clog } from "@/misc/helpers";

export default {
    data() {
        return {
            classes: {
                checked: false,
            },
        };
    },

    mounted() {
        clog("test fixed scroll");
    },

    methods: {
        checkClasses(el) {
            const vm = this;
            if (vm.classes.checked) return;
            for (const _class in vm.classes) {
                vm.classes[_class] = el.classList.contains(_class);
            }
            vm.classes.checked = true;
        },

        fixWidthnPosition(el) {
            this.checkClasses(el);
            const rect = el.getBoundingClientRect();
            el.style.width = `${rect.width}px`;
            el.style.height = `${rect.height}px`;
            el.style.top = `${rect.top}px`;
            el.style.right = `${rect.top}px`;
            el.style.position = "fixed";
            el.classList.remove("w-100");
            el.classList.remove("h-100");
        },

        restoreClasses(el) {
            const vm = this;
            for (const _class in vm.classes) {
                vm.classes[_class] = el.classList.contains(_class);
            }
        },

        makeTargetFixed(el) {},
    },
};
