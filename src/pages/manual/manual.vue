<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import BottomMenu from '@/components/BottomMenu.vue'
import ControlButton from '@/components/ControlButton.vue'
import JoystickController from '@/components/JoystickController.vue'
import MapComponent from '@/components/MapComponent.vue'
import { formatCurrent, formatNumber, formatPercentage, formatSpeed, formatVoltage } from '@/utils/index'

interface RealTimeData {
  power: number
  voltage: number
  speed: number
  runtime: string
  current: number
  remainingPower: number
  operatingPower: number
}

interface WeatherData {
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
}

interface SeaCondition {
  waveHeight: number
  seaState: string
  visibility: number
  waterTemperature: number
}

interface ControlItem {
  key: string
  icon: string
  label: string
  color: 'red' | 'yellow' | 'orange' | 'blue' | 'green' | 'purple'
}

const realTimeData = reactive<RealTimeData>({
  power: 85,
  voltage: 12.5,
  speed: 8.0,
  runtime: '02:34:15',
  current: 7.1,
  remainingPower: 78.5,
  operatingPower: 92.3,
})

const weatherData = reactive<WeatherData>({
  condition: '晴朗',
  temperature: 22.5,
  humidity: 65.2,
  windSpeed: 3.8,
  windDirection: '东北风',
})

const seaCondition = reactive<SeaCondition>({
  waveHeight: 1.2,
  seaState: '轻浪',
  visibility: 8.5,
  waterTemperature: 18.7,
})

const joystickX = ref(0)
const joystickY = ref(0)

const mapCenter = ref({ lat: 26.0614, lng: 119.3061 })

const currentShip = ref({
  id: '001',
  name: '当前船只',
  lat: 26.0654, // 更靠近海岸的位置
  lng: 119.3081, // 更靠近海岸的位置
  status: 'online' as const,
  speed: 8.0,
  battery: 85,
  course: 120,
})

const leftControls: ControlItem[] = [
  { key: 'emergency', icon: '🛑', label: '急停', color: 'red' },
  { key: 'anchor', icon: '⚓', label: '锚泊', color: 'yellow' },
  { key: 'warning', icon: '⚠️', label: '警报', color: 'orange' },
]

let dataUpdateInterval: NodeJS.Timeout

function goBack() {
  uni.navigateBack()
}

function handleControlClick(key: string) {
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
  }
}

function handleEmergencyStop() {
  uni.showModal({
    title: '紧急停止',
    content: '确定要执行紧急停止吗？',
    success: (res) => {
      if (res.confirm) {
        // 执行急停逻辑
        joystickX.value = 0
        joystickY.value = 0
        realTimeData.speed = 0
        uni.showToast({
          title: '已执行紧急停止',
          icon: 'success',
        })
      }
    },
  })
}

function handleAnchor() {
  uni.showToast({
    title: '锚泊模式已启动',
    icon: 'success',
  })
}

function handleWarning() {
  uni.showToast({
    title: '警报已发出',
    icon: 'none',
  })
}


function handleJoystickControl(data: { x: number, y: number }) {
  joystickX.value = data.x
  joystickY.value = data.y

  // 根据摇杆输入计算速度（范围0-100转换为0-10节）
  const magnitude = Math.sqrt(data.x * data.x + data.y * data.y)
  realTimeData.speed = Math.round(magnitude * 10 * 100) / 100

  // 更新船只位置（模拟）
  // 修正坐标系：X控制经度（左右），Y控制纬度（上下）
  const moveSpeed = 0.00001 // 调整移动速度，适配新的控制范围
  currentShip.value.lat += (data.y / 100) * moveSpeed // Y轴控制纬度：正值向北，负值向南
  currentShip.value.lng += (data.x / 100) * moveSpeed // X轴控制经度：正值向东，负值向西

  // 更新船只航向
  if (magnitude > 10) { // 调整阈值，适配新的控制范围
    currentShip.value.course = Math.round((Math.atan2(data.x, data.y) * 180 / Math.PI + 360) % 360)
  }
}

function handleShipClick(_ship: any) {
  // 处理船只点击事件
}

