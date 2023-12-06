import request from "../utils/request"

function getTimUserSig(data) {
    // 获取 腾讯即时通信 的 userSig
    return request({
        url: "/user/get_im_sig",
        method: 'get',
        params: data
    })
}

function getStudentInfo() {
    // 获取 学生信息
    return request({
        url: "/student/get_info",
        method: 'get'
    })
}


function modifyPersonalized(data) {
    // 修改 学生个性信息
    return request({
        url: "/student/modify_personalized_info",
        method: 'post',
        params: data
    })
}

function logout() {
    // 登出
    return request({
        url: "/user/login/logout",
        method: 'post',
    })
}

export {
    getTimUserSig,
    getStudentInfo,
    modifyPersonalized,
    logout
}