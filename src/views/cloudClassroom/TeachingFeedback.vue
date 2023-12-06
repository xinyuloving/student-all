<template>
    <div class="teaching-feedback">
        <!-- 教学反馈 -->
        <div :class="['main', { 'main-dis': buttonDis }]" v-if="options.length">
            <div class="container" v-for="item in options" :key="item.id">
                <div
                    :class="[
                        'topic-options',
                        'option1',
                        { active: item.state === 1 },
                    ]"
                    v-touch="
                        () => {
                            handleClick(item);
                        }
                    "
                >
                    <!-- 单个选项组件 -->
                    <span
                        class="span-text"
                        :style="{
                            color: item.state === 0 ? '#2499ff' : '#fff',
                        }"
                    >
                        {{ item.context }}</span
                    >
                </div>
                <div
                    :class="[
                        'topic-options',
                        'option2',
                        { active: item.state === 0 },
                    ]"
                    v-touch="
                        () => {
                            handleClick(item);
                        }
                    "
                >
                    <!-- 单个选项组件 -->
                    <span
                        class="span-text"
                        :style="{
                            color: item.state === 0 ? '#2499ff' : '#fff',
                        }"
                    >
                        {{ item.context }}</span
                    >
                </div>
            </div>
        </div>

        <div
            :class="[
                'bottom',
                { 'submit-style': submitActive === 1, 'button-dis': buttonDis },
            ]"
            v-touch="submit"
        >
            <span>{{ submitState === 0 ? "提交反馈" : "提交成功" }}</span>
        </div>
    </div>
</template>

<script>
let targetObj; // 当前选中的选项
import sendMessage from "@/utils/sendMessage";
import { insertDom } from "@/utils/util";
export default {
    data() {
        return {
            options: [
                {
                    id: 1,
                    state: 0,
                    context: "听懂了",
                },
                {
                    id: 2,
                    state: 0,
                    context: "没听懂",
                },
            ],
            submitState: 0, // 控制是否提交
            submitActive: 0, // 控制提交按钮提交与否的样式：0表示未提交，1表示提交 2表示提交时间已到
            buttonDis: false, // 控制提交按钮的消失与选项盒子的移动
        };
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
    },
    methods: {
        handleClick(target) {
            if (this.submitState === 0) {
                if (this.submitActive !== 1) {
                    this.submitActive = 1;
                }
                if (targetObj && targetObj.id === target.id) {
                    return;
                }
                if (targetObj) {
                    targetObj.state = 0;
                }
                target.state = 1;
                targetObj = target;
            }
        },
        submit() {
            // 提交答案：提交答案之前需要先判断是否选择了选项
            // 如果 submitState 为 0 点击才有效
            if (this.submitState === 0) {
                if (targetObj) {
                    this.submitActive = 0;
                    this.submitState = 1;
                    const data = {
                        content: "ccl_8",
                        extension: JSON.stringify(targetObj.id),
                    };

                    sendMessage(data).then((res) => {
                        // console.log(res);
                    });
                    // 按钮消失
                    setTimeout(() => {
                        this.buttonDis = true;
                    }, 500);
                } else {
                    // 没有选择
                    // console.log("没有选择！");
                }
            }
        },
    },
    beforeDestroy() {
        targetObj = undefined;
    },
};
</script>

<style lang="less" scoped>
.teaching-feedback {
    width: 100%;
    height: 100%;
    // padding: 70px 144px 90px;
    position: relative;
    z-index: 9;
    display: flex;
    overflow: hidden;
    background-color: #1b1a21;
    .main {
        flex: 1;
        height: 100%;
        padding: 0 184px 0 295px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.5s;
        .container {
            position: relative;
            width: 240px;
            height: 120px;
            border-radius: 20px;
            .topic-options {
                width: 100%;
                height: 100%;
                background: #fff;
                border-radius: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 0;
                left: 0;
                transform-origin: center;
                transition: all 0.5s;
                opacity: 1;
                .span-text {
                    color: #2499ff;
                    font-size: 40px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                }
            }
            .option1 {
                z-index: 1;
                background-color: #fff;
                .text {
                    color: #2499ff;
                }
            }
            .option2 {
                z-index: 2;
                background-color: #2499ff;
                .text {
                    color: #fff;
                }
            }
            .active {
                z-index: 1;
                transform: scale(0);
                opacity: 0;
            }
        }
    }
    .main-dis {
        transform: translateX(56px);
    }
    .bottom {
        width: 188px;
        height: 100%;
        background: #535378;
        transition: all 0.5s;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
            font-size: 36px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
        }
    }
    .submit-style {
        // background: #535378;
        background: #2499ff;
    }
    .button-dis {
        transform: translateX(100%);
    }
}
</style>