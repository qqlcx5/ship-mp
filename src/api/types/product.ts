/**
 * 商品相关类型定义
 */

// 商品分类接口
export interface ICategory {
  id: number
  name: string
  sort: number
  add_time: number
  is_del: number
  status: number
  collator: string
  view_num: number
  cate_id: number
  image: string
  desc_file_url: string
  desc_file_name: string
}

// 商品接口
export interface IProduct {
  id: number
  name: string
  sort: number
  add_time: number
  is_del: number
  status: number
  collator: string
  view_num: number
  cate_id: number
  image: string
  desc_file_url: string
  desc_file_name: string
  price?: number
  sales?: number
  stock?: number
  description?: string
}

// 商品列表查询参数
export interface IProductListParams {
  sid?: number
  keyword?: string
  priceOrder?: string
  salesOrder?: string
  news?: number
  page?: number
  limit?: number
  cid?: number
  coupon_category_id?: string
  productId?: string
}

// 商品列表响应
export interface IProductListResponse {
  code: number
  msg: string
  data: {
    list: IProduct[]
    total: number
    page: number
    limit: number
  }
}

// 商品分类响应
export interface ICategoryResponse {
  code: number
  msg: string
  data: ICategory[]
}
