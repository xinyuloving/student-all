// import { repaintArray } from "@/utils/util";
// 随机选人
const random = () => ({
    options: [],
    winnerInfo: {},
    // id: ""
})

const state = random();

const mutations = {
    resetState(state) {
        Object.assign(state, random());
    },
    setState(state, data) {
        state[data.key] = data.value;
    },
    setOptions(state, data) {
        // state.id = data.id;
        const { resultOptions, winnerInfo } = data;
        // console.log(this.getters.studentList);
        // const id = data.id;
        // const temObj = repaintArray(this.getters.studentList, 'id', id)
        state.options = resultOptions;
        state.winnerInfo = winnerInfo;
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