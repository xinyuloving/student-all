/*****
 * 
 * 随堂测试
 * 
 * *******/

import request from '@/utils/request'

// 获取随堂测试试卷列表
function getTestList(data) {
    return request({
        method: 'get',
        url: '/in_class_test/stu/list',
        params: data
    })
}

// 获取随堂测试试卷详情
function getTestInfo(data) {
    return request({
        method: 'get',
        url: '/in_class_test/exam_paper_info',
        params: data
    })
}

// 提交试卷
function submitTest(data) {
    return request({
        method: 'post',
        url: '/in_class_test/stu/answer',
        data,
        headers: { 'Content-Type': 'application/json;charset=utf8' }
    })
}

// 获取错题锦集  
function getErrorQuestions(data) {
    return request({
        method: 'get',
        url: '/in_class_test/stu/error_questions',
        params: data
    })
}

// 导出方法
export {
    getTestList,
    getTestInfo,
    submitTest,
    getErrorQuestions
}