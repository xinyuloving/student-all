import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import imStore from './modules/imStore'
import cloudClassroom from "./modules/cloudClassroom"
import classInfo from "./modules/classInfo"
import staticData from './modules/staticData'
import classroomTest from './modules/classroomTest'
import carousel from './modules/carousel'
import reportedData from "./modules/reportedData" // 埋点数据

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    imStore,
    cloudClassroom,
    staticData,
    classInfo,
    classroomTest,
    carousel,
    reportedData
  },
  getters
})

export default store