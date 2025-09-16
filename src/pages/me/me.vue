<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { LOGIN_PAGE } from '@/router/config'
import { useTokenStore, useUserStore } from '@/store'

definePage({
  style: {
    navigationBarTitleText: '我的',
  },
})

const userStore = useUserStore()
const tokenStore = useTokenStore()
const { userInfo } = storeToRefs(userStore)

// 功能菜单
const menuItems = ref([
  { icon: 'list', title: '我的订单', path: '/pages/order/list' },
  { icon: 'location', title: '收货地址', path: '/pages/address/list' },
])

// 微信小程序下登录
async function handleLogin() {
  // #ifdef MP-WEIXIN
  await tokenStore.wxLogin()
  // #endif
  // #ifndef MP-WEIXIN
  uni.navigateTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent('/pages/me/me')}`,
  })
  // #endif
}

// 退出登录
function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        useTokenStore().logout()
        uni.showToast({
          title: '退出登录成功',
          icon: 'success',
        })
      }
    },
  })
}

function handleMenuItem(item: any) {
  uni.navigateTo({ url: item.path })
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 头部用户信息 -->
    <view class="from-gray-50 to-white bg-gradient-to-r p-4">
      <view v-if="tokenStore.hasLogin" class="flex items-center space-x-4">
        <image
          :src="userInfo.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'"
          class="h-16 w-16 rounded-full"
          mode="aspectFill"
        />
        <view>
          <text class="block text-lg text-gray-800 font-semibold">{{ userInfo.nickname || userInfo.username || '用户' }}</text>
          <text class="text-sm text-gray-500">会员等级：金牌会员</text>
        </view>
      </view>
      <view v-else class="flex items-center space-x-4">
        <image
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
          class="h-16 w-16 rounded-full"
          mode="aspectFill"
        />
        <view>
          <text class="block text-lg text-gray-800 font-semibold">未登录</text>
          <text class="text-sm text-gray-500">请先登录</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="mt-4">
      <view
        v-for="item in menuItems"
        :key="item.title"
        class="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3"
        @click="handleMenuItem(item)"
      >
        <view class="flex items-center">
          <uni-icons :type="item.icon" color="#6b7280" size="18" class="mr-3" />
          <text class="text-gray-800">{{ item.title }}</text>
        </view>
        <uni-icons type="right" color="#9ca3af" size="14" />
      </view>
    </view>

    <!-- 登录/退出登录按钮 -->
    <view class="mt-8 p-4">
      <wd-button v-if="tokenStore.hasLogin" type="error" block @click="handleLogout">
        退出登录
      </wd-button>
      <wd-button v-else type="primary" block @click="handleLogin">
        登录
      </wd-button>
    </view>
  </view>
</template>
