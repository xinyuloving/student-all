import request from '@/utils/request'

function getBlogList(data) {
    return request({
        url: '/school_blog/query_blog',
        method: 'post',
        params: data
    })
}

export {
    getBlogList
}