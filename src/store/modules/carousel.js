
import { getAnnouncement } from '@/api/announcement'

export default {
    namespaced: true,
    state() {
        return {
            carouselShow: false,
            images: [],
            total: 0
        }
    },
    mutations: {
        closeCarousel(state) {
            state.carouselShow = false,
            state.images = []
        },
        setImgs(state, data) {
            state.total = data.length;
            if (data.length > 1) {
                const beforeImg = data[data.length - 1];
                const afterImg = data[0];
                data.unshift(beforeImg);
                data.push(afterImg);
            }
            state.images = data;
            state.carouselShow = true;
        }
    },
    actions: {
        async getAnnouncement({ commit }, code) {
            try {
                const { data } = await getAnnouncement({
                    schoolCode: code
                });
                const imgs = JSON.parse(data.images).filter(item => item);
                commit('setImgs', imgs)
            } catch(err) {
                // console.log(err);
            }
        }
    }
}