import request from '@/utils/request'

function disbandGroup(data) {
    // 解散群
    return request({
        url: "/class_active/mession_end",
        method: "post",
        params: data
    })
}

export {
    disbandGroup
}