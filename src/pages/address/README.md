# 收货地址模块

## 功能说明

本模块实现了完整的收货地址管理功能，包括：

- 地址列表展示
- 新增地址
- 编辑地址
- 删除地址
- 设置默认地址

## 文件结构

```
src/pages/address/
├── list.vue          # 地址列表页面
├── form.vue          # 地址编辑表单页面
└── README.md         # 说明文档

src/api/
├── address.ts        # 地址相关API接口
└── types/
    └── address.ts    # 地址相关类型定义
```

## API接口

### 地址列表
- **接口**: `GET /api/address/list`
- **说明**: 获取用户的收货地址列表
- **返回**: 地址列表数据

### 地址详情
- **接口**: `GET /api/address/detail/{id}`
- **说明**: 获取指定地址的详细信息
- **参数**: 地址ID

### 创建地址
- **接口**: `POST /api/address/create`
- **说明**: 创建新的收货地址
- **参数**: 地址信息（姓名、手机、省市区、详细地址等）

### 更新地址
- **接口**: `PUT /api/address/update/{id}`
- **说明**: 更新指定地址信息
- **参数**: 地址ID + 地址信息

### 删除地址
- **接口**: `DELETE /api/address/delete/{id}`
- **说明**: 删除指定地址
- **参数**: 地址ID

### 设置默认地址
- **接口**: `POST /api/address/setDefault/{id}`
- **说明**: 将指定地址设为默认地址
- **参数**: 地址ID

## 使用示例

### 在页面中使用API

```typescript
import {
  getAddressListAPI,
  createAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
  setDefaultAddressAPI
} from '@/api/address'

// 获取地址列表
const addressList = await getAddressListAPI()

// 创建地址
const newAddress = {
  name: '张三',
  phone: '13800138000',
  province: '北京市',
  city: '北京市',
  district: '朝阳区',
  detail: '望京街道科技园区A座1001室',
  isDefault: false
}
await createAddressAPI(newAddress)

// 更新地址
await updateAddressAPI(1, newAddress)

// 删除地址
await deleteAddressAPI(1)

// 设置默认地址
await setDefaultAddressAPI(1)
```

## 页面路由

- 地址列表：`/pages/address/list`
- 地址编辑：`/pages/address/form?id={addressId}` （编辑模式）
- 新增地址：`/pages/address/form` （新增模式）

## 特性

1. **类型安全**: 使用TypeScript提供完整的类型定义
2. **错误处理**: 完善的错误处理和用户提示
3. **加载状态**: 提供加载状态指示
4. **表单验证**: 完整的表单验证逻辑
5. **简化输入**: 省市区使用输入框，简化用户操作
6. **响应式设计**: 适配不同屏幕尺寸

## 注意事项

1. **API接口调整**: 当前API接口为示例，需要根据实际后端接口进行调整
2. **省市区输入**: 已改为手动输入方式，用户可以自由输入省市区信息
3. **表单验证**: 表单验证规则可以根据业务需求进行调整
4. **后备方案**: 如果API调用失败，会自动使用模拟数据作为后备方案
5. **接口联调**: 根据提供的API文档，地址相关接口可能需要与实际业务接口进行对接
