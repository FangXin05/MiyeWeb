import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
// createRouter 创建路由实例
// 配置history模式
//1. history模式createWebHistory()   历史模式 地址栏不带#
//2. hash模式createWebHashHistory()  哈希模式 地址栏带#
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        { path: '/article/manage', component: () => import('@/views/article/ArticleManage.vue') }, // 文章管理
        { path: '/article/channel', component: () => import('@/views/article/ArticleChannel.vue') }, // 文章渠道
        { path: '/user/avatar', component: () => import('@/views/user/UserAvatar.vue') }, // 用户角色
        { path: '/user/profile', component: () => import('@/views/user/UserProfile.vue') }, // 用户头像
        { path: '/user/password', component: () => import('@/views/user/UserPassword.vue') }, // 用户密码
      ],
    }, // 主页
  ],
})

// 登陆访问拦截=>默认直接放行的
// 根据返回值决定是放行还是拦截
//返回值：1.undefined/true直接放行
// 2.false拦回form对象拦截到对应的地址
// 3.具体路径 或 路径对象，拦截到对应的地址
// ‘/login'
router.beforeEach((to) => {
  //如果没有token，拦截到登录页
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
