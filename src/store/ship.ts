import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

// 船舶标记点接口
export interface IWaypoint {
  id: number
  latitude: number
  longitude: number
  selected: boolean
  updated?: boolean
  anchor: { x: number, y: number }
  iconPath: string
  width: number
  height: number
}

// 船舶轨迹点接口
export interface ITrackPoint {
  latitude: number
  longitude: number
}

// 船舶信息接口
export interface IShipMarker {
  id: number
  width: number
  height: number
  anchor: { x: number, y: number }
  latitude: number
  longitude: number
  rotate: number
  iconPath: string
}

// PLOS标记接口
export interface IPlosMarker {
  id: number
  width: number
  height: number
  anchor: { x: number, y: number }
  latitude: number
  longitude: number
  rotate: number
  iconPath: string
}

// 船舶数据接口
export interface IShipData {
  power: number
  rudder: number
  waypoints: IWaypoint[]
  points: ITrackPoint[]
  ship: IShipMarker
  plos: IPlosMarker
}

// 十字标记接口
export interface ICrossMarker {
  id: number
  width: number
  height: number
  anchor: { x: number, y: number }
  latitude: number
  longitude: number
  iconPath: string
  zindex: number
  mapscale: number
}

// 蓝牙设备接口
export interface IBluetoothDevice {
  deviceId: string
  name: string
  localName?: string
  RSSI: number
  advertisServiceUUIDs?: string[]
}

// 船舶状态数据接口
export interface IShipStatus {
  power: number // 功率 W
  batteryVoltage: number // 电池电压 V
  speedKnot: number // 速度 节
  runningTime: number // 运行时间 分钟
  localOK: boolean // 主控状态
  remoteOK: boolean // 遥控状态
  usvOnline: boolean // 基站状态
}

