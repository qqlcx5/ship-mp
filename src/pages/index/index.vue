<script lang="ts" setup>
import type { SlideItem } from '@/api/types/common'
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { getNoticeInfo, getSlideList } from '@/api/home'
import { useShare } from '@/hooks/useShare'
import { useThemeStore } from '@/store'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const { shareOptions } = useShare({
  title: '首页',
  path: '/pages/index/index',
})

onShareAppMessage(() => shareOptions)
onShareTimeline(() => shareOptions)

const themeStore = useThemeStore()
// 获取轮播图数据
const {
  data: slideList,
  loading: slideLoading,
  error: slideError,
} = useRequest(() => getSlideList(), { immediate: true })
const currentBanner = ref(0)

// 快捷功能菜单
const quickMenus = ref([
  { icon: 'i-carbon-shopping-cart', title: '商品', path: '/pages/product/list' },
  { icon: 'i-carbon-calendar', title: '取件', path: '/pages/pickup/list' },
  // { icon: 'i-carbon-location', title: '地址', path: '/pages/address/list' },
  // { icon: 'i-carbon-list', title: '订单', path: '/pages/order/list' },
  // { icon: 'i-carbon-user-avatar', title: '我的', path: '/pages/me/me' },
])

// 公告信息
const announcement = ref('新用户注册即享8折优惠')

// 获取公告数据
const {
  data: noticeInfo,
  loading: noticeLoading,
  error: noticeError,
} = useRequest(() => getNoticeInfo(), { immediate: true })

// 处理轮播图点击
function handleSlideClick(item: SlideItem) {
  if (item.link) {
    uni.navigateTo({
      url: item.link,
    })
  }
}

function handleQuickMenu(item: any) {
  if (item.path === '/pages/me/me' || item.path === '/pages/product/list' || item.path === '/pages/pickup/list') {
    uni.switchTab({ url: item.path })
  }
  else {
    uni.navigateTo({ url: item.path })
  }
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <view class="flex items-center justify-between bg-white px-4 py-3" :style="{ paddingTop: `${safeAreaInsets?.top + 12}px` }">
      <view class="text-xl text-gray-800 font-bold">
        MINIMAL
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="relative mx-4 mt-4 h-48 overflow-hidden rounded-lg">
      <swiper
        :current="currentBanner"
        autoplay
        :interval="3000"
        :duration="300"
        circular
        class="h-full"
        @change="(e) => currentBanner = e.detail.current"
      >
        <swiper-item v-for="(banner, index) in slideList" :key="index">
          <view class="relative h-full from-gray-100 to-gray-200 bg-gradient-to-r">
            <image :src="banner.image" class="h-full w-full object-cover" mode="aspectFill" />
          </view>
        </swiper-item>
      </swiper>
      <!-- 指示器 -->
      <view class="absolute bottom-4 right-4 flex space-x-1">
        <view
          v-for="(_, index) in slideList"
          :key="index"
          class="h-2 w-2 rounded-full" :class="[currentBanner === index ? 'bg-white' : 'bg-white opacity-50']"
        />
      </view>
    </view>

    <!-- 公告栏 -->
    <view v-if="noticeInfo?.desc" class="mx-4 mt-4 border-l-4 border-blue-400 rounded-lg bg-blue-50 p-3">
      <view class="flex items-center">
        <view class="i-carbon-volume-up-filled mr-2 text-[16px] text-[#2563eb]" />
        <text class="text-sm text-blue-800">{{ noticeInfo.desc }}</text>
      </view>
    </view>

    <!-- 快捷功能 -->
    <view class="grid grid-cols-4 mt-4 gap-4 p-4">
      <view
        v-for="menu in quickMenus"
        :key="menu.title"
        class="text-center"
        @click="handleQuickMenu(menu)"
      >
        <view class="mx-auto mb-2 h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
          <view :class="menu.icon" class="text-[20px] text-[#6b7280]" />
        </view>
        <text class="text-xs text-gray-700">{{ menu.title }}</text>
      </view>
    </view>
  </view>
</template>
