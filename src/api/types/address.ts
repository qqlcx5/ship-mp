/**
 * 地址相关类型定义
 */

// 地址信息接口
export interface IAddress {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  address: string // 完整地址
  isDefault: boolean
  createTime?: string
  updateTime?: string
}

// 创建/更新地址参数
export interface IAddressParams {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: boolean
}

// 地址列表响应
export interface IAddressListResponse {
  status: number
  msg: string
  data: {
    total: number
    list: IAddress[]
  }
}

// 地址详情响应
export interface IAddressDetailResponse {
  status: number
  msg: string
  data: IAddress
}

// 地址操作响应
export interface IAddressOperationResponse {
  status: number
  msg: string
  data?: any
}

// 省市区数据接口
export interface IRegion {
  code: string
  name: string
  children?: IRegion[]
}

// 省市区选择器数据
export interface IRegionPickerData {
  provinces: IRegion[]
  cities: IRegion[]
  districts: IRegion[]
}
