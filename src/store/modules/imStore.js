import { disbandGroup } from '@/api/im'
import { receptionHeartbeat, exitCloudClassromm } from '@/utils/heartbeat'
import router from "@/router"
import { data_batchUpload } from "@/components/mixins/dataPoint"


const imStore = () => ({
    IMSdkState: false,  // IMSdk 状态，为 true 表示加载完成，可以收发信息
    groupId: "",
    ccl_1: false,  // 进入云课堂的消息
    netWorkInfo: '',
    loginInfo: '',
    teacherIM: '',
    heartbeatFailTimes: 0, // 发送心跳包的失败次数
})

// const state = {
//     IMSdkState: "",  // IMSdk 状态，为 true 表示加载完成，可以收发信息
//     groupId: "",
//     // message: {
//     //     // 定义了消息之后，在此进行初始化，否则无法监听
// 有关云课堂的消息以ccl为前缀标识
//  ------------------>   教师向学生发的消息
//     //     ccl: {
//     //         ccl_1: false,  // 进入云课堂
//     //         ccl_2: false,  // 定时器
//     //         ccl_3: false,  // 选择题答题器
//     //         ccl_4: false,  // 判断题答题器
//     //         ccl_5: false,  // 随机选人
//     //         ccl_6: false,  // 课堂测试答题器
//     //         ccl_7: false,  // 抢答模块
//     //         ccl_8: false,  // 教学反馈
//     //         ccl_9: false,  // 结束上课，退出云课堂
//     //         ccl_10: false,  // 奖励小红花
//     //         ccl_11: false,  // 举手
//     //         ccl_12: false,  // 内容分发
//     //     }
//     // },
// }
// ---------------------->   学生向老师发的消息
// ccl_3 --> 选择题反馈
// ccl_4 --> 判断题反馈
// ccl_7 --> 抢答题反馈
// ccl_8 --> 教学反馈
// ccl_11 --> 举手反馈

const state = imStore();


const mutations = {
    resetState(state) {
        // Object.assign(state, imStore);
        // state.groupId = "";
        state.netWorkInfo = '';
        state.loginInfo = ''
    },
    setState(state, data) {
        state[data.key] = data.value;
    },

    setOfflineMessage(state, e) {
        // 监听并设置离线消息
    },
}

