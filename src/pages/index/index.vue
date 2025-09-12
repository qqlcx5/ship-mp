<script lang="ts" setup>
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

const themeStore = useThemeStore()

// 轮播图数据
const bannerList = ref([
  {
    id: 1,
    title: '精选好物',
    subtitle: '发现生活之美',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
  },
  {
    id: 2,
    title: '限时特惠',
    subtitle: '品质生活，优惠价格',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=200&fit=crop',
  },
  {
    id: 3,
    title: '新品上市',
    subtitle: '潮流前沿，抢先体验',
    image: 'https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?w=400&h=200&fit=crop',
  },
])

const currentBanner = ref(0)

// 快捷功能菜单
const quickMenus = ref([
  { icon: 'shop', title: '商品', path: '/pages/product/list' },
  { icon: 'calendar', title: '取件', path: '/pages/pickup/list' },
  { icon: 'list', title: '订单', path: '/pages/order/list' },
  { icon: 'contact', title: '我的', path: '/pages/me/me' },
])

// 公告信息
const announcement = ref('新用户注册即享8折优惠')

// 轮播图自动切换
onMounted(() => {
  setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % bannerList.value.length
  }, 3000)
})

// 快捷菜单点击
function handleQuickMenu(item: any) {
  if (item.path === '/pages/me/me' || item.path === '/pages/product/list' || item.path === '/pages/pickup/list') {
    uni.switchTab({ url: item.path })
  }
  else {
    uni.navigateTo({ url: item.path })
  }
}

onLoad(() => {
  console.log('首页加载完成')
})
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
        <swiper-item v-for="(banner, index) in bannerList" :key="banner.id">
          <view class="relative h-full from-gray-100 to-gray-200 bg-gradient-to-r">
            <image :src="banner.image" class="h-full w-full object-cover" mode="aspectFill" />
            <view class="absolute bottom-4 left-4 text-white">
              <text class="block text-lg font-semibold">{{ banner.title }}</text>
              <text class="text-sm opacity-90">{{ banner.subtitle }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
      <!-- 指示器 -->
      <view class="absolute bottom-4 right-4 flex space-x-1">
        <view
          v-for="(_, index) in bannerList"
          :key="index"
          class="h-2 w-2 rounded-full" :class="[currentBanner === index ? 'bg-white' : 'bg-white opacity-50']"
        />
      </view>
    </view>

    <!-- 公告栏 -->
    <view class="mx-4 mt-4 border-l-4 border-blue-400 rounded-lg bg-blue-50 p-3">
      <view class="flex items-center">
        <uni-icons type="sound-filled" color="#2563eb" size="16" class="mr-2" />
        <text class="text-sm text-blue-800">{{ announcement }}</text>
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
          <uni-icons :type="menu.icon" color="#6b7280" size="20" />
        </view>
        <text class="text-xs text-gray-700">{{ menu.title }}</text>
      </view>
    </view>
  </view>
</template>
