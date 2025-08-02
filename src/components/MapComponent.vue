<template>
  <view class="map-component">
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
      class="native-map"
      @markertap="handleMarkerTap"
    />
    <!-- #endif -->
    

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

interface Props {
  ships: Ship[]
  center: { lat: number; lng: number }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  shipClick: [ship: Ship]
}>()

const mapUrl = ref('')
const currentZoom = ref(13)

// 转换船只数据为地图标记
const mapMarkers = computed(() => {
  return props.ships.map((ship, index) => ({
    id: parseInt(ship.id) || index,
    latitude: ship.lat,
    longitude: ship.lng,
    title: ship.name,
    iconPath: getShipIcon(ship.status),
    width: 32,
    height: 32,
    callout: {
      content: `${ship.name}\n速度: ${ship.speed}节\n电量: ${ship.battery}%`,
      color: '#ffffff',
      fontSize: 10,
      borderRadius: 6,
      bgColor: 'rgba(0,0,0,0.8)',
      padding: 6,
      display: 'BYCLICK'
    }
  }))
})

const getShipIcon = (status: string) => {
  const colors = {
    online: '#10B981',
    warning: '#F59E0B',
    offline: '#6B7280',
    default: '#4FD1C7'
  }
  const color = colors[status as keyof typeof colors] || colors.default
  
  // 小船样式图标 - 更像真实的小船
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <!-- 船体底部 -->
      <ellipse cx="20" cy="28" rx="16" ry="4" fill="${color}" stroke="white" stroke-width="1.5"/>
      <!-- 船体主体 -->
      <path d="M8 28C8 24 12 20 20 20C28 20 32 24 32 28" fill="${color}" stroke="white" stroke-width="1.5"/>
      <!-- 船舱 -->
      <rect x="16" y="22" width="8" height="4" fill="white" fill-opacity="0.9" rx="1"/>
      <!-- 桅杆 -->
      <line x1="20" y1="22" x2="20" y2="12" stroke="white" stroke-width="2"/>
      <!-- 帆 -->
      <path d="M20 12L26 14L26 20L20 18Z" fill="white" fill-opacity="0.8" stroke="white" stroke-width="1"/>
      <!-- 船头装饰 -->
      <circle cx="20" cy="20" r="2" fill="white" fill-opacity="0.9"/>
      <!-- 方向指示箭头 -->
      <polygon points="20,10 18,14 22,14" fill="${color}" stroke="white" stroke-width="1"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

const handleMarkerTap = (e: any) => {
  const markerId = e.detail.markerId
  const ship = props.ships.find(s => s.id === markerId)
  if (ship) {
    emit('shipClick', ship)
  }
}

const handleMapMessage = (e: any) => {
  try {
    const data = JSON.parse(e.detail.data[0])
    if (data.type === 'shipClick') {
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
  // 构建包含船只数据的地图URL
  const shipsData = encodeURIComponent(JSON.stringify(props.ships))
  const centerData = encodeURIComponent(JSON.stringify(props.center))
  mapUrl.value = `/static/map.html?ships=${shipsData}&center=${centerData}`
  // #endif
})
</script>

<style lang="scss" scoped>
.map-component {
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
}
</style>
