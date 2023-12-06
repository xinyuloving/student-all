import request from '@/utils/request'

// 获取课件列表
function getCoursewareList(data) {
    return request({
        method: 'get',
        url: '/learning_assistant/list',
        params: data
    })
}

// 科目列表
function getSubjectList(data) {
    return request({
        method: 'get',
        url: '/learning_assistant/list_subject',
        params: data
    })
}


export {
    getCoursewareList,
    getSubjectList
}