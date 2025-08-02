<template>
  <view class="status-bar">
    <view class="status-left">
      <view class="title-section">
        <text class="anchor-icon">⚓</text>
        <text class="title">{{ title }}</text>
      </view>
      <view class="system-status">
        <view class="status-dot"></view>
        <text class="status-text">系统在线</text>
      </view>
    </view>
    
    <view class="status-right">
      <view class="status-item">
        <text class="ship-icon">🚢</text>
        <text class="status-value">{{ shipCount }}艘在线</text>
      </view>
      <view class="status-item">
        <text class="signal-icon">📡</text>
        <text class="status-value">信号{{ signalStatus }}</text>
      </view>
      <view class="status-item">
        <text class="time-icon">🕐</text>
        <text class="status-value">{{ currentTime }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title: string
  shipCount: number
  signalStatus: string
  currentTime: string
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20rpx);
  padding: 24rpx 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.2);
}

.status-left {
  display: flex;
  align-items: center;
  gap: 32rpx;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  
  .anchor-icon {
    color: #4FD1C7;
    font-size: 32rpx;
  }
  
  .title {
    color: white;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.system-status {
  display: flex;
  align-items: center;
  gap: 12rpx;
  
  .status-dot {
    width: 16rpx;
    height: 16rpx;
    background: #10B981;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  .status-text {
    color: #10B981;
    font-size: 24rpx;
  }
}

.status-right {
  display: flex;
  align-items: center;
  gap: 48rpx;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  .ship-icon,
  .signal-icon,
  .time-icon {
    color: #4FD1C7;
    font-size: 24rpx;
  }
  
  .status-value {
    color: white;
    font-size: 24rpx;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .status-bar {
    height: 100rpx;
    padding: 16rpx 32rpx;
  }
  
  .title-section .title {
    font-size: 28rpx;
  }
  
  .status-right {
    gap: 32rpx;
  }
  
  .status-item .status-value {
    font-size: 22rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .status-bar {
    height: 140rpx;
    padding: 32rpx;
  }
  
  .status-right {
    flex-direction: column;
    gap: 8rpx;
    align-items: flex-end;
  }
  
  .status-item .status-value {
    font-size: 20rpx;
  }
}
</style>
