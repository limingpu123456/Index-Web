import request from '@/utils/request'
export function getmanualList(data) {
  return request({
    url: '/sys/manual/list',
    method: 'get',
    params: data
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/manual/info/' + id,
    method: 'get'
  })
}

export function getCommunityList() {
  return request({
    url: '/sys/manual/getCommunityList',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/sys/manual/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/manual/edit',
    method: 'put',
    data
  })
}

export function del(data) {
  return request({
    url: '/sys/manual/del',
    method: 'delete',
    data
  })
}
