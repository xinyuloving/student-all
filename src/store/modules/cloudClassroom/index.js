import choice from "./choice"
import judge from "./judge"
import random from "./random";
import responder from "./responder";
import { judgeFileSuffix } from "@/utils/util";
import cos from "@/utils/cos";


const cloudClassroom = () => ({
    type: "ccl_1", // 进入云课堂的默认页面
    //     ccl_2: false,  // 定时器
    //     ccl_3: false,  // 选择题答题器
    //     ccl_4: false,  // 判断题答题器
    //     ccl_5: false,  // 随机选人
    //     ccl_6: false,  // 课堂测试答题器
    //     ccl_7: false,  // 抢答模块
    //     ccl_8: false,  // 教学反馈
    //     ccl_9: false,  // 结束上课，退出云课堂
    //     ccl_10: false,  // 奖励小红花
    visibleGroup: {
        choice: false,
        judge: false,
        randomSelection: false,
        classTest: false,
        rushToAnswer: false,
        teachimgFeedback: false,
        distribute: false,
    },
    reward: false, // 开启小红花
    // flowerNum: 0,
    time: [],  // 定时器老师设置的时间
    studentList: [], // 学生列表
    distributeCon: {}, // 内容分发，老师传过来的数据
    currentSubject: "", // 当前的上课科目
})

const state = cloudClassroom();

const mutations = {
    resetState(state) {
        Object.assign(state, cloudClassroom());
    },
    setState(state, data) {
        if (data.objKey) {
            state[data.objKey][data.key] = data.value;
        } else {
            state[data.key] = data.value;
        }
    },
    setDistributeCon(state, data) {
        state.distributeCon[data.key] = data.value;
    },
    // handleReward(state, data) {
    //     // 接收到奖励学生的消息后的处理函数
    //     const studentList = data.studentList;
    //     if (studentList === "all") {
    //         state.flowerNum++;
    //         state.reward = true;
    //     } else {
    //         const studentId = this.getters.studentId;
    //         if (studentList.includes(studentId)) {
    //             state.flowerNum++;
    //             state.reward = true;
    //         }
    //     }
    // },
    resetAll() {
        this.commit('cloudClassroom/resetState');
        this.commit('cloudClassroom/choice/resetState');
        this.commit('cloudClassroom/judge/resetState');
        this.commit('cloudClassroom/random/resetState');
        this.commit('cloudClassroom/responder/resetState');
    }
}

const actions = {
    // rewardAction({ state, commit }) {
    //     const num = state.flowerNum + 1;

    //     if (state.reward) {
    //         commit("setState", { key: "reward", value: false });
    //         const timer = setTimeout(() => {
    //             commit("setState", { key: "reward", value: true });
    //             commit("setState", { key: "flowerNum", value: num });
    //             clearTimeout(timer);
    //         })
    //     } else {
    //         // state.reward = true;
    //         commit("setState", { key: "reward", value: true });
    //         commit("setState", { key: "flowerNum", value: num });
    //     }
    // }
    async handleDistribute({ commit }, params) {
        // console.log(params);
        const { content } = params;
        const type = judgeFileSuffix(params.content.suffix);
        params.type = type;
        if (content.fileUrl) {
            params.fileUrl = content.fileUrl;
            delete params.content.fileUrl;
            commit("setState", { key: "distributeCon", value: params });
        } else {
            params.fileUrl = "";
            commit("setState", { key: "distributeCon", value: params });
            let url;
            if (type === 3) {
                const data = await cos.previewTheDocument({ key: params.content.name, type: 0 });
                url = data;
            } else {
                const { Url } = await cos.getObjectUrl({ type: 0, key: params.content.name });
                url = Url;
                // console.log(Url);
            }
            commit("setDistributeCon", { key: "fileUrl", value: url });
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    modules: {
        choice,
        judge,
        random,
        responder,
    }
}