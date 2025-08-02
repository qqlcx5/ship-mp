<template>
  <view class="dashboard-container">
    <!-- 顶部状态栏 -->
    <StatusBar 
      title="福建海域监控中心"
      :ship-count="7"
      :signal-status="'良好'"
      :current-time="currentTime"
    />
    
    <!-- 地图容器 -->
    <view class="map-container">
      <MapComponent 
        :ships="ships"
        :center="mapCenter"
        @ship-click="handleShipClick"
      />
    </view>
    
    <!-- 底部菜单栏 -->
    <BottomMenu 
      :active-tab="'dashboard'"
      @tab-change="handleTabChange"
    />
    
    <!-- 船只详情弹窗 -->
    <ShipDetailModal 
      v-if="selectedShip"
      :ship="selectedShip"
      @close="selectedShip = null"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import StatusBar from '@/components/StatusBar.vue'
import MapComponent from '@/components/MapComponent.vue'
import BottomMenu from '@/components/BottomMenu.vue'
import ShipDetailModal from '@/components/ShipDetailModal.vue'

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

const currentTime = ref('')
const selectedShip = ref<Ship | null>(null)
const mapCenter = ref({ lat: 26.0614, lng: 119.3061 }) // 福建海域

const ships = ref<Ship[]>([
  {
    id: '001',
    name: '海巡001',
    lat: 26.0614,
    lng: 119.3061,
    status: 'online',
    speed: 8.5,
    battery: 85,
    course: 120
  },
  {
    id: '002',
    name: '海巡002',
    lat: 26.0714,
    lng: 119.3161,
    status: 'warning',
    speed: 6.2,
    battery: 45,
    course: 90
  },
  {
    id: '003',
    name: '海巡003',
    lat: 26.0514,
    lng: 119.2961,
    status: 'online',
    speed: 7.8,
    battery: 92,
    course: 180
  }
])

let timeInterval: NodeJS.Timeout

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleShipClick = (ship: Ship) => {
  selectedShip.value = ship
}

const handleTabChange = (tab: string) => {
  switch (tab) {
    case 'manual':
      uni.navigateTo({ url: '/pages/manual/manual' })
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

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  width: 100vw;
  height: 100vh;
  background: #0B1426;
  position: relative;
  overflow: hidden;
}

.map-container {
  position: absolute;
  top: 120rpx;
  left: 0;
  right: 0;
  bottom: 104rpx;
}

/* 横屏适配 */
@media (orientation: landscape) {
  .map-container {
    top: 100rpx;
    bottom: 100rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .map-container {
    top: 140rpx;
    bottom: 120rpx;
  }
}
</style>
