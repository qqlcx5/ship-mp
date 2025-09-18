/**
 * 商品相关类型定义
 */

// 商品分类接口
export interface ICategory {
  id: number | string
  name: string
  cate_name: string
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
  id: number | string
  store_name: string
  sort: number
  add_time: number
  is_del: number
  status: number
  collator: string
  view_num: number
  cate_id: number
  image: string
  slider_image?: string[]
  desc_file_url: string
  desc_file_name: string
  price?: number
  sales?: number
  stock?: number
  description?: string
  attrInfo?: ISkuAttrInfo[] // SKU 属性信息
  sku?: ISkuItem[] // SKU 列表
}

// SKU 属性信息
export interface ISkuAttrInfo {
  attrName: string
  attrValue: string[]
}

// SKU 单项
export interface ISkuItem {
  id: number
  productId: number
  sku: string
  price: number
  stock: number
  image: string
  unique: string
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
  cid?: number | string
  coupon_category_id?: string
  productId?: string
}

// 商品列表响应
export interface IProductListResponse {
  status: number
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
  status: number
  msg: string
  data: ICategory[]
}

// 商品详情响应
export interface IProductDetailResponse {
  status: number
  msg: string
  data: {
    storeInfo: IProduct
  }
}
