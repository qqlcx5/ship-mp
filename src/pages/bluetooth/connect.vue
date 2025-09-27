<script setup lang="ts">
import type { IBluetoothDevice } from '@/store/ship'

import { onMounted, onUnmounted, ref } from 'vue'
import { useShipStore } from '@/store/ship'

const shipStore = useShipStore()

// 页面数据
const devices = ref<IBluetoothDevice[]>([])
const connected = ref(false)
const discoveryStarted = ref(false)

// 工具函数
function inArray(arr: any[], key: string, val: any) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}

// 监听蓝牙设备发现
function onBluetoothDeviceFound() {
  uni.onBluetoothDeviceFound((res) => {
    res.devices.forEach((device) => {
      if (!device.name && !device.localName) {
        return
      }

      const foundDevices = devices.value
      const idx = inArray(foundDevices, 'deviceId', device.deviceId)

      if (idx === -1) {
        foundDevices.push(device as IBluetoothDevice)
      }
      else {
        foundDevices[idx] = device as IBluetoothDevice
      }

      devices.value = [...foundDevices]
    })
  })
}

// 开始蓝牙设备发现
function startBluetoothDevicesDiscovery() {
  if (discoveryStarted.value) {
    return
  }
  discoveryStarted.value = true

  uni.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: true,
    success: (res) => {
      console.log('startBluetoothDevicesDiscovery success', res)
      onBluetoothDeviceFound()
    },
  })
}

// 创建蓝牙连接
function createBLEConnection(device: IBluetoothDevice) {
  const deviceId = device.deviceId
  const name = device.name || device.localName || ''

  uni.createBLEConnection({
    deviceId,
    success: (res) => {
      connected.value = true
      shipStore.setBluetoothConnection(true, deviceId, name)

      console.log('连接成功:', name)

      // 跳转到地图页面
      uni.navigateTo({
        url: `/pages/ManualNavigation/ManualNavigation?connectedDeviceId=${deviceId}&connectedDevicename=${encodeURIComponent(name)}`,
      })
    },
    fail: (res) => {
      console.log('连接失败:', res)
      uni.showToast({
        title: '连接失败',
        icon: 'error',
      })
    },
  })
}

// 跳过连接
function skip() {
  uni.navigateTo({
    url: '/pages/ManualNavigation/ManualNavigation?connectedDeviceId=0&connectedDevicename=0',
  })
}

// 计算信号强度百分比
function getSignalPercent(rssi: number) {
  return Math.max(0, rssi + 100)
}

// 页面生命周期
onMounted(() => {
  // 加载存储的数据
  shipStore.loadFromStorage()

  // 开启蓝牙适配器
  uni.openBluetoothAdapter({
    success: (res) => {
      console.log('openBluetoothAdapter success', res)
      startBluetoothDevicesDiscovery()
    },
    fail: (res) => {
      if (res.errCode === 10001) {
        uni.onBluetoothAdapterStateChange((res) => {
          console.log('onBluetoothAdapterStateChange', res)
          if (res.available) {
            startBluetoothDevicesDiscovery()
          }
        })
      }
    },
  })
})

onUnmounted(() => {
  uni.stopBluetoothDevicesDiscovery()
  uni.closeBluetoothAdapter()
})
</script>

<template>
  <view class="page">
    <view class="header">
      <text class="title">USV 蓝牙连接</text>
      <text class="subtitle">请选择要连接的设备</text>
    </view>

    <scroll-view
      class="device-list"
      scroll-y
      :scroll-with-animation="true"
    >
      <view
        v-for="(item, index) in devices"
        :key="index"
        class="device-item"
        hover-class="device-item-hover"
        @tap="createBLEConnection(item)"
      >
        <view class="device-name">
          {{ item.name || item.localName }}
        </view>
        <view class="device-info">
          信号强度: {{ item.RSSI }}dBm ({{ getSignalPercent(item.RSSI) }}%)
        </view>
        <view class="device-info">
          UUID: {{ item.deviceId }}
        </view>
        <view class="device-info">
          Service数量: {{ item.advertisServiceUUIDs?.length || 0 }}
        </view>
      </view>
    </scroll-view>

    <view class="footer">
      <button
        class="skip-btn"
        type="primary"
        @tap="skip"
      >
        跳过连接
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f8f8;
  color: #333;
}

.header {
  padding: 40rpx 30rpx 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: #666;
}

.device-list {
  flex: 1;
  margin: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}

.device-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.device-item-hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.device-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.device-info {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 5rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.footer {
  padding: 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.skip-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #007aff;
  color: #fff;
  border-radius: 10rpx;
  font-size: 32rpx;
}
</style>

