<template>
    <div class="container" :style="{ width: size, height: size }">
        <div
            :class="['topic-options', 'option1', { active: item.state === 1 }]"
            :style="{ backgroundColor: bgColor1 }"
            v-touch="
                () => {
                    choiceOptionTouch(item);
                }
            "
        >
            <!-- 单个选项组件 -->
            <span
                class="text"
                :style="{ fontSize: fontSize, color: fontColor }"
                >{{ item.content }}</span
            >
            <span
                class="circle"
                v-show="item.state === 2 || item.state === 3"
                :style="{ width: circleSize, height: circleSize }"
            >
                <i
                    :class="[
                        'iconfont',
                        item.state === 2 ? 'icon-duihao1' : 'icon-cuo',
                    ]"
                    :style="{
                        color: item.state === 2 ? '#0BC75B' : '#FD534E',
                        fontSize: iconSize,
                    }"
                ></i>
            </span>
        </div>
        <div
            :class="['topic-options', 'option2', { active: item.state === 0 }]"
            :style="{ backgroundColor: bgColor2 }"
            v-touch="
                () => {
                    choiceOptionTouch(item);
                }
            "
        >
            <!-- 单个选项组件 -->
            <span
                class="text"
                :style="{ fontSize: fontSize, color: fontColor }"
                >{{ item.content }}</span
            >
            <!-- <span
                class="circle"
                v-show="item.state === 2 || item.state === 3"
                :style="{ width: circleSize, height: circleSize }"
            >
                <i
                    :class="[
                        'iconfont',
                        item.state === 2 ? 'icon-duihao1' : 'icon-cuo',
                    ]"
                    :style="{
                        color: item.state === 2 ? '#0BC75B' : '#FD534E',
                        fontSize: iconSize,
                    }"
                ></i>
            </span> -->
        </div>
    </div>
</template>

<script>
const colorOptions = {
    normal: "#fff",
    primary: "#2499FF",
    success: "#0BC75B",
    fail: "#FD534E",
};
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("cloudClassroom");
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
        flag: {
            type: String,
            default: "",
        },
        proportion: {
            // 比例：如果选项多余4个 宽高字体均除以2，否则除以1即可
            type: Number,
            default: 1,
        },
    },
    computed: {
        bgColor1() {
            return this.item.state === 2
                ? colorOptions.success
                : this.item.state === 3
                ? colorOptions.fail
                : colorOptions.normal;
        },
        bgColor2() {
            return this.item.state === 2
                ? colorOptions.success
                : this.item.state === 3
                ? colorOptions.fail
                : colorOptions.primary;
        },
        fontColor() {
            return this.item.state === 0
                ? colorOptions.primary
                : colorOptions.normal;
        },
        size() {
            // 盒子宽高的尺寸
            return this.proportion === 1 ? "198px" : "165px";
        },
        fontSize() {
            // 选项字体的尺寸
            return this.proportion === 1 ? "120px" : "96px";
        },
        circleSize() {
            // 正确错误的小圆圈
            return this.proportion === 1 ? "34px" : "24px";
        },
        iconSize() {
            return this.proportion === 1 ? "24px" : "18px";
        },
    },
    methods: {
        ...mapMutations({
            choiceOptionTouch: "choice/choiceOptionTouch",
        }),
    },
};
</script>

<style lang="less" scoped>
.container {
    position: relative;
    border-radius: 16px;
    margin: 0 26px;
    .topic-options {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: center;
        transition: all 0.5s;
        opacity: 1;
        .text {
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
        }
        // .circle {
        //     position: absolute;
        //     background-color: #fff;
        //     border-radius: 50%;
        //     bottom: 6%;
        //     right: 8%;
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
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
</style>