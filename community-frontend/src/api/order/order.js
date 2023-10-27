import request from '@/utils/request'

// 查询订单管理列表
export function listOrder(query) {
  return request({
    url: '/order/order/list',
    method: 'get',
    params: query
  })
}

// 查询订单管理详细
export function getOrder(orderId) {
  return request({
    url: '/order/order/' + orderId,
    method: 'get'
  })
}

// 新增订单管理
export function addOrder(data) {
  return request({
    url: '/order/order',
    method: 'post',
    data: data
  })
}

// 修改订单管理
export function updateOrder(data) {
  return request({
    url: '/order/order',
    method: 'put',
    data: data
  })
}

// 删除订单管理
export function delOrder(orderId) {
  return request({
    url: '/order/order/' + orderId,
    method: 'delete'
  })
}

// 导出订单管理
export function exportOrder(query) {
  return request({
    url: '/order/order/export',
    method: 'get',
    params: query
  })
}