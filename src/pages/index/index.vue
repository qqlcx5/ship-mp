<script lang="ts" setup>
import type { INoticeInfo, ISlideItem } from '@/api/shop'
import { getNoticeAPI, getSlidesAPI } from '@/api/shop'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'Home',
})
definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const slides = ref<ISlideItem[]>([])
const notice = ref<INoticeInfo | null>(null)
const currentSlideIndex = ref(0)
const swiperInstance = ref()

// 加载轮播图
async function loadSlides() {
  try {
    slides.value = await getSlidesAPI()
  }
  catch (error) {
    console.error('Failed to load slides:', error)
    // 提供默认轮播图
    slides.value = [{
      id: 1,
      title: '精选好物',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
      sort: 1,
      status: 1,
    }]
  }
}

// 加载公告
async function loadNotice() {
  try {
    notice.value = await getNoticeAPI()
  }
  catch (error) {
    console.error('Failed to load notice:', error)
    // 提供默认公告
    notice.value = {
      id: 1,
      title: '新用户注册即享8折优惠',
      content: '新用户注册即享8折优惠',
      type: 1,
      status: 1,
      created_at: '2024-08-29',
    }
  }
}

// 轮播图切换
function onSwiperChange(e: any) {
  currentSlideIndex.value = e.detail.current
}

// 快捷功能点击
function handleQuickAction(action: string) {
  switch (action) {
    case 'products':
      uni.switchTab({ url: '/pages/products/list' })
      break
    case 'pickup':
      uni.switchTab({ url: '/pages/pickup/list' })
      break
    case 'orders':
      uni.switchTab({ url: '/pages/orders/list' })
      break
    case 'profile':
      uni.switchTab({ url: '/pages/me/me' })
      break
  }
}

onLoad(() => {
  loadSlides()
  loadNotice()
})
</script>

<template>
  <view class="min-h-screen bg-gray-50" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <!-- 顶部导航 -->
    <view class="flex items-center justify-between bg-white p-4">
      <view class="text-xl text-gray-800 font-bold">
        MINIMAL
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="relative mx-4 mt-4 h-48 overflow-hidden rounded-lg from-gray-100 to-gray-200 bg-gradient-to-r">
      <swiper
        ref="swiperInstance"
        class="h-full w-full"
        indicator-dots
        autoplay
        interval="3000"
        duration="500"
        @change="onSwiperChange"
      >
        <swiper-item v-for="(slide, index) in slides" :key="slide.id">
          <image
            :src="slide.image"
            class="h-full w-full object-cover"
            :alt="slide.title"
            mode="aspectFill"
          />
          <view class="absolute bottom-4 left-4 text-white">
            <text class="text-lg font-semibold">{{ slide.title }}</text>
            <text class="block text-sm opacity-90">发现生活之美</text>
          </view>
        </swiper-item>
      </swiper>

      <!-- 自定义指示器 -->
      <view class="absolute bottom-4 right-4 flex space-x-1">
        <view
          v-for="(slide, index) in slides"
          :key="index"
          class="h-2 w-2 rounded-full transition-opacity"
          :class="index === currentSlideIndex ? 'bg-white' : 'bg-white opacity-50'"
        />
      </view>
    </view>

    <!-- 公告栏 -->
    <view v-if="notice" class="mx-4 mt-4 border-l-4 border-blue-400 rounded-lg bg-blue-50 p-3">
      <view class="flex items-center">
        <uni-icons type="sound" size="16" color="#2563eb" class="mr-2" />
        <text class="text-sm text-blue-800">{{ notice.content }}</text>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="grid grid-cols-4 mt-4 gap-4 p-4">
      <view class="text-center" @click="handleQuickAction('products')">
        <view class="mx-auto mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
          <uni-icons type="bag" size="24" color="#6b7280" />
        </view>
        <text class="text-xs text-gray-700">商品</text>
      </view>
      <view class="text-center" @click="handleQuickAction('pickup')">
        <view class="mx-auto mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
          <uni-icons type="cart" size="24" color="#6b7280" />
        </view>
        <text class="text-xs text-gray-700">取件</text>
      </view>
      <view class="text-center" @click="handleQuickAction('orders')">
        <view class="mx-auto mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
          <uni-icons type="list" size="24" color="#6b7280" />
        </view>
        <text class="text-xs text-gray-700">订单</text>
      </view>
      <view class="text-center" @click="handleQuickAction('profile')">
        <view class="mx-auto mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
          <uni-icons type="contact" size="24" color="#6b7280" />
        </view>
        <text class="text-xs text-gray-700">我的</text>
      </view>
    </view>

    <!-- 推荐商品区域 -->
    <view class="mx-4 mb-4 mt-6">
      <view class="mb-4 text-lg text-gray-800 font-semibold">
        热门推荐
      </view>
      <view class="grid grid-cols-2 gap-4">
        <view class="overflow-hidden border border-gray-100 rounded-lg bg-white shadow-sm">
          <image
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop"
            class="h-32 w-full object-cover"
            mode="aspectFill"
          />
          <view class="p-3">
            <text class="mb-1 block text-sm text-gray-800 font-medium">无线蓝牙耳机</text>
            <text class="mb-2 block text-xs text-gray-500">高品质音响效果</text>
            <view class="flex items-center justify-between">
              <text class="text-red-500 font-semibold">¥299</text>
              <view class="h-6 w-6 flex items-center justify-center rounded-full bg-blue-500">
                <uni-icons type="plus" size="12" color="white" />
              </view>
            </view>
          </view>
        </view>

        <view class="overflow-hidden border border-gray-100 rounded-lg bg-white shadow-sm">
          <image
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop"
            class="h-32 w-full object-cover"
            mode="aspectFill"
          />
          <view class="p-3">
            <text class="mb-1 block text-sm text-gray-800 font-medium">运动鞋</text>
            <text class="mb-2 block text-xs text-gray-500">舒适透气设计</text>
            <view class="flex items-center justify-between">
              <text class="text-red-500 font-semibold">¥599</text>
              <view class="h-6 w-6 flex items-center justify-center rounded-full bg-blue-500">
                <uni-icons type="plus" size="12" color="white" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="h-20" />
  </view>
</template>
