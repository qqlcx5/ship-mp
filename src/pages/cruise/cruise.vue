<template>
  <view class="cruise-container">
    <!-- 顶部状态栏 -->
    <view class="cruise-header">
      <view class="header-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="title-section">
          <text class="route-icon">🗺️</text>
          <text class="title">自动巡航</text>
        </view>
        <view class="auto-status">
          <view class="status-dot"></view>
          <text class="status-text">自动模式</text>
        </view>
      </view>
      
      <view class="route-info">
        <text class="info-text">航点: {{ currentWaypoint }}/{{ totalWaypoints }}</text>
        <text class="info-separator">|</text>
        <text class="info-text">总距离: {{ totalDistance }}km</text>
      </view>
    </view>
    
    <!-- 左上角控制面板 -->
    <view class="control-panel">
      <view class="panel-buttons">
        <CruiseControlButton 
          v-for="control in cruiseControls"
          :key="control.key"
          :icon="control.key === 'add-waypoint' && isAddingWaypoint ? '✕' : control.icon"
          :label="control.key === 'add-waypoint' && isAddingWaypoint ? '取消' : control.label"
          :color="control.key === 'add-waypoint' && isAddingWaypoint ? 'orange' : control.color"
          @click="handleControlClick(control.key)"
        />
      </view>
    </view>
    
    <!-- 右侧高级设置面板 -->
    <view class="advanced-panel" v-if="showAdvancedPanel">
      <view class="advanced-buttons">
        <button 
          v-for="setting in advancedSettings"
          :key="setting.key"
          class="advanced-btn"
          :class="setting.color"
          @click="handleAdvancedClick(setting.key)"
        >
          <text class="setting-icon">{{ setting.icon }}</text>
          <text class="setting-text">{{ setting.label }}</text>
        </button>
      </view>
    </view>
    
    <!-- 地图区域 -->
    <view class="map-area">
      <CruiseMapComponent 
      :ships="[currentShip]"
      :waypoints="waypoints"
      :isAddingWaypoint="isAddingWaypoint"
        :route-path="routePath"
        :center="mapCenter"
        @waypoint-add="handleWaypointAdd"
        @waypoint-remove="handleWaypointRemove"
        @ship-click="handleShipClick"
      />
    </view>
    
    <!-- 底部菜单栏 -->
    <BottomMenu 
      :active-tab="'cruise'"
      @tab-change="handleTabChange"
    />
    
    <!-- 航点设置弹窗 -->
    <WaypointModal 
      v-if="showWaypointModal"
      :waypoint="selectedWaypoint"
      @save="handleWaypointSave"
      @close="showWaypointModal = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BottomMenu from '@/components/BottomMenu.vue'
import CruiseControlButton from '@/components/CruiseControlButton.vue'
import CruiseMapComponent from '@/components/CruiseMapComponent.vue'
import WaypointModal from '@/components/WaypointModal.vue'

interface Waypoint {
  id: string
  lat: number
  lng: number
  name: string
  speed: number
  waitTime: number
}

interface CruiseControl {
  key: string
  icon: string
  label: string
  color: string
}

interface AdvancedSetting {
  key: string
  icon: string
  label: string
  color: string
}

const showAdvancedPanel = ref(false)
const showWaypointModal = ref(false)
const selectedWaypoint = ref<Waypoint | null>(null)
const isAddingWaypoint = ref(false) // 是否处于添加航点模式

const currentWaypoint = ref(3)
const totalWaypoints = ref(5)
const totalDistance = ref(12.5)

const mapCenter = ref({ lat: 26.0614, lng: 119.3061 })

const currentShip = ref({
  id: '001',
  name: '巡航船只',
  lat: 26.0614,
  lng: 119.3061,
  status: 'online' as const,
  speed: 6.5,
  battery: 78,
  course: 145
})

const waypoints = ref<Waypoint[]>([
  {
    id: '1',
    lat: 26.0614,
    lng: 119.3061,
    name: '起始点',
    speed: 8,
    waitTime: 0
  },
  {
    id: '2',
    lat: 26.0714,
    lng: 119.3161,
    name: '航点1',
    speed: 6,
    waitTime: 300
  },
  {
    id: '3',
    lat: 26.0814,
    lng: 119.3261,
    name: '航点2',
    speed: 7,
    waitTime: 600
  },
  {
    id: '4',
    lat: 26.0714,
    lng: 119.3361,
    name: '航点3',
    speed: 5,
    waitTime: 900
  },
  {
    id: '5',
    lat: 26.0614,
    lng: 119.3261,
    name: '终点',
    speed: 8,
    waitTime: 0
  }
])

