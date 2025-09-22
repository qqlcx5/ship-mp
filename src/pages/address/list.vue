<script lang="ts" setup>
import type { IAddress } from '@/api/types/address'
import {
  deleteAddressAPI,
  getAddressListAPI,
  setDefaultAddressAPI,
} from '@/api/address'
import { usePagination } from '@/hooks/usePagination'

definePage({
  style: {
    navigationBarTitleText: '收货地址',
  },
})
const addressList = ref<IAddress[]>([])
const { paging, query: queryList } = usePagination<IAddress>({
  api: getAddressListAPI,
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
        paging.value?.reload() // 删除成功后重新加载列表
      }
    },
  })
}

// 设为默认地址
async function setDefaultAddress(id: number) {
  await setDefaultAddressAPI(id)
  uni.showToast({ title: '设置成功', icon: 'success' })
  paging.value?.reload() // 设置默认成功后重新加载列表
}
</script>

<template>
  <view class="bg-gray-50">
    <!-- 头部操作栏 -->

    <!-- 地址列表 -->
    <z-paging
      ref="paging"
      v-model="addressList"
      class="p-4 space-y-4"
      empty-view-text="暂无地址"
      @query="queryList"
    >
      <template #top>
        <view class="bg-gray-100 p-2">
          <wd-button size="small" type="primary" @click="addAddress">
            新增
          </wd-button>
        </view>
      </template>
      <template #bottom>
        <view class="h-12 p-safe" />
      </template>
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
    </z-paging>
  </view>
</template>
