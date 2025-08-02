<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { usePageAuth } from '@/hooks/usePageAuth'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

usePageAuth()

onLaunch(() => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* 引入响应式样式 */
@import '@/styles/responsive.scss';

/* 全局样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--ocean-blue);
  color: white;
  overflow: hidden;
}

/* 通用组件样式 */
swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

/* 按钮样式重置 */
button {
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;

  &::after {
    border: none;
  }
}

/* 输入框样式重置 */
input, textarea {
  border: none;
  outline: none;
  background: transparent;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8rpx;
  height: 8rpx;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
}

::-webkit-scrollbar-thumb {
  background: rgba(79, 209, 199, 0.6);
  border-radius: 4rpx;

  &:hover {
    background: rgba(79, 209, 199, 0.8);
  }
}

/* 全局动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* 全局工具类 */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-1 {
  flex: 1;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
}

.z-10 {
  z-index: 10;
}

.z-100 {
  z-index: 100;
}

.z-1000 {
  z-index: 1000;
}

.overflow-hidden {
  overflow: hidden;
}

.pointer {
  cursor: pointer;
}

.select-none {
  user-select: none;
}
</style>
