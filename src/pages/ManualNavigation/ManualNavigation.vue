<script setup lang="ts">
import crcCal from '@/utils/crcCalc'
import stm32 from '@/utils/STM32Com'
import JWDutils from '@/utils/WScoordinate'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useShipStore } from '@/store/ship'

const shipStore = useShipStore()

// 页面参数
const connectedDeviceId = ref('')
const connectedDeviceName = ref('')

// 蓝牙连接相关
const bleDeviceId = ref('')
const bleServiceId = ref('')
const bleCharacteristicId = ref('')

// 控制参数
const userSetPower = ref(0)
const currentRudder = ref(0)
const enableAuto = ref(false)
const showSettings = ref(false)
const powerSliderValue = ref(60)
const rudderSliderValue = ref(60)
const powerButtonColor = ref('#757575')
const rudderButtonColor = ref('#757575')

// 状态数据
const shipStatus = ref({
  power: 0,
  batteryVoltage: 0,
  speedKnot: 0,
  runningTime: 0,
  localOK: false,
  remoteOK: false,
  usvOnline: false,
})

const rxCount = ref(0)
const mapScale = ref(10)

// 定时器相关
let interval: any = null
let rxTimeOut = 0
let timeout = 0
let rudderDragTime = 0

// 当前船舶ID
const currentShipId = ref(0)

// 计算属性
const currentShip = computed(() => shipStore.ships[currentShipId.value])
const allMarkers = computed(() => shipStore.allMarkers)
const polylines = computed(() => shipStore.polylines)

// 启动定时器
function startInterval() {
  interval = setInterval(() => {
    rudderDragTime++
    if (rxTimeOut < 0 || rxTimeOut > 20) {
      console.log('RxTimeOut:', rxTimeOut)
      writeBLECharacteristicValue()
      rxTimeOut = 1
    }
    rxTimeOut++
  }, 50)
}

// 获取蓝牙设备服务
function getBLEDeviceServices(deviceId: string) {
  console.log('获取设备服务:', deviceId)
  uni.getBLEDeviceServices({
    deviceId,
    success: (res) => {
      console.log('getBLEDeviceServices success')
      for (let i = 0; i < res.services.length; i++) {
        console.log(res.services[i].uuid)
        if (shipStore.bleServiceUuid.indexOf(res.services[i].uuid) >= 0) {
          getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
          return
        }
      }
    },
    fail: (res) => {
      console.error('获取设备服务失败:', res)
    },
  })
}

// 获取蓝牙设备特征值
function getBLEDeviceCharacteristics(deviceId: string, serviceId: string) {
  console.log('获取设备特征值:', deviceId, serviceId)
  uni.getBLEDeviceCharacteristics({
    deviceId,
    serviceId,
    success: (res) => {
      console.log('getBLEDeviceCharacteristics success', res.characteristics)
      timeout = 0

      for (let i = 0; i < res.characteristics.length; i++) {
        const item = res.characteristics[i]

        if (item.properties.read) {
          uni.readBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
          })
        }

        if (shipStore.bleTxUuid.indexOf(item.uuid) >= 0) {
          bleDeviceId.value = deviceId
          bleServiceId.value = serviceId
          bleCharacteristicId.value = item.uuid
          writeBLECharacteristicValue()
        }

        if (item.properties.notify || item.properties.indicate) {
          uni.notifyBLECharacteristicValueChange({
            deviceId,
            serviceId,
            characteristicId: item.uuid,
            state: true,
          })
        }
      }

      // 初始化航点数据
      for (let i = 0; i < shipStore.ships.length; i++) {
        stm32.StartUpdateWayPoint(i)
        for (let j = 0; j < shipStore.ships[i].waypoints.length; j++) {
          const wp = shipStore.ships[i].waypoints[j]
          stm32.UpdateWayPoint(i, wp.id, wp.longitude, wp.latitude)
        }
        stm32.EndUpdateWayPoint(i)
      }
    },
    fail: (res) => {
      console.error('getBLEDeviceCharacteristics', res)
    },
  })

  onBLEDataReceived()
}

// 蓝牙发送数据
function writeBLECharacteristicValue() {
  const arr = stm32.GetTxBuf(currentShipId.value, userSetPower.value, -currentShip.value.rudder)

  uni.writeBLECharacteristicValue({
    deviceId: bleDeviceId.value,
    serviceId: bleServiceId.value,
    characteristicId: bleCharacteristicId.value,
    value: new Uint8Array(arr).buffer,
    success: () => {
      timeout = 0
    },
    fail: (res) => {
      timeout++
      if (timeout > 1) {
        reconnectBLE()
      }
      uni.showToast({
        title: '发送失败',
        icon: 'error',
      })
    },
  })
}

