import request from '@/utils/request'

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

export function getCaptchaImg() {
  return request({
    url: '/captcha',
    method: 'get'
  })
}

export function checkToken(token) {
  return request({
    url: '/checkToken',
    method: 'get',
    headers:{
      token:token
    }
  })
}
