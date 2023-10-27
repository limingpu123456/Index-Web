import request from '@/utils/request'

export function getDataList(params) {
  return request({
    url: '/sys/log/list',
    method: 'get',
    params: params
  })
}

export function getInfo(params) {
  return request({
    url: '/sys/log/info',
    method: 'get',
    params: params
  })
}

export function del(data) {
  return request({
    url: '/sys/log/del',
    method: 'delete',
    data
  })
}

