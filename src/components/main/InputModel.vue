<template>
    <div class="input_model" v-if="visible" v-touch.self="close">
        <div class="input_con">
            <input
                ref="input"
                type="text"
                :value="value"
                @input="handleInput"
                :maxlength="maxlength"
                :minlength="minlength"
                :placeholder="placeholder"
                @keyup.enter="submit"
            />
            <span class="input_btn" v-touch="submit"></span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: [Number, String],
        visible: Boolean,
        maxlength: Number,
        minlength: Number,
        placeholder: String,
        autofocus: {
            type: Boolean,
            default: true,
        },
    },
    // data() {
    //     return {
    //         targetValue: "",
    //     };
    // },
    watch: {
        visible(newValue) {
            if (newValue) {
                // this.targetValue = this.value;
                if (this.autofocus) {
                    this.$nextTick(() => {
                        this.$refs.input.focus();
                    });
                }
            } else {
                // this.targetValue = "";
            }
        },
    },
    methods: {
        handleInput(event) {
            const value = event.target.value;
            // this.targetValue = value;
            const { maxlength } = this;
            if (value.length >= maxlength) return;
            this.$emit("input", value);
        },
        close() {
            this.$emit("close");
            this.$emit("update:visible", false);
        },
        submit() {
            this.$emit("submit", this.$refs.input.value);
            this.close();
        },
    },
};
</script>

<style lang="less" scoped>
.input_model {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    .input_con {
        width: 834px;
        height: 70px;
        margin: 77px auto 0;
        overflow: hidden;
        position: relative;
        input {
            border-radius: 50px;
            width: 100%;
            height: 100%;
            font-size: 32px;
            font-weight: 400;
            color: #3a8cfd;
            padding: 0 70px 0 46px;
        }
        .input_btn {
            background: transparent url("../../assets/img/next.png") no-repeat
                center center;
            width: 58px;
            height: 58px;
            position: absolute;
            top: 50%;
            right: 7px;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
}
</style>