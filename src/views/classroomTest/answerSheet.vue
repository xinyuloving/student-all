<template>
    <!-- 答题卡 -->
    <div class="answer-sheet">
        <!-- 退出按钮 -->
        <div class="out" v-if="back">
            <TButton class="out-button" @touch="exit">
                <img src="~@/assets/img/outCurrent.png" />
            </TButton>
        </div>
        <!-- 主体内容 -->
        <div class="content">
            <!-- 题目类型标签 -->
            <div class="type-tag">{{ tagName }}</div>
            <!-- 总分 -->
            <div class="total" v-if="testData.answerStatus && testData.examPaperScore >= 0">
                <img
                    :src="require(`@/assets/img/classroom/${item}.png`)"
                    v-for="(item, index) in (testData.examPaperScore + '')"
                    :key="index"
                />
            </div>
            <!-- 是否正确 -->
            <!-- <div class="is-correct" v-if="testData.answerStatus">
                <i class="iconfont icon-duihao1" v-if="!topicInfo.answerResult"></i>
                <i class="iconfont icon-cuo" v-else></i>
            </div> -->
            <!-- 试卷名 -->
            <div class="title">{{ testData.examPaperName }}</div>
            <!-- 题目 -->
            <div class="topic-content">
                <div class="is-correct" v-if="testData.answerStatus">
                    <i class="iconfont icon-duihao1" v-if="!topicInfo.answerResult"></i>
                    <i class="iconfont icon-cuo" v-else></i>
                </div>
                <div class="topic" v-html="topicList[currentIndex].topic"></div>
            </div>

            <!-- 答题选项 -->
            <div class="options" v-if="!testData.answerStatus">
                <div class="option-text">选项：</div>
                <!-- 选择题选项 -->
                <div class="option-box">
                    <div
                        class="option"
                        v-touch="
                            () => {
                                optionCheck(index);
                            }
                        "
                        v-for="(item, index) in optionsChecks"
                        :key="index"
                        :style="{
                            color: item ? '#0E98FD' : null,
                            backgroundColor: item ? '#DAF0FF' : null,
                            borderColor: item ? '#0E98FD' : null,
                        }"
                    >
                        {{ index | optionFilter }}
                    </div>
                </div>
            </div>

            <!-- 解析 -->
            <div class="analysis" v-if="testData.answerStatus">
                <span
                    v-touch="
                        () => {
                            analysisTop = '0';
                        }
                    "
                    v-show="analysisTop === '-125px'"
                    >查看答案和解析</span
                >
                <div class="box" :style="{ top: analysisTop }">
                    <div class="result">
                        <span>正确答案：</span>
                        <span
                            v-if="topicInfo.type !== 1"
                            class="analysis-right"
                            >{{ topicInfo.answer | answerFilter }}</span
                        >
                        <span class="analysis-right" v-else>
                            <img
                                src="~@/assets/img/correct.png"
                                v-if="topicInfo.answer"
                            />
                            <img src="~@/assets/img/error.png" v-else />
                        </span>
                    </div>
                    <div class="analysis-details">
                        <span>解析：</span>
                        <span class="details">{{
                            topicInfo.analysis ? topicInfo.analysis : "无"
                        }}</span>
                    </div>
                    <div class="pack-up">
                        <span
                            v-touch="
                                () => {
                                    analysisTop = '-125px';
                                }
                            "
                            v-show="analysisTop === '0'"
                            >收起答案和解析</span
                        >
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧栏 -->
        <div class="right">
            <div class="text">答题卡</div>
            <!-- 如果是未做的试卷 -->
            <div class="check-box" v-if="!testData.answerStatus">
                <div
                    class="check"
                    :style="{
                        opacity: currentIndex === index ? '1' : '.5',
                        backgroundColor: item.already ? '#2499FF' : null,
                        color: item.already ? '#fff' : null,
                    }"
                    v-touch="
                        () => {
                            currentIndex = index;
                        }
                    "
                    v-for="(item, index) in rightList"
                    :key="index"
                >
                    {{ index + 1 }}
                </div>
            </div>
            <!-- 如果是已做的试卷 -->
            <div class="check-box" v-else>
                <div
                    class="check"
                    :style="{
                        opacity: currentIndex === index ? '1' : '.5',
                        backgroundColor: item.already ? '#0BC75B' : '#F35E5E',
                        color: '#fff',
                    }"
                    v-touch="
                        () => {
                            currentIndex = index;
                        }
                    "
                    v-for="(item, index) in rightList"
                    :key="index"
                >
                    {{ index + 1 }}
                </div>
            </div>
            <div
                class="submit"
                v-if="!isSubmit && !testData.answerStatus"
            >
                <TButton class="submit-but" :disabled="isDisabled" @touch="openDialog">提交</TButton>
            </div>
        </div>

        <!-- 二次确认弹框 -->
        <ClassroomDialog
            :isDialog.sync="isDialog"
            :type="dialogType"
            :content="'请仔细检查，确认后将会提交给老师呦'"
            @close="
                () => {
                    isDialog = false;
                    dialogType = 0;
                }
            "
            @notarize="submit"
        />
    </div>
