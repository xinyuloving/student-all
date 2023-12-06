import { getStudentInfo, logout } from "@/api/user"
import { getSubject } from '@/api/school'
import { createStudentIM } from "@/utils/util";

const state = {
    isInitStudentSuccess: true, // 是否初始化学生信息成功
    userInfo: {
        // avatar: "avatar1",
        // realName: "张嘉译",
        // introduction: "张可爱的可爱",
        // rewardList: [
        //     {
        //         id: 1,
        //         rewardUrl: "1",
        //         content: "146"
        //     },
        //     {
        //         id: 2,
        //         rewardUrl: "2",
        //         content: "学习委员"
        //     },
        // ],
        // signature: "走别人的路，让别人无路可走让别人走...",
        // figure: "figure",
    },
    token: "",
    studentId: "",
    schoolCode: "",
    subjects: '',
    studentAccount: '',
    startUpTimeStamp: "", // 开机的时间戳 --> 数据上报中的登录成功到退出登录或关机的总时长
}

const mutations = {
    setState(state, data) {
        // 设置 state
        if (data.objKey) {
            state[data.objKey][data.key] = data.value;
        } else {
            state[data.key] = data.value;
        }
    },
    setToken(state, token) {
        // 设置 token
        state.token = token;
    },
    removeToken(state) {
        // 移除 token
        state.token = "";
        state.studentId = ''
    },
    setStudentInfo(state, data) {
        // 设置 userInfo
        // console.log(data);
        const { clazzInfo, student } = data;
        state.schoolCode = student.schoolCode;
        this.dispatch('carousel/getAnnouncement', student.schoolCode);
        const userInfo = {
            id: student.id,
            studentAccount: student.account,
            // im_id: Number(`1000${student.id}`),
            im_id: createStudentIM(student.id),
            avatar: student.gender ? "1" : "2",
            realName: student.name,
            nickName: student.nickName,
            introduction: "张可爱的可爱",
            gender: student.gender,  // 1 男，0 女
            rewardList: [
                {
                    id: 1,
                    rewardUrl: "1",
                    content: "146"
                },
                {
                    id: 2,
                    rewardUrl: "2",
                    content: "学习委员"
                },
            ],
            signature: student.personalSignature,
            figure: student.gender ? "1" : "2",
            clazz: {
                clazzCode: clazzInfo.code,
                clazzName: clazzInfo.clazzName
            },
            grade: {
                gradeCode: clazzInfo.gradeCode,
                gradeName: clazzInfo.gradeName
            },
            redFlowerNum: student.redFlowerNum
        }
        state.userInfo = userInfo;
        state.studentId = student.id;
        state.studentAccount = student.account
        // try {
        //     let str;
        //     const data = window.WebViewJavascript.getGroudID();
        //     if (typeof(data) === 'string') {
        //         str = data
        //     } else {
        //         str = JSON.stringify(data)
        //     }
        //     window.giveGroupInfoToJS(str)

        // } catch (error) {
        //     console.log(error);
        // }
    },

}

const actions = {
    getUserInfo({ commit, dispatch }) {
        // 发请求，拿到学生信息
        commit("setState", { key: "startUpTimeStamp", value: Date.now() })
        return new Promise(async (resolve) => {
            try {
                const { data } = await getStudentInfo();
                // console.log(data);
                commit('setStudentInfo', data);
                commit('setState', { key: "isInitStudentSuccess", value: true });
                resolve({ id: data.student.id, gender: data.student.gender.toString() });
                dispatch('getSubjects');
            } catch (error) {
                commit("setState", { key: "isInitStudentSuccess", value: false })
            }

        })
    },
    async SKIP_LOGIN({ commit }) {
        try {
            await logout();
        } finally {
            commit("removeToken");
            window?.WebViewJavascript?.exit();
        }
        // window?.WebViewJavascript?.login();
    },
    async getSubjects({ state, commit }) {
        try {
            const { data } = await getSubject({ schoolCode: state.schoolCode })
            commit('setState', { key: 'subjects', value: data })
        } catch (err) {
            // console.log(err);
        }
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}