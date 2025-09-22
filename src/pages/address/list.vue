<script lang="ts" setup>
import type { IAddressListResponse } from '@/api/types/address'
import {
  deleteAddressAPI,
  getAddressListAPI,
  setDefaultAddressAPI,
} from '@/api/address'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '收货地址',
  },
})

// 获取地址列表
const { loading, data: addressData, run: loadAddressList } = useRequest<IAddressListResponse>(() => getAddressListAPI())

// 地址列表
const addressList = computed(() => {
  return addressData.value || []
})

// 页面加载时获取数据
onShow(() => {
  loadAddressList()
})

// 新增地址
function addAddress() {
  uni.navigateTo({ url: '/pages/address/form' })
}

// 编辑地址
function editAddress(id: number) {
  uni.navigateTo({ url: `/pages/address/form?id=${id}` })
}

// 删除地址
async function deleteAddress(id: number) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    success: async (res) => {
      if (res.confirm) {
        await deleteAddressAPI(id)
        uni.showToast({ title: '删除成功', icon: 'success' })
        await loadAddressList()
      }
    },
  })
}

// 设为默认地址
async function setDefaultAddress(id: number) {
  await setDefaultAddressAPI(id)
  uni.showToast({ title: '设置成功', icon: 'success' })
  await loadAddressList()
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 头部操作栏 -->
    <view class="flex items-center justify-between border-b border-gray-100 bg-white p-4">
      <text class="text-lg text-gray-800 font-semibold">收货地址</text>
      <wd-button size="small" type="primary" @click="addAddress">
        新增
      </wd-button>
    </view>

    <!-- 地址列表 -->
    <view class="p-4 space-y-4">
      <!-- 加载状态 -->
      <view v-if="loading" class="py-20 text-center">
        <wd-loading />
        <text class="mt-4 block text-gray-500">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="addressList?.length === 0" class="py-20 text-center">
        <view class="i-carbon-location text-[48px] text-[#d1d5db]" />
        <text class="mt-4 block text-gray-500">暂无地址</text>
        <wd-button type="primary" class="mt-4" @click="addAddress">
          添加地址
        </wd-button>
      </view>

      <view
        v-for="address in addressList"
        :key="address.id"
        class="relative border border-gray-200 rounded-lg bg-white p-4"
      >
        <!-- 默认标签 -->
        <view v-if="address.is_default === 1" class="absolute right-4 top-4">
          <wd-button size="small" type="success">
            默认
          </wd-button>
        </view>

        <!-- 地址信息 -->
        <view :class="address.is_default === 1 ? 'pr-12' : ''">
          <view class="mb-2 flex items-center">
            <text class="mr-2 text-gray-800 font-medium">{{ address.real_name }}</text>
            <text class="text-sm text-gray-600">{{ address.phone }}</text>
          </view>
          <text class="break-all text-sm text-gray-600 leading-relaxed">
            {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
          </text>
        </view>

        <!-- 操作按钮 -->
        <view class="mt-4 flex items-center justify-between">
          <wd-button
            v-if="address.is_default !== 1"
            size="small"
            type="info"
            @click="setDefaultAddress(address.id)"
          >
            设为默认
          </wd-button>
          <view v-else />

          <view class="flex items-center gap-2">
            <wd-button size="small" type="primary" @click="editAddress(address.id)">
              编辑
            </wd-button>
            <wd-button size="small" type="error" class="ml-2" @click="deleteAddress(address.id)">
              删除
            </wd-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