</template>

<script>
import { submitTest } from "@/api/classroomTest";
import ClassroomDialog from "@/components/classroomTest/classroomDialog.vue";
import { mapMutations, mapState } from "vuex";
import TButton from '@/components/publicMethods/TButton.vue'

// 用于储存当前题目的类型
let topicType = -1;

export default {
    name: "AnswerSheet",

    props: {
        testData: Object,
        topicList: Array,
        back: {
            type: Boolean,
            default: true,
        },
    },

    components: {
        ClassroomDialog,
        TButton
    },

    data() {
        return {
            studentId: this.$store.getters.studentId, // 学生id
            currentIndex: 0, // 当前题目的索引
            answerSubmitList: [], // 答案提交所需的数据
            rightList: [], // 右侧数据列表
            optionsChecks: [], // 当前题目选项的选中状态
            isDialog: false, // 控制弹框的显示与隐藏
            dialogType: 0, // 弹窗类型
            isSubmit: false, // 是否提交
            isFlag: false,
            tagName: "", // 题目类型
            topicInfo: {}, // 当前题目的详情
            analysisTop: "0",
            throttle: true,
        };
    },

    filters: {
        optionFilter(index) {
            if (topicType === 1) {
                // type全等于1 则为判断题
                return index ? "√" : "×";
            }
            const num = index + 65;
            // 将数字转为字母
            return String.fromCharCode(num);
        },
        answerFilter(answer) {
            if (topicType === 2) {
                const arr = [];
                answer
                    .split("-")
                    .forEach((item) =>
                        arr.push(String.fromCharCode(parseInt(item) + 65))
                    );
                return arr.join("-");
            } else if (topicType === 0) {
                return String.fromCharCode(parseInt(answer) + 65);
            }
        },
    },

    watch: {
        answerSubmitList() {
            if (this.testData.answerStatus) return;
            if (this.isFlag) return (this.isFlag = false);
            this.rightList[this.currentIndex].already =
                !this.rightList[this.currentIndex].already;
        },
        // 如果当前题目发生改变
        currentIndex() {
            if (this.currentIndex === -1) return;
            // 更改题目类型
            topicType = this.topicList[this.currentIndex].type;
            this.getTypeName(this.topicList[this.currentIndex].type);
            if (this.testData.answerStatus) {
                this.topicInfo = this.topicList[this.currentIndex];
                return;
            }
            // 筛选出当前题目是否已作答
            const arr = this.answerSubmitList.filter(
                (item) => item.index === this.currentIndex
            );
            // 重置选项状态
            this.optionsChecks = new Array(
                this.topicList[this.currentIndex].options
            );
            if (this.topicList[this.currentIndex].type === 1)
                this.optionsChecks = new Array(2);
            // 如果当前题目已作答
            if (arr.length) {
                // 替换已作答的选项状态
                arr[0].inputAnswer.forEach((item) =>
                    this.optionsChecks.splice(item, 1, true)
                );
            }
        },
        topicList() {
            this.dataInit();
        },
        "cExam.type"(newValue) {
            // 关闭云课堂
            if (newValue === 0) return;
            if (newValue === 1) {
                // 一键交卷
                this.submit();
            } else if (newValue === 2) {
                // 留作业
                this.exit();
            }
            this.$store.commit("cloudClassroom/setState", {
                objKey: "visibleGroup",
                key: "classTest",
                value: false,
            });
        },
    },

    computed: {
        ...mapState({
            cExam: (state) => state.classroomTest.cExam,
        }),
        isDisabled() {
            // 题目是否答完
            return !(this.topicList.length === this.answerSubmitList.length);
        },
        listeners() {
            return Object.keys(this.$listeners);
        },
    },

    methods: {
        ...mapMutations("classroomTest", ["setAnswerList", "removeAnswer"]),
        // 退出
        exit() {
            if (this.testData.answerStatus) return this.$emit("toAnswer", -1);
            if (this.answerSubmitList.length && !this.isSubmit) {
                this.setAnswerList({
                    id: this.testData.teacherPublishId,
                    list: this.answerSubmitList,
                });
            }
            this.$emit("toAnswer", -1);
        },
        // 选择题答案
        optionCheck(index) {
            if (this.isSubmit) return;
            // 获取当前题目的id
            const id = this.topicList[this.currentIndex].id;
            // 筛选出符合的数据
            let arr = this.answerSubmitList.filter((item) => item.id === id);
            let checks = this.optionsChecks;
            if (arr.length) {
                // 如果当前题目id已经在提交列表里
                let num = arr[0].inputAnswer.indexOf(index);
                // 如果type为2则为多选题
                if (this.topicList[this.currentIndex].type === 2) {
                    checks[index] = !checks[index];
                    this.$forceUpdate();
                    // 如果已选答案中找不到本次选择的答案 则追加进去
                    if (num === -1) return arr[0].inputAnswer.push(index);
                    // 如果找到了则删除该答案  并判断是否还有答案  没有的话则删除该题
                    arr[0].inputAnswer.splice(num, 1);
                    if (arr[0].inputAnswer.length) return;
                    this.answerSubmitList = this.answerSubmitList.filter(
                        (item) => item.id !== id
                    );
                } else {
                    // 如果是单选题或判断题
                    for (let i = 0; i < checks.length; i++) {
                        if (i === index) {
                            checks[i] = !checks[i];
                            continue;
                        }
                        checks[i] = false;
                    }
                    this.$forceUpdate();
                    if (num === -1) return (arr[0].inputAnswer = [index]);
                    this.answerSubmitList = this.answerSubmitList.filter(
                        (item) => item.id !== id
                    );
                }
            } else {
                // 如果当前题目id不在提交列表里
                this.answerSubmitList.push({
                    id,
                    inputAnswer: [index],
                    index: this.currentIndex,
                });
                checks[index] = true;
            }
        },
        // 提交
        openDialog() {
            this.isDialog = true;
        },
        async submit() {
            try {
                let obj = {
                    answerQuestionList: [],
                    studentId: this.studentId,
                    teacherPublishId: this.testData.teacherPublishId,
                };
                if (this.answerSubmitList.length) {
                    this.answerSubmitList.forEach((item) => {
                        obj.answerQuestionList.push({
                            id: item.id,
                            inputAnswer: item.inputAnswer.join("-"),
                        });
                    });
                } else {
                    for (let i = 0; i < this.topicList.length; i++) {
                        const e = this.topicList[i];
                        obj.answerQuestionList.push({
                            id: e.id,
                            inputAnswer: "",
                        });
                    }
                }
                const res = await submitTest(JSON.stringify(obj));
                console.log(res);
                if (res.code === 0) {
                    this.$emit("updateInfo");
                    this.dialogType = 1;
                    this.isSubmit = true;
                    if (this.listeners.includes("cClose")) {
                        this.$emit("cClose");
                    } else {
                        this.removeAnswer(this.testData.teacherPublishId);
                    }
                } else {
                    throw new Error();
                }
            } catch (err) {
                this.dialogType = 2;
                this._msg('提交失败', err);
                console.log(err);
            }
        },
        // 获取当前题目的类型名称
        getTypeName(type) {
            if (type === 0) {
                this.tagName = "单选题";
            } else if (type === 1) {
                this.tagName = "判断题";
            } else if (type === 2) {
                this.tagName = "多选题";
            }
        },
        // 数据初始化
        dataInit() {
            if (this.testData.answerStatus) {
                this.rightList = [];
                this.getTypeName(this.topicList[this.currentIndex].type);
                this.topicList.forEach((item) => {
                    if (item.answerResult === 0) {
                        this.rightList.push({ already: true });
                    } else {
                        this.rightList.push({ already: false });
                    }
                    console.log(item);
                });
                this.topicInfo = this.topicList[this.currentIndex];
                return;
            }
            this.getTypeName(this.topicList[this.currentIndex].type);
            // 初始化选项状态
            this.optionsChecks = new Array(
                this.topicList[this.currentIndex].options
            );
            // 如果题目为判断 初始化选项状态
            if (this.topicList[this.currentIndex].type === 1)
                this.optionsChecks = new Array(2);
            // 初始化右侧数据
            this.topicList.forEach(() =>
                this.rightList.push({ already: false })
            );
            // 将题目类型赋值给全局变量

            // 判断vuex里有没有该试卷的信息
            const answerList = this.$store.getters.answerList.filter(
                (item) => item.id === this.testData.teacherPublishId
            )[0];
            if (answerList) {
                this.answerSubmitList = answerList.list;
                this.isFlag = true;
                const arr = answerList.list.filter(
                    (item) => item.index === this.currentIndex
                )[0];
                answerList.list.forEach(
                    (item) => (this.rightList[item.index].already = true)
                );
                if (arr) {
                    arr.inputAnswer.forEach((item) =>
                        this.optionsChecks.splice(item, 1, true)
                    );
                }
            }
        },
    },

    created() {
        topicType = this.topicList[0].type;
        this.dataInit();
    },
};
</script>

