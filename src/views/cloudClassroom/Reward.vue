<template>
    <div class="reward">
        <div class="con" :style="{ background: background }">
            <div class="img-con" ref="imgCon">
                <img
                    class="front"
                    src="@/assets/img/cloudClassroom/flowerBig.png"
                    alt=""
                    v-if="!showGif"
                />
                <img v-if="showGif" src="@/assets/img/cloudClassroom/flowerGif.gif" alt="" />
            </div>
            <div class="text" v-if="showGif">
                <span class="top-text">小红花奖励</span>
                <span class="bottom-text">太棒啦，恭喜你获得一朵小红花！</span>
            </div>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations } = createNamespacedHelpers("cloudClassroom");
let timer1, timer2;
export default {
    props: {
        floTop: {
            type: Number,
            default: 40,
        },
        floLeft: {
            type: Number,
            default: 1134,
        },
    },
    data() {
        return {
            showGif: true, // 控制 gif 图 和 底部文字的消失与出现的消失与出现
        };
    },
    computed: {
        // ...mapState({
        //     flowerNum: "flowerNum",
        // }),
        background() {
            return this.showGif
                ? "rgba(27, 27, 33, 0.9)"
                : "rgba(27, 27, 33, 0)";
        },
    },
    mounted() {
        timer1 = setTimeout(() => {
            this.showGif = false;
            // 两秒之后 gif 消失
            timer2 = setTimeout(() => {
                this.startMove();
            }, 400);
        }, 2000);
    },
    methods: {
        ...mapMutations({
            setState: "setState",
        }),
        // 小红花的动画
        startMove() {
            const dom = this.$refs.imgCon;
            const top = dom.offsetTop;
            const left = dom.offsetLeft;
            // 两点的匀减速运动

            let size = 109;

            const moveTop = Math.abs(top - this.floTop); // 向上移动的距离
            const moveLeft = Math.abs(left - this.floLeft); // 向左移动的距离

            const topCritical = moveTop / 2; // 临界值，前半部分做加速，后半部分做减速
            const leftCritical = moveLeft / 2;

            let topSpeed = 5;
            let leftSpeed = 5;
            let topG = 2;
            let leftG = 4;
            let scale = 5;

            let topDistance = 0; // 向上移动的距离
            let leftDistance = 0; // 向左移动的距离

            dom.flowerTimer = setInterval(() => {
                if (topDistance < topCritical) {
                    // 加速
                    dom.style.top = `${top - topDistance}px`;
                    topDistance += topSpeed;
                    topSpeed += topG;
                } else if (topDistance > topCritical && topDistance < moveTop) {
                    // 减速
                    if (topSpeed > 5) {
                        topSpeed -= topG;
                    }
                    topDistance += topSpeed;
                    dom.style.top = `${top - topDistance}px`;
                }
                if (topDistance >= moveTop) {
                    // 超过运动距离，top 置为 floTop
                    dom.style.top = `${this.floTop}px`;
                }

                if (leftDistance < leftCritical) {
                    // 加速
                    dom.style.left = `${left + leftDistance}px`;
                    leftDistance += leftSpeed;
                    leftSpeed += leftG;
                } else if (
                    leftDistance > leftCritical &&
                    leftDistance < moveLeft
                ) {
                    // 减速
                    if (topSpeed > 5) {
                        leftSpeed -= leftG;
                    }
                    leftDistance += leftSpeed;
                    dom.style.left = `${left + leftDistance}px`;
                }
                if (leftDistance >= moveLeft) {
                    // 超过运动距离，top 置为 floLeft
                    dom.style.left = `${this.floLeft}px`;
                }

                if (size > 40) {
                    dom.style.width = `${size - scale}px`;
                    dom.style.height = `${size - scale}px`;
                    size -= scale;
                } else {
                    dom.style.width = `40px`;
                    dom.style.height = `40px`;
                }

                // 停止定时器
                if (
                    dom.style.top === `${this.floTop}px` &&
                    dom.style.left === `${this.floLeft}px`
                ) {
                    // console.log("动画停止");
                    clearInterval(dom.flowerTimer);
                    // this.$emit("turnReward", false); // 动画停止，销毁组件
                    // const num = this.flowerNum + 1;
                    // this.setState({ key: "flowerNum", value: num });
                    this.$emit("updateFlowerNum");
                    this.setState({ key: "reward", value: false });
                }
            }, 30);
        },
    },
    beforeDestroy() {
        this.showGif = true;
        clearTimeout(timer1);
        clearTimeout(timer2);
    },
};
</script>

<style lang="less" scoped>
.reward {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background: rgba(27, 27, 33, 0.9);
    .con {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        // background: rgba(0, 0, 0, 0.6);
        // background: #1b1a21;
        // background: rgba(27, 27, 33, 0.9);
        .img-con {
            position: absolute;
            top: 50%;
            left: 50%;
            // top: 240px;
            // left: 616px;
            transform: translate(-50%, -50%);
            z-index: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            .front {
                width: 100%;
                height: 100%;
                // width: 109px;
                // height: 109px;
                // position: absolute;
                // top: 50%;
                // left: 50%;
                // transform: translate(-50%, -50%);
                margin-left: 3px;
                margin-bottom: 2px;
            }
        }
        .text {
            position: absolute;
            bottom: 70px;
            left: 50%;
            z-index: 2;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            .top-text {
                font-size: 30px;
                font-family: STYuanti-SC-Bold, STYuanti-SC;
                font-weight: bold;
                color: #fffef8;
                text-shadow: 1px 1px 0px #fec353;
                margin-bottom: 20px;
            }
            .bottom-text {
                font-size: 20px;
                font-weight: 600;
                color: #ddc077;
            }
        }
    }
}
</style>