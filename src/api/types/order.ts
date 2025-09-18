import type { ApiResponse } from './common'

// 订单确认参数
export interface IOrderConfirmParams {
  cartId: string
  new?: number
  shipping_type?: number
  addressId?: number
}
export interface IOrderCreateParams {
  orderKey: string
  addressId: number
  [key: string]: unknown
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
  orderKey: string
  addressInfo: {
    id: number
    real_name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    is_default: number
  }
  cartInfo: IOrderProduct[]
  priceGroup: {
    totalPrice: string
    storePostage: string
    storeCouponPrice: string
    payFee: string
    payPrice: string
    deductionPrice: string
    couponPrice: string
  }
  [key: string]: unknown
}

// 订单确认响应
export type IOrderConfirmResponse = ApiResponse<IOrderConfirmData>

// 创建订单响应数据
export interface IOrderCreateData {
  result: {
    orderId: string
    [key: string]: unknown
  }
}

// 创建订单响应
export type IOrderCreateResponse = ApiResponse<IOrderCreateData>

// 支付参数
export interface IOrderPayParams {
  paytype: 'weixin' | 'balance'
  type: number
  uni: string
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
  id: number
  order_id: string
  trade_no: string
  uid: number
  real_name: string
  user_phone: string
  user_address: string
  cart_id: string[]
  freight_price: string
  total_num: number
  total_price: string
  total_postage: string
  pay_price: string
  pay_postage: string
  deduction_price: string
  coupon_id: number
  coupon_price: string
  paid: number
  pay_time: number
  pay_type: string
  add_time: number
  status: number
  is_stock_up: number
  refund_status: number
  refund_type: number
  refund_express: string
  refund_express_name: string
  refund_reason_wap_img: string
  refund_reason_wap_explain: string
  refund_reason_time: number
  refund_reason_wap: string
  refund_reason: string
  refund_price: string
  delivery_name: string
  delivery_code: string
  delivery_type: string
  delivery_id: string
  kuaidi_label: string
  kuaidi_task_id: string
  kuaidi_order_id: string
  fictitious_content: string
  delivery_uid: number
  gain_integral: string
  use_integral: string
  back_integral: string
  spread_uid: number
  spread_two_uid: number
  one_brokerage: string
  two_brokerage: string
  mark: string
  is_del: number
  is_cancel: number
  unique: string
  remark: string
  mer_id: number
  is_mer_check: number
  combination_id: number
  pink_id: number
  cost: string
  seckill_id: number
  bargain_id: number
  advance_id: number
  verify_code: string
  store_id: number
  shipping_type: number
  clerk_id: number
  is_channel: number
  is_remind: number
  is_system_del: number
  channel_type: string
  province: string
  express_dump: string
  virtual_type: number
  virtual_info: string
  pay_uid: number
  custom_form: any[]
  staff_id: number
  agent_id: number
  division_id: number
  staff_brokerage: string
  agent_brokerage: string
  division_brokerage: string
  is_gift: number
  gift_price: string
  gift_uid: number
  gift_mark: string
  nickname: string
  phone: string
  avatar: string
  split: any[]
  invoice: any
  add_time_y: string
  add_time_h: string
  system_store: boolean
  code: string
  mapKey: string
  yue_pay_status: number
  pay_weixin_open: boolean
  ali_pay_status: boolean
  friend_pay_status: number
  cartInfo: IOrderDetailProduct[]
  _status: {
    _type: number
    _title: string
    _msg: string
    _class: string
    _payType: string
    _deliveryType: string
  }
  _pay_time: string
  _add_time: string
  stop_time: number
  status_pic: string
  offlinePayStatus: number
  order_log: {
    create: string
    pay: string
    delivery: string
    take: string
    complete: string
  }
  gift_user_info: {
    gift_uid: number
    gift_nickname: string
    gift_avatar: string
  }
  vip_true_price: string
  levelPrice: string
  memberPrice: number
  postage_price: number
  member_price: number
  routine_contact_type: string
  invoice_func: boolean
  special_invoice: boolean
  refund_cartInfo: IOrderDetailProduct[]
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

// 订单详情参数
export interface IOrderDetailParams {
  id: string
}

// 订单详情商品信息
export interface IOrderDetailProduct {
  id: string
  cart_num: number
  productInfo: {
    id: number
    image: string
    store_name: string
    price: string
  }
  truePrice: number
}

// 订单详情数据, 和列表项一致
export interface IOrderDetailData extends IOrderListItem {}

// 订单详情响应
export type IOrderDetailResponse = ApiResponse<IOrderDetailData>

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
