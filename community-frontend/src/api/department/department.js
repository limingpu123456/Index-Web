import request from '@/utils/request'

// 查询部门管理列表
export function listDepartment(query) {
  return request({
    url: '/department/department/list',
    method: 'get',
    params: query
  })
}

// 查询部门管理详细
export function getDepartment(departmentId) {
  return request({
    url: '/department/department/' + departmentId,
    method: 'get'
  })
}

// 新增部门管理
export function addDepartment(data) {
  return request({
    url: '/department/department',
    method: 'post',
    data: data
  })
}

// 修改部门管理
export function updateDepartment(data) {
  return request({
    url: '/department/department',
    method: 'put',
    data: data
  })
}

// 删除部门管理
export function delDepartment(departmentId) {
  return request({
    url: '/department/department/' + departmentId,
    method: 'delete'
  })
}

// 导出部门管理
export function exportDepartment(query) {
  return request({
    url: '/department/department/export',
    method: 'get',
    params: query
  })
}