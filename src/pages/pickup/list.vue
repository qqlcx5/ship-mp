<script lang="ts" setup>
import type { IPickitem, IPickitemCategory } from '@/api/types/pickitem'
import { getPickitemCategoriesAPI, getPickitemListAPI } from '@/api/pickitem'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '取件列表',
  },
})

// 当前选中的分类ID
const currentCategoryId = ref<number>(0)

// 获取取件分类列表
const { loading: categoryLoading, data: categoryData, run: loadCategories } = useRequest<IPickitemCategory[]>(() => getPickitemCategoriesAPI())

// 获取取件列表
const { loading: pickupLoading, data: pickupData, run: loadPickups } = useRequest<{
  list: IPickitem[]
  total: number
}>(() => getPickitemListAPI({ cate_id: currentCategoryId.value }))

// 分类选项（包含全部选项）
const categoryTabs = computed(() => {
  const categories = [{ id: 0, name: '全部' }]
  if (categoryData.value) {
    categories.push(...categoryData.value) // 只显示启用的分类
  }
  return categories
})

// 取件列表
const pickupList = computed(() => {
  return pickupData.value?.list || []
})

// 切换分类
function switchCategory(categoryId: number) {
  currentCategoryId.value = categoryId
  loadPickups()
}

// 格式化时间
function formatTime(timeStr: string | number) {
  if (typeof timeStr === 'number') {
    return new Date(timeStr * 1000).toLocaleString()
  }
  return timeStr
}

// 查看取件详情
function viewDetail(id: number) {
  uni.navigateTo({ url: `/pages/pickup/detail?id=${id}` })
}

// 页面加载时获取数据
onLoad(() => {
  loadCategories()
  loadPickups()
})
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 分类筛选 -->
    <view class="border-b border-gray-100 bg-white px-4 py-3">
      <scroll-view scroll-x>
        <view class="flex items-center space-x-2">
          <view
            v-for="tab in categoryTabs"
            :key="tab.id"
            class="whitespace-nowrap rounded-full px-3 py-1 text-sm" :class="[
              currentCategoryId === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600',
            ]"
            @click="switchCategory(tab.id)"
          >
            {{ tab.name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 加载状态 -->
    <view v-if="pickupLoading" class="flex items-center justify-center py-20">
      <wd-loading />
      <text class="ml-2 text-gray-500">加载中...</text>
    </view>

    <!-- 取件列表 -->
    <view v-else class="p-4 space-y-4">
      <view v-if="pickupList.length === 0" class="py-20 text-center">
        <uni-icons type="cart" color="#d1d5db" size="48" />
        <text class="mt-4 block text-gray-500">暂无取件</text>
      </view>

      <view
        v-for="pickup in pickupList"
        :key="pickup.id"
        class="border border-gray-200 rounded-lg bg-white p-4"
        @click="viewDetail(pickup.id)"
      >
        <view class="flex items-start justify-between">
          <!-- 左侧信息 -->
          <view class="flex-1">
            <view class="mb-2 flex items-center justify-between">
              <text class="text-gray-800 font-medium">{{ pickup.name }}</text>
            </view>

            <text class="block text-sm text-gray-600">整理人：{{ pickup.collator }}</text>
            <text class="block text-sm text-gray-600">浏览量：{{ pickup.view_num }}</text>
            <text class="block text-sm text-gray-500">时间：{{ pickup.add_time }}</text>

            <!-- 附件信息 -->
            <view v-if="pickup.desc_file_name" class="mt-1">
              <text class="text-sm text-blue-600">附件：{{ pickup.desc_file_name }}</text>
            </view>
          </view>

          <!-- 右侧商品图片 -->
          <image :src="pickup.image" class="ml-4 h-20 w-20 rounded-lg" mode="aspectFill" />
        </view>
      </view>
    </view>
  </view>
</template>
