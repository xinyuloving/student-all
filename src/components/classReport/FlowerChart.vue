<template>
    <div class="bar-chart-main">
        <div class="bar-chart-title">
            <img src="~@/assets/img/classReport/title_1.png" />
            <span>获得奖励</span>
        </div>
        <div class="award-con">
            <div class="award-name">获得小红花</div>
            <div class="award-img">
                <img src="~@/assets/img/flower.png" align="middle" />
            </div>
            <div class="award-num">{{ flowerSum }}</div>
        </div>
        <div class="bar-chart-con">
            <div class="personal-award item">
                <div class="bar-con">
                    <div class="img-box">
                        <img src="@/assets/img/classReport/bar_1.png" />
                    </div>
                    <div class="bar-box">
                        <div class="bar" :style="{background: '#FE9999', height: personalH + '%'}"></div>
                    </div>
                </div>
                <div class="text">个人奖励</div>
            </div>
            <div class="collective-award item">
                <div class="bar-con">
                    <div class="img-box">
                        <img src="@/assets/img/classReport/bar_2.png" />
                    </div>
                    <div class="bar-box">
                        <div class="bar" :style="{background: '#FDC65F', height: collectiveH + '%'}"></div>
                    </div>
                </div>
                <div class="text">全班奖励</div>
            </div>
            <div class="answer-award item">
                <div class="bar-con">
                    <div class="img-box">
                        <img src="@/assets/img/classReport/bar_3.png" />
                    </div>
                    <div class="bar-box">
                        <div class="bar" :style="{background: '#52DDBB', height: answerH + '%'}"></div>
                    </div>
                </div>
                <div class="text">答题奖励</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'FlowerChart',

    computed: {
        ...mapState('reportedData', ['reward']),
        flowerSum() {
            let sum = 0;
            for (let k in this.reward) {
                sum += this.reward[k];
                this.maxNum = this.maxNum > this.reward[k] ? this.maxNum : this.reward[k]
            }
            return sum
        },
        personalH() {
            return this.maxNum ? (this.reward.personal / this.maxNum) * 100 : 0
        },
        collectiveH() {
            return this.maxNum ? (this.reward.wholeClass / this.maxNum) * 100 : 0
        },
        answerH() {
            return this.maxNum ? (this.reward.answer / this.maxNum) * 100 : 0
        }
    },

    data() {
        return {
            maxNum: 0
        }
    },
}
</script>

<style lang="less" scoped>
.bar-chart-main {
    padding: 16px 20px;
    .bar-chart-title {
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
    .award-con {
        text-align: center;
        margin-top: 15px;
        img {
            width: 31px;
            margin: 2px 0;
        }
        .award-name {
            font-size: 16px;
            color: #666;
        }
        .award-num {
            font-family: D-DINExp-Bold, D-DINExp;
            font-size: 18px;
            font-weight: 600;
        }
    }
    .bar-chart-con {
        height: 219px;
        margin-top: 15px;
        border-radius: 12px;
        background: rgba(88, 208, 188, .15);
        padding: 28PX 5px 0;
        display: flex;
        justify-content: space-evenly;
        .item {
            width: 65px;
            height: 100%;
            .bar-con {
                width: 100%;
                height: 156px;
                border-radius: 10px;
                background: #FFF;
                display: flex;
                flex-direction: column;
                // padding: 4px;
                // position: relative;
                .bar-box {
                    flex: 1;
                    width: 100%;
                    position: relative;
                }
                .img-box {
                    text-align: center;
                    margin-top: 10px;
                }
                .bar {
                    border-radius: 8px;
                    position: absolute;
                    bottom: 4px;
                    left: 4px;
                    width: 57px;
                    transition: all .5s;
                }
            }
            .text {
                font-weight: 600;
                font-size: 15px;
                color: #333;
                text-align: center;
                margin-top: 8px;
            }
        }
    }
}
</style>