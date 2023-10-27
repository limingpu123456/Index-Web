import request from '@/utils/request'

export function getSysInfo() {
  return request({
    url: '/index/main',
    method: 'get'
  })
}

export function cleanCache() {
  return request({
    url: '/index/clearRedis',
    method: 'post'
  })
}
