<template>
  <view class="login-container">
    <!-- 海洋背景 -->
    <view class="ocean-background">
      <image
        src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=400&fit=crop"
        class="background-image"
        mode="aspectFill"
      />
    </view>

    <!-- 登录内容 -->
    <view class="login-content">
      <!-- 登录页面 -->
      <view v-if="currentStep === 'login'" class="login-card">
        <!-- Logo -->
        <view class="logo-section">
          <view class="logo-icon">
            <text class="iconfont icon-ship">⚓</text>
          </view>
          <text class="app-title">海洋智控</text>
          <text class="app-subtitle">船舶智能管理系统</text>
        </view>

        <!-- 登录表单 -->
        <view class="login-form">
          <view class="input-wrapper">
            <text class="input-label">用户名</text>
            <view class="input-group">
              <view class="input-icon">
                <text class="icon">👤</text>
              </view>
              <wd-input type="text" class="login-input" v-model="loginForm.username" placeholder="请输入用户名"   />
            </view>
          </view>
          
          <view class="input-wrapper">
            <text class="input-label">密码</text>
            <view class="input-group">
              <view class="input-icon">
                <text class="icon">🔒</text>
              </view>
              <wd-input type="text" class="login-input" v-model="loginForm.password" placeholder="请输入密码"   />
            </view>
          </view>
        </view>

        <!-- 登录按钮 -->
        <button class="login-button" @click="handleLogin" :disabled="isLoading">
          <text v-if="!isLoading" class="button-icon">🚀</text>
          <text v-else class="loading-icon">⏳</text>
          {{ isLoading ? '登录中...' : '立即登录' }}
        </button>

        <!-- 快速登录 -->
        <button class="quick-login-button" @click="quickLogin">
          快速登录（演示）
        </button>
        
        <text class="demo-text">默认账号: admin / 密码: 123456</text>
      </view>

      <!-- 蓝牙连接页面 -->
      <view v-else-if="currentStep === 'bluetooth'" class="login-card">
        <!-- Logo -->
        <view class="logo-section">
          <view class="logo-icon">
            <text class="iconfont icon-ship">⚓</text>
          </view>
          <text class="app-title">海洋智控</text>
          <text class="app-subtitle">船舶智能管理系统</text>
        </view>

        <!-- 蓝牙连接状态 -->
        <view class="bluetooth-section">
          <view class="bluetooth-status">
            <view class="status-indicator" :class="{ 'connected': isBluetoothConnected }"></view>
            <text class="status-text">
              {{ isBluetoothConnected ? '设备已连接' : (isSearching ? '正在搜索蓝牙设备...' : '准备连接设备') }}
            </text>
          </view>
          
          <view v-if="!isBluetoothConnected" class="device-list">
            <view 
              v-for="device in bluetoothDevices" 
              :key="device.id"
              class="device-card"
              @click="connectToDevice(device)"
            >
              <view class="device-info">
                <text class="device-name">{{ device.name }}</text>
                <text class="bluetooth-icon">📶</text>
              </view>
              <text class="signal-strength">信号强度: {{ device.signal }}%</text>
            </view>
          </view>
          
          <view v-else class="connected-device">
            <view class="device-card connected">
              <view class="device-info">
                <text class="device-name">{{ connectedDevice?.name }}</text>
                <text class="bluetooth-icon connected">✅</text>
              </view>
              <text class="signal-strength">连接状态: 已连接</text>
            </view>
          </view>
        </view>

        <!-- 连接/进入按钮 -->
        <button 
          v-if="!isBluetoothConnected" 
          class="connect-button" 
          @click="searchDevices"
          :disabled="isSearching"
        >
          <text class="button-icon">{{ isSearching ? '🔄' : '🔍' }}</text>
          {{ isSearching ? '搜索中...' : '搜索设备' }}
        </button>
        
        <button 
          v-else 
          class="connect-button" 
          @click="enterManualControl"
        >
          <text class="button-icon">🎮</text>
          进入手动控制
        </button>

        <text class="help-text">
          {{ isBluetoothConnected ? '设备连接成功，可以开始操控' : '请确保蓝牙已开启并靠近设备' }}
        </text>
        
        <!-- 返回按钮 -->
        <button class="back-button" @click="goBackToLogin">
          ← 返回登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface BluetoothDevice {
  id: string
  name: string
  signal: number
}

