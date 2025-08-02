<template>
  <view class="manual-container">
    <!-- 顶部状态栏 -->
    <view class="manual-header">
      <view class="header-left">
        <button class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </button>
        <view class="title-section">
          <text class="control-icon">🎮</text>
          <text class="title">手动导航控制</text>
        </view>
        <view class="connection-status">
          <view class="status-dot"></view>
          <text class="status-text">遥控连接</text>
        </view>
      </view>
      
      <!-- 实时参数显示 -->
      <view class="params-display">
        <view class="param-item">
          <text class="param-icon">⚡</text>
          <text class="param-label">功率:</text>
          <text class="param-value">{{ realTimeData.power }}W</text>
        </view>
        <view class="param-item">
          <text class="param-icon">🔌</text>
          <text class="param-label">电压:</text>
          <text class="param-value">{{ realTimeData.voltage }}V</text>
        </view>
        <view class="param-item">
          <text class="param-icon">🏃</text>
          <text class="param-label">速度:</text>
          <text class="param-value">{{ realTimeData.speed }}节</text>
        </view>
        <view class="param-item">
          <text class="param-icon">⏱️</text>
          <text class="param-label">运行:</text>
          <text class="param-value">{{ realTimeData.runtime }}</text>
        </view>
      </view>
    </view>
    
    <!-- 地图区域 -->
    <view class="map-area">
      <MapComponent 
        :ships="[currentShip]"
        :center="mapCenter"
        @ship-click="handleShipClick"
      />
    </view>
    
    <!-- 左侧控制按钮 -->
    <view class="left-controls">
      <ControlButton 
        v-for="control in leftControls"
        :key="control.key"
        :icon="control.icon"
        :label="control.label"
        :color="control.color"
        @click="handleControlClick(control.key)"
      />
    </view>
    
    <!-- 右下角摇杆控制器 -->
    <view class="joystick-area">
      <JoystickController 
        @control="handleJoystickControl"
        :x-value="joystickX"
        :y-value="joystickY"
      />
    </view>
    
    <!-- 底部菜单栏 -->
    <BottomMenu 
      :active-tab="'manual'"
      @tab-change="handleTabChange"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MapComponent from '@/components/MapComponent.vue'
import BottomMenu from '@/components/BottomMenu.vue'
import ControlButton from '@/components/ControlButton.vue'
import JoystickController from '@/components/JoystickController.vue'

interface RealTimeData {
  power: number
  voltage: number
  speed: number
  runtime: string
}

interface ControlItem {
  key: string
  icon: string
  label: string
  color: string
}

const realTimeData = ref<RealTimeData>({
  power: 85,
  voltage: 12.5,
  speed: 8.0,
  runtime: '02:34:15'
})

const joystickX = ref(0)
const joystickY = ref(0)

const mapCenter = ref({ lat: 26.0614, lng: 119.3061 })

const currentShip = ref({
  id: '001',
  name: '当前船只',
  lat: 26.0614,
  lng: 119.3061,
  status: 'online' as const,
  speed: 8.0,
  battery: 85,
  course: 120
})

const leftControls: ControlItem[] = [
  { key: 'emergency', icon: '🛑', label: '急停', color: 'red' },
  { key: 'anchor', icon: '⚓', label: '锚泊', color: 'yellow' },
  { key: 'warning', icon: '⚠️', label: '警报', color: 'orange' },
  { key: 'return', icon: '🏠', label: '回收', color: 'blue' }
]

let dataUpdateInterval: NodeJS.Timeout

const goBack = () => {
  uni.navigateBack()
}

const handleControlClick = (key: string) => {
  switch (key) {
    case 'emergency':
      handleEmergencyStop()
      break
    case 'anchor':
      handleAnchor()
      break
    case 'warning':
      handleWarning()
      break
    case 'return':
      handleReturn()
      break
  }
}

const handleEmergencyStop = () => {
  uni.showModal({
    title: '紧急停止',
    content: '确定要执行紧急停止吗？',
    success: (res) => {
      if (res.confirm) {
        // 执行急停逻辑
        joystickX.value = 0
        joystickY.value = 0
        realTimeData.value.speed = 0
        uni.showToast({
          title: '已执行紧急停止',
          icon: 'success'
        })
      }
    }
  })
}

const handleAnchor = () => {
  uni.showToast({
    title: '锚泊模式已启动',
    icon: 'success'
  })
}

