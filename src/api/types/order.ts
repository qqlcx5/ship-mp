import type { ApiResponse } from './common'

// 订单确认参数
export interface IOrderConfirmParams {
  cartId: string
}

// 订单商品信息
export interface IOrderProduct {
  id: number
  name: string
  image: string
  price: number
  quantity: number
  total: number
}

// 订单确认响应数据
export interface IOrderConfirmData {
  cartId: string
  products: IOrderProduct[]
  totalAmount: number
  shippingFee: number
  finalAmount: number
  address?: {
    id: number
    name: string
    phone: string
    address: string
  }
}

// 订单确认响应
export type IOrderConfirmResponse = ApiResponse<IOrderConfirmData>

// 创建订单响应数据
export interface IOrderCreateData {
  orderId: string
  orderNo: string
  totalAmount: number
  status: number
  created_at: string
}

// 创建订单响应
export type IOrderCreateResponse = ApiResponse<IOrderCreateData>

// 支付参数
export interface IOrderPayParams {
  orderId: string
  paymentMethod?: string
}

// 支付响应数据
export interface IOrderPayData {
  orderId: string
  paymentId: string
  paymentUrl?: string
  status: number
}

// 支付响应
export type IOrderPayResponse = ApiResponse<IOrderPayData>

// 订单列表查询参数
export interface IOrderListParams {
  type: number // 9-全部，0-待付款，1-待发货，2-待收货，3-已收货
  page: number
  limit: number
}

// 订单列表项
export interface IOrderListItem {
  id: string
  orderNo: string
  status: number
  statusText: string
  totalAmount: number
  products: IOrderProduct[]
  created_at: string
  updated_at: string
}

// 订单列表响应数据
export interface IOrderListData {
  list: IOrderListItem[]
  total: number
  page: number
  limit: number
}

// 订单列表响应
export type IOrderListResponse = ApiResponse<IOrderListData>

// 订单状态枚举
export enum OrderStatus {
  PENDING_PAYMENT = 0, // 待付款
  PENDING_SHIPMENT = 1, // 待发货
  PENDING_RECEIPT = 2, // 待收货
  COMPLETED = 3, // 已收货
}

// 订单状态文本映射
export const OrderStatusText = {
  [OrderStatus.PENDING_PAYMENT]: '待付款',
  [OrderStatus.PENDING_SHIPMENT]: '待发货',
  [OrderStatus.PENDING_RECEIPT]: '待收货',
  [OrderStatus.COMPLETED]: '已收货',
}
