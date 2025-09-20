<script lang="ts" setup>
import type { IPickitemDetailResponse } from '@/api/types/pickitem'
import { getPickitemDetailAPI } from '@/api/pickitem'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '取件详情',
  },
})

const pickupId = ref<number>(0)

// 获取取件详情
const { loading, data: pickupData, run: loadPickupDetail } = useRequest<IPickitemDetailResponse>(() =>
  getPickitemDetailAPI({ id: pickupId.value, group_field: 'part_name' }),
)

// 取件详情
const pickupDetail = computed(() => {
  return pickupData.value
})

// 折叠状态管理
const expandedCategories = ref<Record<string, boolean>>({})

// 切换分类展开/折叠状态
function toggleCategory(category: string) {
  expandedCategories.value[category] = !expandedCategories.value[category]
}

// 检查分类是否展开
function isCategoryExpanded(category: string) {
  return expandedCategories.value[category] !== false
}

onLoad((options) => {
  if (options?.id) {
    pickupId.value = Number(options.id)
    loadPickupDetail()
  }
})

// 下载附件
function downloadFile() {
  if (!pickupDetail.value?.desc_file_url) {
    uni.showToast({ title: '附件地址不存在', icon: 'none' })
    return
  }

  console.log('下载文件URL:', pickupDetail.value.desc_file_url)
  uni.downloadFile({
    // url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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
      <!-- 封面（原商品图片） -->
      <view class="mx-4 mt-4 border border-gray-200 rounded-lg bg-white p-4">
        <image :src="pickupDetail?.image" class="h-48 w-full rounded-lg object-cover" mode="aspectFill" />
      </view>

      <!-- 基本信息 -->
      <view class="mx-4 mt-4 border border-gray-200 rounded-lg bg-white p-4">
        <text class="mb-4 block text-gray-800 font-semibold">基本信息</text>
        <view class="space-y-3">
          <view class="flex justify-between">
            <text class="text-gray-600">名称：</text>
            <text class="text-gray-800 font-medium">{{ pickupDetail?.name }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-600">整理人：</text>
            <text class="text-gray-800 font-medium">{{ pickupDetail?.collator }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-600">分类名称：</text>
            <text class="text-gray-800 font-medium">{{ pickupDetail?.cate_name }}</text>
          </view>
          <view class="flex justify-between">
            <text class="text-gray-600">浏览量：</text>
            <text class="text-gray-800">{{ pickupDetail?.view_num }}</text>
          </view>
          <!-- <view class="flex justify-between">
            <text class="text-gray-600">时间：</text>
            <text class="text-gray-800">{{ pickupDetail?.add_time }}</text>
          </view> -->
        </view>
      </view>

      <!-- 项目列表 -->
      <view v-if="pickupDetail?.item_list && Object.keys(pickupDetail.item_list).length > 0" class="mx-4 mt-4 border border-gray-200 rounded-lg bg-white p-4">
        <text class="mb-4 block text-lg text-gray-800 font-semibold">项目列表</text>
        <view class="space-y-4">
          <view v-for="(items, category) in pickupDetail.item_list" :key="category" class="border border-gray-100 rounded-lg from-blue-50 to-indigo-50 bg-gradient-to-r p-4 shadow-sm">
            <!-- 标题 - 可点击折叠/展开 -->
            <view class="flex cursor-pointer items-center justify-between" @click="toggleCategory(String(category))">
              <view class="flex items-center">
                <view class="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                <text class="text-base text-gray-800 font-bold">{{ category }}</text>
              </view>
              <view
                :class="isCategoryExpanded(String(category)) ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'"
                class="text-[16px] text-[#6366f1] transition-transform duration-200"
              />
            </view>

            <!-- 可折叠的内容区域 -->
            <view v-show="isCategoryExpanded(String(category))" class="mt-3 transition-all duration-300">
              <view v-for="(item, index) in items" :key="index" class="ml-2 border-l-2 border-blue-200 py-2 pl-4">
                <view v-for="(values, key) in item" :key="key" class="mb-3 last:mb-0">
                  <view class="mb-2 flex items-center">
                    <view class="i-carbon-flag mr-2 text-[14px] text-[#6366f1]" />
                    <text class="text-sm text-gray-700 font-semibold">{{ key }}</text>
                  </view>
                  <view class="ml-6 flex flex-wrap gap-2">
                    <view v-for="(value, i) in values" :key="i" class="border border-gray-200 rounded-lg bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm transition-shadow hover:shadow-md">
                      <view class="i-carbon-checkmark mr-1 text-[10px] text-[#10b981]" />
                      {{ value }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 相关附件 -->
      <view v-if="pickupDetail?.desc_file_url" class="mx-4 mt-4 border border-gray-200 rounded-lg bg-white p-4">
        <text class="mb-3 block text-gray-800 font-semibold">相关附件</text>
        <view
          class="flex items-center justify-between rounded-lg bg-gray-50 p-3"
          @click="downloadFile"
        >
          <view class="flex items-center">
            <view class="i-carbon-send-filled mr-3 text-[20px] text-[#dc2626]" />
            <view>
              <text class="block text-sm text-gray-800 font-medium">{{ pickupDetail?.desc_file_name }}</text>
              <text class="text-xs text-gray-500">点击下载</text>
            </view>
          </view>
          <wd-button size="small" type="primary">
            <view class="i-carbon-download mr-1 text-[12px] text-white" />
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
      <view class="i-carbon-shopping-cart text-[48px] text-[#d1d5db]" />
      <text class="mt-4 text-gray-500">取件不存在</text>
    </view>
  </view>
</template>
