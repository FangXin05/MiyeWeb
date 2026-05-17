import { defineStore } from 'pinia' //创建store用的
import { ref } from 'vue' //创建响应式数据用的
import { userGetInfoService } from '@/api/user' //调用后端接口用的
// 用户模块
export const useUserStore = defineStore(
  //defineStore（）创建一个 store
  'big-user',
  //这个big-user就是这个store的id，相当于仓库编号,pinia会用它来区分不同的store
  () => {
    // 写响应式数据和函数
    //------------------------------------------------------------------------
    const token = ref('') //定义一个响应式token，初始值为空字符串，登陆成功后把后端返回的token传进去
    const setToken = (newToken) => {
      token.value = newToken
    }
    //这是设置token的方法简单来说就是参进去一个新的参数然后赋值给token
    const removeToken = () => {
      token.value = ''
    }
    //清空token的方法，退出登录的时候使用
    const user = ref({})
    //创建一个响应式对象，一开始里面存放的是一个空对象
    //响应式说得再具体一些也就是这个数据变了，页面上所有用到它的地方都会改变
    //这行代码const user=ref({})在内存中的真是写法其实是user={value:{}}，因此我们在script用到它
    //的时候不能写user.username而是要写user.value.username
    const getUser = async () => {
      const res = await userGetInfoService() // 这是在api里面封装好的接口函数，请求获取数据
      user.value = res.data
    }
    //getUser这部分作用是去后端请求当前登录的用户的信息请求回来后保存在user里面
    //async是异步函数，然后await是配合其使用，在该操作执行完之前不执行别的操作
    const setUser = (obj) => {
      user.value = obj
    }
    //------------------------------------------------------------------------
    return {
      // 暴露出去
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
