// 通用响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 轮播图类型
export interface SlideItem {
  id: number
  title: string
  image: string
  link?: string
  sort: number
  status: number
  created_at: string
  updated_at: string
}

// 公告类型
export interface NoticeInfo {
  id: number
  title: string
  desc: string
  type: number
  status: number
  created_at: string
  updated_at: string
}
