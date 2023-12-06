/****
 * 
 * 随堂测试
 * 
 * *****/

const cExam = () => ({
    examName: "",
    publishId: "",
    type: 0, // 0 关闭；1 一键交卷；2 留为作业
})

export default {

    namespaced: true,

    state: {
        answerList: [],         // 答案列表
        cExam: cExam(),
    },

    mutations: {
        // 储存答案列表
        setAnswerList(state, data) {
            let num = state.answerList.findIndex(item => item.id === data.id);
            if (num !== -1) {
                state.answerList[num] = data
            } else {
                state.answerList.push(data)
            }
        },
        // 删除
        removeAnswer(state, data) {
            state.answerList = state.answerList.filter(item => item.id !== data);
        },
        setState(state, data) {
            state[data.key] = data.value;
        },
        resetCExam(state) {
            state.cExam = cExam();
        },
        setCExamState(state, data) {
            state.cExam[data.key] = data.value;
        },
        handleCExam(state, content) {
            const { publishList, examName } = content;
            const obj = { type: 0, examName };
            const gradeCode = this.getters.gradeCode;
            const classCode = this.getters.classCode;

            const t = publishList.find(item => (item.gradeCode === gradeCode) && (item.classCode === classCode));

            if (t) obj.publishId = t.publishId;

            state.cExam = obj;
        }
    },
}

