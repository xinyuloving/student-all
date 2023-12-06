<template>
    <div class="accuracy-chart-main">
        <div class="accuracy-chart-title">
            <img src="~@/assets/img/classReport/title_3.png" />
            <span>答题正确率</span>
        </div>
        <div class="accuracy-chart-con">
            <div class="personal">
                <header>个人正确率</header>
                <main>
                    <div class="Proportion">{{ personal }}<span>%</span></div>
                    <ul>
                        <!-- <li v-for="item in 10" :key="item" :style="{ opacity: personalNum >= item ? (personal > 0 ? 1 : null) : null }"></li> -->
                        <li
                            v-for="item in 10"
                            :key="item"
                            :style="{
                                opacity:
                                    parseInt(personal / 10) >= item ? 1 : null,
                            }"
                        ></li>
                    </ul>
                    <div :class="pointTo">
                        <i class="iconfont icon-jiantou"></i>
                    </div>
                </main>
            </div>
            <div class="whole-class">
                <header>班级平均率</header>
                <main>
                    <div class="Proportion">{{ whole }}<span>%</span></div>
                    <ul>
                        <!-- <li v-for="item in 10" :key="item" :style="{ opacity: wholeNum >= item ? (whole > 0 ? 1 : null) : null }"></li> -->
                        <li
                            v-for="item in 10"
                            :key="item"
                            :style="{
                                opacity:
                                    parseInt(whole / 10) >= item ? 1 : null,
                            }"
                        ></li>
                    </ul>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "AccuracyChart",
    data() {
        return {
            personalNum: 0,
            wholeNum: 0,
        };
    },
    computed: {
        ...mapState("reportedData", ["correctRate", "interaction"]),
        pointTo() {
            if (this.personal > this.whole) {
                return ["sig", "upward"];
            } else if (this.personal < this.whole) {
                return ["sig", "downward"];
            } else {
                return ["sig", "vanish"];
            }
        },
        personal() {
            const { choice, judge } = this.interaction;
            const personalSum = choice.numOfInitiate + judge.numOfInitiate;
            const correctNum = choice.correctTimes + judge.correctTimes;
            return personalSum
                ? (correctNum / personalSum).toFixed(2) * 100
                : 0;
        },
        whole() {
            return parseInt(this.correctRate.classAverageRate * 100);
        },
    },
    // methods: {
    //     dataMount() {
    //         const n1 = parseInt(this.personal / 10);
    //         const n2 = parseInt(this.whole / 10);
    //         const time1 = 500 / n1;
    //         const time2 = 500 / n2;
    //         const timer1 = setInterval(() => {
    //             if (this.personalNum >= n1) return clearInterval(timer1);
    //             this.personalNum++;
    //         }, time1);
    //         const timer2 = setInterval(() => {
    //             if (this.wholeNum >= n2) return clearInterval(timer2);
    //             this.wholeNum++;
    //         }, time2);
    //     }
    // },
    // created() {
    //     this.dataInit()
    // }
};
</script>

<style lang="less" scoped>
.accuracy-chart-main {
    padding: 16px 20px;
    .accuracy-chart-title {
        display: flex;
        align-items: center;
        img {
            width: 24px;
            margin-right: 8px;
        }
        span {
            font-weight: 600;
            font-size: 20px;
        }
    }
    .accuracy-chart-con {
        height: 330px;
        display: flex;
        .personal,
        .whole-class {
            flex: 1;
            font-size: 14px;
            color: #666;
            header {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px 0;
                &::after {
                    content: "";
                    display: inline-block;
                    width: 20px;
                    height: 14px;
                    border-radius: 2px;
                    margin-left: 3px;
                }
            }
            main {
                display: flex;
                flex-direction: column;
                .Proportion {
                    font-size: 30px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    span {
                        font-size: 22px;
                    }
                }
                ul {
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transform: rotate(180deg);
                    li {
                        width: 55px;
                        height: 10px;
                        border-radius: 5px;
                    }
                }
            }
        }
        .personal {
            header {
                &::after {
                    background-color: #52ddbb;
                }
            }
            main {
                padding-right: 20px;
                align-items: flex-end;
                position: relative;
                .Proportion {
                    color: #00c595;
                }
                li {
                    background-color: #00c595;
                    opacity: 0.3;
                }
                .sig {
                    position: absolute;
                    left: 0;
                    top: 70px;
                    .iconfont {
                        font-size: 22px;
                        color: #00c595;
                        text-decoration: none;
                        mask-image: -webkit-gradient(
                            linear,
                            left top,
                            left bottom,
                            from(rgba(255, 255, 255, 1)),
                            to(rgba(255, 255, 255, 0))
                        );
                    }
                }
                .downward {
                    transform: rotate(180deg);
                }
                .vanish {
                    display: none;
                }
            }
        }
        .whole-class {
            header {
                &::after {
                    background-color: #878be9;
                }
            }
            main {
                padding-left: 20px;
                .Proportion {
                    color: #686de5;
                }
                ul {
                    width: 55px;
                }
                li {
                    background-color: #878be9;
                    opacity: 0.3;
                }
            }
        }
    }
}
</style>