const handleWarning = () => {
  uni.showToast({
    title: '警报已发出',
    icon: 'none'
  })
}

const handleReturn = () => {
  uni.showModal({
    title: '自动回收',
    content: '确定要启动自动回收模式吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '自动回收已启动',
          icon: 'success'
        })
      }
    }
  })
}

const handleJoystickControl = (data: { x: number; y: number }) => {
  joystickX.value = data.x
  joystickY.value = data.y
  
  // 根据摇杆输入计算速度
  const magnitude = Math.sqrt(data.x * data.x + data.y * data.y)
  realTimeData.value.speed = Math.round(magnitude * 10 * 100) / 100
  
  // 更新船只位置（模拟）
  const moveSpeed = 0.0001
  currentShip.value.lat += data.y * moveSpeed
  currentShip.value.lng += data.x * moveSpeed
}

const handleShipClick = (ship: any) => {
  // 处理船只点击事件
}

const handleTabChange = (tab: string) => {
  switch (tab) {
    case 'dashboard':
      uni.navigateTo({ url: '/pages/dashboard/dashboard' })
      break
    case 'cruise':
      uni.navigateTo({ url: '/pages/cruise/cruise' })
      break
    case 'ai':
      uni.navigateTo({ url: '/pages/ai/ai' })
      break
    case 'management':
      uni.navigateTo({ url: '/pages/management/management' })
      break
  }
}

const updateRealTimeData = () => {
  // 模拟实时数据更新
  realTimeData.value.power = 80 + Math.random() * 10
  realTimeData.value.voltage = 12.0 + Math.random() * 1.0
  
  // 更新运行时间
  const now = new Date()
  const startTime = new Date(now.getTime() - 2 * 60 * 60 * 1000 - 34 * 60 * 1000 - 15 * 1000)
  const diff = now.getTime() - startTime.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  realTimeData.value.runtime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  updateRealTimeData()
  dataUpdateInterval = setInterval(updateRealTimeData, 1000)
})

onUnmounted(() => {
  if (dataUpdateInterval) {
    clearInterval(dataUpdateInterval)
  }
})
</script>

<style lang="scss" scoped>
.manual-container {
  width: 100vw;
  height: 100vh;
  background: #0B1426;
  position: relative;
  overflow: hidden;
}

.manual-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 140rpx;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20rpx);
  padding: 16rpx 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.2);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .back-icon {
    color: white;
    font-size: 32rpx;
  }
}

.title-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  
  .control-icon {
    color: #4FD1C7;
    font-size: 32rpx;
  }
  
  .title {
    color: white;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.connection-status {
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

.params-display {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16rpx;
  padding: 16rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.param-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  .param-icon {
    font-size: 20rpx;
  }
  
  .param-label {
    color: white;
    font-size: 20rpx;
  }
  
  .param-value {
    color: #4FD1C7;
    font-size: 20rpx;
    font-family: monospace;
    font-weight: 600;
  }
}

.map-area {
  position: absolute;
  top: 140rpx;
  left: 0;
  right: 0;
  bottom: 104rpx;
}

.left-controls {
  position: absolute;
  left: 32rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.joystick-area {
  position: absolute;
  bottom: 140rpx;
  right: 32rpx;
  z-index: 1000;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .manual-header {
    height: 120rpx;
    padding: 12rpx 24rpx;
  }
  
  .params-display {
    grid-template-columns: repeat(4, 1fr);
    gap: 12rpx;
  }
  
  .param-item {
    gap: 6rpx;
    
    .param-icon,
    .param-label,
    .param-value {
      font-size: 18rpx;
    }
  }
  
  .map-area {
    top: 120rpx;
    bottom: 100rpx;
  }
  
  .joystick-area {
    bottom: 120rpx;
    right: 24rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .manual-header {
    height: 160rpx;
    flex-direction: column;
    gap: 16rpx;
    padding: 24rpx 32rpx;
  }
  
  .header-left {
    width: 100%;
    justify-content: space-between;
  }
  
  .params-display {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }
  
  .map-area {
    top: 160rpx;
    bottom: 120rpx;
  }
  
  .left-controls {
    left: 24rpx;
    gap: 16rpx;
  }
  
  .joystick-area {
    bottom: 160rpx;
    right: 24rpx;
  }
}
</style>
