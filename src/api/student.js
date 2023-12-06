import request from "@/utils/request";

function getStudent(data) {
    // 获取 学生列表
    return request({
        url: "/student/get_list_by_rule",
        method: 'post',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' },
    })
}

function getAssignment(data) {
    return request({
        url: '/student/get_assignment',
        method: 'post',
        data
    })
}

export {
    getStudent,
    getAssignment
}