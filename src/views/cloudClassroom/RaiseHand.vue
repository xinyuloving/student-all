<template>
    <div class="raise-hand">
        <!-- 对应举手回答问题模块 -->
        <div class="mid" v-show="active">
            <img src="@/assets/img/cloudClassroom/raiseHand.gif" alt="" />
        </div>
        <div class="right">
            <div class="hand" @touchstart="handleDown" ref="hand">
                <img src="@/assets/img/cloudClassroom/hand.png" alt="" />
                <span
                    :class="['mask', { active: active }]"
                    @transitionend="transitionend"
                ></span>
            </div>
            <span :class="['hand-tips', { 'my-ani': shake }]" v-if="handTips"
                >长按举手</span
            >
        </div>
    </div>
</template>

<script>
import { longPress } from "@/utils/util";
import sendMessage from "@/utils/sendMessage";
import { mapGetters, mapMutations } from "vuex";
let tipsTimer;
export default {
    data() {
        return {
            active: false, // 控制举手的遮罩层
            shake: false,
            handTips: false,
            flag: false, // 最终标记，控制事件的触发：如果 flag 为 true 的话，误触事件和鼠标按下的事件都不再触发
        };
    },
    computed: {
        ...mapGetters({
            studentId: "studentId",
        }),
    },
    methods: {
        ...mapMutations({
            interactionStateAc: "reportedData/interactionStateAc",
        }),
        mistakeTouch() {
            // 没有超过约定时间的处理函数 或 误触事件
            this.active = false;

            if (!this.handTips) {
                this.handTips = true;
            } else {
                clearTimeout(this.shakeTimer);
                this.shake = true;
                this.shakeTimer = setTimeout(() => {
                    this.shake = false;
                    clearTimeout(tipsTimer);
                    tipsTimer = setTimeout(() => {
                        this.handTips = false;
                        clearTimeout(tipsTimer);
                    }, 3000);
                }, 200);
            }
        },
        handleDown() {
            // 鼠标按下事件
            if (!this.flag) {
                this.active = true;
                longPress(this.$refs.hand, 1000, undefined, this.mistakeTouch);
            }
        },
        // moreThanFun() {
        // 长按超过约定时间的处理函数
        // this.flag = true;
        // const t = setTimeout(() => {
        //     this.active = false; // 控制举手的遮罩层
        //     this.shake = false;
        //     this.handTips = false;
        //     this.flag = false;
        //     clearTimeout(t);
        // }, 10000);
        // const data = {
        //     content: "ccl_11",
        //     extension: JSON.stringify({ id: this.studentId }),
        // };
        // sendMessage(data).then(() => {
        //     console.log("发送消息");
        // });
        // },
        transitionend() {
            // 过渡结束的回调函数
            this.flag = true;
            const t = setTimeout(() => {
                this.active = false; // 控制举手的遮罩层
                this.shake = false;
                this.handTips = false;
                this.flag = false;
                clearTimeout(t);
            }, 10000);
            const data = {
                content: "ccl_11",
                extension: JSON.stringify({ id: this.studentId }),
            };
            sendMessage(data).then(() => {
                // console.log("发送消息");
                // 看板
                this.interactionStateAc("raiseHand");
                // 埋点
                this.data_triggerEvent("raiseHandSuccess", true);
            });
        },
        // handleDown() {
        //     // 鼠标按下事件
        //     downTimeStamp = new Date().getTime();
        //     this.active = true;
        // },
        // handleUp() {
        //     // 鼠标抬起事件
        //     upTimeStamp = new Date().getTime();
        //     if (upTimeStamp - downTimeStamp > 500) {
        //         console.log("长按超过 500 ms");
        //     } else {
        //         // 长按没有超过 500
        //         if (!this.handTips) {
        //             this.handTips = true;
        //         } else {
        //             this.shake = true;
        //             setTimeout(() => {
        //                 this.shake = false;
        //             }, 200);
        //         }
        //         this.active = false;
        //     }
        // },
    },
};
</script>

<style lang="less" scoped>
.raise-hand {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    .mid {
        margin-top: 207px;
    }
    .right {
        position: absolute;
        top: 50%;
        right: 28px;
        transform: translateY(-50%);
        width: 24%;
        display: flex;
        justify-content: flex-end;
        .hand {
            width: 168px;
            height: 168px;
            background: #323137;
            border-radius: 50%;
            cursor: pointer;
            overflow: hidden;
            position: relative;
            img {
                height: 89px;
                width: 62px;
                position: absolute;
                top: 50%;
                left: 50%;
                z-index: 10;
                transform: translate(-50%, -50%);
            }
            .mask {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 9;
                background: #bbbabc;
                // opacity: 0;
                transform-origin: center;
                transform: scale(0);
                // transition: all 3s;
            }
            .active {
                transition: all 1s ease-in;
                // opacity: 1;
                transform: scale(1);
            }
        }
        .hand-tips {
            color: #fff;
            position: absolute;
            left: 0;
            top: 50%;
            padding: 3px 12px;
            border-radius: 6px;
            transform: translateY(-50%);
            background-color: #323137;
            border: 1px solid #585859;
            &::after {
                content: "";
                width: 8px;
                height: 8px;
                background-color: #323137;
                border: 1px solid #585859;
                border-bottom: 0;
                border-left: 0;
                position: absolute;
                top: 50%;
                right: -5px;
                margin-top: -4px;
                transform: rotate(45deg);
            }
        }

        @keyframes shake {
            0% {
                transform: translateY(-70%);
            }
            20% {
                transform: translateY(-100%);
            }
            40% {
                transform: translateY(-70%);
            }
            60% {
                transform: translateY(-30%);
            }
            80% {
                transform: translateY(0%);
            }
            100% {
                transform: translateY(-50%);
            }
        }
        .my-ani {
            animation: shake 0.1s ease;
        }
    }
}
</style>
