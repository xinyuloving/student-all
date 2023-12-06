<template>
    <div class="class-test">
        <AnswerSheet
            v-if="examList.length && !loading"
            :back="false"
            :topicList="examList"
            :testData="answerTestData"
            @cClose="cClose"
        />
        <Loading v-if="loading" />
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { getTestInfo } from "@/api/classroomTest";
import cos from "@/utils/cos";
import AnswerSheet from "../classroomTest/answerSheet.vue";
import { insertDom } from "@/utils/util";
import Loading from "@/components/publicMethods/Loading.vue";
export default {
    components: {
        AnswerSheet,
        Loading,
    },
    data() {
        return {
            examList: [],
            answerTestData: {
                answerStatus: 0,
                examPaperName: "",
                studentId: "",
                teacherPublishId: "",
            }, // 答题试卷详情
            loading: true,
        };
    },
    created() {
        this.getExamList();
    },
    mounted() {
        insertDom(this.$el, this.$parent.$el);
    },
    computed: {
        ...mapState({
            cExam: (state) => state.classroomTest.cExam,
        }),
        ...mapGetters({
            studentId: "studentId",
        }),
    },
    methods: {
        ...mapMutations({
            cloudClassroomSet: "cloudClassroom/setState",
            classroomTestSet: "classroomTest/resetCExam",
        }),
        async getExamList() {
            // 获取题目列表
            try {
                this.answerTestData.teacherPublishId = this.cExam.publishId;
                this.answerTestData.examPaperName = this.cExam.examName;
                this.answerTestData.studentId = this.studentId;
                const params = {
                    studentId: this.studentId,
                    publishId: this.cExam.publishId,
                    answerStatus: 0,
                };
                const { data } = await getTestInfo(params);
                this.examList = data;
                this.examList.forEach(async (item, index) => {
                    await this.getFileInfo(item);
                    if (index === this.examList.length - 1) {
                        // 最后一个
                        this.loading = false;
                    }
                });
            } catch (error) {
                // console.log(error);
                this.loading = false;
            }
        },
        // 获取cos题目
        async getFileInfo(data) {
            try {
                const tempTopic = data.topic;
                data.topic = "";
                data.topic = await cos.getFile({
                    type: 1,
                    // key: data.topic,
                    key: tempTopic,
                });
            } catch (err) {
                // console.log(err);
            }
        },
        getFileName(file) {
            return file.slice(file.lastIndexOf("/") + 1);
        },
        cClose() {
            setTimeout(() => {
                this.cloudClassroomSet({
                    objKey: "visibleGroup",
                    key: "classTest",
                    value: false,
                });
                this.classroomTestSet();
            }, 3000);
        },
        submit() {
            this.dialogVisible = true;
        },
        cancel() {
            this.dialogVisible = false;
        },
        confirm() {
            // 提交事件
            // this.dialogVisible = false;
            this.success = true;
            // 提交之后，将 questions 对象 做清空!
        },
    },
};
</script>

<style lang="less" scoped>
.class-test {
    width: 100%;
    height: 100%;
    background-color: #f4f4f9;
    padding: 0 32px;
    position: absolute;
    z-index: 9;
}
</style>