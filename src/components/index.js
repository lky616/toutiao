import MyBread from '@/components/my-bread'

// vue插件 暴露一个对象 对象中有一个选项 install 安装依赖
export default {
  install (Vue) {
    // 安装函数 当Vue.use(使用插件) install被调用
    // Vue 全局的vue对象   MyBread.name  是MyBread的name名
    Vue.component(MyBread.name, MyBread)
  }
}
