import { defineStore } from 'pinia' //创建store用的
import { ref } from 'vue' //创建响应式数据用的
import { userGetInfoService } from '@/api/user' //调用后端接口用的
// 用户模块
export const useUserStore = defineStore(
  //defineStore（）创建一个 store
  'big-user',
  //这个big-user就是这个store的id，相当于仓库编号,pinia会用它来区分不同的store
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const user = ref({})

    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data
    }

    const setUser = (obj) => {
      user.value = obj
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser,
    }
  },
  {
    persist: true, //开启持久化，刷新页面后数据还能保留
  },
)
