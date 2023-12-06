<template>
    <div class="random-selection">
        <div class="main">
            <!-- <div :class="['con', { 'animate-swing': !showRegion }]">
                <div class="top">
                    <div class="container">
                        <div class="region" v-show="showRegion">
                            <ul class="move-ul" ref="moveUl">
                                <li
                                    class="list"
                                    v-for="(item, index) in options"
                                    :key="index"
                                >
                                    <img
                                        class="avatar"
                                        :src="
                                            require(`../../assets/img/${item.imgUrl}.png`)
                                        "
                                        alt=""
                                    />
                                    <span class="name"
                                        >李小美-{{ item.id }}</span
                                    >
                                </li>
                            </ul>
                        </div>
                        <div class="show-text" v-touch="action">
                            <span v-show="flag">正在随机选人...</span>
                        </div>
                    </div>
                </div>
                <div class="bottom"></div>
            </div> -->
            <transition name="hide">
                <div class="con" v-if="!winnerAnimate">
                    <div class="top">
                        <div class="container">
                            <div class="region">
                                <ul class="move-ul" ref="moveUl">
                                    <li
                                        class="list"
                                        v-for="(item, index) in options"
                                        :key="index"
                                    >
                                        <!-- <img
                                        class="avatar"
                                        :src="item.photoUrl"
                                        alt=""
                                    /> -->
                                        <span class="avatar">{{
                                            item.name.slice(0, 1)
                                        }}</span>
                                        <span class="name single_elli">{{
                                            item.name
                                        }}</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="show-text">
                                <span>{{
                                    maskActive ? "" : "正在随机选人..."
                                }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bottom"></div>
                </div>
            </transition>

            <div :class="['mask', { active: maskActive }]">
                <!-- 遮罩层 -->
                <transition name="enlarge">
                    <div
                        class="container"
                        v-if="winnerAnimate && winnerInfo.name"
                    >
                        <!-- <img class="avatar" :src="winnerInfo.photoUrl" alt="" /> -->
                        <span class="avatar">{{
                            winnerInfo.name.slice(0, 1)
                        }}</span>
                        <span class="name">{{ winnerInfo.name }}</span>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { startMove, insertDom } from "@/utils/util";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("cloudClassroom");
export default {
    data() {
        return {
            // flag: false, // 控制随机选人动画的启停
            // showRegion: false, // 控制显示区域的显示：初始不显示，点击开始后才显示，之后就一直显示和摇摆动画的启停
            maskActive: false, // 选中者的遮罩层
            winnerAnimate: false,
            // winnerInfo: {}, // 选中人的信息
        };
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
        this.action();
    },
    computed: {
        // showList() {
        //     return repaintArray(this.list, "id", this.winner);
        // },
        ...mapState({
            options: (state) => state.random.options,
            winnerInfo: (state) => state.random.winnerInfo,
        }),
    },
    methods: {
        action() {
            // if (!this.flag) {
            //     if (this.showRegion === false) {
            //         this.showRegion = true;
            //     }
            //     this.flag = true; // 动画执行完成后 变为 false
            //     const len = this.showList.length - 1;
            //     const h = 148 * len;
            //     startMove(this.$refs.moveUl, h, this.openFlag);
            //     this.winnerInfo = this.list.find((e) => e.id === this.winner);
            // }
            this.maskActive = false;
            const len = this.options.length - 1;
            const h = 148 * len;
            startMove(this.$refs.moveUl, h, this.openFlag);
            // this.winnerInfo = this.list.find((e) => e.id === this.winner);
        },
        openFlag() {
            // 运动完成的回调函数
            this.winnerAnimate = true;
            this.$nextTick(() => {
                this.maskActive = true;
            });
            // const t = setTimeout(() => {
            //     this.maskActive = true;
            //     clearTimeout(t);
            // });
        },
        // closeMask() {
        //     this.maskActive = false;
        //     this.winnerAnimate = false;
        //     // this.showRegion = false;
        // },
    },
    // beforeDestroy() {
    //     clearInterval(this.$refs.moveUl.timer);
    // },
};
</script>

<style lang="less" scoped>
.random-selection {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    position: absolute;
    z-index: 9;
    background-color: #1b1a21;
    .main {
        width: 100%;
        height: 100%;
        display: flex;
        position: relative;
        // flex-direction: column;
        // transition: all 0.5s;
        .con {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .top {
                width: 380px;
                height: 342px;
                position: relative;
                background: url("../../assets/img/cloudClassroom/random.png")
                    center 100%/100% no-repeat;
                // img {
                //     width: 100%;
                //     height: 100%;
                // }
                .container {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    .region {
                        width: 234px;
                        height: 148px;
                        background: #edf8ff;
                        border-radius: 7px;
                        // margin: 58px 0 0 63px;
                        position: absolute;
                        top: 58px;
                        left: 63px;
                        overflow: hidden;
                        .move-ul {
                            width: 100%;
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            .list {
                                width: 100%;
                                height: 148px;
                                // padding: 0 15px 0;
                                display: flex;
                                // justify-content: space-between;
                                align-items: center;
                                .avatar {
                                    width: 96px;
                                    height: 96px;
                                    border-radius: 50%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    background: #3e83f8;
                                    color: #ffffff;
                                    font-size: 48px;
                                    margin-left: 15px;
                                }
                                .name {
                                    width: calc(100% - 121px);
                                    font-size: 32px;
                                    font-weight: 500;
                                    color: #5050e5;
                                    margin-left: 10px;
                                }
                            }
                        }
                    }
                    .show-text {
                        width: 140px;
                        height: 40px;
                        position: absolute;
                        bottom: 17px;
                        left: 29%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        span {
                            font-size: 18px;
                            font-weight: 400;
                            color: #d3e7ff;
                        }
                    }
                }
            }
            .bottom {
                width: 209px;
                height: 26px;
                background: #434249;
                border-radius: 50%;
                margin-top: 30px;
            }
        }
        .hide-leave-to {
            opacity: 0;
        }
        .hide-leave-active {
            transition: opacity 0.3s;
        }
        .animate-swing {
            animation: swing 3s linear infinite;
        }
        @keyframes swing {
            0% {
                transform: translateY(0);
            }
            25% {
                transform: translateY(-10px);
            }
            50% {
                transform: translateY(0);
            }
            75% {
                transform: translateY(10px);
            }
            100% {
                transform: translateY(0);
            }
        }
        .mask {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(27, 26, 33, 0);
            z-index: -1;
            transition: all 0.5s;
            .enlarge-enter {
                transform: scale(0);
            }
            .enlarge-enter-active {
                transition: all 1.5s;
            }
            .container {
                transform-origin: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .avatar {
                    width: 180px;
                    height: 180px;
                    margin-bottom: 10px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #3e83f8;
                    color: #ffffff;
                    font-size: 84px;
                }
                .name {
                    font-size: 44px;
                    font-weight: 500;
                    color: #fc886c;
                }
            }
        }
        .active {
            z-index: 2;
            background-color: rgba(27, 26, 33, 0.9);
        }
    }
}
</style>