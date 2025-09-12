<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '商品列表',
  },
})

// 搜索关键词
const searchKeyword = ref('')

// 分类选项
const categoryTabs = ref([
  { label: '全部', value: 'all' },
  { label: '数码', value: 'digital' },
  { label: '服装', value: 'clothing' },
  { label: '家居', value: 'home' },
])

const currentCategory = ref('all')

// 模拟商品数据
const productList = ref([
  {
    id: 1,
    name: '无线蓝牙耳机',
    description: '高品质音响效果',
    price: 299.00,
    originalPrice: 399.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
    category: 'digital',
    sales: 1234,
  },
  {
    id: 2,
    name: '运动鞋',
    description: '舒适透气设计',
    price: 599.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop',
    category: 'clothing',
    sales: 856,
  },
  {
    id: 3,
    name: '智能手表',
    description: '健康监测专家',
    price: 1299.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop',
    category: 'digital',
    sales: 432,
  },
  {
    id: 4,
    name: '咖啡杯',
    description: '精致陶瓷材质',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150&h=150&fit=crop',
    category: 'home',
    sales: 678,
  },
])

// 筛选后的商品列表
const filteredProducts = computed(() => {
  let result = productList.value

  // 分类筛选
  if (currentCategory.value !== 'all') {
    result = result.filter(product => product.category === currentCategory.value)
  }

  // 搜索筛选
  if (searchKeyword.value) {
    result = result.filter(product =>
      product.name.includes(searchKeyword.value)
      || product.description.includes(searchKeyword.value),
    )
  }

  return result
})

// 切换分类
function switchCategory(category: string) {
  currentCategory.value = category
}

// 搜索商品
function searchProducts() {
  // 搜索逻辑已在computed中处理
  console.log('搜索关键词：', searchKeyword.value)
}

// 查看商品详情
function viewProduct(id: number) {
  uni.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

// 添加到购物车
function addToCart(product: any) {
  uni.showToast({
    title: `已添加${product.name}到购物车`,
    icon: 'success',
    duration: 1500,
  })
}
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
    <view class="flex border-b border-gray-100 bg-white px-4 py-3 space-x-2">
      <view
        v-for="tab in categoryTabs"
        :key="tab.value"
        class="rounded-full px-3 py-1 text-sm" :class="[
          currentCategory === tab.value
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600',
        ]"
        @click="switchCategory(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 商品网格 -->
    <view class="grid grid-cols-2 gap-4 p-4">
      <view v-if="filteredProducts.length === 0" class="col-span-2 py-20 text-center">
        <uni-icons type="shop" color="#d1d5db" size="48" />
        <text class="mt-4 block text-gray-500">暂无商品</text>
      </view>

      <view
        v-for="product in filteredProducts"
        :key="product.id"
        class="overflow-hidden border border-gray-200 rounded-lg bg-white"
        @click="viewProduct(product.id)"
      >
        <image :src="product.image" class="h-32 w-full object-cover" mode="aspectFill" />
        <view class="p-3">
          <text class="mb-1 block text-sm text-gray-800 font-medium">{{ product.name }}</text>
          <text class="mb-2 block text-xs text-gray-500">{{ product.description }}</text>

          <view class="mb-2 flex items-center justify-between">
            <view>
              <text class="text-red-500 font-semibold">¥{{ product.price.toFixed(0) }}</text>
              <text v-if="product.originalPrice" class="ml-1 text-xs text-gray-400 line-through">
                ¥{{ product.originalPrice.toFixed(0) }}
              </text>
            </view>
            <text class="text-xs text-gray-500">已售{{ product.sales }}+</text>
          </view>

          <view class="flex items-center justify-between">
            <view />
            <wd-button size="small" type="primary" @click.stop="addToCart(product)">
              <uni-icons type="plus" color="white" size="12" />
            </wd-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
