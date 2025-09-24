<template>
  <view class="h-full w-full bg-gray-50">
    <!-- 顶部标题 -->
    <view class="bg-blue-600 px-4 py-6 text-white">
      <text class="text-xl font-bold">USV 无人船控制系统</text>
      <text class="mt-2 block text-sm opacity-90">请选择要连接的设备</text>
    </view>

    <!-- 搜索状态 -->
    <view class="border-b border-gray-200 bg-white px-4 py-3">
      <view class="flex items-center justify-between">
        <text class="text-gray-600">正在搜索蓝牙设备...</text>
        <view class="flex items-center space-x-2">
          <view v-if="isSearching" class="h-4 w-4 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
          <text class="text-sm text-blue-600">{{ devices.length }} 个设备</text>
        </view>
      </view>
    </view>

    <!-- 设备列表 -->
    <scroll-view class="flex-1 px-4 py-2" scroll-y>
      <view v-if="devices.length === 0" class="py-20 text-center">
        <view class="mb-4 text-6xl">
          📡
        </view>
        <text class="text-gray-500">未发现设备</text>
        <text class="mt-2 block text-sm text-gray-400">请确保设备已开启并在附近</text>
      </view>

      <view
        v-for="device in devices"
        :key="device.deviceId"
        class="mb-3 rounded-lg bg-white p-4 shadow-sm"
        @tap="connectDevice(device)"
      >
        <view class="flex items-center justify-between">
          <view class="flex-1">
            <text class="text-base text-gray-900 font-medium">{{ device.name || '未知设备' }}</text>
            <view class="mt-1 space-y-1">
              <text class="block text-xs text-gray-500">信号强度: {{ device.RSSI }}dBm ({{ getSignalPercentage(device.RSSI) }}%)</text>
              <text class="block text-xs text-gray-400">设备ID: {{ device.deviceId }}</text>
              <text v-if="device.advertisServiceUUIDs?.length" class="block text-xs text-gray-400">
                服务数量: {{ device.advertisServiceUUIDs.length }}
              </text>
            </view>
          </view>
          <view class="ml-4 flex items-center">
            <view class="flex items-center space-x-2">
              <!-- 信号强度指示器 -->
              <view class="flex items-end space-x-1">
                <view
                  class="h-2 w-1 rounded-full"
                  :class="getSignalPercentage(device.RSSI) > 20 ? 'bg-green-500' : 'bg-gray-300'"
                />
                <view
                  class="h-3 w-1 rounded-full"
                  :class="getSignalPercentage(device.RSSI) > 40 ? 'bg-green-500' : 'bg-gray-300'"
                />
                <view
                  class="h-4 w-1 rounded-full"
                  :class="getSignalPercentage(device.RSSI) > 60 ? 'bg-green-500' : 'bg-gray-300'"
                />
                <view
                  class="h-5 w-1 rounded-full"
                  :class="getSignalPercentage(device.RSSI) > 80 ? 'bg-green-500' : 'bg-gray-300'"
                />
              </view>
              <text class="text-blue-600">连接</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作 -->
    <view class="border-t border-gray-200 bg-white px-4 py-4">
      <button
        class="w-full rounded-lg bg-gray-600 py-3 text-white font-medium"
        @tap="skipConnection"
      >
        跳过连接（演示模式）
      </button>
    </view>

    <!-- 连接中弹窗 -->
    <view v-if="connecting" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <view class="mx-4 rounded-lg bg-white p-6 text-center">
        <view class="mx-auto mb-4 h-8 w-8 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
        <text class="text-base font-medium">正在连接设备...</text>
        <text class="mt-2 block text-sm text-gray-500">{{ connectingDeviceName }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IBluetoothDevice } from '@/store/ship'
import { onMounted, onUnmounted, ref } from 'vue'
import { useShipStore } from '@/store/ship'
import { bluetoothManager, formatDeviceName, getSignalStrengthPercentage } from '@/utils/bluetooth'

const shipStore = useShipStore()

// 响应式数据
const devices = ref<IBluetoothDevice[]>([])
const isSearching = ref(false)
const connecting = ref(false)
const connectingDeviceName = ref('')

// 获取信号强度百分比
function getSignalPercentage(rssi: number) {
  return getSignalStrengthPercentage(rssi)
}

// 初始化蓝牙
async function initBluetooth() {
  // 设置蓝牙回调
  bluetoothManager.setCallbacks({
    onDeviceFound: (device: IBluetoothDevice) => {
      const existingIndex = devices.value.findIndex(d => d.deviceId === device.deviceId)
      if (existingIndex !== -1) {
        devices.value[existingIndex] = device
      }
      else {
        devices.value.push(device)
      }
    },
    onAdapterStateChange: (state) => {
      isSearching.value = state.discovering
    },
    onConnectionStateChange: (connected, deviceId) => {
      if (connected && deviceId) {
        connecting.value = false
        // 跳转到地图页面
        uni.navigateTo({
          url: `/pages/ManualNavigation/ManualNavigation?deviceId=${deviceId}&deviceName=${connectingDeviceName.value}`,
        })
      }
      else {
        connecting.value = false
        uni.showToast({
          title: '连接失败',
          icon: 'none',
        })
      }
    },
  })

  // 打开蓝牙适配器
  const success = await bluetoothManager.openBluetoothAdapter()
  if (!success) {
    uni.showModal({
      title: '提示',
      content: '请开启蓝牙后重试',
      showCancel: false,
    })
  }
}

// 连接设备
async function connectDevice(device: IBluetoothDevice) {
  connecting.value = true
  connectingDeviceName.value = formatDeviceName(device)

  const success = await bluetoothManager.connectDevice(device.deviceId)
  if (success) {
    shipStore.setBluetoothConnection(true, device.deviceId, device.name)
  }
  else {
    connecting.value = false
    uni.showToast({
      title: '连接失败',
      icon: 'none',
    })
  }
}

// 跳过连接
function skipConnection() {
  uni.navigateTo({
    url: '/pages/ManualNavigation/ManualNavigation?deviceId=demo&deviceName=演示模式',
  })
}

// 页面生命周期
onMounted(() => {
  // 从存储加载数据
  shipStore.loadFromStorage()

  // 保持屏幕常亮
  uni.setKeepScreenOn({
    keepScreenOn: true,
  })

  // 初始化蓝牙
  initBluetooth()
})

onUnmounted(() => {
  // 关闭蓝牙适配器
  bluetoothManager.closeBluetoothAdapter()
})
</script>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "设备连接",
    "navigationBarBackgroundColor": "#2563eb",
    "navigationBarTextStyle": "white"
  }
}
</route>
