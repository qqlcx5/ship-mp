<template>
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
</script>

<style scoped>
/* Scoped styles for Manual Navigation page */
/* All custom styles have been converted to UnoCSS utility classes */
</style>
