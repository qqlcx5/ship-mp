<script lang="ts" setup>
import type { IPickitem } from '@/api/types/pickitem'
import { getPickitemCategoriesAPI, getPickitemListAPI } from '@/api/pickitem'
import { usePagination } from '@/hooks/usePagination'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '取件列表',
  },
})

// 当前选中的分类ID
const currentCategoryId = ref<number>(0)
const searchKeyword = ref('')

// 获取取件分类列表
const { data: categoryData, run: loadCategories } = useRequest<any>(() => getPickitemCategoriesAPI())
const pickupList = ref<IPickitem[]>([])
const paginationParams = computed(() => ({
  cate_id: currentCategoryId.value,
  keyword: searchKeyword.value,
}))
const { paging, query: queryPickups } = usePagination<any>({
  api: getPickitemListAPI,
  initialParams: paginationParams,
})

// 分类选项（包含全部选项）
const categoryTabs = computed(() => {
  const categories = [{ id: 0, name: '全部' }]
  if (categoryData.value) {
    categories.push(...categoryData.value)
  }
  return categories
})

// 切换分类
function switchCategory(categoryId: number) {
  currentCategoryId.value = categoryId
}

// 查看取件详情
function viewDetail(id: number) {
  uni.navigateTo({ url: `/pages/pickup/detail?id=${id}` })
}

// 页面加载时获取数据
onShow(() => {
  loadCategories()
  paging.value?.reload()
})
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 取件列表 -->
    <z-paging
      ref="paging"
      v-model:list="pickupList"
      class="p-4 space-y-4"
      empty-view-text="暂无取件"
      @query="queryPickups"
    >
      <template #top>
        <!-- 搜索栏 -->
        <view class="bg-gray-100 p-2">
          <wd-input
            v-model="searchKeyword"
            prefix-icon="search"
            no-border
            custom-class="bg-white rounded-full p-2"
          />
        </view>
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
      </template>
      <template #bottom>
        <view class="h-12 p-safe" />
      </template>
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
          <image :src="pickup.image" class="ml-4 size-20 rounded-lg" mode="aspectFill" />
        </view>
      </view>
    </z-paging>
  </view>
</template>
