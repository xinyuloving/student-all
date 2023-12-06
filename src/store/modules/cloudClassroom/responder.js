// 抢答
const responder = () => ({
    winnerInfo: {},
})

const state = responder();

const mutations = {
    resetState(state) {
        Object.assign(state, responder());
    },
    setState(state, data) {
        state[data.key] = data.value;
    },
    setWinnerInfo(state, data) {
        // state.winnerInfo = this.getters.studentList.find(item => item.id === data.id)
        state.winnerInfo = data;
    }
}

const actions = {
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}