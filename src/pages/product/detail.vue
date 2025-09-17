<script lang="ts" setup>
import type { IProductDetailResponse } from '@/api/types/product'
import { addToCart as addToCartAPI } from '@/api/cart'
import { getProductDetailAPI } from '@/api/product'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '商品详情',
  },
})

const productId = ref<number>(0)
const currentImageIndex = ref(0)
const quantity = ref(1)

// 获取商品详情
const { loading, data: productData, run: loadProductDetail } = useRequest<IProductDetailResponse>(() =>
  getProductDetailAPI(productId.value),
)

// 商品详情
const productDetail = computed(() => {
  return productData.value?.data?.storeInfo
})

// 商品图片列表（如果只有一张图片，则只显示一张）
const productImages = computed(() => {
  if (!productDetail.value?.image)
    return []
  return [productDetail.value.image]
})

// 格式化价格显示
function formatPrice(price?: number) {
  if (!price)
    return '0.00'
  return (price / 100).toFixed(2) // 假设后端返回的是分为单位
}

onLoad((options) => {
  if (options?.id) {
    productId.value = Number(options.id)
    loadProductDetail()
  }
})

// 调整数量
function adjustQuantity(delta: number) {
  const newQuantity = quantity.value + delta
  if (newQuantity >= 1) {
    quantity.value = newQuantity
  }
}

// 添加到购物车请求
const { loading: addCartLoading, run: runAddToCart } = useRequest(() =>
  addToCartAPI({
    cartNum: quantity.value,
    productId: productDetail.value!.id,
  }),
)

// 添加到购物车
async function addToCart() {
  if (!productDetail.value)
    return

  try {
    await runAddToCart()
    uni.showToast({
      title: `已添加${productDetail.value.store_name}到购物车`,
      icon: 'success',
    })
  }
  catch (error) {
    uni.showToast({
      title: '添加失败，请重试',
      icon: 'error',
    })
  }
}

// 立即购买
async function buyNow() {
  if (!productDetail.value)
    return

  try {
    // 先添加到购物车
    const cartResult = await addToCartAPI({
      cartNum: quantity.value,
      productId: productDetail.value.id,
    })

    // 跳转到订单确认页面
    uni.navigateTo({
      url: `/pages/order/confirm?cartId=${cartResult.cartId}`,
    })
  }
  catch (error) {
    uni.showToast({
      title: '购买失败，请重试',
      icon: 'error',
    })
  }
}

// 分享商品
function shareProduct() {
  uni.showToast({
    title: '分享商品',
    icon: 'none',
  })
}

// 收藏商品
function favoriteProduct() {
  uni.showToast({
    title: '已收藏',
    icon: 'success',
  })
}

// 下载附件
function downloadFile() {
  if (!productDetail.value?.desc_file_url)
    return

  uni.downloadFile({
    url: productDetail.value.desc_file_url,
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
</script>

<template>
  <view class="min-h-screen bg-white">
    <!-- 加载状态 -->
    <view v-if="loading" class="flex items-center justify-center py-20">
      <wd-loading />
      <text class="ml-2 text-gray-500">加载中...</text>
    </view>

    <!-- 商品详情内容 -->
    <view v-else-if="productDetail">
      <!-- 头部导航 -->
      <!-- <view class="flex items-center justify-between border-b border-gray-100 p-4">
        <uni-icons type="left" color="#6b7280" size="18" @click="() => uni.navigateBack()" />
        <view class="flex space-x-4">
          <uni-icons type="heart" color="#6b7280" size="18" @click="favoriteProduct" />
          <uni-icons type="redo" color="#6b7280" size="18" @click="shareProduct" />
        </view>
      </view> -->

      <!-- 商品图片轮播 -->
      <view class="relative">
        <swiper
          v-if="productImages.length > 1"
          :current="currentImageIndex"
          class="h-64"
          @change="(e) => currentImageIndex = e.detail.current"
        >
          <swiper-item v-for="(image, index) in productImages" :key="index">
            <image :src="image" class="h-full w-full object-cover" mode="aspectFill" />
          </swiper-item>
        </swiper>
        <image
          v-else-if="productImages.length === 1"
          :src="productImages[0]"
          class="h-64 w-full object-cover"
          mode="aspectFill"
        />
        <view v-if="productImages.length > 1" class="absolute bottom-4 right-4 rounded bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
          {{ currentImageIndex + 1 }}/{{ productImages.length }}
        </view>
      </view>

      <!-- 商品信息 -->
      <view class="p-4">
        <view class="mb-4">
          <text class="mb-2 block text-xl text-gray-800 font-semibold">{{ productDetail.store_name }}</text>
          <!-- <text class="text-sm text-gray-600">整理人：{{ productDetail.collator }}</text> -->
        </view>

        <view class="mb-4 flex items-center justify-between">
          <view class="flex items-baseline">
            <text class="text-2xl text-red-500 font-bold">¥{{ formatPrice(productDetail.price) }}</text>
          </view>
          <text class="text-sm text-gray-500">销售 {{ productDetail.sales }}+</text>
        </view>

        <view v-if="productDetail.desc_file_url" class="mb-4 rounded-lg bg-gray-50 p-3">
          <text class="mb-2 block text-sm text-gray-800 font-medium">相关附件</text>
          <view class="flex items-center justify-between">
            <text class="text-sm text-blue-600">{{ productDetail.desc_file_name }}</text>
            <wd-button size="small" type="primary" @click="downloadFile">
              下载
            </wd-button>
          </view>
        </view>

        <!-- 数量选择 -->
        <view class="mb-6">
          <text class="mb-2 block text-sm text-gray-800 font-medium">数量</text>
          <view class="flex items-center">
            <wd-button
              size="small"
              type="default"
              :disabled="quantity <= 1"
              @click="adjustQuantity(-1)"
            >
              <uni-icons type="minus" size="24" />
            </wd-button>
            <view class="text-md px-2">
              {{ quantity }}
            </view>
            <wd-button size="small" type="default" @click="adjustQuantity(1)">
              <uni-icons type="plus" size="24" />
            </wd-button>
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
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
      <view class="h-20" />
    </view>

    <!-- 商品不存在提示 -->
    <view v-else class="flex flex-col items-center justify-center py-20">
      <uni-icons type="shop" color="#d1d5db" size="48" />
      <text class="mt-4 text-gray-500">商品不存在</text>
    </view>
  </view>
</template>
