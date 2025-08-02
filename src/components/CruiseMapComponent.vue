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
    
    <!-- 地图控制按钮 -->
    <view class="map-controls">
      <button class="control-btn" @click="zoomIn">
        <text class="control-icon">+</text>
      </button>
      <button class="control-btn" @click="zoomOut">
        <text class="control-icon">-</text>
      </button>
      <button class="control-btn" @click="centerMap">
        <text class="control-icon">📍</text>
      </button>
      <button class="control-btn" @click="toggleRouteMode">
        <text class="control-icon">{{ routeMode ? '✏️' : '👁️' }}</text>
      </button>
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
  const shipMarkers = props.ships.map(ship => ({
    id: ship.id,
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
      bgColor: 'rgba(0,0,0,0.8)',
      padding: 8,
      display: 'BYCLICK'
    }
  }))
  
  const waypointMarkers = props.waypoints.map((waypoint, index) => ({
    id: `waypoint-${waypoint.id}`,
    latitude: waypoint.lat,
    longitude: waypoint.lng,
    title: waypoint.name,
    iconPath: getWaypointIcon(index),
    width: 32,
    height: 32,
    callout: {
      content: `${waypoint.name}\n速度: ${waypoint.speed}节\n等待: ${waypoint.waitTime}秒`,
      color: '#ffffff',
      fontSize: 12,
      borderRadius: 8,
      bgColor: 'rgba(79,209,199,0.9)',
      padding: 8,
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
  switch (status) {
    case 'online':
      return '/static/icons/ship-online.png'
    case 'warning':
      return '/static/icons/ship-warning.png'
    case 'offline':
      return '/static/icons/ship-offline.png'
    default:
      return '/static/icons/ship-default.png'
  }
}

const getWaypointIcon = (index: number) => {
  if (index === 0) return '/static/icons/waypoint-start.png'
  if (index === props.waypoints.length - 1) return '/static/icons/waypoint-end.png'
  return '/static/icons/waypoint-normal.png'
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
  if (routeMode.value) {
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
  
  .info-item {
    .info-label,
    .info-value {
      font-size: 28rpx;
    }
  }
}
</style>
