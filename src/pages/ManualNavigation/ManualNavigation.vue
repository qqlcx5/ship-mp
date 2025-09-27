<template>
  <view class="h-full w-full flex flex-col">
    <!-- 顶部状态栏 -->
    <view v-if="userAccelerometer" class="bg-blue-600 px-4 py-2 text-center text-white">
      <text class="text-sm">当前舵角: {{ currentRudder }}°</text>
    </view>

    <!-- 地图容器 -->
    <view class="relative flex-1">
      <!-- 地图组件 -->
      <map
        id="mapId"
        class="h-full w-full"
        :latitude="mapCenter.latitude"
        :longitude="mapCenter.longitude"
        :scale="mapScale"
        :markers="allMarkers"
        :polyline="polylines"
        @regionchange="onRegionChange"
        @markertap="onMarkerTap"
        @tap="onMapTap"
      >
        <!-- 地图控制按钮 -->
        <view class="absolute left-4 top-4 space-y-2">
          <view class="rounded-lg bg-white p-2 shadow-md">
            <switch
              :checked="enableAuto"
              class="mr-2"
              @change="onAutoChange"
            />
            <text class="text-sm">自动</text>
          </view>
          <button
            class="rounded-lg bg-white px-3 py-2 text-sm shadow-md"
            @tap="addWaypoint"
          >
            添加点
          </button>
          <button
            class="rounded-lg bg-white px-3 py-2 text-sm shadow-md"
            @tap="deleteWaypoint"
          >
            删除点
          </button>
          <button
            class="rounded-lg bg-white px-3 py-2 text-sm shadow-md"
            @tap="toggleSettings"
          >
            设置
          </button>
        </view>

        <!-- 设置面板 -->
        <view v-if="showSettings" class="absolute left-4 top-48 rounded-lg bg-white p-3 shadow-md space-y-2">
          <button
            class="block w-full py-1 text-left text-sm"
            @tap="deleteAllWaypoints"
          >
            删除所有路径
          </button>
          <button
            class="block w-full py-1 text-left text-sm"
            @tap="setZeroPoint"
          >
            设置舵机零点
          </button>
          <button
            class="block w-full py-1 text-left text-sm"
            @tap="calibrateINS"
          >
            标定磁力计
          </button>
          <view class="flex items-center space-x-2">
            <switch
              :checked="userAccelerometer"
              @change="onAccelerometerChange"
            />
            <text class="text-sm">加速度计</text>
          </view>
        </view>

        <!-- 功率控制滑块 -->
        <view class="absolute right-4 top-4 h-80 w-12 rounded-lg bg-white p-2 shadow-md">
          <slider
            :value="powerSliderValue"
            :max="120"
            vertical
            class="h-full"
            @change="onPowerChange"
          />
          <view class="mt-2 text-center">
            <text class="text-xs text-gray-600">{{ userSetPower }}</text>
          </view>
        </view>
      </map>
    </view>

    <!-- 舵角控制（非加速度计模式） -->
    <view v-if="!userAccelerometer" class="border-t border-gray-200 bg-white px-4 py-3">
      <view class="flex items-center space-x-4">
        <text class="text-sm text-gray-600">舵角:</text>
        <slider
          :value="rudderSliderValue"
          :max="120"
          class="flex-1"
          @change="onRudderChange"
        />
        <text class="text-sm font-medium">{{ currentRudder }}°</text>
      </view>
    </view>

    <!-- 底部状态栏 -->
    <view class="border-t border-gray-200 bg-white px-4 py-3">
      <view class="flex items-center justify-between text-xs">
        <view class="flex space-x-4">
          <text>功率: {{ shipStatus.power }}W</text>
          <text>电压: {{ shipStatus.batteryVoltage }}V</text>
          <text>速度: {{ shipStatus.speedKnot }}节</text>
          <text>运行时间: {{ shipStatus.runningTime }}分</text>
        </view>
        <view class="flex space-x-2">
          <view
            class="rounded px-2 py-1 text-xs text-white"
            :class="shipStatus.localOK ? 'bg-green-500' : 'bg-red-500'"
          >
            主控
          </view>
          <view
            class="rounded px-2 py-1 text-xs text-white"
            :class="shipStatus.usvOnline ? 'bg-green-500' : 'bg-red-500'"
          >
            基站
          </view>
          <view
            class="rounded px-2 py-1 text-xs text-white"
            :class="shipStatus.remoteOK ? 'bg-green-500' : 'bg-red-500'"
          >
            遥控
          </view>
          <text class="text-gray-600">{{ rxCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useShipStore } from '@/store/ship'


// 获取页面参数
const options = ref<any>({})

// Store
const shipStore = useShipStore()
const {
  currentShipId,
  currentShip,
  allMarkers,
  polylines,
  userAccelerometer,
  crossMarker,
  shipStatus,
  bluetoothConnected,
  connectedDeviceId,
  connectedDeviceName,
} = storeToRefs(shipStore)

// 响应式数据
const mapCenter = ref({
  latitude: 24.5945,
  longitude: 118.0835,
})
const mapScale = ref(10)
const enableAuto = ref(false)
const showSettings = ref(false)
const userSetPower = ref(0)
const currentRudder = ref(0)
const powerSliderValue = ref(60)
const rudderSliderValue = ref(60)
const rxCount = ref(0)

// 定时器相关
let communicationTimer: any = null
let rxTimeOut = 0
let rudderDragTime = 0

// 初始化通信定时器
function startCommunication() {
  communicationTimer = setInterval(() => {
    rudderDragTime++

    if (rxTimeOut < 0 || rxTimeOut > 20) {
      console.log('RxTimeOut:', rxTimeOut)
      sendBluetoothData()
      rxTimeOut = 1
    }
    rxTimeOut++
  }, 50)
}

// 发送蓝牙数据
async function sendBluetoothData() {
  if (!bluetoothConnected.value || connectedDeviceId.value === 'demo') {
    return
  }

  const data = shipProtocol.getTxBuffer(
    currentShipId.value,
    userSetPower.value,
    -currentShip.value.rudder,
  )

  const success = await bluetoothManager.writeData(data)
  if (!success) {
    console.error('发送数据失败')
  }
}

// 更新地图中心
function updateMapCenter() {
  const ship = currentShip.value
  if (ship.ship.latitude && ship.ship.longitude) {
    mapCenter.value = {
      latitude: ship.ship.latitude,
      longitude: ship.ship.longitude,
    }
  }
}

// 地图事件处理
function onRegionChange(event: any) {
  if (event.type === 'end' && event.causedBy === 'drag') {
    const mapCtx = uni.createMapContext('mapId')
    mapCtx.getCenterLocation({
      success: (res) => {
        const { latitude, longitude } = res

        // 更新选中航点位置
        const ship = currentShip.value
        ship.waypoints.forEach((waypoint) => {
          if (waypoint.selected) {
            shipStore.updateWaypoint(currentShipId.value, waypoint.id, latitude, longitude)
            shipProtocol.modifyWaypoint(currentShipId.value, waypoint.id, longitude, latitude)
            shipStore.saveToStorage()
          }
        })

        // 更新十字标记位置
        shipStore.setCrossMarker(latitude, longitude)

        mapCtx.getScale({
          success: (scaleRes) => {
            mapScale.value = scaleRes.scale
            shipStore.setCrossMarker(latitude, longitude, scaleRes.scale)
          },
        })

        shipStore.saveToStorage()
      },
    })
  }
}

function onMarkerTap(event: any) {
  console.log('onMarkerTap', event.markerId)

  // 处理航点选择
  const ship = currentShip.value
  let selectedWaypoint = false

  for (let i = 0; i < ship.waypoints.length; i++) {
    const waypoint = ship.waypoints[i]
    if (event.markerId === waypoint.id) {
      selectedWaypoint = true
      // 移动地图到选中航点
      const mapCtx = uni.createMapContext('mapId')
      mapCtx.moveToLocation({
        latitude: waypoint.latitude,
        longitude: waypoint.longitude,
      })
      shipStore.setCrossMarker(waypoint.longitude, waypoint.latitude)
      break
    }
  }

  // 处理船舶选择
  for (let index = 0; index < shipStore.ships.length; index++) {
    const shipData = shipStore.ships[index]
    if (shipData.ship.id === event.markerId) {
      shipStore.setCurrentShipId(index)
      break
    }
  }

  updateControlValues()
}

function onMapTap() {
  console.log('onMapTap')
  updateControlValues()
}

// 控制事件处理
function onPowerChange(event: any) {
  const value = 60 - event.detail.value
  let result = 0

  if (value < -10 || value > 10) {
    result = value
  }

  if (result < 0) {
    result = result + 10
  }
  else if (result > 0) {
    result = result - 10
  }

  const power = Math.round(result * 2)
  userSetPower.value = power
  powerSliderValue.value = event.detail.value

  // 更新船舶功率
  const ship = currentShip.value
  ship.power = power
}

function onRudderChange(event: any) {
  rudderDragTime = 0

  const value = 60 - event.detail.value
  let result = 0

  if (value < -10 || value > 10) {
    result = value
  }

  if (result < 0) {
    result = result + 10
  }
  else if (result > 0) {
    result = result - 10
  }

  const rudder = Math.round(-result * 2)
  currentRudder.value = rudder
  rudderSliderValue.value = event.detail.value

  // 更新船舶舵角
  const ship = currentShip.value
  ship.rudder = rudder
}

function onAutoChange(event: any) {
  enableAuto.value = event.detail.value
 }

function onAccelerometerChange(event: any) {
  const enabled = event.detail.value
  shipStore.setUserAccelerometer(enabled)



  // 保存设置
  shipStore.saveToStorage()
}

// 航点管理
function addWaypoint() {
  console.log('addWaypoint')

  const mapCtx = uni.createMapContext('mapId')
  mapCtx.getCenterLocation({
    success: (res) => {
      const ship = currentShip.value
      let id = 0
      if (ship.waypoints.length > 0) {
        id = ship.waypoints[ship.waypoints.length - 1].id + 1
      }

      const waypoint = {
        id,
        anchor: { x: 0.5, y: 1 },
        iconPath: '/static/images/reddotmark.png',
        width: 20,
        height: 20,
        latitude: res.latitude,
        longitude: res.longitude,
        selected: false,
        updated: false,
      }

      shipStore.addWaypoint(currentShipId.value, waypoint)
      shipProtocol.addWaypoint(currentShipId.value, id, res.longitude, res.latitude)
      shipStore.saveToStorage()
    },
  })
}

function deleteWaypoint() {
  console.log('deleteWaypoint')

  const ship = currentShip.value
  for (let i = ship.waypoints.length - 1; i >= 0; i--) {
    const waypoint = ship.waypoints[i]
    if (waypoint.selected) {
      shipProtocol.deleteWaypoint(currentShipId.value, waypoint.id)
      shipStore.removeWaypoint(currentShipId.value, waypoint.id)
      shipStore.saveToStorage()
    }
  }
}

function deleteAllWaypoints() {
  console.log('deleteAllWaypoints')

  shipProtocol.deleteAllWaypoints(currentShipId.value)
  shipStore.clearAllWaypoints(currentShipId.value)
  shipStore.saveToStorage()
}

function setZeroPoint() {
  shipProtocol.setForceSetZPoint(currentShipId.value)
}

function calibrateINS() {
  shipProtocol.setCalibINS(currentShipId.value)
}

function toggleSettings() {
  showSettings.value = !showSettings.value
}
</script>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "船舶控制",
    "navigationBarBackgroundColor": "#2563eb",
    "navigationBarTextStyle": "white",
    "pageOrientation": "landscape"
  }
}
</route>
