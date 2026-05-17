import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
})
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err),
)
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 兼容 code 和 status 两种字段
    if (res.data.code === 0 || res.data.status === 0) {
      return res.data
    }
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错误
    // 错误特殊情况
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 错误默认情况=>只要给提示
    ElMessage.error(err.response?.data?.message || '服务异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