const routePath = computed(() => {
  return waypoints.value.map(wp => ({ lat: wp.lat, lng: wp.lng }))
})

const cruiseControls: CruiseControl[] = [
  { key: 'auto-toggle', icon: '⚡', label: '自动开关', color: 'green' },
  { key: 'add-waypoint', icon: '➕', label: '添加航点', color: 'blue' },
  { key: 'remove-waypoint', icon: '➖', label: '删除航点', color: 'red' },
  { key: 'advanced', icon: '⚙️', label: '高级设置', color: 'purple' }
]

const advancedSettings: AdvancedSetting[] = [
  { key: 'clear-route', icon: '🗑️', label: '删除所有路径', color: 'red' },
  { key: 'servo-zero', icon: '🎯', label: '设置舵机零点', color: 'yellow' },
  { key: 'compass-cal', icon: '🧭', label: '标定磁力计', color: 'blue' },
  { key: 'accel-toggle', icon: '⚖️', label: '加速度计开关', color: 'green' }
]

const goBack = () => {
  uni.navigateBack()
}

const handleControlClick = (key: string) => {
  switch (key) {
    case 'auto-toggle':
      handleAutoToggle()
      break
    case 'add-waypoint':
      handleAddWaypoint()
      break
    case 'remove-waypoint':
      handleRemoveWaypoint()
      break
    case 'advanced':
      showAdvancedPanel.value = !showAdvancedPanel.value
      break
  }
}

const handleAutoToggle = () => {
  uni.showModal({
    title: '自动巡航',
    content: '确定要启动自动巡航模式吗？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '自动巡航已启动',
          icon: 'success'
        })
      }
    }
  })
}

const handleAddWaypoint = () => {
  if (!isAddingWaypoint.value) {
    isAddingWaypoint.value = true
    uni.showToast({
      title: '请在地图上点击添加航点',
      icon: 'none',
      duration: 2000
    })
  } else {
    isAddingWaypoint.value = false
    uni.showToast({
      title: '已退出添加模式',
      icon: 'none'
    })
  }
}

const handleRemoveWaypoint = () => {
  if (waypoints.value.length > 2) {
    waypoints.value.pop()
    totalWaypoints.value = waypoints.value.length
    uni.showToast({
      title: '已删除最后一个航点',
      icon: 'success'
    })
  } else {
    uni.showToast({
      title: '至少需要保留2个航点',
      icon: 'none'
    })
  }
}

const handleAdvancedClick = (key: string) => {
  switch (key) {
    case 'clear-route':
      handleClearRoute()
      break
    case 'servo-zero':
      uni.showToast({ title: '舵机零点已设置', icon: 'success' })
      break
    case 'compass-cal':
      uni.showToast({ title: '磁力计标定完成', icon: 'success' })
      break
    case 'accel-toggle':
      uni.showToast({ title: '加速度计状态已切换', icon: 'success' })
      break
  }
  showAdvancedPanel.value = false
}

const handleClearRoute = () => {
  uni.showModal({
    title: '清除路径',
    content: '确定要删除所有航点吗？',
    success: (res) => {
      if (res.confirm) {
        waypoints.value = [waypoints.value[0]] // 保留起始点
        totalWaypoints.value = 1
        currentWaypoint.value = 1
        uni.showToast({
          title: '所有路径已清除',
          icon: 'success'
        })
      }
    }
  })
}

const handleWaypointAdd = (position: { lat: number; lng: number }) => {
  if (isAddingWaypoint.value) {
    selectedWaypoint.value = {
      id: Date.now().toString(),
      lat: position.lat,
      lng: position.lng,
      name: `航点${waypoints.value.length + 1}`,
      speed: 6,
      waitTime: 300
    }
    showWaypointModal.value = true
    isAddingWaypoint.value = false // 退出添加模式
    uni.showToast({
      title: '航点已添加，请设置参数',
      icon: 'success'
    })
  }
}

const handleWaypointRemove = (waypointId: string) => {
  const index = waypoints.value.findIndex(wp => wp.id === waypointId)
  if (index > 0) { // 不能删除起始点
    waypoints.value.splice(index, 1)
    totalWaypoints.value = waypoints.value.length
    uni.showToast({
      title: '航点已删除',
      icon: 'success'
    })
  }
}

