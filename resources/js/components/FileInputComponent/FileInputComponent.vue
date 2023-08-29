<template>
    <div class="form-control-custom relative">
        <input
            class="file"
            @change="changeFile"
            type="file"
            :name="name"
            :id="id"
            :accept="accept"
            :required="required"
        />
        <input type="text" readonly :value="fileName" />
        <label :for="id" :class="{ active: labelActiveClass }"
            ><slot></slot
        ></label>
    </div>
</template>

<script>
export default {
    props: ["_id", "_name", "_accept", "_required"],
    data() {
        return {
            name: this._name,
            id: this._id,
            accept: this._accept,
            required: this._required,
            fileName: null,
        };
    },

    computed: {
        labelActiveClass() {
            return false;
        },
    },
    methods: {
        changeFile(event) {
            const vm = this;
            vm.fileName = event.target.files[0].name;

            vm.$emit("changed", { file: event.target.files[0] });
        },
    },
};
</script>

<style scoped>
.relative {
    position: relative;
}
.file {
    opacity: 0;
    cursor: pointer;
    z-index: 10;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>
