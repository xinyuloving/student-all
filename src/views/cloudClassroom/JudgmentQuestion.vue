<template>
    <div class="judgment-question">
        <!-- 判断题答题器 -->
        <div :class="['main', { 'main-dis': buttonDis }]" v-if="options.length">
            <div
                class="container"
                v-for="(item, index) in options"
                :key="index"
            >
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
                    :style="{
                        background:
                            item.state === 2
                                ? '#0BC75B'
                                : item.state === 3
                                ? '#FD534E'
                                : '#fff',
                    }"
                >
                    <!-- 单个选项组件 -->
                    <i
                        :class="['iconfont', 'my-icon', item.icon]"
                        :style="{
                            color: item.state === 0 ? '#2499ff' : '#fff',
                        }"
                    ></i>
                    <!-- <span
                        class="circle"
                        v-show="item.state === 2 || item.state === 3"
                    >
                        <i
                            :class="[
                                'iconfont',
                                'icon',
                                item.state === 2 ? 'icon-duihao1' : 'icon-cuo',
                            ]"
                            :style="{
                                color: item.state === 2 ? '#0BC75B' : '#FD534E',
                            }"
                        ></i>
                    </span> -->
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
                    :style="{
                        background:
                            item.state === 2
                                ? '#0BC75B'
                                : item.state === 3
                                ? '#FD534E'
                                : '#2499FF',
                    }"
                >
                    <!-- 单个选项组件 -->
                    <i
                        :class="['iconfont', 'my-icon', item.icon]"
                        :style="{
                            color: item.state === 0 ? '#2499ff' : '#fff',
                        }"
                    ></i>
                    <!-- <span
                        class="circle"
                        v-show="item.state === 2 || item.state === 3"
                    >
                        <i
                            :class="[
                                'iconfont',
                                'icon',
                                item.state === 2 ? 'icon-duihao1' : 'icon-cuo',
                            ]"
                            :style="{
                                color: item.state === 2 ? '#0BC75B' : '#FD534E',
                            }"
                        ></i>
                    </span> -->
                </div>
            </div>
        </div>

        <div
            :class="[
                'bottom',
                { 'submit-style': submitActive === 1, 'button-dis': buttonDis },
            ]"
            v-touch="handleSubmit"
        >
            <span>{{
                submitState === 0
                    ? "提交答案"
                    : submitState === 1
                    ? "提交成功"
                    : "提交超时"
            }}</span>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { insertDom } from "@/utils/util";
const { mapState, mapMutations, mapActions } =
    createNamespacedHelpers("cloudClassroom");
export default {
    computed: {
        ...mapState({
            options: (state) => state.judge.options,
            submitState: (state) => state.judge.submitState,
            submitActive: (state) => state.judge.submitActive,
            buttonDis: (state) => state.judge.buttonDis,
        }),
    },
    created() {
        // 时长埋点
        this.data_enterPage();
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
    },
    methods: {
        ...mapMutations({
            handleClick: "judge/handleClick",
        }),
        ...mapActions({
            submit: "judge/submit",
        }),
        handleSubmit() {
            // 点击提交按钮后完成埋点
            this.submit({
                buriedPointCb: () => {
                    // 埋点函数
                    this.data_exitPage(
                        {
                            eventId: "answerTime",
                            logValue: "1",
                        },
                        true
                    );
                    // console.log("判断题的时长埋点执行完成！ --------->");
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
.judgment-question {
    width: 100%;
    height: 100%;
    position: absolute;
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
            height: 240px;
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
                .my-icon {
                    color: #2499ff;
                    font-size: 120px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                }
                // .circle {
                //     position: absolute;
                //     width: 36px;
                //     height: 36px;
                //     background-color: #fff;
                //     border-radius: 50%;
                //     bottom: 6%;
                //     right: 8%;
                //     display: flex;
                //     justify-content: center;
                //     align-items: center;
                //     .icon {
                //         font-size: 24px;
                //     }
                // }
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