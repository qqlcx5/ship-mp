<template>
  <div class="margin-20px relative inline-block h-812px w-375px overflow-hidden border-8 border-[#1a1a1a] rounded-36px bg-white align-top shadow-xl">
    <div class="relative h-full w-full bg-blue-50">
      <!-- 地图区域 -->
      <div class="absolute inset-0">
        <div class="relative h-full w-full from-blue-200 via-blue-100 to-cyan-100 bg-gradient-to-br">
          <!-- 模拟地图背景 -->
          <div
            class="absolute inset-0"
            style="
              background-image: url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=800&fit=crop');
              background-size: cover;
              background-position: center;
              opacity: 0.3;
            "
          />

          <!-- 船舶标记 -->
          <div class="absolute h-24px w-24px border-2 border-white rounded-full bg-[#3b82f6] shadow-md" style="top: 25%; left: 30%" />
          <div class="absolute h-24px w-24px border-2 border-white rounded-full bg-[#3b82f6] shadow-md" style="top: 40%; left: 60%" />
          <div class="absolute h-24px w-24px border-2 border-white rounded-full bg-[#3b82f6] shadow-md" style="top: 60%; left: 25%" />
          <div class="absolute h-24px w-24px border-2 border-white rounded-full bg-[#3b82f6] shadow-md" style="top: 35%; left: 80%" />
          <div class="absolute h-24px w-24px border-2 border-white rounded-full bg-[#3b82f6] shadow-md" style="top: 70%; left: 70%" />
          <div class="absolute h-24px w-24px border-2 border-white rounded-full bg-[#3b82f6] shadow-md" style="top: 55%; left: 45%" />

          <!-- 信息浮窗 -->
          <div class="absolute left-1/2 top-1/3 min-w-[200px] transform rounded-12px bg-white/95 p-3 shadow-lg backdrop-blur-10px -translate-x-1/2">
            <div class="mb-1 text-sm text-gray-800 font-semibold">
              船舶 #001
            </div>
            <div class="text-xs text-gray-600 space-y-1">
              <div>经度: 119.5023°E</div>
              <div>纬度: 26.0745°N</div>
              <div>航向: 045°</div>
              <div class="text-green-600 font-medium">
                状态: 正常
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 状态监控面板 -->
      <div class="absolute right-4 top-4 w-32 rounded-12px bg-white/95 p-3 shadow-lg backdrop-blur-10px">
        <div class="text-xs text-gray-600 space-y-2">
          <div class="mb-2 text-gray-800 font-semibold">
            实时状态
          </div>
          <div class="flex justify-between">
            <span>天气</span>
            <span class="text-blue-600">晴</span>
          </div>
          <div class="flex justify-between">
            <span>海况</span>
            <span class="text-green-600">良好</span>
          </div>
          <div class="flex justify-between">
            <span>时速</span>
            <span>12.5节</span>
          </div>
          <div class="flex justify-between">
            <span>电量</span>
            <span class="text-orange-600">75%</span>
          </div>
          <div class="flex justify-between">
            <span>功率</span>
            <span>850W</span>
          </div>
        </div>
      </div>

      <!-- 操控系统 -->
      <div class="absolute bottom-6 right-6">
        <div class="relative h-120px w-120px border-2 border-white/30 rounded-full bg-white/10" @mousedown="handleMouseDown">
          <div class="absolute left-1/2 top-1/2 h-40px w-40px rounded-full bg-white shadow-md" :style="{ transform: `translate(-50%, -50%) translate(${knobPosition.x}px, ${knobPosition.y}px)` }" />
        </div>
        <div class="mt-2 text-center text-xs text-white font-medium">
          手动操控
        </div>
      </div>

      <!-- 模式切换 -->
      <div class="absolute bottom-6 left-6 flex space-x-2">
        <button class="rounded-full bg-blue-600 px-4 py-2 text-sm text-white font-medium">
          手动
        </button>
        <button class="rounded-full bg-white px-4 py-2 text-sm text-gray-600 font-medium">
          自动
        </button>
      </div>

      <!-- 底部导航 -->
      <div class="absolute bottom-0 left-0 right-0 bg-white p-4">
        <div class="flex justify-around">
          <div class="flex flex-col items-center border border-blue-600/30 rounded-lg bg-blue-600/10 p-2 transition-all duration-300 ease-in-out" :class="{ active: activeTab === 'manual' }" @click="setActiveTab('manual')">
            <svg class="mb-1 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
            </svg>
            <span class="text-xs text-blue-600 font-medium">手动导航</span>
          </div>
          <div class="flex flex-col items-center p-2 transition-all duration-300 ease-in-out" :class="{ active: activeTab === 'auto' }" @click="setActiveTab('auto')">
            <svg class="mb-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-xs text-gray-400">自动巡航</span>
          </div>
          <div class="flex flex-col items-center p-2 transition-all duration-300 ease-in-out" :class="{ active: activeTab === 'ai' }" @click="setActiveTab('ai')">
            <svg class="mb-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span class="text-xs text-gray-400">AI管理</span>
          </div>
          <div class="flex flex-col items-center p-2 transition-all duration-300 ease-in-out" :class="{ active: activeTab === 'manage' }" @click="setActiveTab('manage')">
            <svg class="mb-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span class="text-xs text-gray-400">综合管理</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const isDragging = ref(false)
const knobPosition = ref({ x: 0, y: 0 })

function handleMouseDown(e: MouseEvent) {
  isDragging.value = true
  // Prevent text selection during drag
  e.preventDefault()
}

function handleMouseMove(e: MouseEvent) {
  if (isDragging.value) {
    const joystick = document.querySelector('.w-120px.h-120px.rounded-full.bg-white\\/10.border-2.border-white\\/30.relative')
    if (!joystick)
      return

    const rect = joystick.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const maxRadius = 40

    let deltaX = e.clientX - centerX
    let deltaY = e.clientY - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance > maxRadius) {
      deltaX = (deltaX / distance) * maxRadius
      deltaY = (deltaY / distance) * maxRadius
    }

    knobPosition.value = { x: deltaX, y: deltaY }
  }
}

function handleMouseUp() {
  isDragging.value = false
  knobPosition.value = { x: 0, y: 0 }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

const activeTab = ref('manual') // 'manual', 'auto', 'ai', 'manage'

function setActiveTab(tab: string) {
  activeTab.value = tab
  let path = ''
  switch (tab) {
    case 'manual':
      path = '/pages/ship-management/ManualNavigation'
      break
    case 'auto':
      path = '/pages/ship-management/AutomaticCruise'
      break
    case 'ai':
      path = '/pages/ship-management/AIManager'
      break
    case 'manage':
      path = '/pages/ship-management/ComprehensiveManagement'
      break
  }
  if (path) {
    uni.switchTab({
      url: path,
      fail: (res) => {
        console.error(`Failed to switch tab to ${path}:`, res)
      },
    })
  }
}
</script>

<style scoped>
/* Scoped styles for Manual Navigation page */
/* All custom styles have been converted to UnoCSS utility classes */
</style>
