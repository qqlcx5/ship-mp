import type {
  IOrderConfirmData,
  IOrderConfirmParams,
  IOrderCreateData,
  IOrderCreateParams,
  IOrderDetailData,
  IOrderListParams,
  IOrderPayData,
  IOrderPayParams,
} from './types/order'
import { http } from '@/http/http'

/**
 * 立即购买订单详情
 */
export function confirmOrder(params: IOrderConfirmParams) {
  return http.post<IOrderConfirmData>(`/order/confirm`, params)
}

/**
 * 提交订单
 */
export function createOrder(cartId: string, params: IOrderCreateParams) {
  return http.post<IOrderCreateData>(`/order/create/${cartId}`, params)
}

/**
 * 支付订单
 */
export function payOrder(params: IOrderPayParams) {
  return http.post<IOrderPayData>(`/order/pay`, params)
}

/**
 * 获取订单列表
 */
export function getOrderList(params: IOrderListParams) {
  return http.get<any>(`/order/list`, params)
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id: string) {
  return http.get<IOrderDetailData>(`/order/detail/${id}`)
}
