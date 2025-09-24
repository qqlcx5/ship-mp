import type { IBluetoothDevice } from '@/store/ship'

// 蓝牙适配器状态
export interface IBluetoothAdapterState {
  available: boolean
  discovering: boolean
}

// 蓝牙连接回调
export interface IBluetoothCallbacks {
  onDeviceFound?: (device: IBluetoothDevice) => void
  onAdapterStateChange?: (state: IBluetoothAdapterState) => void
  onConnectionStateChange?: (connected: boolean, deviceId?: string) => void
  onCharacteristicValueChange?: (value: ArrayBuffer) => void
}

class BluetoothManager {
  private callbacks: IBluetoothCallbacks = {}
  private discoveryStarted = false
  private connectedDeviceId = ''
  private serviceId = ''
  private characteristicId = ''

  // 蓝牙服务UUID
  private readonly serviceUUIDs = [
    '0000FFE0-0000-1000-8000-00805F9B34FB',
    '00001000-0000-1000-8000-00805F9B34FB',
  ]

  // 蓝牙特征UUID
  private readonly txUUIDs = [
    '0000FFE1-0000-1000-8000-00805F9B34FB',
    '00001001-0000-1000-8000-00805F9B34FB',
  ]

  constructor() {
    this.initEventListeners()
  }

