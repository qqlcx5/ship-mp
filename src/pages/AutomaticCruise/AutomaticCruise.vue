<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useShipStore } from '@/store/ship'

const shipStore = useShipStore()

// 导入工具函数
const stm32 = require('@/utils/STM32Com.js')

// 当前船舶ID
const currentShipId = ref(0)

// 自动巡航状态
const isAutoCruising = ref(false)
const cruiseSpeed = ref(50)
const cruiseMode = ref('waypoint') // waypoint | circle | line

// 计算属性
const currentShip = computed(() => shipStore.ships[currentShipId.value])
const allMarkers = computed(() => shipStore.allMarkers)
const polylines = computed(() => shipStore.polylines)

// 开始自动巡航
function startAutoCruise() {
  if (currentShip.value.waypoints.length === 0) {
    uni.showToast({
      title: '请先添加航点',
      icon: 'error',
    })
    return
  }

  isAutoCruising.value = true
  stm32.SetEnableManual(currentShipId.value, false) // 启用自动模式

  uni.showToast({
    title: '开始自动巡航',
    icon: 'success',
  })
}

// 停止自动巡航
function stopAutoCruise() {
  isAutoCruising.value = false
  stm32.SetEnableManual(currentShipId.value, true) // 切换到手动模式

  uni.showToast({
    title: '停止自动巡航',
    icon: 'success',
  })
}

// 设置巡航速度
function setCruiseSpeed(speed: number) {
  cruiseSpeed.value = speed
  // 这里可以发送速度设置指令到船舶
}

// 切换巡航模式
function switchCruiseMode(mode: string) {
  cruiseMode.value = mode
}

// 添加航点
function addWayPoint() {
  uni.navigateTo({
    url: '/pages/ManualNavigation/ManualNavigation',
  })
}

// 清除所有航点
function clearAllWaypoints() {
  uni.showModal({
    title: '确认',
    content: '确定要清除所有航点吗？',
    success: (res) => {
      if (res.confirm) {
        stm32.DeleteAllWayPoint(currentShipId.value)
        shipStore.clearAllWaypoints(currentShipId.value)
        shipStore.saveToStorage()

        uni.showToast({
          title: '已清除所有航点',
          icon: 'success',
        })
      }
    },
  })
}

// 地图点击
function onMapTap() {
  console.log('地图点击')
}

// 标记点点击
function onMarkerTap(e: any) {
  console.log('标记点点击:', e.markerId)

  // 检查是否点击了船舶
  shipStore.ships.forEach((sp, index) => {
    if (sp.ship.id === e.markerId) {
      currentShipId.value = index
      shipStore.setCurrentShipId(index)
    }
  })
}

// 页面生命周期
onMounted(() => {
  shipStore.loadFromStorage()
})

// 页面配置
definePage({
  style: {
    navigationBarTitleText: '自动巡航'
  }
})
</script>

