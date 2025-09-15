import type {
  IAddressDetailResponse,
  IAddressListResponse,
  IAddressOperationResponse,
  IAddressParams,
} from './types/address'
import { http } from '@/http/http'

/**
 * 获取地址列表
 * 注意：这个接口需要根据实际后端接口进行调整
 */
export function getAddressListAPI() {
  return http.get<IAddressListResponse>('/address/list')
}

/**
 * 获取地址详情
 * @param id 地址ID
 * 注意：这个接口需要根据实际后端接口进行调整
 */
export function getAddressDetailAPI(id: number) {
  return http.get<IAddressDetailResponse>(`/address/detail/${id}`)
}

/**
 * 创建地址
 * @param data 地址信息
 * 注意：这个接口需要根据实际后端接口进行调整
 */
export function createAddressAPI(data: IAddressParams) {
  return http.post<IAddressOperationResponse>('/address/create', data)
}

/**
 * 更新地址
 * @param id 地址ID
 * @param data 地址信息
 * 注意：这个接口需要根据实际后端接口进行调整
 */
export function updateAddressAPI(id: number, data: IAddressParams) {
  return http.put<IAddressOperationResponse>(`/address/update/${id}`, data)
}

/**
 * 删除地址
 * @param id 地址ID
 * 注意：这个接口需要根据实际后端接口进行调整
 */
export function deleteAddressAPI(id: number) {
  return http.delete<IAddressOperationResponse>(`/address/delete/${id}`)
}

/**
 * 设置默认地址
 * @param id 地址ID
 * 注意：这个接口需要根据实际后端接口进行调整
 */
export function setDefaultAddressAPI(id: number) {
  return http.post<IAddressOperationResponse>(`/address/setDefault/${id}`)
}
