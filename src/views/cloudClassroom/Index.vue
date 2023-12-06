<template>
    <div class="cloud-classroom" ref="cloudIndex">
        <DefaultIndex />

        <CountDown v-if="time.length" />
        <ChoiceQuestion v-if="visibleGroup.choice" />
        <JudgmentQuestion v-if="visibleGroup.judge" />
        <RandomSelection v-if="visibleGroup.randomSelection" />
        <ClassTest v-if="visibleGroup.classTest" />
        <RushToAnswer v-if="visibleGroup.rushToAnswer" />
        <TeachingFeedback v-if="visibleGroup.teachingFeedback" />
        <Distribute v-if="visibleGroup.distribute" />
    </div>
</template>

<script>
import ChoiceQuestion from "./ChoiceQuestion.vue";
import JudgmentQuestion from "./JudgmentQuestion.vue";
import RandomSelection from "./RandomSelection.vue";
import RushToAnswer from "./RushToAnswer.vue";
import ClassTest from "./ClassTest.vue";
import TeachingFeedback from "./TeachingFeedback.vue";
import { mapState, mapMutations } from "vuex";
import CountDown from "./CountDown.vue";
import { getStudent } from "@/api/student";
import Distribute from "./Distribute.vue";
import DefaultIndex from "./DefaultIndex.vue";
import { changeStatusBar } from "@/utils/util";
export default {
    name: "CloudClassroom",
    components: {
        ChoiceQuestion,
        JudgmentQuestion,
        RandomSelection,
        RushToAnswer,
        ClassTest,
        TeachingFeedback,
        CountDown,
        Distribute,
        DefaultIndex,
    },

    created() {
        // 获取 学生列表
        // this.getStudentList();
        changeStatusBar(false);
    },
    computed: {
        ...mapState({
            time: (state) => state.cloudClassroom.time,
            studentInfo: (state) => state.user.userInfo,
            schoolCode: (state) => state.user.schoolCode,
            distributeCon: (state) => state.cloudClassroom.distributeCon,
            visibleGroup: (state) => state.cloudClassroom.visibleGroup,
        }),
    },

    methods: {
        // turnReward(flag) {
        //     // flag 类型为 Boolean
        //     this.reward = flag;
        //     if (!flag) {
        //         // 动画关闭，奖牌加一
        //         this.flowerNum += 1;
        //     }
        // },
        ...mapMutations({
            setState: "cloudClassroom/setState",
        }),
        goHome() {
            // 返回首页
            this.$router.push({ name: "Home" });
        },
        async getStudentList() {
            // 获取学生列表
            const data = {
                clazzCode: this.studentInfo.clazz.clazzCode,
                gradeCode: this.studentInfo.grade.gradeCode,
                page: 1,
                pageSize: 999,
                schoolCode: this.schoolCode,
            };
            const {
                data: { studentInfoList },
            } = await getStudent(JSON.stringify(data));
            const temArr = [];
            for (let i = 0; i < studentInfoList.length; i++) {
                const e = studentInfoList[i];
                temArr.push({
                    studentAccount: e.student.account,
                    id: e.student.id,
                    photoUrl: e.student.photoUrl,
                    name: e.student.name,
                });
            }
            this.setState({ key: "studentList", value: temArr });
        },
    },
};
</script>

<style lang="less" scoped>
.cloud-classroom {
    width: 100%;
    height: 100%;
    background-color: #1b1a21;
    user-select: none;
    position: relative;
    .flower {
        width: 76px;
        height: 34px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 0px 17px 17px 0px;
        position: absolute;
        top: 36px;
        right: 36px;
        z-index: 0;
        display: flex;
        align-items: center;
        img {
            width: 40px;
            height: 40px;
            position: absolute;
            z-index: 2;
            top: -3px;
            left: -12px;
        }
        span {
            font-size: 26px;
            font-weight: 600;
            color: #ffffff;
            margin-left: 36px;
        }
    }
}
</style>