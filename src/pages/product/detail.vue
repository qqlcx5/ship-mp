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
const selectedSku = ref<ISkuItem | null>(null)
const selectedAttr = ref<Record<string, string>>({})

// 监听 SKU 属性变化，更新选中的 SKU
watch(selectedAttr, (newVal) => {
  if (!productDetail.value?.sku) {
    selectedSku.value = null
    return
  }
  const skuKey = Object.values(newVal).join(',')
  selectedSku.value = productDetail.value.sku.find(item => item.sku === skuKey) || null
}, { deep: true })

// 获取商品详情
const { loading, data: productData, run: loadProductDetail } = useRequest<IProductDetailResponse>(() =>
  getProductDetailAPI(productId.value),
)

// 商品详情
const productDetail = computed(() => {
  return productData.value?.storeInfo
})

// 商品图片列表（如果只有一张图片，则只显示一张）
const productImages = computed(() => {
  return productDetail.value?.slider_image || []
})

// 格式化价格显示
function formatPrice(price?: number | string) {
  if (!price)
    return '0.00'
  return price
}

// 获取当前显示价格
const displayPrice = computed(() => {
  return selectedSku.value?.price || productDetail.value?.price || '0.00'
})

// 获取当前库存
const displayStock = computed(() => {
  return selectedSku.value?.stock || productDetail.value?.stock || 0
})

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
    new: 1,
    uniqueld: '0',
    virtual_type: 0,
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
      new: 1,
      uniqueld: '0',
      virtual_type: 0,
    })
    console.log('cartResult', cartResult)

    if (!cartResult?.cartId)
      return
    // 跳转到订单确认页面
    uni.navigateTo({
      url: `/pages/order/confirm?cartId=${cartResult.cartId}`,
    })
  }
  catch (error) {
    console.log('购买失败', error)
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
        const filePath = res.tempFilePath
        console.log('filePath', filePath);
        
        uni.openDocument({
          filePath: filePath,
          showMenu: true,
          success: (openRes) => {
            console.log('打开文件成功', openRes)
            uni.showToast({
              title: '打开文件成功',
              icon: 'success',
            })
          },
          fail: (openErr) => {
            console.error('打开文件失败', openErr)
            uni.showToast({
              title: '打开文件失败',
              icon: 'none',
            })
          },
        })
      } else {
        console.error('下载文件失败，状态码：', res.statusCode)
        uni.showToast({
          title: '下载文件失败',
          icon: 'none',
        })
      }
    },
    fail: (err) => {
      console.error('下载文件失败', err)
      uni.showToast({
        title: '下载文件失败',
        icon: 'none',
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
        <view class="i-carbon-chevron-left text-[18px] text-[#6b7280]" @click="() => uni.navigateBack()" />
        <view class="flex space-x-4">
          <view class="i-carbon-favorite text-[18px] text-[#6b7280]" @click="favoriteProduct" />
          <view class="i-carbon-redo text-[18px] text-[#6b7280]" @click="shareProduct" />
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
            <text class="text-2xl text-red-500 font-bold">¥{{ formatPrice(displayPrice) }}</text>
          </view>
          <text class="text-sm text-gray-500">库存 {{ displayStock }}</text>
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

        <!-- SKU 选择 -->
        <view v-if="productDetail.attrInfo && productDetail.attrInfo.length > 0" class="mb-4">
          <view v-for="(attr, index) in productDetail.attrInfo" :key="index" class="mb-2">
            <text class="mb-2 block text-lg text-gray-800 font-medium">{{ attr.attrName }}</text>
            <view class="flex flex-wrap gap-2">
              <view
                v-for="(value, valIndex) in attr.attrValue"
                :key="valIndex"
                class="rounded-full px-3 py-1 text-sm" :class="[
                  selectedAttr[attr.attrName] === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600',
                ]"
                @click="selectedAttr[attr.attrName] = value"
              >
                {{ value }}
              </view>
            </view>
          </view>
        </view>

        <!-- 数量选择 -->
        <view class="flex items-center">
          <view class="mr-2 block text-lg text-gray-800 font-medium">
            数量
          </view>
          <view class="flex items-center">
            <wd-button
              icon="decrease"
              size="small"
              type="default"
              :disabled="quantity <= 1 || displayStock === 0"
              @click="adjustQuantity(-1)"
            />
            <view class="text-md px-2">
              {{ quantity }}
            </view>
            <wd-button icon="add" size="small" type="default" :disabled="quantity >= displayStock" @click="adjustQuantity(1)" />
          </view>
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <view class="flex">
          <wd-button custom-class="flex-1" size="medium" type="primary" @click="buyNow">
            立即购买
          </wd-button>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="h-20" />
    </view>

    <!-- 商品不存在提示 -->
    <view v-else class="flex flex-col items-center justify-center py-20">
      <view class="i-carbon-shopping-cart text-[48px] text-[#d1d5db]" />
      <text class="mt-4 text-gray-500">商品不存在</text>
    </view>
  </view>
</template>