<style lang="less" scoped>
.answer-sheet {
    display: flex;
    // justify-content: center;
    align-items: center;
    height: 100%;
    color: #333;
    .icon-duihao1 {
        color: #0BC75B;
    }
    .icon-cuo {
        color: #F35E5E;
    }
    .out {
        width: 78px;
        display: flex;
        align-items: center;
        .out-button {
            background: transparent;
        }
    }
    .content,
    .right {
        // margin-top: 29px;
        width: 906px;
        height: 391px;
        background-color: #fff;
        border-radius: 16px;
        position: relative;
        .type-tag {
            position: absolute;
            top: 30px;
            left: 0;
            background-color: #2499ff;
            color: #fff;
            padding: 10px 20px;
            border-radius: 3px;
            font-size: 14px;
        }
        .total {
            position: absolute;
            top: 20px;
            right: 50px;
        }
        .options {
            padding: 0 66px;
            line-height: 44px;
            display: flex;
            .option-text {
                font-weight: 600;
                width: 65px;
            }
            .option-box {
                display: flex;
                flex-wrap: wrap;
                .option {
                    width: 100px;
                    border-radius: 4px;
                    border: 1px solid #979797;
                    margin-right: 15px;
                    margin-bottom: 10px;
                    text-align: center;
                }
            }
        }
        .title {
            font-size: 24px;
            font-weight: 500;
            margin-top: 30px;
            margin-bottom: 20px;
            text-align: center;
        }
        .topic-content {
            position: relative;
            .is-correct {
                position: absolute;
                left: 40px;
            }
        }
        .topic {
            margin: 0 0 20px;
            padding: 0 66px;
            height: 200px;
            overflow-y: auto;
            /deep/ .option-box {
                display: flex;
                flex-wrap: wrap;
                .option-item {
                    margin-right: 40px;
                    margin-top: 10px;
                }
            }
        }
        .analysis {
            font-size: 18px;
            color: #3e83f8;
            margin-top: 0px;
            position: relative;
            overflow: hidden;
            height: 165px;
            .box {
                transition: all 0.2s;
                width: 100%;
                height: 125px;
                position: absolute;
                color: #333;
                background-color: #fff;
                .pack-up {
                    width: 100%;
                    text-align: center;
                    color: #3e83f8;
                    position: absolute;
                    bottom: 20px;
                }
                .result {
                    .analysis-right {
                        font-weight: 600;
                        color: #0bc75b;
                    }
                }
                .analysis-details {
                    margin-top: 5px;
                    height: 50px;
                    overflow-y: auto;
                    .details {
                        color: #999;
                    }
                }
            }
        }
    }
    .right {
        width: 256px;
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
        .text {
            font-weight: 600;
            text-align: center;
            line-height: 42px;
        }
        .check-box {
            margin-top: 20px;
            flex: 1;
            overflow-y: auto;
            // display: flex;
            // flex-wrap: wrap;
            .check {
                width: 44px;
                line-height: 44px;
                border-radius: 4px;
                margin: 0 0 16px 16px;
                text-align: center;
                display: inline-block;
                background-color: #f3f3f3;
            }
        }
        .submit {
            padding: 12px 16px;
            border-top: 1px solid #eaeaea;
            position: relative;
            .submit-but {
                width: 224px;
                height: 44px;
                font-size: 20px;
                font-weight: 600;
                border-radius: 30px;
            }
        }
    }
}
</style>