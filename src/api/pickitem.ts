import type {
  IPickitemDetailParams,
  IPickitemDetailResponse,
  IPickitemListParams,
} from './types/pickitem'
import { http } from '@/http/http'

/**
 * 获取取件详情
 */
export function getPickitemDetailAPI(params: IPickitemDetailParams) {
  return http.get<IPickitemDetailResponse>(`/v2/pickitem/info`, params)
}

/**
 * 获取所有取件分类
 */
export function getPickitemCategoriesAPI() {
  return http.get<any>(`/v2/pickitemcate/getall`)
}

/**
 * 获取取件列表
 */
export function getPickitemListAPI(params: IPickitemListParams) {
  return http.get<any>(`/v2/pickitem/getlist`, params)
}

/**
 * 根据部位获取取件详情
 */
export function getPickitemDetailByPartAPI(id: number) {
  return getPickitemDetailAPI({
    id,
    group_field: 'part_name',
  })
}

/**
 * 根据板件获取取件详情
 */
export function getPickitemDetailByPlateAPI(id: number) {
  return getPickitemDetailAPI({
    id,
    group_field: 'plate_part_no',
  })
}
