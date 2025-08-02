<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import BottomMenu from '@/components/BottomMenu.vue'
// import BatteryCard from '@/components/BatteryCard.vue'
// import EnergyConsumptionCard from '@/components/EnergyConsumptionCard.vue'
// import RuntimeDataCard from '@/components/RuntimeDataCard.vue'
// import SuggestionCard from '@/components/SuggestionCard.vue'
// import TrendChart from '@/components/TrendChart.vue'
// import BatteryDetailModal from '@/components/BatteryDetailModal.vue'

interface Battery {
  id: string
  name: string
  level: number
  voltage: number
  status: 'critical' | 'warning' | 'good'
  temperature: number
  cycles: number
}

interface EnergyConsumption {
  propulsion: number
  navigation: number
  communication: number
  other: number
}

interface RuntimeData {
  totalDistance: number
  totalFuelConsumption: number
  totalRuntime: string
  averageSpeed: number
  efficiency: number
}

interface AISuggestion {
  id: string
  type: 'energy' | 'route' | 'maintenance' | 'performance'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  savings: string
}

const selectedBattery = ref<Battery | null>(null)

const batteryStatus = ref('18%警告')
const estimatedRuntime = ref('2.5小时')

const batteries = ref<Battery[]>([
  {
    id: 'main',
    name: '主电池',
    level: 18,
    voltage: 12.1,
    status: 'critical',
    temperature: 35,
    cycles: 1247,
  },
  {
    id: 'backup',
    name: '备用电池',
    level: 76,
    voltage: 12.8,
    status: 'good',
    temperature: 28,
    cycles: 856,
  }
])

const energyConsumption = ref<EnergyConsumption>({
  propulsion: 64,
  navigation: 18,
  communication: 12,
  other: 6,
})

const runtimeData = ref<RuntimeData>({
  totalDistance: 1847.6,
  totalFuelConsumption: 356.8,
  totalRuntime: '127小时32分',
  averageSpeed: 14.5,
  efficiency: 5.18,
})

const aiSuggestions = ref<AISuggestion[]>([
  {
    id: '1',
    type: 'energy',
    title: '优化推进系统功率',
    description: '建议在当前海况下降低推进功率至75%，可节省15%电量',
    impact: 'high',
    savings: '节省15%电量',
  },
  {
    id: '2',
    type: 'route',
    title: '调整航行路径',
    description: '检测到前方有逆流，建议调整航向避开，可减少20分钟航行时间',
    impact: 'medium',
    savings: '节省20分钟',
  },
  {
    id: '3',
    type: 'maintenance',
    title: '主电池需要维护',
    description: '主电池电量过低且温度偏高，建议尽快进行检查和维护',
    impact: 'high',
    savings: '延长电池寿命',
  },
])

const trendData = ref({
  labels: ['6h前', '5h前', '4h前', '3h前', '2h前', '1h前', '现在'],
  datasets: [
    {
      label: '电池电量',
      data: [85, 78, 65, 52, 38, 25, 18],
      color: '#EF4444',
    },
    {
      label: '能耗功率',
      data: [75, 82, 88, 85, 90, 87, 85],
      color: '#4FD1C7',
    },
  ],
})

let dataUpdateInterval: NodeJS.Timeout

function goBack() {
  uni.navigateBack()
}

function getStatusText(status: string) {
  switch (status) {
    case 'critical':
      return '低电量警告'
    case 'warning':
      return '电量警告'
    case 'good':
      return '正常'
    default:
      return '未知'
  }
}

function getSuggestionIcon(type: string) {
  switch (type) {
    case 'energy':
      return '⚡'
    case 'route':
      return '🗺️'
    case 'maintenance':
      return '🔧'
    case 'performance':
      return '🚀'
    default:
      return '💡'
  }
}

function getImpactText(impact: string) {
  switch (impact) {
    case 'high':
      return '高影响'
    case 'medium':
      return '中影响'
    case 'low':
      return '低影响'
    default:
      return '未知'
  }
}

function handleBatteryClick(battery: Battery) {
  selectedBattery.value = battery
}

