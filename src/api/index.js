import axios from 'axios'
import store from '@/store'
import router from '../router'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
/* axios.defaults.headers = {
  Authorization: `Bearer ${store.getUser().token}`
} */
// 在每次请求之前，获取token信息，追加在headers中
// 请求拦截器：在每次请求前 做某些事情
axios.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${store.getUser().token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
// 响应拦截器，在每次响应后做某些事情
axios.interceptors.response.use((res) => {
  return res
}, (err) => {
  // 获取响应状态码 err对象包含响应对象 相应对象中包含状态码
  if (err.response.status === 401) {
    // 跳转到登录页面 this.$router.push('/login')
    // 方式1：
    // $router.push('/login') 其实地址栏改成 #/login
    // location.hash = '#/login'
    // 方式2：
    // 此时没有vue实例，$router对象获取不到，通过router实例直接使用
    router.push('/login')
  }
  return Promise.reject(err)
})
export default axios
