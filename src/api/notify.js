import request from '@/utils/request'

function getNotifyList(data) {
    return request({
        method: 'post',
        url: '/school/query_school_notice_by_clazz',
        params: data
    })
}

export {
    getNotifyList
}