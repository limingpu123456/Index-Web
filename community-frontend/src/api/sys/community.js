import request from '@/utils/request'
export function getList(data) {
  return request({
    url: '/sys/community/list',
    method: 'get',
    params: data
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/community/info/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/sys/community/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/community/edit',
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: '/sys/community/del',
    method: 'delete',
    data
  })
}

export function getCommunityMap(data) {
  return request({
    url: '/sys/community/getCommunityMap',
    method: 'get'
  })
}