<template>
  <view class="page">
    <!-- 地图区域 -->
    <view class="map-container">
      <map
        id="mapId"
        class="map"
        :latitude="shipStore.crossMarker.latitude"
        :longitude="shipStore.crossMarker.longitude"
        :scale="shipStore.crossMarker.mapscale"
        :markers="allMarkers"
        :polyline="polylines"
        @markertap="onMarkerTap"
        @tap="onMapTap"
      />
    </view>

    <!-- 控制面板 -->
    <view class="control-panel">
      <!-- 巡航状态 -->
      <view class="status-section">
        <view class="section-title">巡航状态</view>
        <view class="status-info">
          <text :class="isAutoCruising ? 'status-active' : 'status-inactive'">
            {{ isAutoCruising ? '自动巡航中' : '手动模式' }}
          </text>
          <text class="waypoint-count">
            航点数量: {{ currentShip.waypoints.length }}
          </text>
        </view>
      </view>

      <!-- 巡航模式选择 -->
      <view class="mode-section">
        <view class="section-title">巡航模式</view>
        <view class="mode-buttons">
          <button
            :class="cruiseMode === 'waypoint' ? 'mode-btn active' : 'mode-btn'"
            @tap="switchCruiseMode('waypoint')"
          >
            航点巡航
          </button>
          <button
            :class="cruiseMode === 'circle' ? 'mode-btn active' : 'mode-btn'"
            @tap="switchCruiseMode('circle')"
          >
            圆形巡航
          </button>
          <button
            :class="cruiseMode === 'line' ? 'mode-btn active' : 'mode-btn'"
            @tap="switchCruiseMode('line')"
          >
            直线巡航
          </button>
        </view>
      </view>

      <!-- 速度控制 -->
      <view class="speed-section">
        <view class="section-title">巡航速度: {{ cruiseSpeed }}%</view>
        <slider
          :value="cruiseSpeed"
          :max="100"
          :min="10"
          :step="5"
          active-color="#007aff"
          @change="(e) => setCruiseSpeed(e.detail.value)"
        />
      </view>

      <!-- 控制按钮 -->
      <view class="button-section">
        <button
          v-if="!isAutoCruising"
          class="control-btn start-btn"
          @tap="startAutoCruise"
        >
          开始自动巡航
        </button>
        <button
          v-else
          class="control-btn stop-btn"
          @tap="stopAutoCruise"
        >
          停止巡航
        </button>

        <button class="control-btn secondary-btn" @tap="addWayPoint">
          编辑航点
        </button>

        <button class="control-btn danger-btn" @tap="clearAllWaypoints">
          清除航点
        </button>
      </view>

      <!-- 船舶信息 -->
      <view class="ship-info">
        <view class="section-title">船舶信息</view>
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">当前船舶:</text>
            <text class="info-value">船舶 {{ currentShipId + 1 }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">位置:</text>
            <text class="info-value">
              {{ currentShip.ship.latitude.toFixed(6) }}, {{ currentShip.ship.longitude.toFixed(6) }}
            </text>
          </view>
          <view class="info-item">
            <text class="info-label">航向:</text>
            <text class="info-value">{{ currentShip.ship.rotate.toFixed(1) }}°</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  @apply flex flex-col h-screen bg-gray-50;
}

.map-container {
  @apply flex-1;
}

.map {
  @apply w-full h-full;
}

.control-panel {
  @apply bg-white border-t border-gray-200 p-4 max-h-96 overflow-y-auto;
}

.section-title {
  @apply text-lg font-semibold text-gray-800 mb-3;
}

.status-section {
  @apply mb-6;
}

.status-info {
  @apply flex justify-between items-center;
}

.status-active {
  @apply text-green-600 font-medium;
}

.status-inactive {
  @apply text-gray-500;
}

.waypoint-count {
  @apply text-sm text-gray-600;
}

.mode-section {
  @apply mb-6;
}

.mode-buttons {
  @apply flex space-x-2;
}

.mode-btn {
  @apply flex-1 py-2 px-3 text-sm border border-gray-300 rounded bg-white text-gray-700;

  &.active {
    @apply bg-blue-500 text-white border-blue-500;
  }
}

.speed-section {
  @apply mb-6;
}

.button-section {
  @apply space-y-3 mb-6;
}

.control-btn {
  @apply w-full py-3 px-4 rounded font-medium text-white;
}

.start-btn {
  @apply bg-green-500;
}

.stop-btn {
  @apply bg-red-500;
}

.secondary-btn {
  @apply bg-blue-500;
}

.danger-btn {
  @apply bg-orange-500;
}

.ship-info {
  @apply border-t border-gray-200 pt-4;
}

.info-grid {
  @apply space-y-2;
}

.info-item {
  @apply flex justify-between;
}

.info-label {
  @apply text-sm text-gray-600;
}

.info-value {
  @apply text-sm font-medium text-gray-800;
}
</style>
