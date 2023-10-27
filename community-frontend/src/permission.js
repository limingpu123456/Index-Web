import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'
import { checkToken } from '@/api/sys/login'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect'] // 没有重定向白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)
  let token = getToken()
  if (token) {
    //校验Token
    checkToken(token).then(res => {
      if (res.code === 200 && res.status === 'error') {
        next({path: '/error'})
      }
    })
    if (to.path === '/login') {
      // 如果已登录，请重定向到主页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 确定用户是否通过getInfo获取了权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          const { routers } = await store.dispatch('user/getInfo')
          // 基于角色生成可访问的路由映射
          const accessRoutes = await store.dispatch('permission/generateRoutes', { routers })
          // 动态添加可访问的路由
          router.addRoutes(accessRoutes)
          // hack方法 确保addRoutes已完成
          // 设置replace:true，这样导航就不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌并转到登录页重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          next('/login')
          NProgress.done()
        }
      }
    }
  } else {
    /* 没有token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      // 否则全部重定向到登录页
      // next(`/login?redirect=${to.path}`)
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
