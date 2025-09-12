<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '商品详情',
  },
})

const productId = ref('')

// 模拟商品详情数据
const productDetail = ref({
  id: 1,
  name: '无线蓝牙耳机',
  description: '降噪技术，高品质音响效果，续航48小时',
  price: 299.00,
  originalPrice: 399.00,
  sales: 1234,
  images: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop'
  ],
  specs: [
    { name: '颜色', options: ['白色', '黑色', '粉色'], selected: '白色' }
  ],
  quantity: 1
})

const currentImageIndex = ref(0)

onLoad((options) => {
  if (options?.id) {
    productId.value = options.id
    // 这里可以根据ID获取商品详情
  }
})

// 切换规格选择
function selectSpec(specIndex: number, option: string) {
  productDetail.value.specs[specIndex].selected = option
}

// 调整数量
function adjustQuantity(delta: number) {
  const newQuantity = productDetail.value.quantity + delta
  if (newQuantity >= 1) {
    productDetail.value.quantity = newQuantity
  }
}

// 添加到购物车
function addToCart() {
  uni.showToast({
    title: '已添加到购物车',
    icon: 'success'
  })
}

// 立即购买
function buyNow() {
  uni.showToast({
    title: '立即购买',
    icon: 'none'
  })
}

// 分享商品
function shareProduct() {
  uni.showToast({
    title: '分享商品',
    icon: 'none'
  })
}

// 收藏商品
function favoriteProduct() {
  uni.showToast({
    title: '已收藏',
    icon: 'success'
  })
}
</script>

<template>
  <view class="min-h-screen bg-white">
    <!-- 头部导航 -->
    <view class="flex items-center justify-between p-4 border-b border-gray-100">
      <uni-icons type="left" color="#6b7280" size="18" @click="uni.navigateBack()" />
      <view class="flex space-x-4">
        <uni-icons type="heart" color="#6b7280" size="18" @click="favoriteProduct" />
        <uni-icons type="redo" color="#6b7280" size="18" @click="shareProduct" />
      </view>
    </view>

    <!-- 商品图片轮播 -->
    <view class="relative">
      <swiper
        :current="currentImageIndex"
        class="h-64"
        @change="(e) => currentImageIndex = e.detail.current"
      >
        <swiper-item v-for="(image, index) in productDetail.images" :key="index">
          <image :src="image" class="w-full h-full object-cover" mode="aspectFill" />
        </swiper-item>
      </swiper>
      <view class="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        {{ currentImageIndex + 1 }}/{{ productDetail.images.length }}
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="p-4">
      <view class="mb-4">
        <text class="text-xl font-semibold text-gray-800 block mb-2">{{ productDetail.name }}</text>
        <text class="text-gray-600 text-sm">{{ productDetail.description }}</text>
      </view>

      <view class="flex items-center justify-between mb-4">
        <view class="flex items-baseline">
          <text class="text-2xl font-bold text-red-500">¥{{ productDetail.price.toFixed(0) }}</text>
          <text v-if="productDetail.originalPrice" class="text-sm text-gray-400 line-through ml-2">
            ¥{{ productDetail.originalPrice.toFixed(0) }}
          </text>
        </view>
        <text class="text-sm text-gray-500">已售 {{ productDetail.sales }}+</text>
      </view>

      <!-- 规格选择 -->
      <view v-for="(spec, specIndex) in productDetail.specs" :key="spec.name" class="mb-4">
        <text class="text-sm font-medium text-gray-800 block mb-2">选择{{ spec.name }}</text>
        <view class="flex space-x-2">
          <wd-button
            v-for="option in spec.options"
            :key="option"
            size="small"
            :type="spec.selected === option ? 'primary' : 'default'"
            @click="selectSpec(specIndex, option)"
          >
            {{ option }}
          </wd-button>
        </view>
      </view>

      <!-- 数量选择 -->
      <view class="mb-6">
        <text class="text-sm font-medium text-gray-800 block mb-2">数量</text>
        <view class="flex items-center space-x-3">
          <wd-button
            size="small"
            type="default"
            :disabled="productDetail.quantity <= 1"
            @click="adjustQuantity(-1)"
          >
            <uni-icons type="minus" size="12" />
          </wd-button>
          <text class="text-lg font-medium px-4">{{ productDetail.quantity }}</text>
          <wd-button size="small" type="default" @click="adjustQuantity(1)">
            <uni-icons type="plus" size="12" />
          </wd-button>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <view class="flex space-x-3">
        <wd-button type="default" class="flex-1" @click="addToCart">
          加入购物车
        </wd-button>
        <wd-button type="primary" class="flex-1" @click="buyNow">
          立即购买
        </wd-button>
      </view>
    </view>

    <!-- 底部占位 -->
    <view class="h-20"></view>
  </view>
</template>
