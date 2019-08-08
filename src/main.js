import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from './router/index.js'
import '@/style/index.less'
import 'element-ui/lib/theme-chalk/index.css'
import axios from '@/api'
import myCom from '@/components'
Vue.prototype.$https = axios
Vue.use(myCom)
Vue.use(ElementUI)
// 阻止启动生产消息
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
