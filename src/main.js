import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/style/main.css'
import { createDiscreteApi } from 'naive-ui'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./components/TiptapEditor.vue')
    }
  ]
})

// 创建全局消息API
const { message } = createDiscreteApi(['message'])
window.$message = message

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 挂载应用
app.mount('#app') 