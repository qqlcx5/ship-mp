<template>
  <view class="modal-overlay" @click="handleOverlayClick">
    <view class="modal-content" @click.stop>
      <!-- 标题栏 -->
      <view class="modal-header">
        <text class="modal-title">{{ ship.name }} 详情</text>
        <button class="close-btn" @click="$emit('close')">
          <text class="close-icon">✕</text>
        </button>
      </view>
      
      <!-- 船只状态 -->
      <view class="ship-status">
        <view class="status-indicator" :class="ship.status"></view>
        <text class="status-text">{{ getStatusText(ship.status) }}</text>
      </view>
      
      <!-- 基本信息 -->
      <view class="info-section">
        <text class="section-title">基本信息</text>
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">船只编号</text>
            <text class="info-value">{{ ship.id }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">当前速度</text>
            <text class="info-value">{{ ship.speed }} 节</text>
          </view>
          <view class="info-item">
            <text class="info-label">航向角度</text>
            <text class="info-value">{{ ship.course }}°</text>
          </view>
          <view class="info-item">
            <text class="info-label">电池电量</text>
            <text class="info-value" :class="getBatteryClass(ship.battery)">
              {{ ship.battery }}%
            </text>
          </view>
        </view>
      </view>
      
      <!-- 位置信息 -->
      <view class="info-section">
        <text class="section-title">位置信息</text>
        <view class="location-info">
          <view class="location-item">
            <text class="location-label">纬度</text>
            <text class="location-value">{{ ship.lat.toFixed(6) }}</text>
          </view>
          <view class="location-item">
            <text class="location-label">经度</text>
            <text class="location-value">{{ ship.lng.toFixed(6) }}</text>
          </view>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-btn primary" @click="handleControl">
          <text class="btn-icon">🎮</text>
          <text class="btn-text">远程控制</text>
        </button>
        <button class="action-btn secondary" @click="handleTrack">
          <text class="btn-icon">📍</text>
          <text class="btn-text">实时跟踪</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Ship {
  id: string
  name: string
  lat: number
  lng: number
  status: 'online' | 'warning' | 'offline'
  speed: number
  battery: number
  course: number
}

interface Props {
  ship: Ship
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const getStatusText = (status: string) => {
  switch (status) {
    case 'online':
      return '在线运行'
    case 'warning':
      return '警告状态'
    case 'offline':
      return '离线状态'
    default:
      return '未知状态'
  }
}

const getBatteryClass = (battery: number) => {
  if (battery < 20) return 'battery-critical'
  if (battery < 50) return 'battery-warning'
  return 'battery-good'
}

const handleOverlayClick = () => {
  emit('close')
}

const handleControl = () => {
  // 跳转到手动控制页面
  uni.navigateTo({
    url: '/pages/manual/manual'
  })
  emit('close')
}

const handleTrack = () => {
  // 开启实时跟踪
  uni.showToast({
    title: '已开启实时跟踪',
    icon: 'success'
  })
  emit('close')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.modal-content {
  background: rgba(0, 0, 0, 0.9);
  border: 2rpx solid rgba(79, 209, 199, 0.5);
  border-radius: 24rpx;
  padding: 48rpx;
  max-width: 640rpx;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
  
  .modal-title {
    color: white;
    font-size: 36rpx;
    font-weight: bold;
  }
  
  .close-btn {
    width: 64rpx;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .close-icon {
      color: white;
      font-size: 24rpx;
    }
  }
}

.ship-status {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 32rpx;
  
  .status-indicator {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    
    &.online {
      background: #10B981;
      animation: pulse 2s infinite;
    }
    
    &.warning {
      background: #F59E0B;
      animation: pulse 2s infinite;
    }
    
    &.offline {
      background: #6B7280;
    }
  }
  
  .status-text {
    color: white;
    font-size: 28rpx;
  }
}

.info-section {
  margin-bottom: 32rpx;
  
  .section-title {
    color: #4FD1C7;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
    display: block;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.info-item {
  .info-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .info-value {
    color: white;
    font-size: 28rpx;
    font-weight: 600;
    display: block;
    
    &.battery-critical {
      color: #EF4444;
    }
    
    &.battery-warning {
      color: #F59E0B;
    }
    
    &.battery-good {
      color: #10B981;
    }
  }
}

.location-info {
  display: flex;
  gap: 32rpx;
}

.location-item {
  flex: 1;
  
  .location-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .location-value {
    color: #4FD1C7;
    font-size: 24rpx;
    font-family: monospace;
    display: block;
  }
}

.action-buttons {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  transition: all 0.3s ease;
  
  .btn-icon {
    font-size: 28rpx;
  }
  
  .btn-text {
    font-size: 28rpx;
    font-weight: 600;
  }
  
  &.primary {
    background: linear-gradient(to right, #4FD1C7, #60A5FA);
    color: white;
    
    &:hover {
      background: linear-gradient(to right, #2DD4BF, #3B82F6);
      transform: translateY(-2rpx);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    color: white;
    
    &:hover {
      background: rgba(79, 209, 199, 0.2);
      border-color: rgba(79, 209, 199, 0.5);
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .modal-content {
    max-width: 800rpx;
    padding: 32rpx;
  }
  
  .info-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .modal-content {
    max-height: 90vh;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16rpx;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
