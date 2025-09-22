<script lang="ts" setup>
import type { IProduct } from '@/api/types/product'
import { getCategoryListAPI, getProductListAPI } from '@/api/product'
import { usePagination } from '@/hooks/usePagination'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '商品列表',
  },
})

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的分类ID
const currentCategoryId = ref<number | string>(0)

// 获取分类列表
const { data: categoryData, run: loadCategories } = useRequest<any>(() => getCategoryListAPI())
const productList = ref<IProduct[]>([])
const paginationParams = computed(() => ({
  keyword: searchKeyword.value,
  sid: 0,
  priceOrder: '',
  salesOrder: '',
  news: 0,
  cid: currentCategoryId.value,
  coupon_category_id: '',
  productId: '',
}))
const { paging, query: queryProducts } = usePagination<IProduct>({
  api: getProductListAPI,
  initialParams: paginationParams,
})

// 分类选项（包含全部选项）
const categoryTabs = computed(() => {
  const categories = [{ id: 0, cate_name: '全部' }]
  if (categoryData.value) {
    categories.push(...categoryData.value)
  }
  return categories
})

// 切换分类
function switchCategory(categoryId: number | string) {
  currentCategoryId.value = categoryId
}

// 查看商品详情
function viewProduct(id: number | string) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}
onShow(() => {
  loadCategories()
  paging.value?.reload()
})
</script>

<template>
  <view class="bg-gray-50">
    <!-- 商品网格 -->
    <z-paging
      ref="paging"
      v-model="productList"
      empty-view-text="暂无商品"
      @query="queryProducts"
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

        <!-- 分类选项 -->
        <view class="bg-gray-100 p-2 pb-3">
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
                {{ tab.cate_name }}
              </view>
            </view>
          </scroll-view>
        </view>
      </template>
      <template #bottom>
        <view class="h-12 p-safe" />
      </template>
      <view class="grid grid-cols-2 gap-4 px-4 pt-4">
        <view
          v-for="product in productList"
          :key="product.id"
          class="relative z-1 overflow-hidden border border-gray-200 rounded-lg bg-white"
          @click="viewProduct(product.id)"
        >
          <image :src="product.image" class="h-32 w-full object-cover" mode="aspectFill" />
          <view class="p-3">
            <text class="mb-1 block truncate text-sm text-gray-800 font-medium">{{ product.store_name || '' }}</text>
            <text class="mb-2 block text-xs text-gray-500">{{ product.collator }}</text>

            <view class="mb-2 flex items-center justify-between">
              <view>
                <text class="text-red-500 font-semibold">¥{{ product.price || 0 }}</text>
              </view>
              <text class="text-xs text-gray-500">销售{{ product.sales }}+</text>
            </view>

            <!-- <view class="flex items-center justify-between">
              <wd-button size="small" type="primary" @click.stop="addToCart(product)">
               <view class="i-carbon-add text-[20px] text-white" />
             </wd-button>
           </view> -->
          </view>
        </view>
      </view>
    </z-paging>
  </view>
</template>