  // 设置回调函数
  setCallbacks(callbacks: IBluetoothCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks }
  }

  // 初始化事件监听
  private initEventListeners() {
    // 监听蓝牙适配器状态变化
    uni.onBluetoothAdapterStateChange((res) => {
      console.log('蓝牙适配器状态变化:', res)
      this.callbacks.onAdapterStateChange?.({
        available: res.available,
        discovering: res.discovering,
      })

      if (res.available && !this.discoveryStarted) {
        this.startDevicesDiscovery()
      }
    })

    // 监听蓝牙设备发现
    uni.onBluetoothDeviceFound((res) => {
      res.devices.forEach((device) => {
        if (!device.name && !device.localName) {
          return
        }

        const bluetoothDevice: IBluetoothDevice = {
          deviceId: device.deviceId,
          name: device.name || device.localName || '',
          localName: device.localName,
          RSSI: device.RSSI,
          advertisServiceUUIDs: device.advertisServiceUUIDs || [],
        }

        this.callbacks.onDeviceFound?.(bluetoothDevice)
      })
    })

    // 监听蓝牙连接状态变化
    uni.onBLEConnectionStateChange((res) => {
      console.log('蓝牙连接状态变化:', res)
      this.callbacks.onConnectionStateChange?.(res.connected, res.deviceId)

      if (!res.connected) {
        this.connectedDeviceId = ''
        this.serviceId = ''
        this.characteristicId = ''
      }
    })

    // 监听特征值变化
    uni.onBLECharacteristicValueChange((res) => {
      this.callbacks.onCharacteristicValueChange?.(res.value as unknown as ArrayBuffer)
    })
  }

  // 打开蓝牙适配器
  async openBluetoothAdapter(): Promise<boolean> {
    return new Promise((resolve) => {
      uni.openBluetoothAdapter({
        success: () => {
          console.log('蓝牙适配器打开成功')
          resolve(true)
          this.startDevicesDiscovery()
        },
        fail: (res) => {
          console.error('蓝牙适配器打开失败:', res)
          if (res.errCode === 10001) {
            // 蓝牙未打开，等待用户打开
            resolve(false)
          }
          else {
            resolve(false)
          }
        },
      })
    })
  }

  // 开始搜索设备
  startDevicesDiscovery() {
    if (this.discoveryStarted) {
      return
    }

    this.discoveryStarted = true
    uni.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: () => {
        console.log('开始搜索蓝牙设备')
      },
      fail: (res) => {
        console.error('搜索蓝牙设备失败:', res)
        this.discoveryStarted = false
      },
    })
  }

  // 停止搜索设备
  stopDevicesDiscovery() {
    if (!this.discoveryStarted) {
      return
    }

    uni.stopBluetoothDevicesDiscovery({
      success: () => {
        console.log('停止搜索蓝牙设备')
        this.discoveryStarted = false
      },
    })
  }

  // 连接设备
  async connectDevice(deviceId: string): Promise<boolean> {
    return new Promise((resolve) => {
      uni.createBLEConnection({
        deviceId,
        success: () => {
          console.log('蓝牙设备连接成功:', deviceId)
          this.connectedDeviceId = deviceId
          this.getBLEDeviceServices(deviceId)
          resolve(true)
        },
        fail: (res) => {
          console.error('蓝牙设备连接失败:', res)
          resolve(false)
        },
      })
    })
  }

  // 断开连接
  async disconnectDevice(): Promise<boolean> {
    if (!this.connectedDeviceId) {
      return true
    }

    return new Promise((resolve) => {
      uni.closeBLEConnection({
        deviceId: this.connectedDeviceId,
        success: () => {
          console.log('蓝牙设备断开成功')
          this.connectedDeviceId = ''
          this.serviceId = ''
          this.characteristicId = ''
          resolve(true)
        },
        fail: (res) => {
          console.error('蓝牙设备断开失败:', res)
          resolve(false)
        },
      })
    })
  }

  // 获取设备服务
  private getBLEDeviceServices(deviceId: string) {
    uni.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        console.log('获取设备服务成功:', res.services)
        for (const service of res.services) {
          if (this.serviceUUIDs.includes(service.uuid)) {
            this.serviceId = service.uuid
            this.getBLEDeviceCharacteristics(deviceId, service.uuid)
            return
          }
        }
      },
      fail: (res) => {
        console.error('获取设备服务失败:', res)
      },
    })
  }

  // 获取设备特征
  private getBLEDeviceCharacteristics(deviceId: string, serviceId: string) {
    uni.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('获取设备特征成功:', res.characteristics)

        for (const characteristic of res.characteristics) {
          // 读取特征值
          if (characteristic.properties.read) {
            uni.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: characteristic.uuid,
            })
          }

          // 设置写入特征
          if (this.txUUIDs.includes(characteristic.uuid)) {
            this.characteristicId = characteristic.uuid
          }

          // 启用通知
          if (characteristic.properties.notify || characteristic.properties.indicate) {
            uni.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: characteristic.uuid,
              state: true,
            })
          }
        }
      },
      fail: (res) => {
        console.error('获取设备特征失败:', res)
      },
    })
  }

  // 写入数据
  async writeData(data: number[]): Promise<boolean> {
    if (!this.connectedDeviceId || !this.serviceId || !this.characteristicId) {
      console.error('蓝牙未连接或服务未准备好')
      return false
    }

    return new Promise((resolve) => {
      const buffer = new ArrayBuffer(data.length)
      const view = new Uint8Array(buffer)
      data.forEach((byte, index) => {
        view[index] = byte
      })

      uni.writeBLECharacteristicValue({
        deviceId: this.connectedDeviceId,
        serviceId: this.serviceId,
        characteristicId: this.characteristicId,
        value: buffer as any,
        success: () => {
          resolve(true)
        },
        fail: (res) => {
          console.error('写入数据失败:', res)
          resolve(false)
        },
      })
    })
  }

  // 关闭蓝牙适配器
  closeBluetoothAdapter() {
    this.stopDevicesDiscovery()
    this.disconnectDevice()
    uni.closeBluetoothAdapter()
  }

  // 获取连接状态
  get isConnected(): boolean {
    return !!this.connectedDeviceId
  }

  // 获取连接的设备ID
  get connectedDevice(): string {
    return this.connectedDeviceId
  }
}

// 导出单例
export const bluetoothManager = new BluetoothManager()

// 工具函数：检查信号强度百分比
export function getSignalStrengthPercentage(rssi: number): number {
  return Math.max(0, rssi + 100)
}

// 工具函数：格式化设备名称
export function formatDeviceName(device: IBluetoothDevice): string {
  return device.name || device.localName || '未知设备'
}
