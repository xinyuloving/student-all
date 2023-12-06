import sendMessage from "@/utils/sendMessage";
import { report } from "@/utils/reportInJSFile"
let targetObj;
let isCorrect = "2"; // 1 --> 对， 2 --> 错
// let isAnswer = true;
const judge = () => ({
    options: [
        {
            id: 1,
            state: 0,
            icon: "icon-duihao1",
        },
        {
            id: 2,
            state: 0,
            icon: "icon-cuo",
        },
    ],
    submitState: 0, // 控制是否提交
    submitActive: 0, // 控制提交按钮提交与否的样式：0表示未提交，1表示提交 2表示提交时间已到
    buttonDis: false, // 控制提交按钮的消失与选项盒子的移动
    mySelect: "",  // 学生的选项  -->  id
    teacherIMId: "",
})

const state = judge();

const mutations = {
    resetState(state) {
        Object.assign(state, judge());
        targetObj = undefined;
        isCorrect = "2";
        // isAnswer = true;
    },
    setState(state, data) {
        state[data.key] = data.value;
    },
    handleClick(state, target) {
        if (state.submitState === 0) {
            if (state.submitActive !== 1) {
                state.submitActive = 1;
            }
            if (targetObj && targetObj.id === target.id) {
                return;
            }
            if (targetObj) {
                targetObj.state = 0;
            }
            target.state = 1;
            targetObj = target;
        }
    },
    handleCorrectAnswer(state, data) {
        // 设置正确答案
        if (state.submitState === 0) {
            // isAnswer = false;
            state.submitState = 2;
            if (state.submitActive === 1) {
                state.submitActive = 0;
            }
        }

        // const o = state.options.find(item => item.id === data.correctId); // 正确的选项
        // o.state = 2;
        // const e = state.options.find(item => item.state === 1); // 选择的选项
        // if (e) {
        //     e.state = 3;
        // }

        const correctOption = state.options.find(item => item.id === data.correctId); // 正确的选项
        const selectOption = state.options.find(item => item.state === 1); // 选择的选项
        if (selectOption) {
            if (correctOption.id === selectOption.id) {
                isCorrect = "1";
            } else {
                selectOption.state = 3;
            }
        }
        correctOption.state = 2;
    }
}

const actions = {
    submit({ state, commit, rootGetters }, param) {
        // 提交答案：提交答案之前需要先判断是否选择了选项
        // 如果 submitState 为 0 点击才有效
        if (state.submitState === 0) {
            if (targetObj) {
                // console.log(targetObj);
                commit('setState', { key: "submitActive", value: 0 });
                commit('setState', { key: "submitState", value: 1 });
                commit('setState', { key: "mySelect", value: targetObj.id });

                const dataObj = {
                    studentId: rootGetters.studentId,
                    optionId: targetObj.id
                };

                const data = {
                    to: state.teacherIMId,
                    type: 2,
                    content: "ccl_4",
                    extension: JSON.stringify(dataObj),
                }

                sendMessage(data).then(res => {
                    // console.log(res);
                    param.buriedPointCb && param.buriedPointCb();
                })

                // 按钮消失
                setTimeout(() => {
                    // state.buttonDis = true;
                    commit('setState', { key: "buttonDis", value: true });
                }, 500);
            } else {
                // 没有选择
                // console.log("没有选择！");
            }
        }
    },
    setCorrectAnswer({ state, rootState, commit, rootGetters }, data) {
        // 设置正确答案
        commit("handleCorrectAnswer", data);
        // console.log(isCorrect);
        if (isCorrect === "1") {
            this.commit("reportedData/interactionStateAc", { objKey: "judge", key: "correctTimes" })
        }
        // 埋点 -->  {type: 1, isSuccess: ""}

        report({ logValue: rootGetters.studentId, extraInfo: { type: "1", isSuccess: state.submitState === 2 ? null : isCorrect, subjectName: rootState.cloudClassroom.currentSubject } });
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}