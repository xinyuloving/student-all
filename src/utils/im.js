import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import Vue from "vue";

let options = {
    // SDKAppID: process.env.NODE_ENV === "development" ? 1400658252 : process.env.NODE_ENV === "testing" ? 1400659921 : 1400556101,
    //SDKAppID: 1400556101//旧版本
    SDKAppID: 1400814823//个人注册
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options);
tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// 注册腾讯云即时通信 IM 上传插件
tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });

export default tim;


Vue.prototype.tim = tim;
Vue.prototype.TIM = TIM;
// 自定义消息码对应表（指令  --->   消息说明）
// 指令一：ccl
//  1) ccl_1   ------>    进入云课堂
//  2) ccl_2   ------>    举手回答问题
//  3) ccl_3  ------>    选择题答题器
//  4) ccl_1   ------>    判断题答题器
//  5) ccl_1   ------>    随机选人
//  6) ccl_1   ------>    课堂测试答题器
//  7) ccl_1   ------>    抢答模块
//  8) ccl_1   ------>    教学反馈