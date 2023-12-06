<template>
    <transition name="move">
        <div
            v-show="showSetting"
            class="dialog-setting"
            v-touch.self="closeDialog"
        >
            <div class="main" v-touch:swipe.right.self="closeDialog">
                <div class="title">
                    <span>设置</span>
                </div>
                <div class="mid">
                    <div class="head">
                        <div
                            ref="brightCom"
                            class="father"
                            v-touch:moving="handleMouseMove"
                            v-touch:start="getMousePosition"
                        >
                            <div
                                class="son"
                                :style="{ width: `${sonWidth}px` }"
                            >
                                <i
                                    :style="{ left: `${sonWidth}px` }"
                                    class="iconfont icon-liangdu my-icon"
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div class="foot">
                        <span>亮度 {{ bright }}</span>
                    </div>
                </div>
                <ul class="domain">
                    <li v-touch="openWifi">
                        <div class="head">
                            <i class="iconfont icon-wifi my-icon"></i>
                        </div>
                        <span class="foot">网络</span>
                    </li>
                    <li
                        v-touch="
                            () => {
                                dialogVisible = true;
                            }
                        "
                    >
                        <div class="head">
                            <i class="iconfont icon-guanji my-icon"></i>
                        </div>
                        <span class="foot">关机</span>
                    </li>
                </ul>
                <ul class="other">
                    <li v-touch="checkForUpdates">
                        <span>检查更新</span>
                        <i class="iconfont icon-arrow"></i>
                    </li>
                    <li v-touch="aboutMe">
                        <span>关于本机</span>
                        <i class="iconfont icon-arrow"></i>
                    </li>
                </ul>
            </div>
            <TDialog
                :diaShow.sync="dialogVisible"
                :dialogClass="'setting-dialog'"
                :customClass="'setting-main'"
                @close="dialogVisible = false"
            >
                <template v-slot:header>
                    <div class="head-con">
                        <!-- <span>结束上课</span> -->
                    </div>
                </template>
                <template v-slot:default>
                    <div class="main-con">
                        <img src="@/assets/img/setting/shutdown.png" alt="" />
                        <span>小可爱,</span>
                        <span>确定要现在将课桌关机吗？</span>
                    </div>
                </template>
                <template v-slot:footer>
                    <div class="footer-con">
                        <TButton
                            class="btn btn1"
                            :loading="restartBtn.loading"
                            :disabled="restartBtn.disabled"
                            @touch="restart"
                        >
                            重启
                        </TButton>
                        <TButton
                            class="btn btn2"
                            :loading="shutDownBtn.loading"
                            :disabled="shutDownBtn.disabled"
                            @touch="shutDown"
                        >
                            关机
                        </TButton>
                    </div>
                </template>
            </TDialog>
        </div>
    </transition>
</template>

