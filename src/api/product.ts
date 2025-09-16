import type {
  // ICategory,
  // IProduct,
  ICategoryResponse,
  IProductDetailResponse,
  IProductListParams,
  IProductListResponse,
} from './types/product'
import { http } from '@/http/http'

// 基础API URL

/**
 * 获取商品列表
 */
export function getProductListAPI(params: IProductListParams = {}) {
  const defaultParams = {
    sid: 0,
    keyword: '',
    priceOrder: '',
    salesOrder: '',
    news: 0,
    page: 1,
    limit: 20,
    cid: 1,
    coupon_category_id: '',
    productId: '',
  }

  return http.get<IProductListResponse>(`/products`, {
    ...defaultParams,
    ...params,
  })
}

/**
 * 获取商品分类（仅一级分类）
 */
export function getCategoryListAPI() {
  return http.get<ICategoryResponse>(`/category`)
}

/**
 * 根据分类ID获取商品列表
 */
export function getProductsByCategoryAPI(cid: number, params: Omit<IProductListParams, 'cid'> = {}) {
  return getProductListAPI({
    ...params,
    cid,
  })
}

/**
 * 搜索商品
 */
export function searchProductsAPI(keyword: string, params: Omit<IProductListParams, 'keyword'> = {}) {
  return getProductListAPI({
    ...params,
    keyword,
  })
}

/**
 * 获取商品详情
 */
export function getProductDetailAPI(id: number) {
  return http.get<IProductDetailResponse>(`/product/detail/${id}`)
}