interface LoginForm {
  username: string
  password: string
}

const currentStep = ref<'login' | 'bluetooth'>('login')
const isLoading = ref(false)
const isSearching = ref(false)
const isBluetoothConnected = ref(false)
const connectedDevice = ref<BluetoothDevice | null>(null)

const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const bluetoothDevices = ref<BluetoothDevice[]>([
  { id: '001', name: '主控设备-001', signal: 85 },
  { id: '002', name: '主控设备-002', signal: 72 },
  { id: '003', name: '备用设备-003', signal: 58 }
])

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    uni.showToast({
      title: '请输入用户名和密码',
      icon: 'none'
    })
    return
  }
  
  isLoading.value = true
  
  try {
    // 模拟登录验证
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 简单验证
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })
      
      // 跳转到蓝牙连接页面
      setTimeout(() => {
        currentStep.value = 'bluetooth'
      }, 1000)
    } else {
      uni.showToast({
        title: '用户名或密码错误',
        icon: 'error'
      })
    }
  } catch (error) {
    uni.showToast({
      title: '登录失败，请重试',
      icon: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const quickLogin = () => {
  loginForm.username = 'admin'
  loginForm.password = '123456'
  handleLogin()
}

const searchDevices = () => {
  isSearching.value = true
  
  // 模拟搜索过程
  setTimeout(() => {
    isSearching.value = false
    uni.showToast({
      title: '发现3个设备',
      icon: 'success'
    })
  }, 2000)
}

const connectToDevice = (device: BluetoothDevice) => {
  uni.showLoading({
    title: '连接中...'
  })
  
  // 模拟连接过程
  setTimeout(() => {
    uni.hideLoading()
    isBluetoothConnected.value = true
    connectedDevice.value = device
    
    uni.showToast({
      title: '设备连接成功',
      icon: 'success'
    })
  }, 2000)
}

const enterManualControl = () => {
  // 跳转到手动导航页面
  uni.reLaunch({
    url: '/pages/manual/manual'
  })
}

const goBackToLogin = () => {
  currentStep.value = 'login'
  isBluetoothConnected.value = false
  connectedDevice.value = null
  isSearching.value = false
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.ocean-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(11, 20, 38, 0.85), rgba(26, 54, 93, 0.85));

  .background-image {
    width: 100%;
    height: 100%;
    opacity: 0.2;
  }
}

.login-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.login-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30rpx);
  border-radius: 32rpx;
  padding: 64rpx;
  width: 100%;
  max-width: 640rpx;
  text-align: center;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}

.logo-section {
  margin-bottom: 48rpx;

  .logo-icon {
    width: 128rpx;
    height: 128rpx;
    background: linear-gradient(to right, #4FD1C7, #60A5FA);
    border-radius: 50%;
    margin: 0 auto 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 16rpx 32rpx rgba(0, 0, 0, 0.3);

    .iconfont {
      font-size: 48rpx;
      color: white;
    }
  }

  .app-title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: white;
    margin-bottom: 8rpx;
  }

  .app-subtitle {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.7);
  }
}

.login-form {
  margin-bottom: 48rpx;

  .input-wrapper {
    margin-bottom: 40rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;

    .input-label {
      color: rgba(255, 255, 255, 0.9);
      font-size: 26rpx;
      font-weight: 500;
      width: 80rpx;
      flex-shrink: 0;
      text-align: right;
    }

    .input-group {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 20rpx;
      border: 2rpx solid rgba(255, 255, 255, 0.15);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(10rpx);
      box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);

      &:focus-within {
        border-color: #4FD1C7;
        background: rgba(79, 209, 199, 0.12);
        box-shadow: 0 0 0 4rpx rgba(79, 209, 199, 0.1), 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
        transform: translateY(-2rpx);
      }

      &:hover {
        border-color: rgba(255, 255, 255, 0.25);
        background: rgba(255, 255, 255, 0.12);
      }

      .input-icon {
        width: 88rpx;
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .icon {
          font-size: 36rpx;
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.3s ease;
        }
      }

      &:focus-within .input-icon .icon {
        color: #4FD1C7;
      }

      .login-input {
        flex: 1;
        padding: 20rpx 32rpx 20rpx 0;
        background: transparent;
        border: none;
        color: white;
        font-size: 30rpx;
        font-weight: 400;
        line-height: 1.4;
        outline: none;
        pointer-events: auto;
        z-index: 1;

        &::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 300;
        }
      }
    }
  }
}