function handleApplySuggestion(suggestion: AISuggestion) {
  uni.showModal({
    title: '应用建议',
    content: `确定要应用"${suggestion.title}"建议吗？`,
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '建议已应用',
          icon: 'success',
        })
        // 从建议列表中移除已应用的建议
        const index = aiSuggestions.value.findIndex(s => s.id === suggestion.id)
        if (index >= 0) {
          aiSuggestions.value.splice(index, 1)
        }
      }
    },
  })
}

function handleTabChange(tab: string) {
  switch (tab) {
    case 'dashboard':
      uni.navigateTo({ url: '/pages/dashboard/dashboard' })
      break
    case 'manual':
      uni.navigateTo({ url: '/pages/manual/manual' })
      break
    case 'cruise':
      uni.navigateTo({ url: '/pages/cruise/cruise' })
      break
    case 'management':
      uni.navigateTo({ url: '/pages/management/management' })
      break
  }
}

function updateData() {
  // 模拟实时数据更新
  batteries.value.forEach((battery) => {
    if (battery.id === 'main' && battery.level > 0) {
      battery.level = Math.max(0, battery.level - 0.1)
      battery.temperature = 35 + Math.random() * 5
    }
    if (battery.id === 'solar') {
      battery.level = Math.min(100, battery.level + Math.random() * 2)
    }
  })

  // 更新电池状态
  const mainBattery = batteries.value.find(b => b.id === 'main')
  if (mainBattery) {
    batteryStatus.value = `${Math.round(mainBattery.level)}%${mainBattery.level < 20 ? '警告' : '正常'}`
    const hours = Math.floor(mainBattery.level / 7.2) // 假设每小时消耗7.2%
    const minutes = Math.floor((mainBattery.level % 7.2) * 60 / 7.2)
    estimatedRuntime.value = `${hours}小时${minutes}分钟`
  }
}

onMounted(() => {
  updateData()
  dataUpdateInterval = setInterval(updateData, 5000) // 每5秒更新一次
})

onUnmounted(() => {
  if (dataUpdateInterval) {
    clearInterval(dataUpdateInterval)
  }
})
</script>

