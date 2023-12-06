import request from "@/utils/request";

function getCourseByClass(data) {
    // 查询班级课表
    return request({
        url: "/course_schedule/class/info",
        method: 'get',
        params: data,
    })
}

function getScheduleTime(data) {
    // 查询班级课表时间
    return request({
        url: "/course_schedule/getTime",
        method: 'get',
        params: data,
    })
}


// 获取学校的科目
function getSubject(data) {
    return request({
        method: 'post',
        url: '/school/get_subject_list_by_school',
        params: data
    })
}

export {
    getCourseByClass,
    getSubject,
    getScheduleTime
}