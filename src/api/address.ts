import type {
  IAddressEditParams,
  IAddressListParams,
  IAddressListResponse,
  IAddressOperationResponse,
  ICityListResponse,
} from './types/address'
import { http } from '@/http/http'

/**
 * 获取地址列表
 */
export function getAddressListAPI(params: IAddressListParams = {}) {
  const defaultParams = {
    page: 1,
    limit: 20,
  }

  return http.get<IAddressListResponse>(`/address/list`, {
    ...defaultParams,
    ...params,
  })
}

/**
 * 添加地址
 */
export function addAddressAPI(data: Omit<IAddressEditParams, 'id'>) {
  return http.post<IAddressOperationResponse>(`/address/edit`, data)
}

/**
 * 编辑地址
 */
export function editAddressAPI(data: IAddressEditParams) {
  return http.post<IAddressOperationResponse>(`/address/edit`, data)
}
export function getAddressDetailAPI(id: number) {
  return http.get<IAddressOperationResponse>(`/address/detail/${id}`)
}

/**
 * 删除地址
 */
export function deleteAddressAPI(id: number) {
  return http.post<IAddressOperationResponse>(`/address/del`, { id })
}

/**
 * 设置默认地址
 */
export function setDefaultAddressAPI(id: number) {
  return http.post<IAddressOperationResponse>(`/address/default/set`, { id })
}

/**
 * 获取省市区列表
 */
export function getCityListAPI() {
  return http.get<ICityListResponse>(`/city_list`)
}
