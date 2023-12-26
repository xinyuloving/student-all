import Vue from 'vue'
import App from './App.vue'
import "./assets/global.css"
import router from './router'
import store from './store'
import "./utils/im"
import Vue2TouchEvents from 'vue2-touch-events'
import msg from '@/components/mixins/msg'
import dataPoint from '@/components/mixins/dataPoint'
import VConsole from 'vconsole'

// if (process.env.npm_lifecycle_event.includes("build") && process.env.NODE_ENV !== "ningxia") {
  // const vConsole = new VConsole();
// }
// if (process.env.NODE_ENV !== "ningxia") {
  // const vConsole = new VConsole();
// }


Vue.mixin({ ...msg, ...dataPoint })

Vue.use(Vue2TouchEvents)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
