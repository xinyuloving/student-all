import request from '@/utils/request'

function getAnnouncement(data) {
    return request({
        method: 'post',
        url: '/school/get_school_banner',
        params: data
    })
}

export {
    getAnnouncement
}