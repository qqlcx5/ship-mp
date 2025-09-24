<template>
  <div class="h-full w-full bg-white">
    <!-- 顶部导航 -->
    <div class="from-blue-600 to-indigo-600 bg-gradient-to-r p-4 text-white">
      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold">
          自动巡航
        </h1>
        <div class="flex items-center space-x-2">
          <div class="h-2 w-2 rounded-full bg-green-400" />
          <span class="text-sm">系统正常</span>
        </div>
      </div>

      <div class="flex text-sm space-x-4">
        <div>续航里程: 45.2km</div>
        <div>预计时间: 3.5h</div>
      </div>
    </div>

    <!-- 地图区域 -->
    <div class="relative h-80 from-blue-100 to-cyan-50 bg-gradient-to-br">
      <div
        class="absolute inset-0"
        style="
          background-image: url('https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=320&fit=crop');
          background-size: cover;
          background-position: center;
          opacity: 0.4;
        "
      />

      <!-- 航点标记 -->
      <div class="absolute left-1/3 top-1/4 h-4 w-4 border-2 border-white rounded-full bg-red-500" />
      <div class="absolute left-2/3 top-1/2 h-4 w-4 border-2 border-white rounded-full bg-yellow-500" />
      <div class="absolute left-1/2 top-3/4 h-4 w-4 border-2 border-white rounded-full bg-green-500" />

      <!-- 航行轨迹 -->
      <svg class="absolute inset-0 h-full w-full">
        <path
          d="M 125 80 Q 200 120 250 160 Q 280 180 187 240"
          stroke="#3B82F6"
          stroke-width="3"
          fill="none"
          stroke-dasharray="8,4"
        />
      </svg>

      <!-- 船舶位置 -->
      <div class="absolute h-24px w-24px border-2 border-white rounded-full bg-[#3b82f6] shadow-md" style="top: 25%; left: 33%" />

      <!-- 添加航点按钮 -->
      <button class="absolute right-4 top-4 rounded-full bg-white p-2 shadow-lg">
        <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
        </svg>
      </button>
    </div>

    <!-- 控制面板 -->
    <div class="p-4 space-y-4">
      <div class="rounded-xl bg-gray-50 p-4">
        <h3 class="mb-3 text-gray-800 font-semibold">
          智能控制
        </h3>
        <div class="mb-3 flex items-center justify-between">
          <span class="text-sm text-gray-600">自动模式</span>
          <div class="relative h-6 w-12 rounded-full bg-blue-600">
            <div class="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white" />
          </div>
        </div>
        <div class="flex space-x-3">
          <button class="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white font-medium">
            开始巡航
          </button>
          <button class="flex-1 rounded-lg bg-gray-200 py-2 text-sm text-gray-700 font-medium">
            暂停
          </button>
        </div>
      </div>

      <div class="rounded-xl bg-gray-50 p-4">
        <h3 class="mb-3 text-gray-800 font-semibold">
          航点管理
        </h3>
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded-lg bg-white p-2">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 rounded-full bg-red-500" />
              <span class="text-sm">起点 (119.50°E, 26.07°N)</span>
            </div>
            <button class="text-red-500">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h6a1 1 0 100-2H7z"
                />
              </svg>
            </button>
          </div>
          <div class="flex items-center justify-between rounded-lg bg-white p-2">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 rounded-full bg-yellow-500" />
              <span class="text-sm">航点1 (119.52°E, 26.09°N)</span>
            </div>
            <button class="text-red-500">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h6a1 1 0 100-2H7z"
                />
              </svg>
            </button>
          </div>
        </div>
        <button class="mt-3 w-full rounded-lg bg-gray-200 py-2 text-sm text-gray-600 font-medium">
          清空所有航点
        </button>
      </div>

      <div class="rounded-xl bg-gray-50 p-4">
        <h3 class="mb-3 text-gray-800 font-semibold">
          船舶校准
        </h3>
        <div class="grid grid-cols-3 gap-2">
          <button class="rounded-lg bg-white py-2 text-xs text-gray-700 font-medium">
            舵机零点
          </button>
          <button class="rounded-lg bg-white py-2 text-xs text-gray-700 font-medium">
            磁力计
          </button>
          <button class="rounded-lg bg-white py-2 text-xs text-gray-700 font-medium">
            加速度计
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Automatic Cruise page logic here
</script>

<style scoped>
/* Scoped styles for Automatic Cruise page */
</style>
