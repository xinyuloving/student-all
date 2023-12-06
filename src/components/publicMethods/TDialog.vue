<template>
    <transition name="td">
        <div
            :class="['t-dialog-mask', dialogClass]"
            v-touch="clickMask"
            v-if="diaShow"
        >
            <div :class="['t-dialog-main', customClass]">
                <div class="t-dialog-head" v-if="$slots.header">
                    <i
                        class="iconfont icon-cuo"
                        v-if="closeHidden"
                        v-touch="close"
                    ></i>
                    <slot name="header" />
                </div>
                <div class="t-dialog-con">
                    <slot />
                </div>
                <div class="t-dialog-footer" v-if="$slots.footer">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: "TDialog",
    props: {
        diaShow: Boolean,
        closeHidden: {
            type: Boolean,
            default: true,
        },
        clickMaskHide: {
            type: Boolean,
            default: false,
        },
        customClass: {
            type: String,
            default: "",
        },
        dialogClass: {
            type: String,
            default: "",
        },
    },

    data() {
        return {};
    },

    methods: {
        clickMask() {
            if (!this.clickMaskHide) return;
            this.$emit("update:diaShow", false);
        },
        close() {
            this.$emit("close");
            this.$emit("update:diaShow", false);
        },
    },
};
</script>

<style lang="less" scoped>
.t-dialog-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    top: 0;
    left: 0;
    z-index: 2000;
    .t-dialog-main {
        width: 670px;
        height: 280px;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        border-radius: 20px;
        padding: 0 20px;
        position: relative;
        .t-dialog-head {
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            font-weight: 600;
            position: relative;
            .iconfont {
                position: absolute;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
            }
        }
        .t-dialog-con {
            flex: 1;
        }
    }
}
.td-enter {
    opacity: 0;
    .t-dialog-main {
        top: -70px;
    }
}
.td-enter-active {
    transition: all 0.3s;
    .t-dialog-main {
        transition: all 0.3s;
    }
}
.td-enter-to {
    opacity: 1;
    .t-dialog-main {
        top: 0;
    }
}
.td-leave {
    opacity: 1;
    .t-dialog-main {
        top: 0;
    }
}
.td-leave-active {
    transition: all 0.3s;
    .t-dialog-main {
        transition: all 0.3s;
    }
}
.td-leave-to {
    opacity: 0;
    .t-dialog-main {
        top: -70px;
    }
}
</style>