<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useShipStore } from '@/store/ship'

const shipStore = useShipStore()

// 导入工具函数
const stm32 = require('@/utils/STM32Com.js')

// 当前船舶ID
const currentShipId = ref(0)

// 系统设置
const systemSettings = ref({
  userAccelerometer: false,
  autoReconnect: true,
  dataLogging: false,
  debugMode: false,
})

// 船舶状态
const shipStatus = ref({
  power: 0,
  batteryVoltage: 0,
  speedKnot: 0,
  runningTime: 0,
  localOK: false,
  remoteOK: false,
  usvOnline: false,
})

// 连接状态
const connectionStatus = ref({
  bluetooth: false,
  deviceName: '',
  signalStrength: 0,
  lastUpdate: '',
})

// 计算属性
const currentShip = computed(() => shipStore.ships[currentShipId.value])

// 系统设置方法
function toggleUserAccelerometer() {
  systemSettings.value.userAccelerometer = !systemSettings.value.userAccelerometer
  shipStore.setUserAccelerometer(systemSettings.value.userAccelerometer)
}

function toggleAutoReconnect() {
  systemSettings.value.autoReconnect = !systemSettings.value.autoReconnect
}

function toggleDataLogging() {
  systemSettings.value.dataLogging = !systemSettings.value.dataLogging
}

function toggleDebugMode() {
  systemSettings.value.debugMode = !systemSettings.value.debugMode
}

// 校准功能
function calibrateCompass() {
  stm32.SetCalibINS(currentShipId.value)
  uni.showToast({
    title: '开始校准磁力计',
    icon: 'success',
  })
}

function setRudderZero() {
  stm32.SetForceSetZPoint(currentShipId.value)
  uni.showToast({
    title: '设置舵机零点',
    icon: 'success',
  })
}

// 数据管理
function exportData() {
  uni.showToast({
    title: '导出数据功能开发中',
    icon: 'none',
  })
}

function clearData() {
  uni.showModal({
    title: '确认',
    content: '确定要清除所有数据吗？此操作不可恢复。',
    success: (res) => {
      if (res.confirm) {
        // 清除所有船舶数据
        shipStore.ships.forEach((_, index) => {
          shipStore.clearAllWaypoints(index)
        })
        shipStore.saveToStorage()

        uni.showToast({
          title: '数据已清除',
          icon: 'success',
        })
      }
    },
  })
}

// 连接管理
function reconnectBluetooth() {
  uni.navigateTo({
    url: '/pages/bluetooth/connect',
  })
}

function disconnectBluetooth() {
  uni.showModal({
    title: '确认',
    content: '确定要断开蓝牙连接吗？',
    success: (res) => {
      if (res.confirm) {
        // 断开蓝牙连接的逻辑
        connectionStatus.value.bluetooth = false
        connectionStatus.value.deviceName = ''

        uni.showToast({
          title: '已断开连接',
          icon: 'success',
        })
      }
    },
  })
}

// 船舶选择
function selectShip(shipId: number) {
  currentShipId.value = shipId
  shipStore.setCurrentShipId(shipId)
}

// 系统信息
function showSystemInfo() {
  const systemInfo = uni.getSystemInfoSync()
  uni.showModal({
    title: '系统信息',
    content: `平台: ${systemInfo.platform}\n版本: ${systemInfo.version}\n设备: ${systemInfo.model}`,
    showCancel: false,
  })
}

// 关于应用
function showAbout() {
  uni.showModal({
    title: '关于 USV 控制系统',
    content: '版本: 1.0.0\n基于 uni-app + Vue3 + TypeScript 开发\n用于无人船舶远程控制和监控',
    showCancel: false,
  })
}

// 页面生命周期
onMounted(() => {
  shipStore.loadFromStorage()
  systemSettings.value.userAccelerometer = shipStore.userAccelerometer
})

// 页面配置
definePage({
  style: {
    navigationBarTitleText: '综合管理'
  }
})
</script>

