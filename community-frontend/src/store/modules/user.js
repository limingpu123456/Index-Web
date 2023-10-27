// import { login, logout, getInfo } from '@/api/login'
// import { getToken, setToken, removeToken } from '@/utils/auth'
//
// const user = {
//   state: {
//     token: getToken(),
//     name: '',
//     avatar: '',
//     roles: [],
//     permissions: []
//   },
//
//   mutations: {
//     SET_TOKEN: (state, token) => {
//       state.token = token
//     },
//     SET_NAME: (state, name) => {
//       state.name = name
//     },
//     SET_AVATAR: (state, avatar) => {
//       state.avatar = avatar
//     },
//     SET_ROLES: (state, roles) => {
//       state.roles = roles
//     },
//     SET_PERMISSIONS: (state, permissions) => {
//       state.permissions = permissions
//     }
//   },
//
//   actions: {
//     // 登录
//     Login({ commit }, userInfo) {
//       const username = userInfo.username.trim()
//       const password = userInfo.password
//       const captcha = userInfo.captcha
//       const uuid = userInfo.uuid
//       return new Promise((resolve, reject) => {
//         login(username, password, captcha, uuid).then(response => {
//           const data = response.data
//           commit('SET_TOKEN', data.token)
//           setToken(data.token)
//           resolve()
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 获取用户信息
//     GetInfo({ commit, state }) {
//       return new Promise((resolve, reject) => {
//         getInfo().then(res => {
//           const user = res.user
//           const avatar = user.avatar == "" ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
//           if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
//             commit('SET_ROLES', res.roles)
//             commit('SET_PERMISSIONS', res.permissions)
//           } else {
//             commit('SET_ROLES', ['ROLE_DEFAULT'])
//           }
//           commit('SET_NAME', user.userName)
//           commit('SET_AVATAR', avatar)
//           resolve(res)
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 退出系统
//     LogOut({ commit, state }) {
//       return new Promise((resolve, reject) => {
//         logout(state.token).then(() => {
//           commit('SET_TOKEN', '')
//           commit('SET_ROLES', [])
//           commit('SET_PERMISSIONS', [])
//           removeToken()
//           resolve()
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//
//     // 前端 登出
//     FedLogOut({ commit }) {
//       return new Promise(resolve => {
//         commit('SET_TOKEN', '')
//         removeToken()
//         resolve()
//       })
//     }
//   }
// }
//
// export default user

import { login, logout, getInfo } from '@/api/sys/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  realName: '',
  avatar: '',
  introduction: '',
  roles: [],
  userType: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_REALNAME: (state, realName) => {
    state.realName = realName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERTYPE: (state, userType) => {
    state.userType = userType
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      login(username, userInfo.password, userInfo.captcha, userInfo.uuid).then(response => {
        const data = response.data
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(res => {
        const data = res.data
        if (!data) {
          reject('验证失败，请重新登录。')
        }

        if (!res.roles || res.roles.length <= 0) {
          reject('该用户没有分配角色！')
        }
        commit('SET_ROLES', res.roles)
        commit('SET_NAME', data.username)
        commit('SET_REALNAME', data.realName)
        commit('SET_AVATAR', data.avatar)
        commit('SET_INTRODUCTION', data.mobile)
        commit('SET_USERTYPE', data.userType)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 动态修改权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'
      commit('SET_TOKEN', token)
      setToken(token)
      const { roles } = await dispatch('getInfo')
      resetRouter()
      // 根据角色生成可访问的路由
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
      // 动态添加路由
      router.addRoutes(accessRoutes)
      // 重置访问的视图和缓存的视图
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
