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
      <view class="login-card">
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
            <view class="status-indicator"></view>
            <text class="status-text">正在搜索蓝牙设备...</text>
          </view>
          <view class="device-card">
            <view class="device-info">
              <text class="device-name">主控设备-001</text>
              <text class="bluetooth-icon">📶</text>
            </view>
            <text class="signal-strength">信号强度: 85%</text>
          </view>
        </view>

        <!-- 连接按钮 -->
        <button class="connect-button" @click="connectDevice">
          <text class="button-icon">🔗</text>
          连接设备
        </button>

        <text class="help-text">请确保蓝牙已开启并靠近设备</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isConnecting = ref(false)

const connectDevice = () => {
  isConnecting.value = true

  // 模拟连接过程
  setTimeout(() => {
    isConnecting.value = false
    // 连接成功后跳转到手动导航页面
    uni.reLaunch({
      url: '/pages/manual/manual'
    })
  }, 2000)
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
    }

    .status-text {
      color: white;
      font-size: 28rpx;
    }
  }

  .device-card {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16rpx;
    padding: 24rpx;
    border: 2rpx solid rgba(255, 255, 255, 0.3);

    .device-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8rpx;

      .device-name {
        color: white;
        font-size: 28rpx;
      }

      .bluetooth-icon {
        color: #4FD1C7;
        font-size: 32rpx;
      }
    }

    .signal-strength {
      color: rgba(255, 255, 255, 0.6);
      font-size: 24rpx;
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

  .button-icon {
    margin-right: 16rpx;
    font-size: 28rpx;
  }

  &:hover {
    background: linear-gradient(to right, #2DD4BF, #3B82F6);
    transform: translateY(-4rpx);
  }
}

.help-text {
  display: block;
  margin-top: 32rpx;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24rpx;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
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