<template>
  <view class="ai-container">
    <!-- 顶部状态栏 -->
    <view class="ai-header">
      <view class="header-left">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <view class="title-section">
          <text class="brain-icon">🧠</text>
          <text class="title">AI管理</text>
        </view>
        <view class="ai-status">
          <view class="status-dot" />
          <text class="status-text">AI监控活跃</text>
        </view>
      </view>

      <view class="battery-summary">
        <text class="summary-text">电池状态: </text>
        <text class="warning-text">{{ batteryStatus }}</text>
        <text class="summary-separator">|</text>
        <text class="summary-text">预计续航: </text>
        <text class="accent-text">{{ estimatedRuntime }}</text>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <scroll-view class="content-area" scroll-y>
      <view class="p-[24rpx]">
        <!-- 电池状态监控 -->
        <view class="battery-section">
          <view class="section-title">
            <text class="title-icon">🔋</text>
            <text class="title-text">电池状态监控</text>
          </view>
          <view class="battery-grid-horizontal">
            <view
              v-for="battery in batteries"
              :key="battery.id"
              class="battery-card-compact"
              :class="battery.status"
              @click="handleBatteryClick(battery)"
            >
              <view class="battery-indicator">
                <view class="battery-level" :class="battery.status" :style="{ width: `${battery.level.toFixed(1)}%` }" />
              </view>
              <text class="battery-name">{{ battery.name }}</text>
              <text class="battery-percentage">{{ battery.level.toFixed(1) }}%</text>
              <view class="battery-status">
                <view class="status-dot" :class="battery.status" />
                <text class="status-text">{{ getStatusText(battery.status) }}</text>
              </view>
              <text class="battery-voltage">{{ battery.voltage.toFixed(1) }}V</text>
            </view>
          </view>
        </view>

        <!-- AI智能分析 -->
        <view class="analysis-section">
          <view class="section-title">
            <text class="title-icon">📊</text>
            <text class="title-text">AI智能分析</text>
          </view>
          <view class="analysis-grid">
            <!-- 能耗统计 -->
            <view class="analysis-card">
              <view class="card-header">
                <text class="card-icon">📊</text>
                <text class="card-title">能耗统计分析</text>
              </view>
              <view class="consumption-list">
                <view class="consumption-item">
                  <text class="item-label">推进系统</text>
                  <view class="progress-bar">
                    <view class="progress-fill" style="width: 64%" />
                  </view>
                  <text class="item-value">64%</text>
                </view>
                <view class="consumption-item">
                  <text class="item-label">导航设备</text>
                  <view class="progress-bar">
                    <view class="progress-fill blue" style="width: 18%" />
                  </view>
                  <text class="item-value">18%</text>
                </view>
                <view class="consumption-item">
                  <text class="item-label">通讯系统</text>
                  <view class="progress-bar">
                    <view class="progress-fill green" style="width: 12%" />
                  </view>
                  <text class="item-value">12%</text>
                </view>
                <view class="consumption-item">
                  <text class="item-label">其他设备</text>
                  <view class="progress-bar">
                    <view class="progress-fill purple" style="width: 6%" />
                  </view>
                  <text class="item-value">6%</text>
                </view>
              </view>
            </view>

            <!-- 运行数据 -->
            <view class="analysis-card">
              <view class="card-header">
                <text class="card-icon">📈</text>
                <text class="card-title">累计运行数据</text>
              </view>
              <view class="runtime-list">
                <view class="runtime-item">
                  <text class="runtime-label">总航程</text>
                  <text class="runtime-value">{{ runtimeData.totalDistance }} 海里</text>
                </view>
                <view class="runtime-item">
                  <text class="runtime-label">总油耗</text>
                  <text class="runtime-value">{{ runtimeData.totalFuelConsumption }} 升</text>
                </view>
                <view class="runtime-item">
                  <text class="runtime-label">运行时间</text>
                  <text class="runtime-value">{{ runtimeData.totalRuntime }}</text>
                </view>
                <view class="runtime-item">
                  <text class="runtime-label">平均速度</text>
                  <text class="runtime-value">{{ runtimeData.averageSpeed }} 节</text>
                </view>
                <view class="runtime-item">
                  <text class="runtime-label">燃油效率</text>
                  <text class="runtime-value">{{ runtimeData.efficiency }} 海里/升</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- AI建议 -->
        <view class="suggestions-section">
          <view class="section-title">
            <text class="title-icon">💡</text>
            <text class="title-text">AI优化建议</text>
          </view>
          <view class="suggestions-list">
            <view
              v-for="suggestion in aiSuggestions"
              :key="suggestion.id"
              class="suggestion-card"
              :class="suggestion.impact"
            >
              <view class="suggestion-header">
                <text class="suggestion-icon">{{ getSuggestionIcon(suggestion.type) }}</text>
                <text class="suggestion-title">{{ suggestion.title }}</text>
                <view class="impact-badge" :class="suggestion.impact">
                  {{ getImpactText(suggestion.impact) }}
                </view>
              </view>
              <text class="suggestion-description">{{ suggestion.description }}</text>
              <view class="suggestion-footer">
                <text class="savings-text">{{ suggestion.savings }}</text>
                <view class="apply-btn" @click="handleApplySuggestion(suggestion)">
                  应用建议
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 历史趋势 -->
        <view class="trends-section">
          <view class="section-title">
            <text class="title-icon">📈</text>
            <text class="title-text">历史趋势分析</text>
          </view>
          <view class="trend-chart">
            <view class="chart-legend">
              <view class="legend-item">
                <view class="legend-color red" />
                <text class="legend-text">电池电量</text>
              </view>
              <view class="legend-item">
                <view class="legend-color blue" />
                <text class="legend-text">能耗功率</text>
              </view>
            </view>
            <view class="chart-placeholder">
              <text class="chart-text">📊 趋势图表区域</text>
              <text class="chart-subtitle">电池电量持续下降，建议尽快充电</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部菜单栏 -->
    <BottomMenu
      active-tab="ai"
      @tab-change="handleTabChange"
    />

    <!-- 电池详情弹窗 -->
    <view v-if="selectedBattery" class="modal-overlay" @click="selectedBattery = null">
      <view class="battery-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedBattery.name }} 详情</text>
          <button class="close-btn" @click="selectedBattery = null">
            <text class="close-icon">✕</text>
          </button>
        </view>
        <view class="modal-content">
          <view class="detail-item">
            <text class="detail-label">电量</text>
            <text class="detail-value">{{ selectedBattery.level.toFixed(1) }}%</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">电压</text>
            <text class="detail-value">{{ selectedBattery.voltage.toFixed(1) }}V</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">温度</text>
            <text class="detail-value">{{ selectedBattery.temperature.toFixed(1) }}°C</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">充电周期</text>
            <text class="detail-value">{{ selectedBattery.cycles }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ai-container {
  width: 100vw;
  height: 100vh;
  background:
    linear-gradient(rgba(11, 20, 38, 0.85), rgba(26, 54, 93, 0.85)),
    url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}

.ai-header {
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

  .brain-icon {
    color: #4fd1c7;
    font-size: 32rpx;
  }

  .title {
    color: white;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.ai-status {
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

.battery-summary {
  color: white;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;

  .summary-text {
    color: white;
  }

  .warning-text {
    color: #f59e0b;
  }

  .accent-text {
    color: #4fd1c7;
  }

  .summary-separator {
    color: rgba(255, 255, 255, 0.5);
  }
}

.content-area {
  position: absolute;
  top: 140rpx;
  left: 0;
  right: 0;
  bottom: 104rpx;
  // padding: 32rpx;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;

  .title-icon {
    font-size: 32rpx;
    color: #4fd1c7;
  }

  .title-text {
    color: white;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.battery-section {
  margin-bottom: 48rpx;
}

.battery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300rpx, 1fr));
  gap: 24rpx;
}

.battery-grid-horizontal {
  display: flex;
  gap: 24rpx;
  justify-content: space-between;
}

.battery-card-compact {
  flex: 1;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 24rpx;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(79, 209, 199, 0.5);
    transform: translateY(-4rpx);
  }

  .battery-indicator {
    width: 100rpx;
    height: 50rpx;
    margin: 0 auto 16rpx;
  }

  .battery-name {
    font-size: 22rpx;
    margin-bottom: 6rpx;
  }

  .battery-percentage {
    font-size: 32rpx;
    margin-bottom: 12rpx;
  }

  .battery-status {
    margin-bottom: 6rpx;
  }

  .battery-voltage {
    font-size: 18rpx;
  }
}

.analysis-section {
  margin-bottom: 48rpx;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400rpx, 1fr));
  gap: 24rpx;
}