function handleTabChange(tab: string) {
  switch (tab) {
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

function updateRealTimeData() {
  // 模拟实时数据更新
  realTimeData.power = Math.round((80 + Math.random() * 20) * 100) / 100
  realTimeData.voltage = Math.round((12 + Math.random() * 2) * 100) / 100
  realTimeData.current = Math.round((6 + Math.random() * 3) * 100) / 100
  realTimeData.remainingPower = Math.round((70 + Math.random() * 20) * 100) / 100
  realTimeData.operatingPower = Math.round((85 + Math.random() * 15) * 100) / 100

  // 更新天气数据
  weatherData.temperature = Math.round((20 + Math.random() * 10) * 10) / 10
  weatherData.humidity = Math.round((60 + Math.random() * 20) * 10) / 10
  weatherData.windSpeed = Math.round((2 + Math.random() * 5) * 10) / 10
  weatherData.condition = ['晴朗', '多云', '阴天'][Math.floor(Math.random() * 3)]

  // 更新海况数据
  seaCondition.waveHeight = Math.round((0.8 + Math.random() * 1.0) * 10) / 10
  seaCondition.visibility = Math.round((7 + Math.random() * 5) * 10) / 10
  seaCondition.waterTemperature = Math.round((16 + Math.random() * 6) * 10) / 10
  seaCondition.seaState = ['平静', '轻浪', '中浪'][Math.floor(Math.random() * 3)]

  // 更新运行时间
  const now = new Date()
  const startTime = new Date(now.getTime() - 2 * 60 * 60 * 1000 - 34 * 60 * 1000 - 15 * 1000)
  const diff = now.getTime() - startTime.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  realTimeData.runtime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  // 更新船只电量和速度
  currentShip.value.battery = Math.round(realTimeData.remainingPower)
  currentShip.value.speed = Math.round(realTimeData.speed * 10) / 10
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

<template>
  <view class="manual-container">
    <!-- 顶部状态栏 -->
    <view class="manual-header">
      <view class="header-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="title-section">
          <text class="control-icon">🎮</text>
          <text class="title">手动导航控制</text>
        </view>
        <view class="connection-status">
          <view class="status-dot" />
          <text class="status-text">遥控连接</text>
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

      <!-- 实时数据显示卡片 -->
      <view class="data-cards-container">
        <!-- 天气海况卡片 -->
        <view class="data-card weather-card">
          <view class="card-header">
            <text class="card-icon">🌤️</text>
            <text class="card-title">天气海况 {{ weatherData.condition }}</text>
          </view>
          <view class="card-grid">
            <view class="card-item">
              <text class="item-icon">🌡️</text>
              <view class="item-content">
                <text class="item-label">温度</text>
                <text class="item-value">{{ formatNumber(weatherData.temperature) }}°C</text>
              </view>
            </view>
            <view class="card-item">
              <text class="item-icon">💨</text>
              <view class="item-content">
                <text class="item-label">风速</text>
                <text class="item-value">{{ formatNumber(weatherData.windSpeed) }}m/s</text>
              </view>
            </view>
            <view class="card-item full-width">
              <text class="item-icon">👁️</text>
              <view class="item-content">
                <text class="item-label">能见度</text>
                <text class="item-value">{{ formatNumber(seaCondition.visibility) }}km</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 船舶状态卡片 -->
        <view class="data-card ship-card">
          <view class="card-header">
            <text class="card-icon">🚢</text>
            <text class="card-title">船舶状态</text>
          </view>
          <view class="card-grid">
            <view class="card-item">
              <text class="item-icon">⚡</text>
              <view class="item-content">
                <text class="item-label">时速</text>
                <text class="item-value">{{ formatSpeed(realTimeData.speed) }}</text>
              </view>
            </view>
            <view class="card-item">
              <text class="item-icon">🔋</text>
              <view class="item-content">
                <text class="item-label">电量</text>
                <text class="item-value">{{ formatPercentage(realTimeData.remainingPower) }}</text>
              </view>
            </view>
            <view class="card-item">
              <text class="item-icon">🔌</text>
              <view class="item-content">
                <text class="item-label">电流</text>
                <text class="item-value">{{ formatCurrent(realTimeData.current) }}</text>
              </view>
            </view>
            <view class="card-item">
              <text class="item-icon">⚡</text>
              <view class="item-content">
                <text class="item-label">电压</text>
                <text class="item-value">{{ formatVoltage(realTimeData.voltage) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
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
        :x-value="joystickX"
        :y-value="joystickY"
        @control="handleJoystickControl"
      />
    </view>

    <!-- 底部菜单栏 -->
    <BottomMenu
      active-tab="manual"
      @tab-change="handleTabChange"
    />
  </view>
</template>

<style lang="scss" scoped>
.manual-container {
  width: 100vw;
  height: 100vh;
  background: #0b1426;
  position: relative;
  overflow: hidden;
}

.manual-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100rpx;
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
    color: #4fd1c7;
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
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .status-text {
    color: #10b981;
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
    color: #4fd1c7;
    font-size: 20rpx;
    font-family: monospace;
    font-weight: 600;
  }
}

.map-area {
  position: absolute;
  top: 100rpx;
  left: 0;
  right: 0;
  bottom: 104rpx; /* 增加底部边距，避免被底部栏遮挡 */
}

.data-cards-container {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.data-card {
  background: rgba(26, 35, 50, 0.85);
  border: 1rpx solid rgba(79, 209, 199, 0.3);
  border-radius: 12rpx;
  padding: 16rpx;
  backdrop-filter: blur(20rpx);
  -webkit-backdrop-filter: blur(20rpx);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  min-width: 280rpx;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(26, 35, 50, 0.9);
    border-color: rgba(79, 209, 199, 0.5);
    transform: translateY(-2rpx);
    box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.4);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 12rpx;
  padding-bottom: 8rpx;
  border-bottom: 1rpx solid rgba(79, 209, 199, 0.2);

  .card-icon {
    font-size: 24rpx;
  }

  .card-title {
    color: #4fd1c7;
    font-size: 24rpx;
    font-weight: 600;
  }
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;

  .card-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 8rpx;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8rpx;
    border: 1rpx solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(79, 209, 199, 0.1);
      border-color: rgba(79, 209, 199, 0.3);
    }

    &.full-width {
      grid-column: 1 / -1;
    }

    .item-icon {
      font-size: 20rpx;
      min-width: 20rpx;
    }

    .item-content {
      display: flex;
      flex-direction: column;
      gap: 2rpx;
      flex: 1;
      min-width: 0;

      .item-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 18rpx;
        line-height: 1;
      }

      .item-value {
        color: #4fd1c7;
        font-size: 20rpx;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
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
  bottom: 180rpx; /* 调整摇杆位置，避免被底部栏遮挡 */
  right: 32rpx;
  z-index: 1000;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
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
    bottom: 140rpx; /* 横屏时也需要避免遮挡 */
  }

  .joystick-area {
    bottom: 160rpx; /* 横屏时调整摇杆位置 */
    right: 24rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .manual-header {
    height: 100rpx;
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
    top: 100rpx;
    bottom: 104rpx; /* 竖屏时增加底部边距 */
  }

  .left-controls {
    left: 24rpx;
    gap: 16rpx;
  }

  .joystick-area {
    bottom: 200rpx; /* 竖屏时进一步调整摇杆位置 */
    right: 24rpx;
  }
}
</style>
