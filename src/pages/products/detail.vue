<script lang="ts" setup>
import { getProductsAPI, type IProduct } from '@/api/shop'

defineOptions({
  name: 'ProductDetail'
})

definePage({
  style: {
    navigationBarTitleText: '商品详情'
  }
})

const product = ref<IProduct | null>(null)
const loading = ref(false)
const selectedColor = ref('')
const selectedSize = ref('')
const quantity = ref(1)
const currentImageIndex = ref(0)

// 模拟多张商品图片
const productImages = ref([
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop'
])

const loadProduct = async (id: string) => {
  loading.value = true
  try {
    const products = await getProductsAPI()
    product.value = products.find(p => p.id === parseInt(id)) || null
    
    if (product.value) {
      // 设置默认选项
      if (product.value.colors && product.value.colors.length > 0) {
        selectedColor.value = product.value.colors[0]
      }
      if (product.value.sizes && product.value.sizes.length > 0) {
        selectedSize.value = product.value.sizes[0]
      }
    }
  } catch (error) {
    console.error('Failed to load product:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}

const onImageChange = (e: any) => {
  currentImageIndex.value = e.detail.current
}

const selectColor = (color: string) => {
  selectedColor.value = color
}

const selectSize = (size: string) => {
  selectedSize.value = size
}

const changeQuantity = (delta: number) => {
  const newQuantity = quantity.value + delta
  if (newQuantity >= 1) {
    quantity.value = newQuantity
  }
}

const addToCart = () => {
  if (!product.value) return
  
  const cartItem = {
    product: product.value,
    color: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value
  }
  
  console.log('Add to cart:', cartItem)
  
  uni.showToast({
    title: '已添加到购物车',
    icon: 'success'
  })
}

const buyNow = () => {
  if (!product.value) return
  
  const orderItem = {
    product: product.value,
    color: selectedColor.value,
    size: selectedSize.value,
    quantity: quantity.value
  }
  
  console.log('Buy now:', orderItem)
  
  uni.showToast({
    title: '立即购买功能待实现',
    icon: 'none'
  })
}

onLoad((options: any) => {
  if (options.id) {
    loadProduct(options.id)
  }
})
</script>

<template>
  <view class="bg-white min-h-screen">
    <view v-if="loading" class="flex items-center justify-center h-64">
      <text class="text-gray-500">加载中...</text>
    </view>
    
    <view v-else-if="product" class="pb-20">
      <!-- 头部导航 -->
      <view class="flex items-center justify-between p-4 relative">
        <view @click="goBack" class="w-8 h-8 flex items-center justify-center">
          <uni-icons type="left" size="20" color="#666" />
        </view>
      </view>

      <!-- 商品图片 -->
      <view class="relative">
        <swiper 
          class="w-full h-64"
          indicator-dots
          @change="onImageChange"
        >
          <swiper-item v-for="(image, index) in productImages" :key="index">
            <image 
              :src="image" 
              class="w-full h-full object-cover"
              mode="aspectFill"
            />
          </swiper-item>
        </swiper>
        
        <view class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {{ currentImageIndex + 1 }}/{{ productImages.length }}
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="p-4">
        <view class="mb-4">
          <text class="text-xl font-semibold text-gray-800 block mb-2">{{ product.name }}</text>
          <text v-if="product.description" class="text-gray-600 text-sm">{{ product.description }}</text>
        </view>

        <view class="flex items-center justify-between mb-4">
          <view class="flex items-baseline space-x-2">
            <text class="text-2xl font-bold text-red-500">¥{{ product.price }}</text>
            <text v-if="product.originalPrice" class="text-sm text-gray-400 line-through">¥{{ product.originalPrice }}</text>
          </view>
          <text class="text-sm text-gray-500">已售 {{ product.sales }}+</text>
        </view>

        <!-- 颜色选择 -->
        <view v-if="product.colors && product.colors.length > 0" class="mb-4">
          <text class="text-sm font-medium text-gray-800 block mb-2">选择颜色</text>
          <view class="flex space-x-2">
            <view 
              v-for="color in product.colors" 
              :key="color"
              class="px-3 py-2 text-sm rounded border transition-colors"
              :class="selectedColor === color ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-gray-300 text-gray-600'"
              @click="selectColor(color)"
            >
              {{ color }}
            </view>
          </view>
        </view>

        <!-- 尺寸选择 -->
        <view v-if="product.sizes && product.sizes.length > 0" class="mb-4">
          <text class="text-sm font-medium text-gray-800 block mb-2">选择尺寸</text>
          <view class="flex space-x-2">
            <view 
              v-for="size in product.sizes" 
              :key="size"
              class="px-3 py-2 text-sm rounded border transition-colors"
              :class="selectedSize === size ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-gray-300 text-gray-600'"
              @click="selectSize(size)"
            >
              {{ size }}
            </view>
          </view>
        </view>

        <!-- 数量选择 -->
        <view class="mb-6">
          <text class="text-sm font-medium text-gray-800 block mb-2">数量</text>
          <view class="flex items-center space-x-3">
            <view 
              class="w-8 h-8 border border-gray-300 rounded flex items-center justify-center"
              :class="quantity <= 1 ? 'opacity-50' : ''"
              @click="changeQuantity(-1)"
            >
              <uni-icons type="minus" size="14" color="#666" />
            </view>
            <text class="text-lg font-medium min-w-8 text-center">{{ quantity }}</text>
            <view 
              class="w-8 h-8 border border-gray-300 rounded flex items-center justify-center"
              @click="changeQuantity(1)"
            >
              <uni-icons type="plus" size="14" color="#666" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="flex items-center justify-center h-64">
      <text class="text-gray-500">商品不存在</text>
    </view>

    <!-- 底部操作栏 -->
    <view v-if="product" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <view class="flex space-x-3">
        <button 
          class="flex-1 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium"
          @click="addToCart"
        >
          加入购物车
        </button>
        <button 
          class="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium"
          @click="buyNow"
        >
          立即购买
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.min-w-8 {
  min-width: 2rem;
}
</style>