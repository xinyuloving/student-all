import sendMessage from './sendMessage'
import store from '@/store'
import router from "@/router/index"
import { checkUserIMStatus } from './im'
import TIM from 'tim-js-sdk'

// store.state.imStore.heartbeatFailTimes

let timer1;
let timer2;
let timer3

function receptionHeartbeat(cb) {
    console.log("收到教师的心跳包");

    handleException();

    clearTimeout(timer1);
    clearTimeout(timer2);
    timer1 = setTimeout(() => {
        tearcherStopTheHeart(cb)
    }, 30000);
}

/**
 * 异常处理
 */
function handleException() {
    const { currentRoute } = router;
    if (currentRoute.fullPath !== "/cloudClassroom") {
        // 此时学生已经在群里但是并没有在云课堂
        // 发请求询问老师自己是否在学生列表中并且现在是否在上课
        sendMessage({
            mesType: 'in_cloudChassroom',
            content: 'QUERY_ME'
        })
    }
}

async function tearcherStopTheHeart(cb) {
    try {
        timer2 = setTimeout(() => {
            console.log("心跳检测失败 --> 开始退出云课堂!");
            resetAll();
            router.push({ name: "ClassReport" });
            cb && cb('退出云课堂');
            clearTimeout(timer1);
            clearTimeout(timer2);
        }, 9000);
        await sendMessage({
            mesType: 'in_cloudChassroom',
            content: 'Still_There'
        });
    } catch (err) {
        cb && cb(err)
        console.log("发送Still_There失败",err);
        // clearTimeout(timer2);
        const heartbeatFailTimes = store.state.imStore.heartbeatFailTimes;
        store.commit("imStore/setState", { key: "heartbeatFailTimes", value: heartbeatFailTimes + 1 })
        if (heartbeatFailTimes >= 2) {
            // timer2 = setTimeout(() => {
            //     resetAll();
            //     cb && cb('退出云课堂');
            //     clearTimeout(timer1);
            //     clearTimeout(timer2);
            // }, 9000);
            // 退出登录
            console.log("发送心跳包失败超过3次，即将退出登录！");
            store.commit("user/SKIP_LOGIN");
        } else {
            if (heartbeatFailTimes !== 0)
                tearcherStopTheHeart(cb);
        }
    }
}

function exitCloudClassromm(data) {
    if (data) {
        const { payload: { groupProfile: { groupID } } } = data;
        const currentGroupId = store.getters.groupId;
        if (currentGroupId !== groupID) return;
        clearTimeout(timer1);
        clearTimeout(timer2);
        resetAll()
    } else {
        clearTimeout(timer1);
        clearTimeout(timer2);
    }
}

function resetAll() {
    const groupId = store.getters.groupId;
    store.commit('imStore/setState', { key: 'ccl_1', value: false });
    store.commit('imStore/resetState');
    store.commit('cloudClassroom/resetAll');
    // if (!flag) {
    //     store.dispatch('imStore/disbandGroupChat', groupId)
    // }
}

function handleUserIMStatus(userIDList = [], cb, cb1) {
    // IM 状态相关的处理函数
    clearInterval(timer3)
  
    timer3 = setInterval(async () => {
      const [{ statusType }] = await checkUserIMStatus(userIDList)
  
      if (statusType === TIM.TYPES.USER_STATUS_OFFLINE) {
        // 离线
        cb && cb()
      }else if(statusType === TIM.TYPES.USER_STATUS_ONLINE){
        cb1 && cb1()
      }
    }, 10000)
  }

export {
    receptionHeartbeat,
    tearcherStopTheHeart,
    exitCloudClassromm,
    handleUserIMStatus
}