// 重连蓝牙
function reconnectBLE() {
  uni.createBLEConnection({
    deviceId: bleDeviceId.value,
    success: () => {
      getBLEDeviceServices(connectedDeviceId.value)
    },
    fail: (res) => {
      console.log('重连失败:', res)
    },
  })
}

// 蓝牙接收数据
function onBLEDataReceived() {
  uni.onBLECharacteristicValueChange((characteristic) => {
    if (!characteristic.value || characteristic.value.byteLength < 5) return

    const view = new DataView(characteristic.value)
    const arr: number[] = []
    for (let i = 0; i < view.byteLength - 2; i++) {
      arr.push(view.getInt8(i))
    }

    const calcCrc = crcCal.compute(arr, arr.length)
    const recCrc = view.getInt16(view.byteLength - 2, false) & 0xffff
    if (calcCrc !== recCrc) return

    const id = view.getUint8(0)
    if (id === currentShipId.value) {
      shipStatus.value.localOK = (view.getInt8(2) & 0x02) !== 0
      shipStatus.value.remoteOK = (view.getInt8(2) & 0x04) !== 0
      shipStatus.value.usvOnline = (view.getInt8(2) & 0x08) !== 0
    }

    const funcCode = view.getUint8(1)
    switch (funcCode) {
      case 0: {
        // GPS位置数据
        const lat = view.getInt32(6, true) / 1000000.0
        const lng = view.getInt32(10, true) / 1000000.0
        const result = JWDutils.wgs84ToGcj02(lng, lat)

        shipStore.updateShipPosition(id, result[1], result[0], view.getInt16(4, true) / 10.0)
        shipStore.addTrackPoint(id, result[1], result[0])
        break
      }
      case 1: {
        // 电池电压数据
        if (id === currentShipId.value) {
          shipStatus.value.batteryVoltage = view.getInt16(8, true) / 10.0
        }
        break
      }
      case 2: {
        // 功率数据
        if (id === currentShipId.value) {
          shipStatus.value.power = view.getInt16(8, true)
        }
        break
      }
      case 3: {
        // 速度数据
        if (id === currentShipId.value) {
          shipStatus.value.speedKnot = view.getInt16(4, true) / 10.0
          shipStatus.value.runningTime = view.getInt16(8, true)
        }
        break
      }
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
        stm32.RemoveInstruction(id, view.getInt8(1), view.getInt16(4))
        break
    }

    rxTimeOut = 20
    rxCount.value++

    if (id === currentShipId.value && rudderDragTime > 20) {
      currentRudder.value = view.getInt8(3)
    }
  })
}

// 功率滑块拖拽
function onPowerDrag(event: any) {
  let result = 0
  let color = '#757575'
  const value = 60 - event.detail.value

  if (value < -10 || value > 10) {
    result = value
  }

  if (result < 0) {
    result = result + 10
    color = '#ff7043'
  } else if (result > 0) {
    result = result - 10
    color = '#00b26a'
  }

  const power = (result * 2)
  shipStore.updateShipPower(currentShipId.value, power)
  userSetPower.value = power
  powerSliderValue.value = event.detail.value
  powerButtonColor.value = color
}

// 舵角滑块拖拽
function onRudderDrag(event: any) {
  rudderDragTime = 0
  if (shipStore.userAccelerometer || !stm32.GetEnableManual(currentShipId.value)) {
    return
  }

  let result = 0
  let color = '#757575'
  const value = 60 - event.detail.value

  if (value < -10 || value > 10) {
    result = value
  }

  if (result < 0) {
    result = result + 10
    color = '#ff7043'
  } else if (result > 0) {
    result = result - 10
    color = '#ff7043'
  }

  const rudder = (-result * 2)
  shipStore.updateShipRudder(currentShipId.value, rudder)
  currentRudder.value = rudder
  rudderSliderValue.value = event.detail.value
  rudderButtonColor.value = color
}

// 自动模式切换
function autoChange(e: any) {
  stm32.SetEnableManual(currentShipId.value, !e.detail.value)
  enableAuto.value = e.detail.value
}

// 使用加速度计切换
function userAccelerometerChange(e: any) {
  shipStore.setUserAccelerometer(e.detail.value)
}

// 设置舵机零点
function forceSetZPoint() {
  stm32.SetForceSetZPoint(currentShipId.value)
}

// 标定磁力计
function calibINS() {
  stm32.SetCalibINS(currentShipId.value)
}

