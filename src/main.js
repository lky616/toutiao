import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import router from './router/index.js'
import '@/style/index.less'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
