import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import '@/assets/main.scss'
import pinia from '@/stores/index'

const app = createApp(App)

app.use(pinia)
app.use(router) // Vue把路由对象注入每一个组件，可以通过$router访问
app.mount('#app')
