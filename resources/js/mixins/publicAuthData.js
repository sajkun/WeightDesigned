import { clog } from "@/misc/helpers";
export default {
    data() {
        return {
            organisationId: -1,
            userId: -1,
        };
    },

    mounted() {
        const vm = this;
        vm.$el.parentNode.classList.remove("d-none");
        vm.organisationId = vm.$refs.organisationId?.value;
        vm.userId = vm.$refs.userId?.value;

        clog(
            "%c Auth params",
            "color:blue",
            `organisationId: ${vm.organisationId}`,
            `userId: ${vm.userId}`
        );
    },
};
