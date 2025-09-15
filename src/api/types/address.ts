/**
 * 地址相关类型定义
 */

// 地址接口
export interface IAddress {
  id: number
  real_name: string // 收货人姓名
  phone: string // 手机号
  province: string // 省份
  city: string // 城市
  district: string // 区县
  detail: string // 详细地址
  post_code?: string // 邮编
  is_default: number // 是否默认地址 1=是 0=否
  add_time?: string // 添加时间
  province_id?: number // 省份ID
  city_id?: number // 城市ID
  district_id?: number // 区县ID
}

// 地址列表查询参数
export interface IAddressListParams {
  page?: number
  limit?: number
}

// 地址列表响应
export interface IAddressListResponse {
  status: number
  msg: string
  data: {
    list: IAddress[]
    total: number
    page: number
    limit: number
  }
}

// 地址新增/编辑参数
export interface IAddressEditParams {
  id?: number // 编辑时需要传ID
  real_name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  post_code?: string
  is_default?: number
  province_id?: number
  city_id?: number
  district_id?: number
}

// 地址操作响应（新增、编辑、删除、设为默认）
export interface IAddressOperationResponse {
  status: number
  msg: string
  data?: any
}

// 省市区数据结构
export interface IRegion {
  id: number
  name: string
  parent_id: number
  level: number // 层级：1省 2市 3区
  children?: IRegion[]
}

// 省市区列表响应
export interface ICityListResponse {
  status: number
  msg: string
  data: IRegion[]
}
// 基于用户提供的数据结构定义
export interface RegionItem {
  v: number // value
  n: string // name
  c: RegionItem[] // children
}

// 兼容原有的Region接口
export interface Region {
  text: string
  value: string
  children?: Region[]
}
