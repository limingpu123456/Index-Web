import request from '@/utils/request'
export function getCameraList(data) {
  return request({
    url: '/sys/camera/list/'+data,
    method: 'get'
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/camera/info/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/sys/camera/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/camera/edit',
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: '/sys/camera/del',
    method: 'delete',
    data
  })
}

