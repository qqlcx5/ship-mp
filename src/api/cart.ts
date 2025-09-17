import type { ICartAddItemData, ICartAddItemParams } from './types/cart'
import { http } from '@/http/http'

/**
 * 立即购买 - 添加到购物车
 */
export function addToCart(params: ICartAddItemParams) {
  return http.post<ICartAddItemData>(`/cart/add`, params)
}
