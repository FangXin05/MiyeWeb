import request from '@/utils/request'

// 通过 export 将这个函数暴露出去，这样项目中其他的页面组件
// （比如登录页 Login.vue）就能使用 import { userRegisterService }
// 将它引入并使用了
// 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', {
    // request：这通常是你在项目里提前封装好的 HTTP 网络请求工具
    // .post：表示这次网络请求使用的是 HTTP 的 POST 方法 。
    // '/user/register'：这是后端服务器专门开放的注册接口地址（路由） 。
    username,
    password,
    repassword,
  })
// 登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', {
    username,
    password,
  })
// 获取用户的基本信息
export const userGetInfoService = () => request.get('/my/userinfo')
//更新用户信息
export const userUpdateInfoService = ({ id, username, nickname, email }) =>
  request.put('/my/userinfo', {
    id,
    username,
    nickname,
    email,
  })
//更新用户头像
export const userUploadAvatarService = (avatar) => request.patch('/my/update/avatar', { avatar })
//更新用户密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
