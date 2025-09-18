<script lang="ts" setup>
import { storeToRefs } from 'pinia'
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
  { icon: 'i-carbon-list', title: '我的订单', path: '/pages/order/list' },
  { icon: 'i-carbon-location', title: '收货地址', path: '/pages/address/list' },
])

// 获取用户手机号
function handleGetPhoneNumber(e: any) {
  if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
    uni.showToast({
      title: '用户拒绝授权',
      icon: 'none',
    })
  }
  else if (e.detail.errMsg === 'getPhoneNumber:ok') {
    console.log('微信登录-手机号: ', e.detail)
    tokenStore.wxLogin({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    })
  }
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
          :src="userInfo.avatar || 'https://images.unsplash.com/photo-1757373406236-f03e14c3e5c5?w=80&h=80&fit=crop&crop=face'"
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
          src="https://images.unsplash.com/photo-1757373406236-f03e14c3e5c5?w=80&h=80&fit=crop&crop=face"
          class="h-16 w-16 rounded-full"
          mode="aspectFill"
        />
        <view class="text-lg text-gray-500">
          请先登录
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
          <view :class="item.icon" class="mr-3 text-[18px] text-[#6b7280]" />
          <text class="text-gray-800">{{ item.title }}</text>
        </view>
        <view class="i-carbon-chevron-right text-[14px] text-[#9ca3af]" />
      </view>
    </view>

    <!-- 登录/退出登录按钮 -->
    <view class="mt-8 p-4">
      <button v-if="tokenStore.hasLogin" type="warn" block @click="handleLogout">
        退出登录
      </button>
      <button
        v-else type="primary" open-type="getPhoneNumber"
        @getphonenumber="handleGetPhoneNumber"
      >
        登录
      </button>
    </view>
  </view>
</template>
