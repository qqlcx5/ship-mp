<script setup lang="ts">
import { onMounted } from 'vue'

// 页面加载时自动跳转到蓝牙连接页面
onMounted(() => {
  uni.switchTab({
    url: '/pages/bluetooth/connect'
  })
})

// 页面配置
definePage({
  style: {
    navigationBarTitleText: 'USV控制系统'
  }
})
</script>

<template>
  <view class="flex items-center justify-center h-screen bg-gray-100">
    <view class="text-center">
      <view class="text-2xl font-bold text-gray-800 mb-4">USV控制系统</view>
      <view class="text-gray-600">正在跳转到蓝牙连接...</view>
    </view>
  </view>
</template>
