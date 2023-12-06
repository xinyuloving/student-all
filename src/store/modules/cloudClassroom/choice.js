import sendMessage from "@/utils/sendMessage";
import { report } from "@/utils/reportInJSFile"
let prevObj;  // 上一个选中的选项
let isCorrect = "2"; // 该题是否选择正确
// let isAnswer = true; // 该题是否作答
const choice = () => ({
    options: [],
    singleOrMult: false,  // false 表示单选，true 表示多选
    submitState: 0, // 控制是否提交(在点击提交按钮后改变该状态 0表示未提交。1表示提交。2表示超时)
    submitActive: 0, // 控制提交按钮提交与否的样式：0表示未提交，1表示提交 2表示提交时间已到(在点击每个选项之后，改变该状态)
    buttonDis: false, // 控制提交按钮的消失与选项盒子的移动（在点击提交按钮之后过500ms改变该状态）
    mySelect: "", // 学生选择的选项
    teacherIMId: "",
});
const state = choice();

const mutations = {
    resetState(state) {
        prevObj = undefined;
        isCorrect = "2";
        // isAnswer = true;
        Object.assign(state, choice());
    },
    setState(state, data) {
        state[data.key] = data.value;
    },
    choiceOptionTouch(state, target) {
        // 选项的点击处理函数
        if (state.submitState === 0) {
            if (target) {
                state.submitActive = 1;
            }
            if (state.singleOrMult) {
                // 多选
                target.state ? (target.state = 0) : (target.state = 1);
            } else {
                // 单选
                if (prevObj && prevObj.content === target.content) {
                    // 点击相同的选项
                    return;
                }
                if (prevObj) {
                    // 如果 prevObj（表示上一个选中的选项） 存在的话先将其置0
                    prevObj.state = 0;
                }
                target.state = 1;
                prevObj = target;
            }
        }
    },
    setChoiceOptions(state, data) {
        // 设置选项
        // t 的 第一个参数为 选项的长度，即有几个选项，第二个为字符串 true 或 false，false 表示单选， true 表示多选
        const { from, payload: { extension } } = data;
        state.teacherIMId = from;

        const t = JSON.parse(extension);
        console.log(t);
        const options = [
            {
                content: "A",
                state: 0, // 表示选择的状态：0表示没有选择，1表示选择，2表示正确，3表示错误
            },
            {
                content: "B",
                state: 0,
            },
            {
                content: "C",
                state: 0,
            },
            {
                content: "D",
                state: 0,
            },
            {
                content: "E",
                state: 0,
            },
            {
                content: "F",
                state: 0,
            },
            {
                content: "G",
                state: 0,
            },
            {
                content: "H",
                state: 0,
            },
        ]
        state.options = options.slice(0, Number(t.optionsNum));
        state.singleOrMult = t.singleOrMult;
    },
    handleChoiceCorrectOption(state, data) {
        // 设置选择题正确的选项
        const { payload: { extension } } = data;
        const { correctAnswer } = JSON.parse(extension);
        // console.log("correctAnswer", correctAnswer);


        if (state.submitState === 0) {
            // isAnswer = false;
            state.submitState = 2;
            if (state.submitActive === 1) {
                state.submitActive = 0;
            }
        }

        if (state.singleOrMult) {
            // 多选  -->  correctAnswer 为数组

            const selectOptions = JSON.parse(JSON.stringify(state.options.filter(option => option.state === 1))); // 选择的所有选项


            for (let i = 0; i < correctAnswer.length; i++) {
                const e = correctAnswer[i];
                const o = state.options.find(item => item.content === e);
                o.state = 2;  // 设置正确选项
            }
            for (let i = 0; i < state.options.length; i++) {
                const e = state.options[i];
                if (e.state === 1) {
                    e.state = 3;
                }
            }


            // console.log("selectOptions", selectOptions);
            if (selectOptions.length !== correctAnswer.length) {
                return;
            } else {
                for (let i = 0; i < correctAnswer.length; i++) {
                    const e = correctAnswer[i];
                    if (selectOptions.findIndex(item => item.content === e) === -1) {
                        isCorrect = "2";
                        break;
                    } else {
                        isCorrect = "1";
                    }
                }
            }


        } else {
            // 单选  -->  correctAnswer 为字符串
            // 先找到学生选择的选项，然后和正确选项进行判断

            // const o = state.options.find(item => item.content === correctAnswer);
            // o.state = 2;  // 设置正确答案
            // const e = state.options.find(item => item.state === 1);
            // if (e) {
            //     e.state = 3;
            // }

            const correctOption = state.options.find(item => item.content === correctAnswer); // 正确的选项
            const selectOption = state.options.find(item => item.state === 1); // 选择的选项
            if (selectOption) {
                if (correctOption.content === selectOption.content) {
                    isCorrect = "1";
                } else {
                    selectOption.state = 3;
                }
            }
            correctOption.state = 2; // 设置正确答案
        }

    }
}

const actions = {
    choiceSubmit({ state, commit, rootGetters }, param) {
        // 选择题的提交事件
        // 提交答案：提交答案之前需要先判断是否选择了选项
        if (state.submitState === 0) {
            // 如果.submitState 为 0 点击才有效
            const dataObj = {
                studentId: rootGetters.studentId,
            };
            let target, timer;
            if (state.singleOrMult) {
                // 多选
                const targetArr = state.options.filter(
                    (item) => item.state === 1
                );
                if (targetArr.length) {
                    state.submitActive = 0;
                    state.submitState = 1;
                    target = targetArr.map((item) => item.content);
                    // 按钮消失
                    timer = setTimeout(() => {
                        state.buttonDis = true;
                        clearTimeout(timer);
                    }, 500);
                } else {
                    return;
                }
            } else {
                // 单选
                if (prevObj) {
                    // console.log(prevObj);
                    state.submitActive = 0;
                    state.submitState = 1;
                    target = prevObj.content;
                    // 按钮消失
                    timer = setTimeout(() => {
                        state.buttonDis = true;
                        clearTimeout(timer);
                    }, 500);
                } else {
                    // 没有选择
                    // console.log("没有选择！");
                    return;
                }
            }
            prevObj = undefined;
            commit('setState', { key: "mySelect", value: target });
            dataObj.target = target;
            const data = {
                to: state.teacherIMId,
                type: 2,
                content: "ccl_3",
                extension: JSON.stringify(dataObj),
            };
            sendMessage(data).then((res) => {
                // console.log("发送成功", res);
                // 埋点
                param.buriedPointCb && param.buriedPointCb();
            }).catch(err => {
                // console.log(err);
            })
        }
    },
    setChoiceCorrectOption({ state, rootState, commit, rootGetters }, data) {
        // console.log(rootState);
        commit("handleChoiceCorrectOption", data);
        // console.log(isCorrect);
        if (isCorrect === "1") {
            this.commit("reportedData/interactionStateAc", { objKey: "choice", key: "correctTimes" })
        }
        // 埋点 -->  {type: 2, isSuccess: ""}  // 根据 isAnswer 判断是否作答
        report({ logValue: rootGetters.studentId, extraInfo: { type: "2", isSuccess: state.submitState === 2 ? null : isCorrect, subjectName: rootState.cloudClassroom.currentSubject } });
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}