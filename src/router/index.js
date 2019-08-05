import VueRouter from 'vue-router'
import Vue from 'vue'
import Login from '@/views/login'
import Home from '@/views/home'
import Welcome from '@/views/welcome'
import NotFound from '@/views/404'
import Article from '@/views/article'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/login', name: 'login', component: Login
    },
    {
      path: '/',
      // name: 'home',
      component: Home,
      children: [
        {
          path: '/',
          name: 'welcome',
          component: Welcome
        },
        {
          path: '/article',
          name: 'article',
          component: Article
        }
      ]
    },
    { path: '*', name: '404', component: NotFound }
  ]
})
export default router
