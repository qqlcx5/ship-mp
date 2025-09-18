import type { ApiResponse } from './common'

// 添加到购物车参数
export interface ICartAddItemParams {
  cartNum: number
  productId: number | string
  new: number
  uniqueld: string
  virtual_type: number
}

// 添加到购物车响应数据
export interface ICartAddItemData {
  cartId: string
  productId: number | string
  cartNum: number
  created_at: string
}

// 添加到购物车响应
export type ICartAddItemResponse = ApiResponse<ICartAddItemData>
