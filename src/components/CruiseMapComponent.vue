<template>
  <view class="cruise-map-component">
    <!-- H5平台使用web-view嵌入Leaflet地图 -->
    <!-- #ifdef H5 -->
    <web-view 
      :src="mapUrl" 
      class="map-webview"
      @message="handleMapMessage"
    />
    <!-- #endif -->
    
    <!-- 非H5平台使用原生地图 -->
    <!-- #ifndef H5 -->
    <map 
      :latitude="center.lat"
      :longitude="center.lng"
      :scale="13"
      :markers="mapMarkers"
      :polyline="routePolyline"
      class="native-map"
      @markertap="handleMarkerTap"
      @tap="handleMapTap"
    />
    <!-- #endif -->
    
    <!-- 添加航点模式提示 -->
    <view class="add-waypoint-overlay" v-if="isAddingWaypoint">
      <view class="add-waypoint-tip">
        <text class="tip-icon">📍</text>
        <text class="tip-text">点击地图添加航点</text>
      </view>
    </view>
    
    <!-- 航点信息面板 -->
    <view class="waypoint-info" v-if="selectedWaypointInfo">
      <view class="info-header">
        <text class="waypoint-name">{{ selectedWaypointInfo.name }}</text>
        <button class="close-info" @click="selectedWaypointInfo = null">
          <text class="close-icon">✕</text>
        </button>
      </view>
      <view class="info-content">
        <view class="info-item">
          <text class="info-label">速度:</text>
          <text class="info-value">{{ selectedWaypointInfo.speed }}节</text>
        </view>
        <view class="info-item">
          <text class="info-label">等待:</text>
          <text class="info-value">{{ selectedWaypointInfo.waitTime }}秒</text>
        </view>
        <view class="info-item">
          <text class="info-label">坐标:</text>
          <text class="info-value">{{ selectedWaypointInfo.lat.toFixed(4) }}, {{ selectedWaypointInfo.lng.toFixed(4) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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

interface Waypoint {
  id: string
  lat: number
  lng: number
  name: string
  speed: number
  waitTime: number
}

interface Props {
  ships: Ship[]
  waypoints: Waypoint[]
  routePath: { lat: number; lng: number }[]
  center: { lat: number; lng: number }
  isAddingWaypoint?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  waypointAdd: [position: { lat: number; lng: number }]
  waypointRemove: [waypointId: string]
  shipClick: [ship: Ship]
}>()

const mapUrl = ref('')
const currentZoom = ref(13)
const routeMode = ref(false) // 路径编辑模式
const selectedWaypointInfo = ref<Waypoint | null>(null)

// 转换船只数据为地图标记
const mapMarkers = computed(() => {
  const shipMarkers = props.ships.map((ship, index) => ({
    id: index,
    latitude: ship.lat,
    longitude: ship.lng,
    title: ship.name,
    iconPath: getShipIcon(ship.status),
    width: 40,
    height: 40,
    callout: {
      content: `${ship.name}\n速度: ${ship.speed}节\n电量: ${ship.battery}%`,
      color: '#ffffff',
      fontSize: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#333333',
      bgColor: 'rgba(0,0,0,0.8)',
      padding: 8,
      textAlign: 'center',
      display: 'BYCLICK'
    }
  }))
  
  const waypointMarkers = props.waypoints.map((waypoint, index) => ({
    id: 1000 + index,
    latitude: waypoint.lat,
    longitude: waypoint.lng,
    title: waypoint.name,
    iconPath: getWaypointIcon(index),
    width: 48,
    height: 48,
    callout: {
      content: `${waypoint.name}\n速度: ${waypoint.speed}节\n等待: ${waypoint.waitTime}秒`,
      color: '#ffffff',
      fontSize: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#4FD1C7',
      bgColor: 'rgba(79,209,199,0.9)',
      padding: 8,
      textAlign: 'center',
      display: 'BYCLICK'
    }
  }))
  
  return [...shipMarkers, ...waypointMarkers]
})

// 路径折线
const routePolyline = computed(() => {
  if (props.routePath.length < 2) return []
  
  return [{
    points: props.routePath.map(point => ({
      latitude: point.lat,
      longitude: point.lng
    })),
    color: '#4FD1C7',
    width: 3,
    dottedLine: true,
    arrowLine: true
  }]
})

const getShipIcon = (status: string) => {
  const colors = {
    online: '#10B981',
    warning: '#F59E0B',
    offline: '#6B7280',
    default: '#4FD1C7'
  }
  const color = colors[status as keyof typeof colors] || colors.default
  
  // 现代化船只图标 - 流线型设计 (增大尺寸)
  const svg = `
    <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <!-- 船体 -->
      <path d="M16 6C12 6 8 12 8 22L16 26L24 22C24 12 20 6 16 6Z" fill="${color}" stroke="white" stroke-width="2"/>
      <!-- 船舱 -->
      <rect x="12" y="12" width="8" height="4" fill="white" fill-opacity="0.8" rx="1"/>
      <!-- 桅杆 -->
      <rect x="15" y="8" width="2" height="6" fill="white"/>
      <!-- 方向指示 -->
      <polygon points="16,8 14,10 18,10" fill="white"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const getWaypointIcon = (index: number) => {
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899']
  const color = colors[index % colors.length]
  
  // 真实小船图标，编号在右下方
  const svg = `
    <svg width="48" height="48" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <!-- 真实船体 -->
      <path d="M30 15C22 15 15 22 15 40L30 45L45 40C45 22 38 15 30 15Z" fill="${color}" stroke="white" stroke-width="2"/>
      <!-- 船舱 -->
      <rect x="24" y="25" width="12" height="8" fill="white" fill-opacity="0.9" rx="2"/>
      <!-- 桅杆 -->
      <rect x="28" y="18" width="4" height="10" fill="white"/>
      <!-- 船头 -->
      <path d="M15 35L10 32L15 40Z" fill="${color}"/>
      <!-- 船尾 -->
      <path d="M45 35L50 32L45 40Z" fill="${color}"/>
      <!-- 小编号在右下方 -->
      <circle cx="48" cy="48" r="6" fill="white" stroke="${color}" stroke-width="1"/>
      <text x="48" y="51" text-anchor="middle" font-size="10" font-weight="bold" fill="${color}">${index + 1}</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const handleMarkerTap = (e: any) => {
  const markerId = e.detail.markerId
  
  if (markerId.startsWith('waypoint-')) {
    const waypointId = markerId.replace('waypoint-', '')
    const waypoint = props.waypoints.find(wp => wp.id === waypointId)
    if (waypoint) {
      selectedWaypointInfo.value = waypoint
    }
  } else {
    const ship = props.ships.find(s => s.id === markerId)
    if (ship) {
      emit('shipClick', ship)
    }
  }
}

const handleMapTap = (e: any) => {
  if (routeMode.value || props.isAddingWaypoint) {
    const { latitude, longitude } = e.detail
    emit('waypointAdd', { lat: latitude, lng: longitude })
  }
}

const handleMapMessage = (e: any) => {
  try {
    const data = JSON.parse(e.detail.data[0])
    if (data.type === 'waypointAdd') {
      emit('waypointAdd', { lat: data.lat, lng: data.lng })
    } else if (data.type === 'waypointRemove') {
      emit('waypointRemove', data.waypointId)
    } else if (data.type === 'shipClick') {
      const ship = props.ships.find(s => s.id === data.shipId)
      if (ship) {
        emit('shipClick', ship)
      }
    }
  } catch (error) {
    console.error('Map message parse error:', error)
  }
}

const zoomIn = () => {
  currentZoom.value = Math.min(currentZoom.value + 1, 18)
  updateMapZoom()
}

const zoomOut = () => {
  currentZoom.value = Math.max(currentZoom.value - 1, 3)
  updateMapZoom()
}

const centerMap = () => {
  // 重新定位到中心点
  updateMapCenter()
}

const toggleRouteMode = () => {
  routeMode.value = !routeMode.value
  uni.showToast({
    title: routeMode.value ? '路径编辑模式' : '查看模式',
    icon: 'none'
  })
}

const updateMapZoom = () => {
  // 发送缩放指令到地图
  // #ifdef H5
  // 通过postMessage与webview通信
  // #endif
}

const updateMapCenter = () => {
  // 发送中心点更新指令到地图
  // #ifdef H5
  // 通过postMessage与webview通信
  // #endif
}

onMounted(() => {
  // #ifdef H5
  // 构建包含船只和航点数据的地图URL
  const shipsData = encodeURIComponent(JSON.stringify(props.ships))
  const waypointsData = encodeURIComponent(JSON.stringify(props.waypoints))
  const routeData = encodeURIComponent(JSON.stringify(props.routePath))
  const centerData = encodeURIComponent(JSON.stringify(props.center))
  mapUrl.value = `/static/cruise-map.html?ships=${shipsData}&waypoints=${waypointsData}&route=${routeData}&center=${centerData}`
  // #endif
})
</script>

<style lang="scss" scoped>
.cruise-map-component {
  width: 100%;
  height: 100%;
  position: relative;
  background: #1e40af;
}

.map-webview,
.native-map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  z-index: 100;
}

.control-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  .control-icon {
    color: white;
    font-size: 32rpx;
    font-weight: bold;
  }
  
  &:hover {
    background: rgba(79, 209, 199, 0.8);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.waypoint-info {
  position: absolute;
  bottom: 32rpx;
  left: 32rpx;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20rpx);
  border: 2rpx solid rgba(79, 209, 199, 0.5);
  border-radius: 16rpx;
  padding: 24rpx;
  min-width: 320rpx;
  z-index: 100;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  
  .waypoint-name {
    color: #4FD1C7;
    font-size: 28rpx;
    font-weight: 600;
  }
  
  .close-info {
    width: 48rpx;
    height: 48rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .close-icon {
      color: white;
      font-size: 20rpx;
    }
  }
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .info-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
  }
  
  .info-value {
    color: white;
    font-size: 24rpx;
    font-weight: 500;
  }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .map-controls {
    top: 24rpx;
    right: 24rpx;
    gap: 12rpx;
  }
  
  .control-btn {
    width: 64rpx;
    height: 64rpx;
    
    .control-icon {
      font-size: 28rpx;
    }
  }
  
  .waypoint-info {
    bottom: 24rpx;
    left: 24rpx;
    padding: 16rpx;
    min-width: 280rpx;
  }
  
  .info-header .waypoint-name {
    font-size: 24rpx;
  }
  
  .info-item {
    .info-label,
    .info-value {
      font-size: 20rpx;
    }
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .map-controls {
    top: 40rpx;
    right: 40rpx;
    gap: 20rpx;
  }
  
  .control-btn {
    width: 96rpx;
    height: 96rpx;
    
    .control-icon {
      font-size: 36rpx;
    }
  }
  
  .waypoint-info {
    bottom: 40rpx;
    left: 40rpx;
    right: 40rpx;
    padding: 32rpx;
    min-width: auto;
  }
  
  .info-header .waypoint-name {
    font-size: 32rpx;
  }
}

/* 添加航点模式提示样式 */
.add-waypoint-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.add-waypoint-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(79, 209, 199, 0.95);
  color: white;
  padding: 24rpx 48rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

.tip-icon {
  font-size: 32rpx;
}

.tip-text {
  font-size: 28rpx;
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    opacity: 0.8;
  }
}

/* 竖屏适配下的info-item样式 */
@media (orientation: portrait) {
  .info-item {
    .info-label,
    .info-value {
      font-size: 28rpx;
    }
  }
}
</style>
