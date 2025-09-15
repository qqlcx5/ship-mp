<script lang="ts" setup>
import type { IPickitem } from '@/api/types/pickitem'
import { getPickitemDetailAPI } from '@/api/pickitem'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '取件详情',
  },
})

const pickupId = ref<number>(0)

// 获取取件详情
const { loading, data: pickupData, run: loadPickupDetail } = useRequest<IPickitem>(() =>
  getPickitemDetailAPI({ id: pickupId.value, group_field: 'part_name' }),
)

// 取件详情
const pickupDetail = computed(() => {
  return pickupData.value
})

onLoad((options) => {
  if (options?.id) {
    pickupId.value = Number(options.id)
    loadPickupDetail()
  }
})

// 下载附件
function downloadFile() {
  if (!pickupDetail.value?.desc_file_url)
    return

  uni.downloadFile({
    url: pickupDetail.value.desc_file_url,
    success: (res) => {
      if (res.statusCode === 200) {
        uni.showToast({
          title: '下载成功',
          icon: 'success',
        })
      }
    },
    fail: () => {
      uni.showToast({
        title: '下载失败',
        icon: 'error',
      })
    },
  })
}

// 分享取件信息
// function sharePickupInfo() {
//   if (!pickupDetail.value)
//     return

//   uni.showToast({
//     title: `分享${pickupDetail.value.name}`,
//     icon: 'none',
//   })
// }
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 加载状态 -->
    <view v-if="loading" class="flex items-center justify-center py-20">
      <wd-loading />
      <text class="ml-2 text-gray-500">加载中...</text>
    </view>

    <!-- 取件详情内容 -->
    <view v-else-if="pickupDetail">
      <!-- 状态卡片 -->
      <view class="mx-4 mt-4 border border-blue-200 rounded-lg bg-blue-50 p-4">
        <view class="flex items-center">
          <view class="mr-3 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <uni-icons type="person" color="#2563eb" size="28" />
          </view>
          <view>
            <text class="block text-blue-800 font-semibold">{{ pickupDetail.name }}</text>
            <text class="text-sm text-blue-600">整理人：{{ pickupDetail.collator }}</text>
          </view>
        </view>
      </view>

      <!-- 取件信息 -->
      <view class="mx-4 mt-4 border border-gray-200 rounded-lg bg-white p-4">
        <text class="mb-4 block text-gray-800 font-semibold">基本信息</text>
        <view class="space-y-3">
          <view class="flex justify-between">
            <text class="text-gray-600">分类ID：</text>
            <text class="text-gray-800 font-medium">{{ pickupDetail.cate_id }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-600">浏览量：</text>
            <text class="text-gray-800">{{ pickupDetail.view_num }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-600">时间：</text>
            <text class="text-gray-800">{{ pickupDetail.add_time }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-600">状态：</text>
            <text :class="pickupDetail.status === 1 ? 'text-green-500' : 'text-red-500'">
              {{ pickupDetail.status === 1 ? '启用' : '禁用' }}
            </text>
          </view>
        </view>
      </view>

      <!-- 商品图片 -->
      <view class="mx-4 mt-4 border border-gray-200 rounded-lg bg-white p-4">
        <text class="mb-4 block text-gray-800 font-semibold">商品图片</text>
        <image :src="pickupDetail.image" class="h-48 w-full rounded-lg object-cover" mode="aspectFill" />
      </view>

      <!-- 相关附件 -->
      <view v-if="pickupDetail.desc_file_url" class="mx-4 mt-4 border border-gray-200 rounded-lg bg-white p-4">
        <text class="mb-3 block text-gray-800 font-semibold">相关附件</text>
        <view
          class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
          @click="downloadFile"
        >
          <view class="flex items-center">
            <uni-icons type="paperplane-filled" color="#dc2626" size="20" class="mr-3" />
            <view>
              <text class="block text-sm text-gray-800 font-medium">{{ pickupDetail.desc_file_name }}</text>
              <text class="text-xs text-gray-500">点击下载</text>
            </view>
          </view>
          <wd-button size="small" type="primary">
            <uni-icons type="download" color="white" size="12" class="mr-1" />
            下载
          </wd-button>
        </view>
      </view>

      <!-- 操作按钮 -->
      <!-- <view class="mt-8 p-4 space-y-3">
        <wd-button type="primary" block @click="sharePickupInfo">
          分享取件信息
        </wd-button>
      </view> -->
    </view>

    <!-- 取件不存在提示 -->
    <view v-else class="flex flex-col items-center justify-center py-20">
      <uni-icons type="cart" color="#d1d5db" size="48" />
      <text class="mt-4 text-gray-500">取件不存在</text>
    </view>
  </view>
</template>
