<template>
  <Shell :loading="loading" v-if="answerTestId === -1">
    <template v-slot v-if="testList.length">
      <div class="right-content">
        <!-- 顶部导航 -->
        <div class="content-top">
          <Navigation :list="navigationList"></Navigation>
        </div>
        <!-- 用于容纳试卷的容器 -->
        <div class="content-box">
          <!-- 每项试卷 -->
          <TestItem
            @toAnswer="beforeToAnswer"
            v-for="(item, index) in testList"
            :key="index"
            :info="item"
          />
        </div>
      </div>
    </template>
  </Shell>
  <!-- 答题卡 -->
  <AnswerSheet
    v-else
    @updateInfo="updateInfo"
    @toAnswer="(id) => (answerTestId = id)"
    :testData="answerTestData"
    :topicList="topicList"
  />
</template>

<script>
import Navigation from "@/components/publicMethods/Navigation.vue";
import TestItem from "@/components/classroomTest/testItem.vue";
import AnswerSheet from "@/views/classroomTest/answerSheet.vue";
import {
  getTestList,
  getTestInfo,
  getErrorQuestions,
} from "@/api/classroomTest";
import cos from "@/utils/cos";
import Shell from "@/components/publicMethods/Shell.vue";

export default {
  name: "ClassroomTest",

  components: {
    Navigation,
    TestItem,
    AnswerSheet,
    Shell,
  },

  data() {
    return {
      checkedNum: 0, // 左侧栏当前选中的索引
      navigationList: ["随堂测试"], // 面包屑导航数据
      testList: [], // 试卷列表
      studentId: this.$store.getters.studentId, // 学生id
      answerTestId: -1, // 答题试卷的id  如果id大于0显示答题卡
      answerTestData: {}, // 答题试卷详情
      topicList: [], // 题目列表
      errorQuestions: {
        answerStatus: 1,
        examPaperName: "错题锦集",
        studentId: this.$store.getters.studentId,
        teacherPublishId: -2,
        topicList: [],
      }, // 错题锦集
      counter: 0,
      loading: false,
      outButColor: "",
    };
  },

  watch: {
    answerTestId() {
      if (this.answerTestId === -1) this.getTestList();
    },
  },

  methods: {
    // 获取随堂测试试卷列表
    async getTestList(flag) {
      try {
        this.loading = true;
        const { data } = await getTestList({
          studentId: this.studentId,
        });
        // console.log(data);
        if (data.length) {
          this.testList = data.reverse();
          this.testList.push(this.errorQuestions);
        }
        if (flag) this.toAnswer(this.answerTestId);
        this.loading = false;
      } catch (err) {
        this.loading = false;
        // this._msg("网络异常");
        // console.log(err);
      }
    },
    // 获取错题锦集
    async getErrorQuestions() {
      try {
        const { data } = await getErrorQuestions({
          studentId: this.studentId,
        });
        // console.log(data);
        this.errorQuestions.topicList = data;
        this.errorQuestions.topicList.forEach((item) =>
          this.getFileInfo(item, null, this.errorQuestions.topicList.length)
        );
      } catch (err) {
        // console.log(err);
      }
    },
    beforeToAnswer(id) {
      const [data] = this.testList.filter(
        (item) => item.teacherPublishId === id
      );
      this.toAnswer(id);
      if (data.answerStatus) {
        this.data_triggerEvent("browse");
      } else {
        this.data_triggerEvent("toAnswer");
      }
    },
    // 前往答题卡
    toAnswer(id) {
      // 筛选出符合条件的数据
      const [data] = this.testList.filter(
        (item) => item.teacherPublishId === id
      );
      this.answerTestData = data;
      if (id === -2) {
        // if (!data.topicList.length) return this._msg("暂无错题");
        if (!data.topicList.length) return;
        this.topicList = data.topicList;
        this.answerTestId = id;
      } else {
        this.getTestInfo(id, this.answerTestData.answerStatus);
      }
    },
    // 获取试卷详情
    async getTestInfo(id, answerStatus) {
      try {
        this.loading = true;
        const { data } = await getTestInfo({
          studentId: this.studentId,
          publishId: this.answerTestData.teacherPublishId,
          answerStatus,
        });
        // console.log(data);
        if (data.examPaperScore >= 0) {
          this.topicList = data.list;
          this.answerTestData.examPaperScore = data.examPaperScore;
        } else {
          this.topicList = data;
        }
        // 获取腾讯云存储中的html

        this.topicList.forEach(async (item, index) => {
          await this.getFileInfo(item, id, this.topicList.length);
          if (index === this.topicList.length - 1) {
            this.loading = false;
          }
        });
      } catch (err) {
        this.loading = false;
        // this._msg("获取试卷失败");
        // console.log(err);
      }
    },
    // 获取题目
    async getFileInfo(data, id, length) {
      try {
        const tempTopic = data.topic;
        data.topic = "";
        data.topic = await cos.getFile({ type: 1, key: tempTopic });
        this.counter++;
        if (this.counter === length) {
          this.counter = 0;
          if (id !== this.answerTestId && id) {
            let timer = setTimeout(() => {
              this.answerTestId = id;
              this.loading = false;
              clearTimeout(timer);
            }, 100);
            // this.answerTestId = id;
          }
        }
      } catch (err) {
        this._msg("获取试卷失败");
        this.counter = 0;
        this.loading = false;
        // console.log(err);
      }
    },
    // 文件名处理
    getFileName(file) {
      return file.slice(file.lastIndexOf("/") + 1);
    },
    // 更新试卷信息
    updateInfo() {
      this.getTestList(true);
    },
  },

  created() {
    this.getTestList();
    this.getErrorQuestions();
  },
};
</script>

<style lang="less" scoped>
.right-content {
  flex: 1;
  height: 395px;
  background-color: #fff;
  border-radius: 16px;
  padding: 8px 0 20px 35px;
  display: flex;
  flex-direction: column;
  .content-box {
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
  }
}
</style>