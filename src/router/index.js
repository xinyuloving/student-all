import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/home/Home.vue"
import PersonalCenter from "../views/home/pensonalCenter/PersonalCenter.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'HomeIndex',
        component: () => import('../views/home/index.vue'),
      },
      {
        path: 'PersonalCenter',
        // name: "PersonalCenter",
        component: PersonalCenter,
      },
      {
        path: '/movieWorld',
        name: 'movieWorld',
        component: () => import('../views/movieWorld/index.vue')
      },
      {
        path: '/studyAide',
        name: 'StudyAide',
        component: () => import('../views/studyAide')
      },
      {
        path: '/classroomTest',
        name: 'ClassroomTest',
        component: () => import('../views/classroomTest')
      },
      {
        path: '/myAssignment',
        name: 'MyAssignment',
        component: () => import('../views/myAssignment')
      },
      {
        path: '/notification',
        name: 'Notification',
        component: () => import('../views/notification')
      }
    ]
  },
  {
    path: '/cloudClassroom',
    name: 'CloudClassroom',
    component: () => import('../views/cloudClassroom/Index.vue'),
  },
  {
    path: '/classReport',
    name: 'ClassReport',
    component: () => import('../views/classReport')
  },
]

const router = new VueRouter({
  routes
})

export default router
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }
