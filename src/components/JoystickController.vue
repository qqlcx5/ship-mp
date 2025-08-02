<template>
  <view class="joystick-wrapper">
    <!-- 控制值显示 -->
    <view class="control-display">
      <view class="control-value">
        <text class="value-label">X:</text>
        <text class="value-number">{{ xValue.toFixed(2) }}</text>
      </view>
      <view class="control-value">
        <text class="value-label">Y:</text>
        <text class="value-number">{{ yValue.toFixed(2) }}</text>
      </view>
    </view>
    
    <!-- 摇杆容器 -->
    <view class="joystick-container" ref="joystickContainer">
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

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

interface Props {
  xValue: number
  yValue: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  control: [data: { x: number; y: number }]
}>()

const joystickContainer = ref<HTMLElement>()
const isDragging = ref(false)
const handlePosition = ref({ x: 0, y: 0 })
const containerSize = 280 // rpx
const handleSize = 100 // rpx
const maxDistance = (containerSize - handleSize) / 2

const handleStyle = computed(() => {
  return {
    transform: `translate(${handlePosition.value.x}rpx, ${handlePosition.value.y}rpx)`
  }
})

const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  e.preventDefault()
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  
  const touch = e.touches[0]
  const containerRect = {
    left: 0,
    top: 0,
    width: containerSize,
    height: containerSize
  }
  
  // 计算触摸点相对于容器中心的位置
  const centerX = containerRect.width / 2
  const centerY = containerRect.height / 2
  
  // 将触摸坐标转换为rpx
  const touchX = (touch.clientX - containerRect.left) * 2 - centerX
  const touchY = (touch.clientY - containerRect.top) * 2 - centerY
  
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
  
  handlePosition.value = { x: newX, y: newY }
  
  // 计算标准化的控制值 (-1 到 1)
  const normalizedX = newX / maxDistance
  const normalizedY = -newY / maxDistance // Y轴反转，向上为正
  
  emit('control', { x: normalizedX, y: normalizedY })
}

const handleTouchEnd = () => {
  isDragging.value = false
  
  // 回弹到中心
  handlePosition.value = { x: 0, y: 0 }
  emit('control', { x: 0, y: 0 })
}

// 监听外部控制值变化
const updateHandlePosition = () => {
  if (!isDragging.value) {
    handlePosition.value = {
      x: props.xValue * maxDistance,
      y: -props.yValue * maxDistance
    }
  }
}

// 当props变化时更新位置
nextTick(() => {
  updateHandlePosition()
})
</script>

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
    color: #4FD1C7;
    font-family: monospace;
    font-weight: 600;
    min-width: 60rpx;
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
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.4), inset 0 0 40rpx rgba(79, 209, 199, 0.1);
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
  background: linear-gradient(145deg, #4FD1C7, #2DD4BF);
  border-radius: 50%;
  border: 6rpx solid white;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3), 0 0 30rpx rgba(79, 209, 199, 0.4);
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
    box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.4), 0 0 50rpx rgba(79, 209, 199, 0.6);
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