const actions = {
    setMessage({ commit, rootState }, e) {
        // 设置 消息列表
        // 事件派发
        const { payload: { extension: ext, description } } = e;
        const extension = JSON.parse(ext); // 扩展字段
        console.log("收到老师发来的消息 --> ", extension);
        switch (description) {
            case 'ccl_1': {
                // 进入/结束 云课堂 做的事
                switch (extension.flag) {
                    case 0: {
                        const { personal,
                            wholeClass,
                            answer } = rootState.reportedData.reward;
                        this.commit("user/setState", { objKey: "userInfo", key: "redFlowerNum", value: rootState.user.userInfo.redFlowerNum + personal + wholeClass + answer });
                        // 结束上课的时候老师会把全班平均正确率传过来
                        this.commit("reportedData/setState", { objKey: "correctRate", key: "classAverageRate", value: extension.correctRate });
                        this.commit('imStore/setState', { key: 'ccl_1', value: false });
                        this.commit('imStore/resetState');
                        this.commit('cloudClassroom/resetAll');
                        exitCloudClassromm();
                        router.push({ name: "ClassReport" })
                        data_batchUpload(); // 数据上报
                        break;
                    }
                    case 1:
                        // 进入云课堂时先清空数据
                        this.commit("reportedData/resetState");
                        // --------
                        receptionHeartbeat();
                        this.commit('imStore/setState', { key: 'ccl_1', value: true });
                        this.commit("cloudClassroom/setState", { key: "currentSubject", value: extension.subjectName })
                        this.commit('imStore/setState', { key: "groupId", value: extension.groupId });
                        this.commit('carousel/closeCarousel');
                        router.push({ name: "CloudClassroom" })
                        break;
                    default:
                        break;
                }
                break;
            }
            case 'ccl_2': {
                // 进入 定时器 做的事
                switch (extension.flag) {
                    case 0:
                        this.commit('cloudClassroom/setState', { key: "time", value: [] }); // 关闭
                        break;
                    case 1:
                        this.commit('cloudClassroom/setState', { key: "time", value: extension.content });
                        break;
                    default:
                        break;
                }
                break;
            }
            case 'ccl_3': {
                // 选择题 要做的事
                const objKey = "visibleGroup";
                switch (extension.flag) {
                    case 0:
                        this.commit("cloudClassroom/setState", { objKey, key: "choice", value: false }); // 关闭
                        this.commit('cloudClassroom/choice/resetState'); // 重置
                        break;
                    case 1: {
                        this.commit("cloudClassroom/setState", { objKey, key: "choice", value: true });
                        this.commit('cloudClassroom/choice/setChoiceOptions', e);
                        // 埋点
                        this.commit("reportedData/interactionStateAc", { objKey: "choice", key: "numOfInitiate" });
                        break;
                    }
                    case 2:
                        // 设置正确答案
                        this.dispatch('cloudClassroom/choice/setChoiceCorrectOption', e)
                        break;
                    default:
                        break;
                }
                break;
            }
            case 'ccl_4': {
                // 判断题 要做的事
                const objKey = "visibleGroup";
                // extension.flag // 1 表示开启，0 表示关闭, 2 表示设置正确答案
                switch (extension.flag) {
                    case 0:
                        this.commit("cloudClassroom/setState", { objKey, key: "judge", value: false });
                        this.commit('cloudClassroom/judge/resetState'); // 重置
                        break;
                    case 1: {
                        const { from } = e;
                        this.commit("cloudClassroom/setState", { objKey, key: "judge", value: true });
                        this.commit("cloudClassroom/judge/setState", { key: "teacherIMId", value: from });
                        // 埋点
                        this.commit("reportedData/interactionStateAc", { objKey: "judge", key: "numOfInitiate" });
                        break;
                    }
                    case 2:
                        // this.commit('cloudClassroom/judge/setCorrectAnswer', extension);
                        this.dispatch('cloudClassroom/judge/setCorrectAnswer', extension);

                        break;
                    default:
                        break;
                }
                break;
            }
            case 'ccl_5': {
                // 随机选人 要做的事
                const objKey = "visibleGroup";
                switch (extension.flag) {
                    case 0:
                        this.commit("cloudClassroom/setState", { objKey, key: "randomSelection", value: false });
                        this.commit('cloudClassroom/random/resetState'); // 重置
                        break;
                    case 1:
                        this.commit("cloudClassroom/setState", { objKey, key: "randomSelection", value: true });
                        this.commit("cloudClassroom/random/setOptions", extension);
                        break;
                    default:
                        break;
                }
                break;
            }
            case 'ccl_6': {
                // 随堂测试 做的事
                const { content, flag } = extension;
                const objKey = "visibleGroup";

                switch (flag) {
                    case 0: {
                        this.commit('classroomTest/setCExamState', { key: "type", value: content.type }); // 重置
                        break;
                    }
                    case 1: {
                        this.commit("classroomTest/handleCExam", content)
                        this.commit("cloudClassroom/setState", { objKey, key: "classTest", value: true });
                        // this.dispatch("classroomTest/getExamInfo", extension)
                        // 埋点
                        this.commit("reportedData/interactionStateAc", "classTest");
                        break;

                    }
                }
                break;
            }
            case 'ccl_7': {
                // 抢答 要做的事
                const objKey = "visibleGroup";
                switch (extension.flag) {
                    case 0:
                        this.commit("cloudClassroom/setState", { objKey, key: "rushToAnswer", value: false });
                        this.commit('cloudClassroom/responder/resetState'); // 重置
                        break;
                    case 1:
                        this.commit("cloudClassroom/setState", { objKey, key: "rushToAnswer", value: true });
                        // 埋点
                        this.commit("reportedData/interactionStateAc", "rushToAnswer");
                        break;
                    case 2:
                        this.commit("cloudClassroom/responder/setWinnerInfo", extension);
                        break;
                    default:
                        break;
                }
                break;
            }
            case 'ccl_8': {
                // 教学反馈
                const objKey = "visibleGroup";
                switch (extension.flag) {
                    case 0:
                        this.commit("cloudClassroom/setState", { objKey, key: "teachimgFeedback", value: false });
                        // this.commit('cloudClassroom/responder/resetState'); // 重置
                        break;
                    case 1:
                        this.commit("cloudClassroom/setState", { objKey, key: "teachimgFeedback", value: true });
                        break;
                    default:
                        break;
                }
                break;
            }
            case 'ccl_10': {
                // 奖励小红花 做的事
                this.dispatch("reportedData/handleReward", extension);
                break;
            }
            case 'ccl_12': {
                // 内容分发 做的事
                const objKey = "visibleGroup";
                switch (extension.flag) {
                    case 0:
                        this.commit("cloudClassroom/setState", { objKey, key: "distribute", value: false });
                        this.commit('cloudClassroom/setState', { key: "distributeCon", value: {} }); // 重置
                        break;
                    case 1:
                        this.commit("cloudClassroom/setState", { objKey, key: "distribute", value: true });
                        this.dispatch("cloudClassroom/handleDistribute", extension)
                        break;
                }
                break;
            }
            case 'Having_Class': {
                // 正在上课
                const { currentRoute } = router;
                if (currentRoute.fullPath !== "/cloudClassroom") {
                    router.push({ name: "CloudClassroom" })
                }
                break;
            }
            default: {
                break;
            }
        }

        // this.commit('imStore/setCloudclassroomTrue', e);
        // if (e.description === 'ccl_9') {
        // 结束上课的时候，应当将所有的 字段进行初始化
        //     state.message.cloudClassroom.ccl_1 = false;
        // }
    },
    async disbandGroupChat({ commit }, groupId) {
        // 解散群组
        try {
            await disbandGroup({ groupId })
        } catch (err) {
            // console.log(err);
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}