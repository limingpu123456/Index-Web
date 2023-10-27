import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/sys/menu/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/menu/edit',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: '/sys/menu/del/' + id,
    method: 'delete'
  })
}

export function getDataList() {
  return request({
    url: '/sys/menu/list',
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/menu/info/' + id,
    method: 'get'
  })
}
