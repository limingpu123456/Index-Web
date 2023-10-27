import request from '@/utils/request'

// 查询仓库管理列表
export function listStorage(query) {
  return request({
    url: '/storage/storage/list',
    method: 'get',
    params: query
  })
}

// 查询仓库管理详细
export function getStorage(storageId) {
  return request({
    url: '/storage/storage/' + storageId,
    method: 'get'
  })
}

// 新增仓库管理
export function addStorage(data) {
  return request({
    url: '/storage/storage',
    method: 'post',
    data: data
  })
}

// 修改仓库管理
export function updateStorage(data) {
  return request({
    url: '/storage/storage',
    method: 'put',
    data: data
  })
}

// 删除仓库管理
export function delStorage(storageId) {
  return request({
    url: '/storage/storage/' + storageId,
    method: 'delete'
  })
}

// 导出仓库管理
export function exportStorage(query) {
  return request({
    url: '/storage/storage/export',
    method: 'get',
    params: query
  })
}