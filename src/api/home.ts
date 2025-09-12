import type { ApiResponse, NoticeInfo, SlideItem } from './types/common'
import { http } from '@/http/http'

/**
 * 获取轮播图列表
 */
export function getSlideList() {
  return http.get<ApiResponse<SlideItem[]>>('/v2/slide/getall')
}

/**
 * 获取公告信息
 */
export function getNoticeInfo() {
  return http.get<ApiResponse<NoticeInfo>>('/v2/notice/info')
}
