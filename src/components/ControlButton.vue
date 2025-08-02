<template>
  <view class="control-button-wrapper">
    <button
      class="control-button"
      :class="colorClass"
      @click="handleClick"
    >
      <text class="button-icon">{{ icon }}</text>
    </button>
    <view class="tooltip" :class="{ show: showTooltip }">
      {{ label }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  icon: string
  label: string
  color: 'red' | 'yellow' | 'orange' | 'blue' | 'green' | 'purple'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

const showTooltip = ref(false)

const colorClass = computed(() => {
  const colorMap = {
    red: 'color-red',
    yellow: 'color-yellow',
    orange: 'color-orange',
    blue: 'color-blue',
    green: 'color-green',
    purple: 'color-purple'
  }
  return colorMap[props.color] || 'color-blue'
})

const handleClick = () => {
  emit('click')

  // 显示提示
  showTooltip.value = true
  setTimeout(() => {
    showTooltip.value = false
  }, 1000)
}
</script>

<style lang="scss" scoped>
.control-button-wrapper {
  position: relative;
}

.control-button {
  width: 88rpx;
  height: 88rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: white;
  transition: all 0.3s ease;
  backdrop-filter: blur(30rpx);
  border: 4rpx solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  .button-icon {
    font-size: 32rpx;
    z-index: 2;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
    z-index: 1;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-4rpx) scale(1.05);
    box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  // 颜色变体
  &.color-red {
    background: linear-gradient(to right, #EF4444, #DC2626);

    &:hover {
      background: linear-gradient(to right, #F87171, #EF4444);
    }
  }

  &.color-yellow {
    background: linear-gradient(to right, #F59E0B, #D97706);

    &:hover {
      background: linear-gradient(to right, #FBBF24, #F59E0B);
    }
  }

  &.color-orange {
    background: linear-gradient(to right, #F97316, #EA580C);

    &:hover {
      background: linear-gradient(to right, #FB923C, #F97316);
    }
  }

  &.color-blue {
    background: linear-gradient(to right, #3B82F6, #2563EB);

    &:hover {
      background: linear-gradient(to right, #60A5FA, #3B82F6);
    }
  }

  &.color-green {
    background: linear-gradient(to right, #10B981, #059669);

    &:hover {
      background: linear-gradient(to right, #34D399, #10B981);
    }
  }

  &.color-purple {
    background: linear-gradient(to right, #8B5CF6, #7C3AED);

    &:hover {
      background: linear-gradient(to right, #A78BFA, #8B5CF6);
    }
  }
}

.tooltip {
  position: absolute;
  left: 100rpx;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1001;

  &.show {
    opacity: 1;
  }

  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 8rpx solid transparent;
    border-right-color: rgba(0, 0, 0, 0.8);
  }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .control-button {
    width: 72rpx;
    height: 72rpx;
    border-radius: 18rpx;

    .button-icon {
      font-size: 28rpx;
    }
  }

  .tooltip {
    left: 84rpx;
    font-size: 20rpx;
    padding: 6rpx 12rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .control-button {
    width: 96rpx;
    height: 96rpx;
    border-radius: 28rpx;

    .button-icon {
      font-size: 36rpx;
    }
  }

  .tooltip {
    left: 112rpx;
    font-size: 26rpx;
    padding: 10rpx 18rpx;

    &::before {
      border-width: 10rpx;
    }
  }
}
</style>
