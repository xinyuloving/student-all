<template>
    <!-- 课堂报告 -->
    <div class="class-report">
        <!-- 退出按钮 -->
        <div class="out">
            <TButton class="out-button" @touch="toHome">
                <img src="~@/assets/img/outCurrent.png" />
            </TButton>
        </div>
        <div class="report-left-box">
            <!-- 时长 -->
            <div class="burning-time">
                <div class="schooltime">
                    {{ userInfo.realName || "姓名" }}
                </div>
                <div class="interactive-time">
                    {{
                        userInfo.grade
                            ? userInfo.grade.gradeName +
                              userInfo.clazz.clazzName
                            : "班级"
                    }}
                </div>
            </div>
            <div class="report-left-img">
                <img
                    :src="
                        require(`../../assets/img/student_figure/${
                            userInfo.figure || 1
                        }.png`)
                    "
                />
            </div>
        </div>
        <div class="report-right-box">
            <!-- 小红花数据图 -->
            <div class="bar-chart-box">
                <FlowerChart />
            </div>
            <!-- 课堂互动数据图 -->
            <div class="pie-chart-box">
                <InteractChart />
            </div>
            <!-- 正确率数据图 -->
            <div class="radar-chart-box">
                <AccuracyChart />
            </div>
        </div>
    </div>
</template>

<script>
import FlowerChart from "@/components/classReport/FlowerChart.vue";
import InteractChart from "@/components/classReport/InteractChart.vue";
import AccuracyChart from "@/components/classReport/AccuracyChart.vue";
import { mapState, mapMutations } from "vuex";
import TButton from "@/components/publicMethods/TButton.vue";

export default {
    name: "ClassReport",

    components: {
        FlowerChart,
        InteractChart,
        AccuracyChart,
        TButton,
    },

    computed: {
        ...mapState("user", ["userInfo"]),
        ...mapState("imStore", ["netWorkInfo", "loginInfo"]),
    },

    methods: {
        ...mapMutations("reportedData", ["resetState"]),
        toHome() {
            this.resetState();
            this.$router.push({ path: "/" });
        },
    },
    // created() {
    //     this.data_batchUpload();
    // },
};
</script>

<style lang="less" scoped>
.class-report {
    display: flex;
    height: 100%;
    padding-top: 65px;
    background: #f4f4f9;
    .out {
        width: 78px;
        display: flex;
        align-items: center;
        .out-button {
            background: transparent;
        }
    }
    .report-left-box {
        width: 298px;
        height: 391px;
        margin-right: 20px;
        border-radius: 16px;
        background: #fff;
        .burning-time {
            display: flex;
            text-align: center;
            padding: 25px 0;
            font-size: 20px;
            font-weight: 500;
            line-height: 2;
            .schooltime {
                width: 50%;
                position: relative;
                &::after {
                    content: "";
                    width: 1px;
                    height: 90%;
                    background: #ededed;
                    position: absolute;
                    right: 0;
                    top: 5%;
                }
            }
            .interactive-time {
                width: 50%;
            }
        }
        .report-left-img {
            text-align: center;
            img {
                width: 153px;
            }
        }
    }
    .report-right-box {
        width: 875px;
        height: 391px;
        border-radius: 16px;
        background: #fff;
        display: flex;
        .bar-chart-box {
            width: 277px;
            height: 100%;
        }
        .pie-chart-box {
            width: 335px;
            height: 100%;
            position: relative;
            &::before {
                content: "";
                width: 1px;
                height: 90%;
                background: #ededed;
                position: absolute;
                left: 0;
                top: 5%;
            }
            &::after {
                content: "";
                width: 1px;
                height: 90%;
                background: #ededed;
                position: absolute;
                right: 0;
                top: 5%;
            }
        }
        .radar-chart-box {
            flex: 1;
            height: 100%;
        }
    }
}
</style>