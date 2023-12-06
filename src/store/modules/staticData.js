const state = {
    quantity: '',    // 小红花数量
    position: '',    // 职务
}


const mutations = {
    setQuantity(state, data) {
        state.quantity = data
    },
    setPosition(state, data) {
        state.position = data
    }
}

export default {
    state,
    mutations
}