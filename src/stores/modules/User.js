import { defineStore } from 'pinia' //创建store用的
import { ref } from 'vue' //创建响应式数据用的
import { userGetInfoService } from '@/api/user' //调用后端接口用的
// 用户模块仓库
export const useUserStore = defineStore(
  'big-user',
  () => {
    //这个big-user就是这个store的id，相当于仓库编号,pinia会用它来区分不同的store

    const token = ref('')
    const user = ref({})
    //实现了token的CRUD操作
    const setToken = (newToken) => {
      token.value = newToken
    }
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data
    }
    const setUser = (obj) => {
      user.value = obj
    }
    const removeToken = () => {
      token.value = ''
    }
    return {
      token,
      user,
      getUser,
      setToken,
      setUser,
      removeToken,
    }
  },
  {
    persist: true, //开启持久化，刷新页面后数据还能保留
  },
)