.suggestions-section {
  margin-bottom: 48rpx;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.trends-section {
  margin-bottom: 32rpx;
}

/* 电池卡片样式 */
.battery-card {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 32rpx;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(79, 209, 199, 0.5);
    transform: translateY(-4rpx);
  }
}

.battery-indicator {
  position: relative;
  width: 120rpx;
  height: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  border-radius: 8rpx;
  background: rgba(0, 0, 0, 0.3);
  margin: 0 auto 24rpx;

  &::after {
    content: '';
    position: absolute;
    right: -12rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 8rpx;
    height: 24rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 0 4rpx 4rpx 0;
  }
}

.battery-level {
  height: 100%;
  border-radius: 4rpx;
  transition: all 0.3s ease;

  &.critical {
    background: linear-gradient(90deg, #ef4444, #dc2626);
    animation: batteryPulse 1.5s infinite;
  }

  &.warning {
    background: linear-gradient(90deg, #f59e0b, #d97706);
  }

  &.good {
    background: linear-gradient(90deg, #10b981, #059669);
  }
}

.battery-name {
  display: block;
  color: white;
  font-size: 24rpx;
  margin-bottom: 8rpx;
}

.battery-percentage {
  display: block;
  color: white;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
}

.battery-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.status-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;

  &.critical {
    background: #ef4444;
    animation: pulse 2s infinite;
  }

  &.warning {
    background: #f59e0b;
    animation: pulse 2s infinite;
  }

  &.good {
    background: #10b981;
    animation: pulse 2s infinite;
  }
}

.status-text {
  color: white;
  font-size: 20rpx;
}

.battery-voltage {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 20rpx;
}

/* 分析卡片样式 */
.analysis-card {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 32rpx;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(79, 209, 199, 0.5);
    transform: translateY(-4rpx);
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;

  .card-icon {
    color: #4fd1c7;
    font-size: 28rpx;
  }

  .card-title {
    color: white;
    font-size: 28rpx;
    font-weight: 600;
  }
}

.consumption-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.consumption-item {
  display: flex;
  align-items: center;
  gap: 16rpx;

  .item-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
    min-width: 120rpx;
  }

  .item-value {
    color: white;
    font-size: 24rpx;
    font-weight: 600;
    min-width: 60rpx;
    text-align: right;
  }
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ef4444;
  border-radius: 4rpx;
  transition: width 0.3s ease;

  &.blue {
    background: #3b82f6;
  }

  &.green {
    background: #10b981;
  }

  &.purple {
    background: #8b5cf6;
  }
}

.runtime-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.runtime-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .runtime-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
  }

  .runtime-value {
    color: #4fd1c7;
    font-size: 24rpx;
    font-weight: 600;
    font-family: monospace;
  }
}

