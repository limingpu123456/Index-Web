import request from '@/utils/request'
export function getPersonList(data) {
  return request({
    url: '/sys/person/list',
    method: 'get',
    params: data
  })
}

export function getInfo(id) {
  return request({
    url: '/sys/person/info/' + id,
    method: 'get'
  })
}

export function getCommunityList() {
  return request({
    url: '/sys/person/getCommunityList',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/sys/person/add',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: '/sys/person/edit',
    method: 'put',
    data
  })
}

export function addPerson(data) {
  return request({
    url: '/sys/person/addPerson',
    method: 'post',
    data
  })
}
export function del(data) {
  return request({
    url: '/sys/person/del',
    method: 'delete',
    data
  })
}

export function exportExcel(data) {
  return request({
    url: '/sys/person/exportExcel',
    method: 'get',
    params: data
  })
}

export function parsefile(filename) {
  return request({
    url: '/sys/person/parsefile/' + filename,
    method: 'post'
  })
}

