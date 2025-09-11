<script lang="ts" setup>
import type { IUploadSuccessInfo } from '@/api/types/login'
import { storeToRefs } from 'pinia'
import { LOGIN_PAGE } from '@/router/config'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'
import { useUpload } from '@/utils/uploadFile'

definePage({
  style: {
    navigationBarTitleText: '我的',
  },
})

const userStore = useUserStore()
const tokenStore = useTokenStore()
// 使用storeToRefs解构userInfo
const { userInfo } = storeToRefs(userStore)

// 菜单项点击事件
const handleMenuClick = (type: string) => {
  switch (type) {
    case 'orders':
      uni.navigateTo({ url: '/pages/orders/list' })
      break
    case 'address':
      uni.navigateTo({ url: '/pages/address/list' })
      break
    case 'wallet':
      uni.showToast({ title: '钱包功能待实现', icon: 'none' })
      break
    case 'service':
      uni.showToast({ title: '客服中心功能待实现', icon: 'none' })
      break
    case 'settings':
      uni.showToast({ title: '设置功能待实现', icon: 'none' })
      break
  }
}

// #ifndef MP-WEIXIN
// 上传头像
const { run: uploadAvatar } = useUpload<IUploadSuccessInfo>(
  import.meta.env.VITE_UPLOAD_BASEURL,
  {},
  {
    onSuccess: (res) => {
      console.log('h5头像上传成功', res)
      useUserStore().setUserAvatar(res.url)
    },
  },
)
// #endif

// 微信小程序下登录
async function handleLogin() {
  // #ifdef MP-WEIXIN

  // 微信登录
  await tokenStore.wxLogin()
  // #endif
  // #ifndef MP-WEIXIN
  uni.navigateTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent('/pages/me/me')}`,
  })
  // #endif
}

// #ifdef MP-WEIXIN

// 微信小程序下选择头像事件
function onChooseAvatar(e: any) {
  console.log('选择头像', e.detail)
  const { avatarUrl } = e.detail
  const { run } = useUpload<IUploadSuccessInfo>(
    import.meta.env.VITE_UPLOAD_BASEURL,
    {},
    {
      onSuccess: (res) => {
        console.log('wx头像上传成功', res)
        useUserStore().setUserAvatar(res.url)
      },
    },
    avatarUrl,
  )
  run()
}
// #endif
// #ifdef MP-WEIXIN
// 微信小程序下设置用户名
function getUserInfo(e: any) {
  console.log(e.detail)
}
// #endif

// 退出登录
function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清空用户信息
        useTokenStore().logout()
        // 执行退出登录逻辑
        uni.showToast({
          title: '退出登录成功',
          icon: 'success',
        })
        // #ifdef MP-WEIXIN
        // 微信小程序，去首页
        // uni.reLaunch({ url: '/pages/index/index' })
        // #endif
        // #ifndef MP-WEIXIN
        // 非微信小程序，去登录页
        // uni.navigateTo({ url: LOGIN_PAGE })
        // #endif
      }
    },
  })
}
</script>

<template>
  <view class="bg-gray-50 min-h-screen">
    <!-- 头部用户信息 -->
    <view class="p-4 bg-gradient-to-r from-gray-50 to-white bg-white">
      <view class="flex items-center space-x-4">
        <!-- #ifdef MP-WEIXIN -->
        <button class="avatar-button" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image :src="userInfo.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'" mode="aspectFill" class="w-16 h-16 rounded-full" />
        </button>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <view @click="uploadAvatar">
          <image :src="userInfo.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'" mode="aspectFill" class="w-16 h-16 rounded-full" />
        </view>
        <!-- #endif -->
        
        <view class="flex-1">
          <!-- #ifdef MP-WEIXIN -->
          <input
            v-model="userInfo.username"
            type="nickname"
            class="text-lg font-semibold text-gray-800 bg-transparent border-none p-0"
            placeholder="请输入昵称"
          />
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <text class="text-lg font-semibold text-gray-800 block">{{ userInfo.username || '张三' }}</text>
          <!-- #endif -->
          <text class="text-sm text-gray-500">会员等级：金牌会员</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="mt-4 bg-white">
      <view 
        class="px-4 py-3 border-b border-gray-100 flex items-center justify-between active:bg-gray-50"
        @click="handleMenuClick('orders')"
      >
        <view class="flex items-center">
          <uni-icons type="list" size="20" color="#6b7280" class="mr-3" />
          <text class="text-gray-800">我的订单</text>
        </view>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
      
      <view 
        class="px-4 py-3 border-b border-gray-100 flex items-center justify-between active:bg-gray-50"
        @click="handleMenuClick('address')"
      >
        <view class="flex items-center">
          <uni-icons type="location" size="20" color="#6b7280" class="mr-3" />
          <text class="text-gray-800">收货地址</text>
        </view>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
      
      <!-- 可选菜单项 -->
      <!-- <view 
        class="px-4 py-3 border-b border-gray-100 flex items-center justify-between active:bg-gray-50"
        @click="handleMenuClick('wallet')"
      >
        <view class="flex items-center">
          <uni-icons type="wallet" size="20" color="#6b7280" class="mr-3" />
          <text class="text-gray-800">我的钱包</text>
        </view>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
      
      <view 
        class="px-4 py-3 border-b border-gray-100 flex items-center justify-between active:bg-gray-50"
        @click="handleMenuClick('service')"
      >
        <view class="flex items-center">
          <uni-icons type="headphones" size="20" color="#6b7280" class="mr-3" />
          <text class="text-gray-800">客服中心</text>
        </view>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view>
      
      <view 
        class="px-4 py-3 border-b border-gray-100 flex items-center justify-between active:bg-gray-50"
        @click="handleMenuClick('settings')"
      >
        <view class="flex items-center">
          <uni-icons type="gear" size="20" color="#6b7280" class="mr-3" />
          <text class="text-gray-800">设置</text>
        </view>
        <uni-icons type="right" size="14" color="#9ca3af" />
      </view> -->
    </view>

    <!-- 登录/退出按钮 -->
    <view class="mt-8 px-4">
      <button 
        v-if="tokenStore.hasLogin" 
        class="w-full py-3 bg-red-500 text-white rounded-lg font-medium"
        @click="handleLogout"
      >
        退出登录
      </button>
      <button 
        v-else 
        class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
        @click="handleLogin"
      >
        登录
      </button>
    </view>
    
    <!-- 调试信息 -->
    <!-- <view class="mt-3 px-4">
      <view class="text-xs text-gray-500 break-all">
        {{ JSON.stringify(userInfo, null, 2) }}
      </view>
    </view> -->
  </view>
</template>

<style lang="scss" scoped>
.avatar-button {
  padding: 0;
  border: none;
  background: none;
  border-radius: 50%;
}

.active\:bg-gray-50:active {
  background-color: #f9fafb;
}
</style>
