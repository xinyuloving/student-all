// js 文件中的数据上报

import store from "../store";
import { data_uploadData } from "../components/mixins/dataPoint"

/**
 * 
 * @param {object} data 需要上报的数据包
 * @param {boolean} nowReport 是否立刻上报数据，默认false
 */
export function report(data = {}, nowReport = false) {
    const dataPacket = {
        appId: 1,
        userId: store.state.user.userInfo.studentAccount,
        gradeName: store.state.user.userInfo.grade.gradeName,
        className: store.state.user.userInfo.clazz.clazzName,
        platformId: 2,
        pageId: "cloudClassroom",
        eventId: "answerTheQuestions",
        // logValue: store.getters.studentId, // 学生id
        // extraInfo: {},
        logTime: Date.now(),
        ...data,
    }
    if (nowReport) {
        data_uploadData(dataPacket);
    } else {
        store.commit("reportedData/setDataList", dataPacket);
    }
}