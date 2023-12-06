<template>
    <TDialog :diaShow="isDialog" v-touch="close" @diaHide="$emit('close')">
        <template v-slot>
            <transition name="el">
                <div class="not-sub-con" v-show="notSubmit">{{content}}</div>
            </transition>
            <transition name="el">
                <div class="hint" v-show="submitSuccess">
                    <div class="img-box">
                        <img src="~@/assets/img/classroom/succeed.png" />
                    </div>
                    <div class="hint-text">提交成功，老师已经收到啦</div>
                </div>
            </transition>
            <transition name="el">
                <div class="hint" v-show="submitError">
                    <div class="img-box">
                        <i class="iconfont icon-jiazaishibai"></i>
                    </div>
                    <div class="hint-text">提交失败，请重试</div>
                </div>
            </transition>
        </template>
        <template v-slot:footer>
            <transition name="el">
                <div class="floor-button" v-show="notSubmit">
                    <TButton class="left-but" @touch="$emit('close')" :disabled="butDisabled">取消</TButton>
                    <TButton class="right-but" @touch="sub" :loading="butDisabled">确认</TButton>
                </div>
            </transition>
        </template>
    </TDialog>
</template>

<script>

import TDialog from '@/components/publicMethods/TDialog.vue'
import TButton from '@/components/publicMethods/TButton.vue'

export default {

    name: 'ClassroomDialog',

    components: {
        TDialog,
        TButton
    },

    props: {
        content: String,
        type: [String, Number],
        isDialog: Boolean
    },

    data() {
        return {
            butDisabled: false
        }
    },

    methods: {
        close() {
            if (!this.type) return;
            this.$emit('close');
        },
        sub() {
            this.butDisabled = true;
            this.$emit('notarize')
        }
    },

    watch: {
        type() {
            this.butDisabled = false;
        }
    },

    computed: {
        notSubmit() {
            if (this.type === 0) {
                return true
            } else {
                return false
            }
        },
        submitSuccess() {
            if (this.type === 1) {
                return true
            } else {
                return false
            }
        },
        submitError() {
            if (this.type === 2) {
                return true
            } else {
                return false
            }
        }
    }
}
</script>

<style lang="less" scoped>
.not-sub-con {
    text-align: center;
    font-size: 26px;
    line-height: 180px;
}
.floor-button {
    height: 100px;
    display: flex;
    justify-content: space-evenly;
    padding: 0 40px;
    .left-but,
    .right-but {
        width: 200px;
        height: 52px;
        border-radius: 30px;
        font-size: 22px;
    }
    .left-but {
        background: #fff;
        border: 1px solid #0F98FD;
        color: #0F98FD;
    }
}
.hint {
    text-align: center;
    .img-box {
        padding: 50px 0 30px;
    }
    .hint-text {
        font-size: 26px;
    }
    .iconfont {
        font-size: 80px;
        color: #F35E5E;
    }
}
.el-enter {
    opacity: 0;
}
.el-enter-active {
    transition: all .3s;
}
.el-enter-to {
    opacity: 1;
}
</style>