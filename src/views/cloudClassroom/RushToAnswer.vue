<template>
    <div class="rush-answer">
        <!-- 抢答 -->
        <div class="main">
            <template v-if="!maskActive">
                <div class="con" v-show="!showNobodyAnswer">
                    <div class="front" v-if="!animateActive">
                        <img src="@/assets/img/cloudClassroom/321.gif" alt="" />
                    </div>
                    <!-- <div class="back" v-if="animateActive">
                        <div class="three">
                            <div class="two">
                                <div class="one">
                                    <div class="btn" v-touch="action">
                                        <span>开始</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> -->
                    <div class="back" v-else>
                        <div class="three">
                            <div class="two">
                                <div class="one">
                                    <div class="btn" v-touch="action">
                                        <span>开始</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="no_body" v-show="showNobodyAnswer">
                    <img src="@/assets/img/cloudClassroom/nobody.png" alt="" />
                    <span class="text">没有学生抢答</span>
                </div>
            </template>
        </div>
        <div :class="['mask', { active: maskActive }]">
            <div class="container" v-if="maskActive">
                <div class="top">
                    <!-- <img class="avatar" :src="winnerInfo.photoUrl" alt="" /> -->
                    <span class="avatar">{{
                        winnerInfo.studentName.slice(0, 1)
                    }}</span>
                    <span class="name">{{ winnerInfo.studentName }}</span>
                </div>
                <div class="bottom">
                    <span>恭喜抢答成功</span>
                </div>
            </div>

            <video class="fireworks" ref="fireworks" v-show="winnerInfo.id">
                <source src="@/assets/video/fireworks.mp4" type="video/mp4" />
            </video>
        </div>
    </div>
</template>

<script>
import sendMessage from "@/utils/sendMessage";
import { mapState } from "vuex";
import { insertDom } from "@/utils/util";
let playTimer, flowerTimer, noOneTimer;
export default {
    data() {
        return {
            maskActive: false,
            animateActive: false,
            showNobodyAnswer: false, // 展示无人抢答页面
            disabled: false,
        };
    },
    computed: {
        ...mapState({
            winnerInfo: (state) => state.cloudClassroom.responder.winnerInfo,
            userInfo: (state) => state.user.userInfo,
        }),
    },
    watch: {
        "winnerInfo.id": {
            handler(newValue) {
                if (newValue) {
                    this.maskActive = true;
                    flowerTimer = setTimeout(() => {
                        this.$refs.fireworks.play();
                        clearTimeout(flowerTimer);
                    }, 200);
                }
            },
        },
    },
    created() {
        // 埋点
        this.data_triggerEvent("receiveAnswer", true);
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
        this.$refs.fireworks.load();
        playTimer = setTimeout(() => {
            this.animateActive = true;
            clearTimeout(playTimer);

            // 无人抢答定时器
            noOneTimer = setTimeout(() => {
                this.showNobodyAnswer = true;
                clearTimeout(noOneTimer);
            }, 5500);
        }, 3000);
    },
    methods: {
        async action() {
            if (this.disabled) return;
            try {
                const data = {
                    content: "ccl_7",
                    extension: JSON.stringify({
                        id: this.userInfo.id,
                        studentName: this.userInfo.realName,
                    }),
                };
                await sendMessage(data);
                this.disabled = true;
            } catch (error) {
                // console.log(error);
            }
        },
        // closeMask() {
        //     this.maskActive = false;
        //     this.$refs.fireworks.load();
        //     // 调试期间，加上此代码。生产环境下再根据真实场景删减。
        // },
    },
    beforeDestroy() {
        clearTimeout(playTimer);
        clearTimeout(flowerTimer);
        clearTimeout(noOneTimer);
    },
};
</script>

<style lang="less" scoped>
.rush-answer {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 9;
    background-color: #1b1a21;
    .main {
        width: 100%;
        height: 100%;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        .con {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .back {
                position: relative;
                .three {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    z-index: 1;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                    animation: turn 0.5s linear 1;
                    .two {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        z-index: 2;
                        transform: translate(-50%, -50%);
                        border-radius: 50%;
                        animation: turn 0.5s linear 0.2s 2;
                        .one {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            z-index: 3;
                            transform: translate(-50%, -50%);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 50%;
                            animation: turn 0.5s linear 0.4s 2;
                            .btn {
                                width: 211px;
                                height: 211px;
                                background: url("../../assets/img/cloudClassroom/rush.png")
                                    center 100%/100% no-repeat;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                animation: turnBtn 0.5s linear 0.2s 1;
                                border-radius: 50%;
                                span {
                                    font-size: 50px;
                                    font-weight: 600;
                                    color: #ffffff;
                                }
                            }
                            @keyframes turnBtn {
                                0% {
                                    transform: scale(1);
                                }
                                25% {
                                    transform: scale(0.95);
                                }
                                50% {
                                    transform: scale(0.9);
                                }
                                75% {
                                    transform: scale(0.95);
                                }
                                100% {
                                    transform: scale(1);
                                }
                            }
                        }
                    }
                }
                @keyframes turn {
                    0% {
                        width: 211px;
                        height: 211px;
                        background: rgba(255, 127, 133, 0);
                    }
                    25% {
                        width: 260px;
                        height: 260px;
                        background: rgba(255, 127, 133, 0.1);
                    }
                    50% {
                        width: 310px;
                        height: 310px;
                        background: rgba(255, 127, 133, 0.2);
                    }
                    75% {
                        width: 360px;
                        height: 360px;
                        background: rgba(255, 127, 133, 0.1);
                    }
                    100% {
                        width: 420px;
                        height: 420px;
                        background: rgba(255, 127, 133, 0);
                    }
                }
            }
        }
        .no_body {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
                width: 102px;
                height: 102px;
            }
            .text {
                margin-top: 30px;
                font-size: 38px;
                font-weight: 600;
                color: #ffffff;
            }
        }
    }
    .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        background-color: rgba(27, 26, 33, 0);
        transition: all 0.5s;
        display: flex;
        justify-content: center;
        align-items: center;
        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transform-origin: center;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            .top {
                display: flex;
                justify-content: center;
                align-items: center;
                .avatar {
                    width: 140px;
                    height: 140px;
                    margin-right: 24px;
                    transform: scale(0);
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #3e83f8;
                    color: #ffffff;
                    font-size: 72px;
                }
                .name {
                    font-size: 42px;
                    font-weight: 500;
                    color: #fc886c;
                    transform: scale(0);
                }
            }
            .bottom {
                margin-top: 24px;
                transform-origin: center;
                transform: scale(0);
                span {
                    font-size: 38px;
                    font-weight: 500;
                    color: #ffffff;
                }
            }
        }
        .fireworks {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: fill;
            z-index: 1;
        }
    }
    .active {
        z-index: 2;
        background-color: rgba(27, 26, 33, 0.9);
        .container {
            transform: scale(1);
            .top {
                .avatar {
                    animation: scale 0.5s forwards ease-out;
                }
                .name {
                    animation: scale 0.5s 0.1s forwards ease-out;
                }
            }
            .bottom {
                animation: scale 0.5s 0.6s forwards ease-out;
            }
        }
    }
    @keyframes scale {
        0% {
            transform: scale(0);
        }
        25% {
            transform: scale(0.5);
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.3);
        }
        100% {
            transform: scale(1);
        }
    }
}
</style>