<template>
  <view class="page">
    <scroll-view class="scroll-container" scroll-y>
      <!-- 船舶选择 -->
      <view class="section">
        <view class="section-title">船舶选择</view>
        <view class="ship-selector">
          <button
            v-for="(ship, index) in shipStore.ships"
            :key="index"
            :class="currentShipId === index ? 'ship-btn active' : 'ship-btn'"
            @tap="selectShip(index)"
          >
            船舶 {{ index + 1 }}
          </button>
        </view>
      </view>

      <!-- 连接状态 -->
      <view class="section">
        <view class="section-title">连接状态</view>
        <view class="status-card">
          <view class="status-item">
            <text class="status-label">蓝牙连接:</text>
            <text :class="connectionStatus.bluetooth ? 'status-connected' : 'status-disconnected'">
              {{ connectionStatus.bluetooth ? '已连接' : '未连接' }}
            </text>
          </view>
          <view v-if="connectionStatus.bluetooth" class="status-item">
            <text class="status-label">设备名称:</text>
            <text class="status-value">{{ connectionStatus.deviceName || '未知设备' }}</text>
          </view>
          <view class="button-row">
            <button class="action-btn primary" @tap="reconnectBluetooth">
              重新连接
            </button>
            <button
              v-if="connectionStatus.bluetooth"
              class="action-btn danger"
              @tap="disconnectBluetooth"
            >
              断开连接
            </button>
          </view>
        </view>
      </view>

      <!-- 船舶状态 -->
      <view class="section">
        <view class="section-title">船舶状态</view>
        <view class="status-grid">
          <view class="status-item">
            <text class="status-label">功率:</text>
            <text class="status-value">{{ shipStatus.power }}W</text>
          </view>
          <view class="status-item">
            <text class="status-label">电压:</text>
            <text class="status-value">{{ shipStatus.batteryVoltage.toFixed(1) }}V</text>
          </view>
          <view class="status-item">
            <text class="status-label">速度:</text>
            <text class="status-value">{{ shipStatus.speedKnot.toFixed(1) }} 节</text>
          </view>
          <view class="status-item">
            <text class="status-label">运行时间:</text>
            <text class="status-value">{{ shipStatus.runningTime }} 分钟</text>
          </view>
        </view>

        <view class="system-status">
          <view class="status-indicator">
            <text :class="shipStatus.localOK ? 'indicator-ok' : 'indicator-error'">主控</text>
            <text :class="shipStatus.usvOnline ? 'indicator-ok' : 'indicator-error'">基站</text>
            <text :class="shipStatus.remoteOK ? 'indicator-ok' : 'indicator-error'">遥控</text>
          </view>
        </view>
      </view>

      <!-- 系统设置 -->
      <view class="section">
        <view class="section-title">系统设置</view>
        <view class="settings-list">
          <view class="setting-item">
            <text class="setting-label">使用加速度计</text>
            <switch
              :checked="systemSettings.userAccelerometer"
              @change="toggleUserAccelerometer"
            />
          </view>
          <view class="setting-item">
            <text class="setting-label">自动重连</text>
            <switch
              :checked="systemSettings.autoReconnect"
              @change="toggleAutoReconnect"
            />
          </view>
          <view class="setting-item">
            <text class="setting-label">数据记录</text>
            <switch
              :checked="systemSettings.dataLogging"
              @change="toggleDataLogging"
            />
          </view>
          <view class="setting-item">
            <text class="setting-label">调试模式</text>
            <switch
              :checked="systemSettings.debugMode"
              @change="toggleDebugMode"
            />
          </view>
        </view>
      </view>

      <!-- 校准功能 -->
      <view class="section">
        <view class="section-title">校准功能</view>
        <view class="button-grid">
          <button class="action-btn secondary" @tap="calibrateCompass">
            校准磁力计
          </button>
          <button class="action-btn secondary" @tap="setRudderZero">
            设置舵机零点
          </button>
        </view>
      </view>

      <!-- 数据管理 -->
      <view class="section">
        <view class="section-title">数据管理</view>
        <view class="button-grid">
          <button class="action-btn primary" @tap="exportData">
            导出数据
          </button>
          <button class="action-btn danger" @tap="clearData">
            清除数据
          </button>
        </view>
      </view>

      <!-- 系统信息 -->
      <view class="section">
        <view class="section-title">系统信息</view>
        <view class="button-grid">
          <button class="action-btn secondary" @tap="showSystemInfo">
            设备信息
          </button>
          <button class="action-btn secondary" @tap="showAbout">
            关于应用
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  @apply h-screen bg-gray-50;
}

.scroll-container {
  @apply h-full;
}

.section {
  @apply bg-white mx-4 my-3 rounded-lg p-4 shadow-sm;
}

.section-title {
  @apply text-lg font-semibold text-gray-800 mb-4;
}

.ship-selector {
  @apply flex flex-wrap gap-2;
}

.ship-btn {
  @apply flex-1 py-2 px-4 text-sm border border-gray-300 rounded bg-white text-gray-700;
  min-width: 80px;

  &.active {
    @apply bg-blue-500 text-white border-blue-500;
  }
}

.status-card {
  @apply space-y-3;
}

.status-item {
  @apply flex justify-between items-center;
}

.status-label {
  @apply text-sm text-gray-600;
}

.status-value {
  @apply text-sm font-medium text-gray-800;
}

.status-connected {
  @apply text-green-600 font-medium;
}

.status-disconnected {
  @apply text-red-600 font-medium;
}

.button-row {
  @apply flex space-x-2 mt-3;
}

.status-grid {
  @apply grid grid-cols-2 gap-3 mb-4;
}

.system-status {
  @apply border-t border-gray-200 pt-3;
}

.status-indicator {
  @apply flex space-x-3;
}

.indicator-ok {
  @apply text-xs bg-green-500 text-white px-2 py-1 rounded;
}

.indicator-error {
  @apply text-xs bg-red-500 text-white px-2 py-1 rounded;
}

.settings-list {
  @apply space-y-4;
}

.setting-item {
  @apply flex justify-between items-center;
}

.setting-label {
  @apply text-sm text-gray-700;
}

.button-grid {
  @apply grid grid-cols-2 gap-3;
}

.action-btn {
  @apply py-3 px-4 rounded font-medium text-white text-sm;
}

.primary {
  @apply bg-blue-500;
}

.secondary {
  @apply bg-gray-500;
}

.danger {
  @apply bg-red-500;
}
</style>
