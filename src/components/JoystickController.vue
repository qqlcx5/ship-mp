<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  xValue: number
  yValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  control: [data: { x: number, y: number }]
}>()

const containerSize = 280 // rpx
const handleSize = 100 // rpx
const maxDistance = (containerSize - handleSize) / 2

const joystickContainer = ref<HTMLElement>()
const isDragging = ref(false)
const handlePosition = ref({ x: -maxDistance, y: -maxDistance })
const controlValue = ref({ x: -100, y: -100 })

const handleStyle = computed(() => {
  return {
    transform: `translate(${handlePosition.value.x}rpx, ${handlePosition.value.y}rpx)`,
  }
})

function handleTouchStart(e: TouchEvent) {
  isDragging.value = true
  e.preventDefault()
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value)
    return

  e.preventDefault()

  const touch = e.touches[0]

  // 获取摇杆容器的实际位置和尺寸
  uni.createSelectorQuery().select('.joystick-container').boundingClientRect((rect: any) => {
    if (!rect)
      return

    // 计算触摸点相对于容器中心的位置
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // 计算相对于中心的偏移量（像素单位）
    const offsetX = touch.clientX - centerX
    const offsetY = touch.clientY - centerY

    // 转换为rpx单位
    const rpxRatio = 750 / uni.getSystemInfoSync().windowWidth
    const touchX = offsetX * rpxRatio
    const touchY = offsetY * rpxRatio

    // 计算距离中心的距离
    const distance = Math.sqrt(touchX * touchX + touchY * touchY)

    let newX = touchX
    let newY = touchY

    // 限制在圆形区域内
    if (distance > maxDistance) {
      const angle = Math.atan2(touchY, touchX)
      newX = Math.cos(angle) * maxDistance
      newY = Math.sin(angle) * maxDistance
    }

    // 更新手柄位置
    handlePosition.value = { x: newX, y: newY }

    // 计算控制值 (-100 到 100)
    // 修正坐标系：右为正X，上为负Y（因为屏幕坐标系Y向下为正）
    const controlX = Math.round((newX / maxDistance) * 100)
    const controlY = Math.round((-newY / maxDistance) * 100) // Y轴反转，向上为正

    controlValue.value = { x: controlX, y: controlY }
    emit('control', { x: controlX, y: controlY })
  }).exec()
}

function handleTouchEnd() {
  isDragging.value = false
  // 智能摇杆：松手后保持当前位置，不回原点
  // 位置和控制值都保持不变
}
</script>

<template>
  <view class="joystick-wrapper">
    <!-- 控制值显示 -->
    <view class="control-display">
      <view class="control-value">
        <text class="value-label">X:</text>
        <text class="value-number">{{ controlValue.x }}</text>
      </view>
      <view class="control-value">
        <text class="value-label">Y:</text>
        <text class="value-number">{{ controlValue.y }}</text>
      </view>
    </view>
    <view class="control-info">
      <text class="info-text">智能摇杆控制器</text>
      <text class="info-desc">范围：±100 精确控制 | 松手保持航向</text>
    </view>

    <!-- 摇杆容器 -->
    <view ref="joystickContainer" class="joystick-container">
      <!-- 方向指示器 -->
      <text class="direction-indicator top">前</text>
      <text class="direction-indicator bottom">后</text>
      <text class="direction-indicator left">左</text>
      <text class="direction-indicator right">右</text>

      <!-- 摇杆手柄 -->
      <view
        class="joystick-handle"
        :style="handleStyle"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <text class="handle-icon">⊕</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.joystick-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.control-display {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 24rpx;
  padding: 16rpx 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  min-width: 200rpx;
  text-align: center;
  display: flex;
  justify-content: space-around;
  gap: 32rpx;
}

.control-value {
  display: flex;
  align-items: center;
  gap: 8rpx;

  .value-label {
    color: rgba(255, 255, 255, 0.7);
  }

  .value-number {
    color: #4fd1c7;
    font-family: monospace;
    font-weight: 600;
    min-width: 60rpx;
  }
}

.control-info {
  background: rgba(79, 209, 199, 0.1);
  color: white;
  padding: 12rpx 20rpx;
  border-radius: 12rpx;
  border: 1rpx solid rgba(79, 209, 199, 0.3);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4rpx;

  .info-text {
    font-size: 22rpx;
    font-weight: 600;
    color: #4fd1c7;
  }

  .info-desc {
    font-size: 18rpx;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.2;
  }
}

.joystick-container {
  width: 280rpx;
  height: 280rpx;
  position: relative;
  background: radial-gradient(circle, rgba(79, 209, 199, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%);
  border-radius: 50%;
  border: 6rpx solid rgba(79, 209, 199, 0.5);
  backdrop-filter: blur(30rpx);
  box-shadow:
    0 16rpx 48rpx rgba(0, 0, 0, 0.4),
    inset 0 0 40rpx rgba(79, 209, 199, 0.1);
}

.direction-indicator {
  position: absolute;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24rpx;
  font-weight: bold;
  text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.5);

  &.top {
    top: 16rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  &.bottom {
    bottom: 16rpx;
    left: 50%;
    transform: translateX(-50%);
  }

  &.left {
    left: 16rpx;
    top: 50%;
    transform: translateY(-50%);
  }

  &.right {
    right: 16rpx;
    top: 50%;
    transform: translateY(-50%);
  }
}

.joystick-handle {
  width: 100rpx;
  height: 100rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(145deg, #4fd1c7, #2dd4bf);
  border-radius: 50%;
  border: 6rpx solid white;
  box-shadow:
    0 8rpx 24rpx rgba(0, 0, 0, 0.3),
    0 0 30rpx rgba(79, 209, 199, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: white;
  touch-action: none;
  user-select: none;

  .handle-icon {
    font-size: 32rpx;
    font-weight: bold;
  }

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow:
      0 12rpx 32rpx rgba(0, 0, 0, 0.4),
      0 0 50rpx rgba(79, 209, 199, 0.6);
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .joystick-container {
    width: 240rpx;
    height: 240rpx;
    border-width: 4rpx;
  }

  .joystick-handle {
    width: 80rpx;
    height: 80rpx;
    border-width: 4rpx;

    .handle-icon {
      font-size: 28rpx;
    }
  }

  .direction-indicator {
    font-size: 20rpx;

    &.top,
    &.bottom {
      top: 12rpx;
    }

    &.bottom {
      bottom: 12rpx;
      top: auto;
    }

    &.left,
    &.right {
      left: 12rpx;
    }

    &.right {
      right: 12rpx;
      left: auto;
    }
  }

  .control-display {
    font-size: 20rpx;
    padding: 12rpx 20rpx;
    gap: 24rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .joystick-container {
    width: 320rpx;
    height: 320rpx;
    border-width: 8rpx;
  }

  .joystick-handle {
    width: 120rpx;
    height: 120rpx;
    border-width: 8rpx;

    .handle-icon {
      font-size: 36rpx;
    }
  }

  .direction-indicator {
    font-size: 28rpx;

    &.top,
    &.bottom {
      top: 20rpx;
    }

    &.bottom {
      bottom: 20rpx;
      top: auto;
    }

    &.left,
    &.right {
      left: 20rpx;
    }

    &.right {
      right: 20rpx;
      left: auto;
    }
  }

  .control-display {
    font-size: 28rpx;
    padding: 20rpx 28rpx;
    gap: 40rpx;
  }
}
</style>