/* 建议卡片样式 */
.suggestion-card {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 32rpx;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(79, 209, 199, 0.5);
    transform: translateY(-4rpx);
  }

  &.high {
    border-color: rgba(239, 68, 68, 0.5);
  }

  &.medium {
    border-color: rgba(245, 158, 11, 0.5);
  }

  &.low {
    border-color: rgba(16, 185, 129, 0.5);
  }
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;

  .suggestion-icon {
    color: #4fd1c7;
    font-size: 28rpx;
  }

  .suggestion-title {
    flex: 1;
    color: white;
    font-size: 28rpx;
    font-weight: 600;
  }
}

.impact-badge {
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: 600;

  &.high {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  &.medium {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
  }

  &.low {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }
}

.suggestion-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
  line-height: 1.5;
  margin-bottom: 24rpx;
  display: block;
}

.suggestion-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .savings-text {
    color: #4fd1c7;
    font-size: 24rpx;
    font-weight: 600;
  }

  .apply-btn {
    background: linear-gradient(to right, #4fd1c7, #60a5fa);
    color: white;
    font-size: 24rpx;
    font-weight: 600;
    padding: 16rpx 32rpx;
    border-radius: 12rpx;
    border: none;
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(to right, #2dd4bf, #3b82f6);
      transform: translateY(-2rpx);
    }
  }
}

/* 趋势图表样式 */
.trend-chart {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(15rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 32rpx;
}

.chart-legend {
  display: flex;
  gap: 32rpx;
  margin-bottom: 24rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12rpx;

  .legend-text {
    color: white;
    font-size: 24rpx;
  }
}

.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 4rpx;

  &.red {
    background: #ef4444;
  }

  &.blue {
    background: #4fd1c7;
  }
}

.chart-placeholder {
  height: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed rgba(255, 255, 255, 0.3);
  border-radius: 16rpx;

  .chart-text {
    color: #4fd1c7;
    font-size: 32rpx;
    margin-bottom: 8rpx;
  }

  .chart-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
  }
}

/* 电池详情弹窗样式 */
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

.battery-modal {
  background: rgba(0, 0, 0, 0.9);
  border: 2rpx solid rgba(79, 209, 199, 0.5);
  border-radius: 24rpx;
  padding: 48rpx;
  max-width: 640rpx;
  width: 100%;
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

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .detail-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 28rpx;
  }

  .detail-value {
    color: #4fd1c7;
    font-size: 28rpx;
    font-weight: 600;
  }
}

@keyframes batteryPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
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
  .ai-header {
    height: 120rpx;
    padding: 12rpx 24rpx;
  }

  .content-area {
    top: 120rpx;
    bottom: 96rpx;
  }

  .battery-grid-horizontal {
    gap: 16rpx;
  }

  .battery-card-compact {
    padding: 20rpx;

    .battery-indicator {
      width: 80rpx;
      height: 40rpx;
    }

    .battery-name {
      font-size: 20rpx;
    }

    .battery-percentage {
      font-size: 28rpx;
    }
  }

  .battery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;
  }

  .analysis-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .ai-header {
    height: 160rpx;
    flex-direction: column;
    gap: 16rpx;
    padding: 24rpx 32rpx;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .battery-summary {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .content-area {
    top: 160rpx;
    bottom: 120rpx;
  }

  .battery-grid {
    grid-template-columns: 1fr;
    gap: 20rpx;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
    gap: 20rpx;
  }
}
</style>