<script>
import TDialog from "../publicMethods/TDialog.vue";
import TButton from "../publicMethods/TButton.vue";
import { mapState } from "vuex";
let x; // 在亮度条上点击之后的鼠标距离文档的坐标，鼠标第一次按下的点位
export default {
    components: {
        TDialog,
        TButton,
    },
    props: {
        showSetting: Boolean,
    },
    data() {
        return {
            sonWidth: 0,
            bright: "0%",
            dialogVisible: false,
            restartBtn: {
                loading: false,
                disabled: false,
            },
            shutDownBtn: {
                loading: false,
                disabled: false,
            },
        };
    },
    mounted() {
        this.getBrightness();
    },
    computed: {
        brightComWidth() {
            // 亮度组件的宽度
            return Number(
                getComputedStyle(this.$refs.brightCom).width.replace("px", "")
            );
            // return this.$refs.brightCom.clientWidth;
        },
        ...mapState({
            startUpTimeStamp: (state) => state.user.startUpTimeStamp,
        }),
    },
    methods: {
        closeDialog() {
            this.$emit("closeSetting");
        },
        handleMouseMove(e) {
            // 移动
            // 先要判断左滑还是右滑
            const targetX = e.touches[0].clientX; // 滑动后获取鼠标位置
            let distance; // 滑动的距离
            if (targetX > x) {
                // 右滑
                distance = targetX - x;
                if (this.sonWidth === this.brightComWidth) {
                    return;
                }
                this.sonWidth += distance;
                if (this.sonWidth + distance > this.brightComWidth) {
                    this.sonWidth = this.brightComWidth;
                }
            } else {
                // 左滑
                distance = x - targetX;
                if (this.sonWidth === 0) {
                    return;
                }
                this.sonWidth -= distance;
                if (this.sonWidth < 0) {
                    this.sonWidth = 0;
                }
            }
            // debounce(this.getPercent, 500);
            this.getPercent();
            x = targetX;
        },
        getPercent() {
            // 获得一个比例，调用接口调节亮度
            // const percent = parseInt(
            //     (this.sonWidth / this.brightComWidth) * 255
            // );
            const percent = this.sonWidth / this.brightComWidth;
            // const t = percent >= 25 ? percent : 25;  // 调用 系统 的亮度的时候（目前在首次打开dialog的时候获取的是系统的亮度，在滑动之后获取的是 应用 的亮度），保留该行代码，避免在亮度为0的时候，屏幕变黑导致无法看清
            this.bright = `${parseInt(percent * 100)}%`;
            // this.bright = `${parseInt((percent / 255) * 100)}%`;
            const bright = parseInt(percent * 255);
            // console.log(bright);
            window?.WebViewJavascript?.printLog("滚动到的位置：" + bright);
            // window?.WebViewJavascript?.setSystemBrightness(
            //     percent < 25 ? 25 : percent
            // );
            window?.WebViewJavascript?.setSystemBrightness(bright);
        },
        getMousePosition(e) {
            // 获取鼠标按下的点位
            x = e.touches[0].clientX;
        },
        getBrightness() {
            // 获取当前亮度
            const bright = window?.WebViewJavascript?.getSystemBrightness(); // 0-255，将其换算为 sonWidth
            window?.WebViewJavascript?.printLog("webview 获取的亮度:" + bright);

            if (bright !== undefined) {
                // if (bright <= 25) {
                //     this.bright = "0%";
                //     this.sonWidth = 0;
                // } else {
                //     this.bright = `${parseInt((bright / 255) * 100)}%`;
                //     const targetWidth = parseInt(
                //         (bright / 255) * this.brightComWidth
                //     );
                //     this.sonWidth = targetWidth;
                // }

                this.bright = `${parseInt((bright / 255) * 100)}%`;

                // const targetWidth = parseInt(
                //     (bright / 255) * this.brightComWidth
                // );

                this.sonWidth = parseInt((bright / 255) * this.brightComWidth);
            }
        },
        openWifi() {
            // 开启 wifi
            window?.WebViewJavascript?.gotoNetworkSelect();
        },
        async shutDown() {
            this.shutDownBtn.loading = true;
            this.restartBtn.disabled = true;
            // await this.reportUseTime(() => {
            //     console.log("关机");
            //     window?.WebViewJavascript?.shutDown();
            // });
            await this.reportUseTime();
            // console.log("关机");
            window?.WebViewJavascript?.shutDown();
        },
        async restart() {
            // 重启
            this.restartBtn.loading = true;
            this.shutDownBtn.disabled = true;
            // await this.reportUseTime(() => {
            //     console.log("重启");
            //     window?.WebViewJavascript?.reBoot();
            // });
            await this.reportUseTime();
            // console.log("重启");
            window?.WebViewJavascript?.reBoot();
        },
        checkForUpdates() {
            // 检查更新
            // console.log("检查更新");
            window?.WebViewJavascript?.gotoUpdate();
        },
        aboutMe() {
            // console.log("关于本机");
            window?.WebViewJavascript?.gotoAbout();
        },
        async reportUseTime() {
            const shutdownTimeStamp = Date.now();
            await this.data_triggerEvent({
                pageId: "login",
                eventId: "utilityTime",
                extraInfo: {
                    time: shutdownTimeStamp - this.startUpTimeStamp,
                },
            });
        },
    },
};
</script>

