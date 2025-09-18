/**
 * 取件相关类型定义
 */

// 取件分类接口
export interface IPickitemCategory {
  id: number
  name: string
  sort: number
  add_time: number
  is_del: number
  status: number
}

// 取件接口
export interface IPickitem {
  id: number
  name: string
  sort: number
  add_time: string | number // 可能是时间戳或字符串格式
  is_del: number
  status: number
  collator: string
  view_num: number
  cate_id: number
  image: string
  desc_file_url: string
  desc_file_name: string
  part_name?: string
  plate_part_no?: string
  item_list?: Record<string, any[]>
}

// 取件详情查询参数
export interface IPickitemDetailParams {
  id: number
  group_field: 'part_name' | 'plate_part_no'
}

// 取件列表查询参数
export interface IPickitemListParams {
  cate_id: number
  page?: number
  limit?: number
}

// 取件详情响应
export interface IPickitemDetailResponse {
  status: number
  msg: string
  data: IPickitem
}

// 取件分类响应
export interface IPickitemCategoryResponse {
  status: number
  msg: string
  data: IPickitemCategory[]
}

// 取件列表响应
export interface IPickitemListResponse {
  status: number
  msg: string
  data: {
    list: IPickitem[]
    total: number
  }
}
