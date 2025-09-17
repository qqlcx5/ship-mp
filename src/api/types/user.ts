import type { ApiResponse } from './common'
import type { IUserInfoRes } from './login'

// 用户信息接口 - 扩展现有的IUserInfoRes
export interface IUserInfo extends IUserInfoRes {
  email?: string
  gender?: number
  birthday?: string
  created_at?: string
  updated_at?: string
}

// 获取用户信息响应
export type IGetUserInfoResponse = ApiResponse<IUserInfo>