<style lang="less" scoped>
.dialog-setting {
    // position: absolute;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    // background: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: flex-end;
    // transition: background 0.3s;
    .main {
        width: 377px;
        height: 100%;
        background: #eeeef3;
        border-radius: 20px 0px 0px 20px;
        // padding-top: 44px;
        // padding-top: 30px;
        // transition: all 0.3s;
        // transform: translateX(100%);
        // transform: translateX(0);
        padding: 44px 60px 0;
        .title {
            // padding-left: 2px;
            // margin-bottom: 64px;
            margin-bottom: 28px;
            // padding-left: 69px;
            span {
                font-size: 20px;
                font-weight: 600;
                color: #333333;
            }
        }
        .mid {
            // padding-left: 69px;
            .head {
                display: flex;
                // margin-bottom: 12px;
                margin-bottom: 20px;
                .father {
                    // width: 240px;
                    width: 257px;
                    // height: 52px;
                    height: 6px;
                    background: rgba(77, 77, 77, 0.8);
                    border-radius: 10px;
                    position: relative;
                    z-index: 1;
                    // overflow: hidden;
                    .son {
                        position: absolute;
                        top: 0;
                        left: 0;
                        // width: 50px;
                        height: 100%;
                        z-index: 2;
                        background-color: #fff;
                        .my-icon {
                            position: absolute;
                            top: 50%;
                            // left: 12px;
                            transform: translate(-50%, -50%);
                            color: #a2a2a2;
                            font-size: 36px;
                            z-index: 3;
                        }
                    }
                }
            }
            .foot {
                // margin-bottom: 40px;
                margin-bottom: 24px;
                span {
                    font-size: 18px;
                    font-weight: 400;
                    color: #333333;
                }
            }
        }
        .domain {
            // padding: 0 69px;
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 32px;
            li {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 80px;
                cursor: pointer;
                .head {
                    width: 80px;
                    height: 80px;
                    background: #6a6a6a;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .my-icon {
                        color: #fff;
                        font-size: 32px;
                    }
                }
                .foot {
                    span {
                        font-size: 18px;
                        font-weight: 400;
                        color: #333333;
                    }
                }
            }
        }
        .other {
            // padding: 0 69px;
            // width: 100%;
            // height: 105px;
            // border-radius: 10px;
            // overflow: hidden;
            width: 257px;
            height: 105px;
            background: #ffffff;
            border-radius: 10px;
            margin: 0 auto;
            li {
                height: 52px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                cursor: pointer;
                & + li {
                    border-top: 1px solid #f3f3f3;
                }
                span {
                    font-size: 18px;
                    font-weight: 400;
                    color: #333333;
                }
                .iconfont {
                    font-size: 18px;
                }
            }
        }
    }
}

.move-enter,
.move-leave-to {
    background-color: rgba(0, 0, 0, 0);
    .main {
        transform: translateX(100%);
    }
}

.move-enter-active,
.move-leave-active {
    transition: background 0.3s;
    .main {
        transition: all 0.3s;
    }
}
</style>
<style lang="less">
.dialog-setting {
    .setting-dialog {
        background: rgba(0, 0, 0, 0.4);
        .setting-main {
            width: 400px;
            height: 244px;
            background: #f8f8fb;
            border-radius: 12px;
            padding: 0;
            overflow: hidden;
            .t-dialog-head {
                height: 26px;
                .icon-cuo {
                    top: 16px;
                    right: 17px;
                    font-size: 24px;
                    color: #b1b1b1;
                    transform: none;
                }
            }
            .t-dialog-con {
                .main-con {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    // justify-content: center;
                    align-items: center;
                    img {
                        width: 55px;
                        height: 55px;
                        margin-bottom: 16px;
                    }
                    span {
                        font-size: 20px;
                        font-weight: 600;
                        color: #333333;
                        line-height: 28px;
                    }
                }
            }
            .footer-con {
                width: 100%;
                height: 53px;
                background: #f8f8fb;
                border-radius: 0px 0px 16px 16px;
                border-top: 1px solid #e2e4e6;
                display: flex;
                .btn {
                    font-size: 20px;
                    font-weight: 400;
                    width: 50%;
                    height: 100%;
                    background: #f8f8fb;
                }
                .btn1 {
                    color: #2499ff;
                    border-right: 1px solid #e2e4e6;
                }
                .btn2 {
                    color: #ff7468;
                }
            }
        }
    }
}
</style>