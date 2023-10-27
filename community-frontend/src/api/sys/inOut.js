import request from '@/utils/request'
export function getList(data) {
  return request({
    url: '/sys/inOut/list',
    method: 'get',
    params: data
  })
}

export function communityList() {
  return request({
    url: '/sys/inOut/communityList',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/sys/inOut/add',
    method: 'post',
    data
  })
}

export function chart() {
  return request({
    url: '/sys/inOut/chart',
    method: 'get',
  })
}
