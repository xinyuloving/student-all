// 埋点所需的数据
import { report } from "@/utils/reportInJSFile"

const reportedData = () => ({
    reward: {
        personal: 0, // 教师端点击单个头像的奖励
        wholeClass: 0, // 教师端点击奖励全部的奖励
        answer: 0, // 教师端在选择题/判断题答题正确奖励的花
    },
    interaction: {
        // 课堂互动：除举手外其他的均为老师工具发过来的次数
        raiseHand: 0,
        choice: {
            numOfInitiate: 0, // 教师发起次数，互动次数
            correctTimes: 0, // 正确次数
        },
        judge: {
            numOfInitiate: 0, // 教师发起次数
            correctTimes: 0, // 正确次数
        },
        // choice: [], // {isSuccess: Boolean, }
        // judge: [],
        rushToAnswer: 0,
        classTest: 0,
    },
    correctRate: {
        classAverageRate: 0
    },
    dataList: [],  // 埋点数据暂存
})


const state = reportedData();


const mutations = {
    setState(state, data) {
        if (data.objKey) {
            state[data.objKey][data.key] = data.value;
        } else {
            state[data.key] = data.value;
        }
    },
    setDataList(state, data) {
        if (data) {
            state.dataList.push(data)
        } else {
            state.dataList = []
        }
    },
    resetState(state) {
        // state = reportedData(); // 重置
        Object.assign(state, reportedData());
    },
    // setRewardState(state, data) {
    //     state.reward[data.key] = data.value;
    // },
    rewardAC(state, data) {
        state.reward[data]++;
    },
    interactionStateAc(state, data) {
        if (typeof data === "string") {
            state.interaction[data]++;
        } else if (typeof data === "object") {
            // objKey --> 外层对象的键名；key --> 对象属性的键名
            const { objKey, key } = data;
            state.interaction[objKey][key]++;
        }
    },
    // setCorrectRateState(state, data) {
    //     state.correctRate[data.key] = data.value;
    // },
}

const actions = {
    handleReward({ state, commit }, data) {
        // 接收到奖励学生的消息后的处理函数
        // type 表示奖励的类型，1 为个人奖励；2 为答题奖励
        const params = {
            eventId: "redFlower",
            logValue: "2",
        };
        const { studentList = [], type } = data;
        if (type === 0) {
            // 奖励全部
            commit("rewardAC", "wholeClass");
        } else {
            // 个人奖励 或 答题奖励
            const studentId = this.getters.studentId;
            if (studentList.includes(studentId)) {
                // 该学生在奖励列表中
                if (type === 1) {
                    commit("rewardAC", "personal");
                } else {
                    params.logValue = "1";
                    commit("rewardAC", "answer");
                }
            } else {
                return;
            }
        }
        this.commit("cloudClassroom/setState", { key: "reward", value: true });
        // 埋点
        report(params, true);
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}