# API文档模板

## 接口概述

**接口名称**: [接口名称]  
**接口路径**: [/api/path]  
**请求方法**: [GET/POST/PUT/DELETE]  
**接口描述**: [接口功能描述]  

## 请求参数

### 路径参数

| 参数名 | 类型 | 必填 | 描述 | 示例 |
|--------|------|------|------|------|
| id | string | 是 | 资源ID | "123" |

### 查询参数

| 参数名 | 类型 | 必填 | 默认值 | 描述 | 示例 |
|--------|------|------|--------|------|------|
| page | number | 否 | 1 | 页码 | 1 |
| size | number | 否 | 10 | 每页数量 | 20 |

### 请求体参数

```typescript
interface RequestBody {
  field1: string    // 字段1描述
  field2: number    // 字段2描述
  field3?: boolean  // 可选字段3描述
}
```

## 响应数据

### 成功响应

```typescript
interface SuccessResponse {
  code: number      // 状态码，200表示成功
  message: string   // 响应消息
  data: ResponseData // 响应数据
}

interface ResponseData {
  // 具体的响应数据结构
}
```

### 错误响应

```typescript
interface ErrorResponse {
  code: number      // 错误码
  message: string   // 错误消息
  details?: any     // 错误详情
}
```

## 状态码说明

| 状态码 | 说明 | 处理建议 |
|--------|------|----------|
| 200 | 成功 | 正常处理数据 |
| 400 | 请求参数错误 | 检查请求参数 |
| 401 | 未授权 | 重新登录 |
| 403 | 禁止访问 | 检查权限 |
| 404 | 资源不存在 | 检查资源ID |
| 500 | 服务器错误 | 稍后重试 |

## 使用示例

### 基础请求

```typescript
// @description: 基础API请求示例
// @params: 请求参数
// @returns: 响应数据
// @example: 获取用户信息

import { http } from '@/http/http'

const getUserInfo = async (userId: string) => {
  try {
    const response = await http.get(`/api/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}
```

### 使用Alova

```typescript
// @description: 使用Alova进行请求
// @params: 请求参数
// @returns: 响应数据
// @example: 使用Alova的缓存和状态管理

import { alovaInstance } from '@/http/alova'

const getUserInfoAlova = (userId: string) => {
  return alovaInstance.Get(`/api/users/${userId}`, {
    // Alova特定配置
    cacheFor: 300000, // 缓存5分钟
  })
}
```

### 使用Vue Query

```typescript
// @description: 使用Vue Query进行请求
// @params: 请求参数
// @returns: 响应数据和状态
// @example: 响应式数据管理

import { useQuery } from '@tanstack/vue-query'

const useUserInfo = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserInfo(userId),
    staleTime: 300000, // 5分钟内数据不过期
  })
}
```

## 注意事项

### 请求注意事项
- 所有请求需要在Header中携带认证信息
- 请求超时时间为30秒
- 支持请求重试，最多重试3次

### 响应注意事项
- 所有时间字段均为UTC时间戳
- 分页数据从1开始计数
- 空数据返回空数组或null

### 平台差异
- H5端支持所有功能
- 小程序端需要配置域名白名单
- App端需要配置网络权限

## 相关接口

- [相关接口1](./related-api-1.md)
- [相关接口2](./related-api-2.md)

---

*API版本: v1.0 | 最后更新: [YYYY-MM-DD]*