// 添加航点
function addWayPoint() {
  const mapCtx = uni.createMapContext('mapId')
  mapCtx.getCenterLocation({
    success: (res) => {
      let id = 0
      const currentWaypoints = shipStore.ships[currentShipId.value].waypoints
      if (currentWaypoints.length > 0) {
        id = currentWaypoints[currentWaypoints.length - 1].id + 1
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
      stm32.AddWayPoint(currentShipId.value, id, res.longitude, res.latitude)
      shipStore.saveToStorage()
    },
  })
}

// 删除选中航点
function deleteWayPoint() {
  const currentWaypoints = shipStore.ships[currentShipId.value].waypoints
  for (let i = 0; i < currentWaypoints.length; i++) {
    if (currentWaypoints[i].selected) {
      stm32.DeleteWayPoint(currentShipId.value, currentWaypoints[i].id)
      shipStore.removeWaypoint(currentShipId.value, currentWaypoints[i].id)
      shipStore.saveToStorage()
      break
    }
  }
}

// 删除所有航点
function deleteAllWayPoint() {
  stm32.DeleteAllWayPoint(currentShipId.value)
  shipStore.clearAllWaypoints(currentShipId.value)
  shipStore.saveToStorage()
}

// 显示设置
function showSettingsToggle() {
  showSettings.value = !showSettings.value
}

// 地图点击
function onMapTap() {
  console.log('地图点击')
  enableAuto.value = !stm32.GetEnableManual(currentShipId.value)
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

  currentRudder.value = shipStore.ships[currentShipId.value].rudder
  userSetPower.value = shipStore.ships[currentShipId.value].power
  enableAuto.value = !stm32.GetEnableManual(currentShipId.value)
}

// 地图区域变化
function onRegionChange(event: any) {
  if (event.type === 'end' && event.causedBy === 'drag') {
    const mapCtx = uni.createMapContext('mapId')
    mapCtx.getCenterLocation({
      success: (res) => {
        const { latitude, longitude } = res

        mapCtx.getScale({
          success: (scaleRes) => {
            shipStore.setCrossMarker(latitude, longitude, scaleRes.scale)
            mapScale.value = scaleRes.scale
          },
        })
      },
    })
  }
}

// 页面生命周期
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage?.options || {}

  connectedDeviceId.value = options.connectedDeviceId || ''
  connectedDeviceName.value = decodeURIComponent(options.connectedDevicename || '')

  // 加载存储数据
  shipStore.loadFromStorage()

  // 设置地图中心
  const mapCtx = uni.createMapContext('mapId')
  mapCtx.moveToLocation({
    latitude: shipStore.crossMarker.latitude,
    longitude: shipStore.crossMarker.longitude,
  })

  mapScale.value = shipStore.crossMarker.mapscale

  // 监听加速度计
  uni.onAccelerometerChange((res) => {
    let result = 0
    const value = res.y * 100

    if (value < -15 || value > 15) {
      result = value
    }

    if (result < 0) {
      result = result + 15
    } else if (result > 0) {
      result = result - 15
    }

    result = -(result * 3)

    if (shipStore.userAccelerometer && stm32.GetEnableManual(currentShipId.value)) {
      const currentRudderValue = shipStore.ships[currentShipId.value].rudder
      if (result === 0 || Math.abs(currentRudderValue - result) > 2) {
        shipStore.updateShipRudder(currentShipId.value, result)
        currentRudder.value = result
      }
    }
  })

  // 如果有设备ID，开始蓝牙通信
  if (connectedDeviceId.value && connectedDeviceId.value !== '0') {
    getBLEDeviceServices(connectedDeviceId.value)
  }

  startInterval()
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }

  uni.stopBluetoothDevicesDiscovery()

  if (connectedDeviceId.value && connectedDeviceId.value !== '0') {
    uni.closeBLEConnection({
      deviceId: connectedDeviceId.value,
    })
  }

  uni.closeBluetoothAdapter()
})

// 页面配置
definePage({
  style: {
    navigationBarTitleText: '手动导航'
  }
})
</script>

