<script lang="ts" setup>
import { getSlide } from '@/api/home'
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
const bannerList = ref([])

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

// 快捷菜单点击
function handleQuickMenu(item: any) {
  if (item.path === '/pages/me/me' || item.path === '/pages/product/list' || item.path === '/pages/pickup/list') {
    uni.switchTab({ url: item.path })
  }
  else {
    uni.navigateTo({ url: item.path })
  }
}

function getBannerList() {
  const { loading, error, data, run } = useRequest<any>(() => getSlide(), {
    immediate: true,
  })
  // console.log(`🚀 - getBannerList - data:`, data, typeof data, JSON.stringify(data))

  // console.log(`🚀 - getBannerList - bannerList.value:`, bannerList.value, data.value)
  // bannerList.value = (data)?.map((item: any) => item.image) as any
}

onLoad(() => {
  getBannerList()
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
      <wd-swiper
        v-model:current="currentBanner"
        :list="bannerList"
        autoplay
        value-key="image"
        :indicator="true"
        indicator-position="bottom-right"
      />
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