const handleWaypointSave = (waypoint: Waypoint) => {
  const existingIndex = waypoints.value.findIndex(wp => wp.id === waypoint.id)
  if (existingIndex >= 0) {
    waypoints.value[existingIndex] = waypoint
  } else {
    waypoints.value.push(waypoint)
    totalWaypoints.value = waypoints.value.length
  }
  showWaypointModal.value = false
  uni.showToast({
    title: '航点已保存',
    icon: 'success'
  })
}

const handleShipClick = (ship: any) => {
  // 处理船只点击
}

const handleTabChange = (tab: string) => {
  switch (tab) {
    case 'dashboard':
      uni.navigateTo({ url: '/pages/dashboard/dashboard' })
      break
    case 'manual':
      uni.navigateTo({ url: '/pages/manual/manual' })
      break
    case 'ai':
      uni.navigateTo({ url: '/pages/ai/ai' })
      break
    case 'management':
      uni.navigateTo({ url: '/pages/management/management' })
      break
  }
}
</script>

<style lang="scss" scoped>
.cruise-container {
  width: 100vw;
  height: 100vh;
  background: #0B1426;
  position: relative;
  overflow: hidden;
}

.cruise-header {
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
  
  .route-icon {
    color: #4FD1C7;
    font-size: 32rpx;
  }
  
  .title {
    color: white;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.auto-status {
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

.route-info {
  color: white;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  
  .info-text {
    color: white;
  }
  
  .info-separator {
    color: rgba(255, 255, 255, 0.5);
  }
}

.control-panel {
  position: absolute;
  z-index: 1000;
}

.panel-buttons {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.advanced-panel {
  position: absolute;
  top: 160rpx;
  right: 32rpx;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20rpx);
  border-radius: 24rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  padding: 32rpx;
}

.advanced-buttons {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.advanced-btn {
  width: 288rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  
  .setting-icon {
    font-size: 28rpx;
  }
  
  .setting-text {
    font-size: 24rpx;
  }
  
  &.red {
    background: linear-gradient(to right, #EF4444, #DC2626);
    color: white;
    
    &:hover {
      background: linear-gradient(to right, #F87171, #EF4444);
    }
  }
  
  &.yellow {
    background: linear-gradient(to right, #F59E0B, #D97706);
    color: white;
    
    &:hover {
      background: linear-gradient(to right, #FBBF24, #F59E0B);
    }
  }
  
  &.blue {
    background: linear-gradient(to right, #3B82F6, #2563EB);
    color: white;
    
    &:hover {
      background: linear-gradient(to right, #60A5FA, #3B82F6);
    }
  }
  
  &.green {
    background: linear-gradient(to right, #10B981, #059669);
    color: white;
    
    &:hover {
      background: linear-gradient(to right, #34D399, #10B981);
    }
  }
}

.map-area {
  position: absolute;
  top: 140rpx;
  left: 0;
  right: 0;
  bottom: 96rpx; /* 优化间距，减少与底部菜单的距离 */
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .cruise-header {
    height: 120rpx;
    padding: 12rpx 24rpx;
  }
  
  .control-panel {
    top: 140rpx;
    left: 24rpx;
    padding: 16rpx;
  }
  
  .advanced-panel {
    top: 140rpx;
    right: 24rpx;
    padding: 24rpx;
  }
  
  .advanced-btn {
    width: 240rpx;
    height: 64rpx;
    
    .setting-icon {
      font-size: 24rpx;
    }
    
    .setting-text {
      font-size: 20rpx;
    }
  }
  
  .map-area {
    top: 120rpx;
    bottom: 96rpx; /* 优化间距，减少与底部菜单的距离 */
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .cruise-header {
    height: 160rpx;
    flex-direction: column;
    gap: 16rpx;
    padding: 24rpx 32rpx;
  }
  
  .header-left {
    width: 100%;
    justify-content: space-between;
  }
  
  .route-info {
    width: 100%;
    justify-content: center;
  }
  
  .control-panel {
    top: 300rpx;
    left: 20rpx;
  }
  
  .advanced-panel {
    top: 180rpx;
    right: 24rpx;
    padding: 28rpx;
  }
  
  .map-area {
    top: 160rpx;
    bottom: 96rpx; /* 优化间距，减少与底部菜单的距离 */
  }
}
</style>