<template>
  <view class="container-row">
    <!-- 顶部信息栏 -->
    <view class="fixed-height">
      <text v-if="shipStore.userAccelerometer" class="page-body-title">
        当前舵角: {{ currentRudder }}
      </text>
    </view>

    <!-- 主要内容区域 -->
    <view class="auto-full-height">
      <view class="container-column">
        <!-- 地图区域 -->
        <view class="auto-full-width">
          <map
            id="mapId"
            class="map"
            :latitude="shipStore.crossMarker.latitude"
            :longitude="shipStore.crossMarker.longitude"
            :scale="mapScale"
            :markers="allMarkers"
            :polyline="polylines"
            @regionchange="onRegionChange"
            @markertap="onMarkerTap"
            @tap="onMapTap"
          >
            <!-- 地图按钮 -->
            <view class="map-button">
              <view class="map-button1">
                <switch
                  :checked="enableAuto"
                  class="transparent-button"
                  @change="autoChange"
                >
                  自动
                </switch>
                <button class="transparent-button" @tap="addWayPoint">
                  添加点
                </button>
                <button class="transparent-button" @tap="deleteWayPoint">
                  删除点
                </button>
                <button class="transparent-button" @tap="showSettingsToggle">
                  设置
                </button>
              </view>

              <!-- 设置面板 -->
              <view v-if="showSettings" class="map-settings">
                <button class="transparent-button" @tap="deleteAllWayPoint">
                  删除所有路径
                </button>
                <button class="transparent-button" @tap="forceSetZPoint">
                  设置舵机零点
                </button>
                <button class="transparent-button" @tap="calibINS">
                  标定磁力计
                </button>
                <switch
                  :checked="shipStore.userAccelerometer"
                  class="transparent-button"
                  @change="userAccelerometerChange"
                >
                  加速度计
                </switch>
              </view>
            </view>
          </map>
        </view>

        <!-- 功率滑块 -->
        <view class="fixed-width">
          <view class="power-slider">
            <slider
              :max="120"
              :value="powerSliderValue"
              :active-color="powerButtonColor"
              inactive-color="#f8f8f8"
              vertical
              @change="onPowerDrag"
            />
            <view
              class="power-button"
              :style="{ backgroundColor: powerButtonColor }"
            >
              {{ userSetPower }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 舵角滑块 -->
    <view v-if="!shipStore.userAccelerometer" class="fixed-height">
      <view class="rudder-slider">
        <slider
          :max="120"
          :value="rudderSliderValue"
          :active-color="rudderButtonColor"
          inactive-color="#f8f8f8"
          @change="onRudderDrag"
        />
        <view
          class="rudder-button"
          :style="{ backgroundColor: rudderButtonColor }"
        >
          {{ currentRudder }}
        </view>
      </view>
    </view>

    <!-- 底部状态栏 -->
    <view class="fixed-height">
      <text class="page-info">功率: {{ shipStatus.power }}W</text>
      <text class="page-info">电压: {{ shipStatus.batteryVoltage.toFixed(1) }}V</text>
      <text class="page-info">速度: {{ shipStatus.speedKnot.toFixed(1) }}</text>
      <text class="page-info">运行时间: {{ shipStatus.runningTime }}</text>

      <text
        :class="shipStatus.localOK ? 'status-ok' : 'status-error'"
      >
        主控
      </text>
      <text
        :class="shipStatus.usvOnline ? 'status-ok' : 'status-error'"
      >
        基站
      </text>
      <text
        :class="shipStatus.remoteOK ? 'status-ok' : 'status-error'"
      >
        遥控
      </text>

      <text class="page-info-right">{{ rxCount }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container-row {
  @apply flex flex-col h-screen;
}

.container-column {
  @apply flex flex-row h-full;
}

.fixed-height {
  @apply h-12 flex items-center px-4 bg-gray-100 border-b border-gray-200;
}

.auto-full-height {
  @apply flex-1;
}

.auto-full-width {
  @apply flex-1;
}

.fixed-width {
  @apply w-20 bg-gray-100 border-l border-gray-200;
}

.page-body-title {
  @apply text-sm font-medium text-gray-700;
}

.map {
  @apply w-full h-full;
}

.map-button {
  @apply absolute top-2 left-2 bg-white bg-opacity-90 rounded-lg p-2;
}

.map-button1 {
  @apply flex flex-col space-y-2;
}

.map-settings {
  @apply flex flex-col space-y-2 mt-2 pt-2 border-t border-gray-200;
}

.transparent-button {
  @apply bg-transparent border-none text-sm text-gray-700 p-1;
  font-size: 12px;
}

.power-slider {
  @apply h-full flex flex-col items-center justify-center p-2;
}

.power-button {
  @apply w-12 h-8 rounded text-white text-xs flex items-center justify-center mt-2;
}

.rudder-slider {
  @apply w-full flex items-center justify-center p-2;
}

.rudder-button {
  @apply w-12 h-8 rounded text-white text-xs flex items-center justify-center ml-2;
}

.page-info {
  @apply text-xs text-gray-600 mr-4;
}

.page-info-right {
  @apply text-xs text-gray-600 ml-auto;
}

.status-ok {
  @apply text-xs bg-green-500 text-white px-2 py-1 rounded mr-2;
}

.status-error {
  @apply text-xs bg-red-500 text-white px-2 py-1 rounded mr-2;
}
</style>
