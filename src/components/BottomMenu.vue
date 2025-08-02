<template>
  <view class="bottom-menu">
    <view 
      v-for="item in menuItems" 
      :key="item.key"
      class="menu-item"
      :class="{ active: activeTab === item.key }"
      @click="handleTabClick(item.key)"
    >
      <text class="menu-icon">{{ item.icon }}</text>
      <text class="menu-label">{{ item.label }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  activeTab: string
}

interface MenuItem {
  key: string
  icon: string
  label: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  tabChange: [tab: string]
}>()

const menuItems: MenuItem[] = [
  { key: 'dashboard', icon: '🎮', label: '主控台' },
  { key: 'manual', icon: '🕹️', label: '手动导航' },
  { key: 'cruise', icon: '🗺️', label: '自动巡航' },
  { key: 'ai', icon: '🧠', label: 'AI管理' },
  { key: 'management', icon: '⚙️', label: '综合管理' }
]

const handleTabClick = (tab: string) => {
  if (tab !== props.activeTab) {
    emit('tabChange', tab)
  }
}
</script>

<style lang="scss" scoped>
.bottom-menu {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 104rpx;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(30rpx);
  border-top: 2rpx solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  display: flex;
}

.menu-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  
  .menu-icon {
    font-size: 32rpx;
    margin-bottom: 6rpx;
  }
  
  .menu-label {
    font-size: 20rpx;
    font-weight: 500;
  }
  
  &:hover,
  &.active {
    color: #4FD1C7;
    background: rgba(79, 209, 199, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .bottom-menu {
    height: 100rpx;
  }
  
  .menu-item {
    .menu-icon {
      font-size: 28rpx;
      margin-bottom: 4rpx;
    }
    
    .menu-label {
      font-size: 18rpx;
    }
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .bottom-menu {
    height: 120rpx;
  }
  
  .menu-item {
    .menu-icon {
      font-size: 36rpx;
      margin-bottom: 8rpx;
    }
    
    .menu-label {
      font-size: 22rpx;
    }
  }
}
</style>
