<script lang="ts" setup>
import { getProductsAPI, type IProduct } from '@/api/shop'

defineOptions({
  name: 'ProductList'
})

definePage({
  style: {
    navigationBarTitleText: '商品列表'
  }
})

const products = ref<IProduct[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('全部')

const categories = ['全部', '数码', '服装', '家居']

const loadProducts = async () => {
  loading.value = true
  try {
    products.value = await getProductsAPI(
      selectedCategory.value === '全部' ? undefined : selectedCategory.value,
      searchKeyword.value || undefined
    )
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const onSearch = () => {
  loadProducts()
}

const onCategoryChange = (category: string) => {
  selectedCategory.value = category
  loadProducts()
}

const goToProductDetail = (product: IProduct) => {
  uni.navigateTo({
    url: `/pages/products/detail?id=${product.id}`
  })
}

const addToCart = (product: IProduct) => {
  uni.showToast({
    title: '已添加到购物车',
    icon: 'success'
  })
}

onLoad(() => {
  loadProducts()
})
</script>

<template>
  <view class="bg-gray-50 min-h-screen">
    <!-- 搜索栏 -->
    <view class="p-4 bg-white border-b border-gray-100">
      <view class="relative">
        <input 
          v-model="searchKeyword"
          type="text" 
          placeholder="搜索商品..." 
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50"
          @confirm="onSearch"
        />
        <uni-icons 
          type="search" 
          size="18" 
          color="#9ca3af" 
          class="absolute left-3 top-2.5"
        />
      </view>
    </view>

    <!-- 分类选项 -->
    <view class="flex space-x-2 px-4 py-3 bg-white border-b border-gray-100">
      <view 
        v-for="category in categories" 
        :key="category"
        class="px-3 py-1 text-sm rounded-full transition-colors"
        :class="selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'"
        @click="onCategoryChange(category)"
      >
        {{ category }}
      </view>
    </view>

    <!-- 商品网格 -->
    <view class="p-4">
      <view v-if="loading" class="text-center py-8">
        <text class="text-gray-500">加载中...</text>
      </view>
      
      <view v-else class="grid grid-cols-2 gap-4">
        <view 
          v-for="product in products" 
          :key="product.id"
          class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-transform hover:scale-102"
          @click="goToProductDetail(product)"
        >
          <image 
            :src="product.image" 
            class="w-full h-32 object-cover"
            mode="aspectFill"
          />
          <view class="p-3">
            <text class="text-sm font-medium text-gray-800 block mb-1 line-clamp-2">{{ product.name }}</text>
            <text v-if="product.description" class="text-xs text-gray-500 block mb-2 line-clamp-1">{{ product.description }}</text>
            <view class="flex justify-between items-center">
              <view class="flex items-baseline space-x-1">
                <text class="text-red-500 font-semibold">¥{{ product.price }}</text>
                <text v-if="product.originalPrice" class="text-xs text-gray-400 line-through">¥{{ product.originalPrice }}</text>
              </view>
              <view 
                class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                @click.stop="addToCart(product)"
              >
                <uni-icons type="plus" size="12" color="white" />
              </view>
            </view>
            <text class="text-xs text-gray-400 mt-1 block">已售 {{ product.sales }}+</text>
          </view>
        </view>
      </view>

      <view v-if="!loading && products.length === 0" class="text-center py-8">
        <text class="text-gray-500">暂无商品</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>