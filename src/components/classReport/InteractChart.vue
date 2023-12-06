<template>
    <div class="interact-chart-main">
        <div class="interact-chart-title">
            <img src="~@/assets/img/classReport/title_2.png" />
            <span>课堂互动</span>
        </div>
        <div class="data-sum">
            累计互动次数：<span>{{ total }}</span> 次
        </div>
        <div class="text-box">（次）</div>
        <div class="interact-chart-con">
            <ul class="interact-chart-setting">
                <li class="setting-item" v-for="item in settingInfo.num" :key="item">
                    <span>{{ (settingInfo.num - item) * settingInfo.interval }}</span>
                    <div class="dividing"></div>
                </li>
            </ul>
            <ul class="interact-chart-data">
                <li class="chart-data-box" v-for="(item, index) in chartData" :key="index">
                    <div class="max-data">
                        <div class="actual-data" :style="{ height: item.h }"></div>
                    </div>
                    <span>{{ item.name }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'InteractChart',
    data() {
        return {
            chartData: [{
                name: '举手',
                num: 0,
                h: '0px'
            },{
                name: '选择题',
                num: 0,
                h: '0px'
            },{
                name: '判断题',
                num: 0,
                h: '0px'
            },{
                name: '抢答',
                num: 0,
                h: '0px'
            },{
                name: '随堂测试',
                num: 0,
                h: '0px'
            }],
            settingInfo: {
                interval: 0,
                num: 0
            }
        }
    },
    computed: {
        ...mapState('reportedData', ['interaction']),
        total() {
            let sum = 0;
            this.chartData[0].num = this.interaction.raiseHand;
            this.chartData[1].num = this.interaction.choice.numOfInitiate;
            this.chartData[2].num = this.interaction.judge.numOfInitiate;
            this.chartData[3].num = this.interaction.rushToAnswer;
            this.chartData[4].num = this.interaction.classTest;
            this.chartData.forEach(i => sum += i.num);
            this.dataInit();
            return sum
        }
    },
    // mounted() {
    //     this.dataMount()
    // },
    methods: {
        // dataMount() {
        //     this.chartData[0].num = this.interaction.raiseHand;
        //     this.chartData[1].num = this.interaction.choice.numOfInitiate;
        //     this.chartData[2].num = this.interaction.judge.numOfInitiate;
        //     this.chartData[3].num = this.interaction.rushToAnswer;
        //     this.chartData[4].num = this.interaction.classTest;
        //     this.chartData.forEach(i => this.total += i.num);
        //     this.dataInit()
        // },
        dataInit() {
            let n = 10;
            let interval;
            this.chartData.forEach(i => n = n > i.num ? n : i.num);
            if (n > 900) {
                interval = 300
            } else if (n > 600 && n <= 900) {
                interval = 200
            } else if (n > 300 && n <= 600) {
                interval = 100
            } else if (n > 100 && n <= 300) {
                interval = 50
            } else if (n > 20 && n <= 100) {
                interval = 20
            } else {
                interval = 5
            }
            this.settingInfo.num = parseInt(n / interval) + 2;
            this.settingInfo.interval = interval;
            const maxData = this.settingInfo.interval * (this.settingInfo.num - 1);
            const timer = setTimeout(() => {
                this.chartData.forEach(i => {
                    let num = i.num / maxData;
                    i.h = num * 100 + '%'
                });
                clearTimeout(timer)
            }, 0);
        }
    }
}
</script>

<style lang="less" scoped>
.interact-chart-main {
    padding: 16px 20px;
    color: #333;
    .interact-chart-title {
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
    .data-sum {
        margin: 24px 0;
        color: #666;
        text-align: center;
        span {
            color: #333;
            font-weight: 600;
            font-size: 18px;
        }
    }
    .text-box {
        font-size: 13px;
        margin-bottom: 5px;
    }
    .interact-chart-con {
        position: relative;
        .interact-chart-setting {
            height: 220px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .setting-item {
                display: flex;
                align-items: center;
                position: relative;
                span {
                    width: 30px;
                    text-align: right;
                    margin-right: 5px;
                    font-size: 12px;
                    position: absolute;
                }
                .dividing {
                    width: 242px;
                    height: 1px;
                    background-color: #E7E7E7;
                    margin-left: 35px;
                }
            }
            .setting-item:nth-last-child(1) {
                align-items: flex-end;
            }
        }
        .interact-chart-data {
            position: absolute;
            width: 242px;
            height: 220px;
            top: 0;
            left: 35px;
            display: flex;
            justify-content: space-between;
            .chart-data-box {
                height: 100%;
                width: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                .max-data {
                    width: 10px;
                    height: 100%;
                    background-color: rgba(237, 237, 237, .5);
                    display: flex;
                    align-items: flex-end;
                    .actual-data {
                        border-radius: 5px 5px 0 0;
                        width: 100%;
                        height: 0;
                        transition: all .5s;
                    }
                }
                span {
                    font-size: 12px;
                    position: absolute;
                    bottom: -17px;
                    white-space: nowrap;
                }
            }
            .chart-data-box:nth-child(1) {
                .actual-data {
                    background-color: #FFEF75;
                }
            }
            .chart-data-box:nth-child(2) {
                .actual-data {
                    background-color: #FE7876;
                }
            }
            .chart-data-box:nth-child(3) {
                .actual-data {
                    background-color: #7B85E1;
                }
            }
            .chart-data-box:nth-child(4) {
                .actual-data {
                    background-color: #87BCFD;
                }
            }
            .chart-data-box:nth-child(5) {
                .actual-data {
                    background-color: #92E17F;
                }
            }
        }
    }
}
</style>