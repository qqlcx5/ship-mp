import { http } from '@/http/http'

/**
 * 获取轮播图列表
 */
export function getSlideList() {
  return http.get<any>('/v2/slide/getall')
}

/**
 * 获取公告信息
 */
export function getNoticeInfo() {
  return http.get<any>('/v2/notice/info')
}