.login-button {
  width: 100%;
  background: linear-gradient(to right, #4FD1C7, #60A5FA);
  color: white;
  font-weight: 600;
  padding: 18rpx 32rpx;
  border-radius: 16rpx;
  border: none;
  font-size: 32rpx;
  transition: all 0.3s ease;
  box-shadow: 0 16rpx 32rpx rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;

  &:disabled {
    opacity: 0.6;
    transform: none;
  }

  &:not(:disabled):hover {
    background: linear-gradient(to right, #2DD4BF, #3B82F6);
    transform: translateY(-4rpx);
  }

  .button-icon,
  .loading-icon {
    margin-right: 16rpx;
    font-size: 28rpx;
  }

  .loading-icon {
    animation: spin 1s linear infinite;
  }
}

.quick-login-button {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
  padding: 20rpx 32rpx;
  border-radius: 12rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  font-size: 28rpx;
  transition: all 0.3s ease;
  margin-bottom: 24rpx;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
}

.demo-text {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24rpx;
  margin-bottom: 24rpx;
}

.bluetooth-section {
  margin-bottom: 48rpx;

  .bluetooth-status {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;

    .status-indicator {
      width: 24rpx;
      height: 24rpx;
      background: #4FD1C7;
      border-radius: 50%;
      margin-right: 16rpx;
      animation: pulse 2s infinite;

      &.connected {
        background: #10B981;
        animation: none;
      }
    }

    .status-text {
      color: white;
      font-size: 28rpx;
    }
  }

  .device-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .device-card {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16rpx;
    padding: 24rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(79, 209, 199, 0.2);
      border-color: rgba(79, 209, 199, 0.5);
      transform: translateY(-2rpx);
    }

    &.connected {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.5);
    }

    .device-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8rpx;

      .device-name {
        color: white;
        font-size: 28rpx;
        font-weight: 500;
      }

      .bluetooth-icon {
        color: #4FD1C7;
        font-size: 32rpx;

        &.connected {
          color: #10B981;
        }
      }
    }

    .signal-strength {
      color: rgba(255, 255, 255, 0.6);
      font-size: 24rpx;
    }
  }

  .connected-device {
    .device-card {
      cursor: default;

      &:hover {
        transform: none;
      }
    }
  }
}

.connect-button {
  width: 100%;
  background: linear-gradient(to right, #4FD1C7, #60A5FA);
  color: white;
  font-weight: 600;
  padding: 24rpx 32rpx;
  border-radius: 16rpx;
  border: none;
  font-size: 32rpx;
  transition: all 0.3s ease;
  box-shadow: 0 16rpx 32rpx rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;

  &:disabled {
    opacity: 0.6;
  }

  &:not(:disabled):hover {
    background: linear-gradient(to right, #2DD4BF, #3B82F6);
    transform: translateY(-4rpx);
  }

  .button-icon {
    margin-right: 16rpx;
    font-size: 28rpx;
  }
}

.back-button {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 500;
  padding: 20rpx 32rpx;
  border-radius: 12rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  font-size: 28rpx;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
}

.help-text {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24rpx;
  margin-bottom: 24rpx;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .login-card {
    max-width: 800rpx;
    padding: 48rpx;
  }

  .logo-section {
    margin-bottom: 32rpx;

    .logo-icon {
      width: 96rpx;
      height: 96rpx;
      margin-bottom: 24rpx;
    }

    .app-title {
      font-size: 40rpx;
    }
  }

  .login-form,
  .bluetooth-section {
    margin-bottom: 32rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .login-content {
    padding: 64rpx 32rpx;
  }

  .login-card {
    padding: 80rpx 48rpx;
  }
}
</style>
