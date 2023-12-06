import axios from 'axios'
import store from '@/store'
import msg from "@/components/mixins/msg"

// 创建一个 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['token'] = `Bearer ${store.getters.token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {

        const { data } = response;

        // 约定的 token 失效返回码约定 10002（token 失效，token 被顶下线等）


        const interceptCode = [10002, 10005, 10006, 10007, 10008, 10009]; // 需要拦截下来的 code
        if (interceptCode.includes(data.code)) {
            // 身份失效所做的事
            // 清除token

            msg.methods._msg("您的登录状态已失效，即将跳转登录页！");
            window.logoutTimer = setTimeout(() => {
                clearTimeout(window.logoutTimer);
                store.dispatch('user/SKIP_LOGIN');
            }, 3000)


            // MessageBox.alert(data.msg, '提示', {
            //     confirmButtonText: '确定',
            //     type: 'error',
            //     callback: () => {
            //         removeToken();
            //         location.reload();
            //     }
            // });
        } else {
            return data;
        }


    },
    error => {
        return Promise.reject(error);
    }
)

export default service
