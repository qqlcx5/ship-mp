<script lang="ts" setup>
import { safeAreaInsets } from '@/utils/systemInfo'
import { getSlidesAPI, getNoticeAPI, type ISlideItem, type INoticeInfo } from '@/api/shop'

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
const loadSlides = async () => {
  try {
    slides.value = await getSlidesAPI()
  } catch (error) {
    console.error('Failed to load slides:', error)
    // 提供默认轮播图
    slides.value = [{
      id: 1,
      title: '精选好物',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
      sort: 1,
      status: 1
    }]
  }
}

// 加载公告
const loadNotice = async () => {
  try {
    notice.value = await getNoticeAPI()
  } catch (error) {
    console.error('Failed to load notice:', error)
    // 提供默认公告
    notice.value = {
      id: 1,
      title: '新用户注册即享8折优惠',
      content: '新用户注册即享8折优惠',
      type: 1,
      status: 1,
      created_at: '2024-08-29'
    }
  }
}

// 轮播图切换
const onSwiperChange = (e: any) => {
  currentSlideIndex.value = e.detail.current
}

// 快捷功能点击
const handleQuickAction = (action: string) => {
  switch (action) {
    case 'products':
      uni.navigateTo({ url: '/pages/products/list' })
      break
    case 'pickup':
      uni.navigateTo({ url: '/pages/pickup/list' })
      break
    case 'orders':
      uni.navigateTo({ url: '/pages/orders/list' })
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
  <view class="bg-gray-50 min-h-screen" :style="{ paddingTop: `${safeAreaInsets?.top}px` }">
    <!-- 顶部导航 -->
    <view class="flex justify-between items-center p-4 bg-white">
      <view class="text-xl font-bold text-gray-800">MINIMAL</view>
    </view>

    <!-- 轮播图 -->
    <view class="relative h-48 bg-gradient-to-r from-gray-100 to-gray-200 mx-4 rounded-lg overflow-hidden mt-4">
      <swiper 
        class="w-full h-full"
        indicator-dots
        autoplay
        interval="3000"
        duration="500"
        @change="onSwiperChange"
        ref="swiperInstance"
      >
        <swiper-item v-for="(slide, index) in slides" :key="slide.id">
          <image 
            :src="slide.image" 
            class="w-full h-full object-cover" 
            :alt="slide.title"
            mode="aspectFill"
          />
          <view class="absolute bottom-4 left-4 text-white">
            <text class="text-lg font-semibold">{{ slide.title }}</text>
            <text class="text-sm opacity-90 block">发现生活之美</text>
          </view>
        </swiper-item>
      </swiper>
      
      <!-- 自定义指示器 -->
      <view class="absolute bottom-4 right-4 flex space-x-1">
        <view 
          v-for="(slide, index) in slides" 
          :key="index"
          class="w-2 h-2 rounded-full transition-opacity"
          :class="index === currentSlideIndex ? 'bg-white' : 'bg-white opacity-50'"
        ></view>
      </view>
    </view>

    <!-- 公告栏 -->
    <view v-if="notice" class="mx-4 mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
      <view class="flex items-center">
        <uni-icons type="sound" size="16" color="#2563eb" class="mr-2" />
        <text class="text-sm text-blue-800">{{ notice.content }}</text>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="grid grid-cols-4 gap-4 p-4 mt-4">
      <view class="text-center" @click="handleQuickAction('products')">
        <view class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <uni-icons type="bag" size="24" color="#6b7280" />
        </view>
        <text class="text-xs text-gray-700">商品</text>
      </view>
      <view class="text-center" @click="handleQuickAction('pickup')">
        <view class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <uni-icons type="cart" size="24" color="#6b7280" />
        </view>
        <text class="text-xs text-gray-700">取件</text>
      </view>
      <view class="text-center" @click="handleQuickAction('orders')">
        <view class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <uni-icons type="list" size="24" color="#6b7280" />
        </view>
        <text class="text-xs text-gray-700">订单</text>
      </view>
      <view class="text-center" @click="handleQuickAction('profile')">
        <view class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <uni-icons type="contact" size="24" color="#6b7280" />
        </view>
        <text class="text-xs text-gray-700">我的</text>
      </view>
    </view>

    <!-- 推荐商品区域 -->
    <view class="mx-4 mt-6 mb-4">
      <view class="text-lg font-semibold text-gray-800 mb-4">热门推荐</view>
      <view class="grid grid-cols-2 gap-4">
        <view class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <image 
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop" 
            class="w-full h-32 object-cover"
            mode="aspectFill"
          />
          <view class="p-3">
            <text class="text-sm font-medium text-gray-800 block mb-1">无线蓝牙耳机</text>
            <text class="text-xs text-gray-500 block mb-2">高品质音响效果</text>
            <view class="flex justify-between items-center">
              <text class="text-red-500 font-semibold">¥299</text>
              <view class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <uni-icons type="plus" size="12" color="white" />
              </view>
            </view>
          </view>
        </view>
        
        <view class="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <image 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop" 
            class="w-full h-32 object-cover"
            mode="aspectFill"
          />
          <view class="p-3">
            <text class="text-sm font-medium text-gray-800 block mb-1">运动鞋</text>
            <text class="text-xs text-gray-500 block mb-2">舒适透气设计</text>
            <view class="flex justify-between items-center">
              <text class="text-red-500 font-semibold">¥599</text>
              <view class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <uni-icons type="plus" size="12" color="white" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="h-20"></view>
  </view>
</template>
