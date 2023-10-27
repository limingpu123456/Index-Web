import request from '@/utils/request'

export function getDataList(params) {
  return request({
    url: '/sys/role/list',
    method: 'get',
    params: params
  })
}

export function getRoleList() {
  return request({
    url: '/sys/role/getRoleList',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/sys/role/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/role/edit',
    method: 'put',
    data
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/role/info/' + id,
    method: 'get'
  })
}

export function del(data) {
  return request({
    url: '/sys/role/del',
    method: 'delete',
    data
  })
}
