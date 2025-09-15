<script lang="ts" setup>
import type { ICategory, IProduct } from '@/api/types/product'
import { getCategoryListAPI, getProductListAPI } from '@/api/product'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '商品列表',
  },
})

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的分类ID
const currentCategoryId = ref<number>(0)

// 商品列表查询参数
const queryParams = ref({
  sid: 0,
  keyword: '',
  priceOrder: '',
  salesOrder: '',
  news: 0,
  page: 1,
  limit: 20,
  cid: 0,
  coupon_category_id: '',
  productId: '',
})

// 获取分类列表
const { loading: categoryLoading, data: categoryData, run: loadCategories } = useRequest<ICategory[]>(() => getCategoryListAPI())

// 获取商品列表
const { loading: productLoading, data: productData, run: loadProducts } = useRequest<{
  list: IProduct[]
  total: number
  page: number
  limit: number
}>(() => getProductListAPI(queryParams.value))

// 分类选项（包含全部选项）
const categoryTabs = computed(() => {
  const categories = [{ id: 0, cate_name: '全部' }]
  if (categoryData.value) {
    categories.push(...categoryData.value)
  }
  return categories
})

// 商品列表
const productList = computed(() => {
  return productData.value || []
})

// 切换分类
function switchCategory(categoryId: number) {
  currentCategoryId.value = categoryId
  queryParams.value.cid = categoryId
  queryParams.value.page = 1 // 重置页码
  loadProducts()
}

// 搜索商品
function searchProducts() {
  queryParams.value.keyword = searchKeyword.value
  queryParams.value.page = 1 // 重置页码
  loadProducts()
}

// 查看商品详情
function viewProduct(id: number) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

// 添加到购物车
function addToCart(product: IProduct) {
  uni.showToast({
    title: `已添加${product.store_name}到购物车`,
    icon: 'success',
    duration: 1500,
  })
}

// 格式化价格显示
function formatPrice(price?: number) {
  if (!price)
    return '0'
  return (price)
}

// 页面加载时获取数据
onLoad(() => {
  loadCategories()
  loadProducts()
})
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 搜索栏 -->
    <view class="border-b border-gray-100 bg-white p-4">
      <view class="relative">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索商品..."
          class="box-border h-[80rpx] w-full border border-gray-300 rounded-full bg-gray-50 py-2 pl-10"
          @confirm="searchProducts"
        >
        <uni-icons type="search" color="#9ca3af" size="16" class="absolute left-3 top-3" />
      </view>
    </view>

    <!-- 分类选项 -->
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
            {{ tab.cate_name }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 加载状态 -->
    <view v-if="productLoading" class="flex items-center justify-center py-20">
      <wd-loading />
      <text class="ml-2 text-gray-500">加载中...</text>
    </view>

    <!-- 商品网格 -->
    <view v-else class="grid grid-cols-2 gap-4 p-4">
      <view v-if="productList.length === 0" class="col-span-2 py-20 text-center">
        <uni-icons type="shop" color="#d1d5db" size="48" />
        <text class="mt-4 block text-gray-500">暂无商品</text>
      </view>

      <view
        v-for="product in productList"
        :key="product.id"
        class="overflow-hidden border border-gray-200 rounded-lg bg-white"
        @click="viewProduct(product.id)"
      >
        <image :src="product.image" class="h-32 w-full object-cover" mode="aspectFill" />
        <view class="p-3">
          <text class="mb-1 block truncate text-sm text-gray-800 font-medium">{{ product.store_name }}</text>
          <text class="mb-2 block text-xs text-gray-500">{{ product.collator }}</text>

          <view class="mb-2 flex items-center justify-between">
            <view>
              <text class="text-red-500 font-semibold">¥{{ formatPrice(product.price) }}</text>
            </view>
            <text class="text-xs text-gray-500">销售{{ product.sales }}+</text>
          </view>

          <view class="flex items-center justify-between">
            <view />
            <wd-button size="small" type="primary" @click.stop="addToCart(product)">
              <uni-icons type="plus" color="white" size="20" />
            </wd-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