export const useShipStore = defineStore('ship', () => {
  // 蓝牙相关配置
  const bleServiceUuid = ref([
    '0000FFE0-0000-1000-8000-00805F9B34FB',
    '00001000-0000-1000-8000-00805F9B34FB',
  ])

  const bleTxUuid = ref([
    '0000FFE1-0000-1000-8000-00805F9B34FB',
    '00001001-0000-1000-8000-00805F9B34FB',
  ])

  // 全局设置
  const observe = ref(false)
  const userAccelerometer = ref(false)

  // 十字标记
  const crossMarker = ref<ICrossMarker>({
    id: 99999,
    width: 25,
    height: 25,
    anchor: { x: 0.5, y: 0.5 },
    latitude: 24.5945,
    longitude: 118.0835,
    iconPath: '/static/images/cross.png',
    zindex: 0,
    mapscale: 10,
  })

  // 船舶数据数组
  const ships = ref<IShipData[]>([
    // 船舶 0
    {
      power: 0,
      rudder: 0,
      waypoints: [],
      points: [],
      ship: {
        id: 99998,
        width: 30,
        height: 30,
        anchor: { x: 0.5, y: 0.5 },
        latitude: 24.5945,
        longitude: 118.0835,
        rotate: 90,
        iconPath: '/static/images/ship0.png',
      },
      plos: {
        id: 99997,
        width: 10,
        height: 10,
        anchor: { x: 0.5, y: 1 },
        latitude: 24.5945,
        longitude: 118.0835,
        rotate: 0,
        iconPath: '/static/images/plosmark.png',
      },
    },
    // 船舶 1-4 (类似结构)
    ...Array.from({ length: 4 }, (_, i) => ({
      power: 0,
      rudder: 0,
      waypoints: [],
      points: [],
      ship: {
        id: 99996 - i * 2,
        width: 30,
        height: 30,
        anchor: { x: 0.5, y: 0.5 },
        latitude: 0,
        longitude: 0,
        rotate: 90,
        iconPath: `/static/images/ship${i + 1}.png`,
      },
      plos: {
        id: 99995 - i * 2,
        width: 10,
        height: 10,
        anchor: { x: 0.5, y: 1 },
        latitude: 0,
        longitude: 0,
        rotate: 0,
        iconPath: '/static/images/plosmark.png',
      },
    })),
  ])

  // 当前选中的船舶ID
  const currentShipId = ref(0)

  // 蓝牙连接状态
  const bluetoothConnected = ref(false)
  const connectedDeviceId = ref('')
  const connectedDeviceName = ref('')

  // 蓝牙设备列表
  const bluetoothDevices = ref<IBluetoothDevice[]>([])

  // 船舶状态数据
  const shipStatus = ref<IShipStatus>({
    power: 0,
    batteryVoltage: 0,
    speedKnot: 0,
    runningTime: 0,
    localOK: false,
    remoteOK: false,
    usvOnline: false,
  })

  // 控制参数
  const userSetPower = ref(0)
  const currentRudder = ref(0)
  const enableAuto = ref(false)
  const showSettings = ref(false)
  const rxCount = ref(0)

  // 计算属性
  const currentShip = computed(() => ships.value[currentShipId.value])

  const allMarkers = computed(() => {
    const current = currentShipId.value
    return [
      crossMarker.value,
      ...ships.value.map(ship => ship.ship),
      ships.value[current].plos,
      ...ships.value[current].waypoints,
    ]
  })

  const polylines = computed(() => [
    {
      points: ships.value[currentShipId.value].waypoints,
      color: '#ff7043',
      width: 1,
    },
    {
      points: ships.value[currentShipId.value].points,
      color: '#3875FF',
      width: 1,
    },
  ])

  // 工具函数：计算两点间距离
  const getRealDistance = (lng1: number, lat1: number, lng2: number, lat2: number): number => {
    const radLat1 = lat1 * Math.PI / 180.0
    const radLng1 = lng1 * Math.PI / 180.0
    const radLat2 = lat2 * Math.PI / 180.0
    const radLng2 = lng2 * Math.PI / 180.0
    const a = radLat1 - radLat2
    const b = radLng1 - radLng2
    const dis = 2 * Math.asin(Math.sqrt(
      Math.sin(a / 2) ** 2
      + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2.0) ** 2.0,
    )) * 6378137
    return dis
  }

  // 方法
  const setCurrentShipId = (id: number) => {
    if (id >= 0 && id < ships.value.length) {
      currentShipId.value = id
    }
  }

  const updateShipPosition = (shipId: number, latitude: number, longitude: number, rotate: number) => {
    if (shipId >= 0 && shipId < ships.value.length) {
      const ship = ships.value[shipId]
      ship.ship.latitude = latitude
      ship.ship.longitude = longitude
      ship.ship.rotate = rotate
    }
  }

  const addTrackPoint = (shipId: number, latitude: number, longitude: number) => {
    if (shipId >= 0 && shipId < ships.value.length) {
      const ship = ships.value[shipId]
      const point = { latitude, longitude }

      // 检查距离，避免添加过于密集的点
      if (ship.points.length === 0
        || getRealDistance(longitude, latitude, ship.points[ship.points.length - 1].longitude, ship.points[ship.points.length - 1].latitude) > 8) {
        ship.points.push(point)
      }

      // 限制轨迹点数量
      if (ship.points.length > 500) {
        ship.points.shift()
      }
    }
  }

  const addWaypoint = (shipId: number, waypoint: IWaypoint) => {
    if (shipId >= 0 && shipId < ships.value.length) {
      ships.value[shipId].waypoints.push(waypoint)
    }
  }

  const removeWaypoint = (shipId: number, waypointId: number) => {
    if (shipId >= 0 && shipId < ships.value.length) {
      const ship = ships.value[shipId]
      const index = ship.waypoints.findIndex(wp => wp.id === waypointId)
      if (index !== -1) {
        ship.waypoints.splice(index, 1)
      }
    }
  }

  const clearAllWaypoints = (shipId: number) => {
    if (shipId >= 0 && shipId < ships.value.length) {
      ships.value[shipId].waypoints = []
    }
  }

  const updateWaypoint = (shipId: number, waypointId: number, latitude: number, longitude: number) => {
    if (shipId >= 0 && shipId < ships.value.length) {
      const ship = ships.value[shipId]
      const waypoint = ship.waypoints.find(wp => wp.id === waypointId)
      if (waypoint) {
        waypoint.latitude = latitude
        waypoint.longitude = longitude
      }
    }
  }

  const setBluetoothDevices = (devices: IBluetoothDevice[]) => {
    bluetoothDevices.value = devices
  }

  const addBluetoothDevice = (device: IBluetoothDevice) => {
    const existingIndex = bluetoothDevices.value.findIndex(d => d.deviceId === device.deviceId)
    if (existingIndex !== -1) {
      bluetoothDevices.value[existingIndex] = device
    }
    else {
      bluetoothDevices.value.push(device)
    }
  }

  const setBluetoothConnection = (connected: boolean, deviceId?: string, deviceName?: string) => {
    bluetoothConnected.value = connected
    if (deviceId)
      connectedDeviceId.value = deviceId
    if (deviceName)
      connectedDeviceName.value = deviceName
  }

  const updateShipStatus = (status: Partial<IShipStatus>) => {
    Object.assign(shipStatus.value, status)
  }

  const setUserAccelerometer = (enabled: boolean) => {
    userAccelerometer.value = enabled
  }

  const setCrossMarker = (latitude: number, longitude: number, mapscale?: number) => {
    crossMarker.value.latitude = latitude
    crossMarker.value.longitude = longitude
    if (mapscale !== undefined) {
      crossMarker.value.mapscale = mapscale
    }
  }

  const updateShipPower = (shipId: number, power: number) => {
    if (shipId >= 0 && shipId < ships.value.length) {
      ships.value[shipId].power = power
    }
  }

  const updateShipRudder = (shipId: number, rudder: number) => {
    if (shipId >= 0 && shipId < ships.value.length) {
      ships.value[shipId].rudder = rudder
    }
  }

  // 持久化相关方法
  const saveToStorage = () => {
    uni.setStorage({
      key: 'ships',
      data: ships.value,
    })
    uni.setStorage({
      key: 'userAccelerometer',
      data: userAccelerometer.value,
    })
    uni.setStorage({
      key: 'crossmarker',
      data: crossMarker.value,
    })
  }

  const loadFromStorage = () => {
    uni.getStorage({
      key: 'ships',
      success: (res) => {
        if (res.data) {
          ships.value = res.data
          // 重置运行时状态
          ships.value.forEach((ship) => {
            ship.power = 0
            ship.rudder = 0
            ship.ship.latitude = ship.ship.latitude || 0
            ship.ship.longitude = ship.ship.longitude || 0
            ship.points = []
            ship.waypoints.forEach((wp) => {
              wp.selected = false
            })
          })
        }
      },
    })

    uni.getStorage({
      key: 'userAccelerometer',
      success: (res) => {
        if (res.data !== undefined) {
          userAccelerometer.value = res.data
        }
      },
    })

    uni.getStorage({
      key: 'crossmarker',
      success: (res) => {
        if (res.data) {
          crossMarker.value = res.data
        }
      },
    })
  }

  return {
    // 只读状态
    bleServiceUuid: readonly(bleServiceUuid),
    bleTxUuid: readonly(bleTxUuid),
    observe: readonly(observe),
    userAccelerometer: readonly(userAccelerometer),
    crossMarker: readonly(crossMarker),
    ships: readonly(ships),
    currentShipId: readonly(currentShipId),
    bluetoothConnected: readonly(bluetoothConnected),
    connectedDeviceId: readonly(connectedDeviceId),
    connectedDeviceName: readonly(connectedDeviceName),
    bluetoothDevices: readonly(bluetoothDevices),
    shipStatus: readonly(shipStatus),
    userSetPower: readonly(userSetPower),
    currentRudder: readonly(currentRudder),
    enableAuto: readonly(enableAuto),
    showSettings: readonly(showSettings),
    rxCount: readonly(rxCount),

    // 计算属性
    currentShip,
    allMarkers,
    polylines,

    // 方法
    setCurrentShipId,
    updateShipPosition,
    addTrackPoint,
    addWaypoint,
    removeWaypoint,
    clearAllWaypoints,
    updateWaypoint,
    setBluetoothDevices,
    addBluetoothDevice,
    setBluetoothConnection,
    updateShipStatus,
    setUserAccelerometer,
    setCrossMarker,
    updateShipPower,
    updateShipRudder,
    getRealDistance,
    saveToStorage,
    loadFromStorage,
  }
}, {
  persist: true,
})
