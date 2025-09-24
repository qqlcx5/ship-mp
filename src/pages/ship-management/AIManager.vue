<template>
  <div class="margin-20px relative inline-block h-812px w-375px overflow-hidden border-8 border-[#1a1a1a] rounded-36px bg-white align-top shadow-xl">
    <div class="h-full w-full bg-white">
      <!-- 顶部导航 -->
      <div class="from-purple-600 to-indigo-600 bg-gradient-to-r p-4 text-white">
        <h1 class="mb-4 text-xl font-semibold">
          AI智能管理
        </h1>
        <div class="flex justify-between text-sm">
          <div>总航行里程</div>
          <div class="font-semibold">
            1,245.8 km
          </div>
        </div>
      </div>

      <!-- 数据统计卡片 -->
      <div class="p-4 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-xl from-blue-50 to-blue-100 bg-gradient-to-br p-4">
            <div class="text-2xl text-blue-600 font-bold">
              85%
            </div>
            <div class="mt-1 text-sm text-gray-600">
              系统效率
            </div>
            <div class="mt-2 h-1.5 w-full rounded-full bg-blue-200">
              <div class="h-1.5 rounded-full bg-blue-600" style="width: 85%" />
            </div>
          </div>
          <div class="rounded-xl from-green-50 to-green-100 bg-gradient-to-br p-4">
            <div class="text-2xl text-green-600 font-bold">
              92%
            </div>
            <div class="mt-1 text-sm text-gray-600">
              电能利用率
            </div>
            <div class="mt-2 h-1.5 w-full rounded-full bg-green-200">
              <div class="h-1.5 rounded-full bg-green-600" style="width: 92%" />
            </div>
          </div>
        </div>

        <!-- 数据分析图表 -->
        <div class="rounded-xl bg-gray-50 p-4">
          <h3 class="mb-4 text-gray-800 font-semibold">
            电量消耗分析
          </h3>
          <div class="relative h-32 rounded-lg bg-white p-3">
            <!-- 模拟图表 -->
            <svg class="h-full w-full">
              <polyline
                points="10,80 50,60 90,40 130,55 170,35 210,45 250,25 290,30 330,20"
                stroke="#3B82F6"
                stroke-width="2"
                fill="none"
              />
              <circle cx="10" cy="80" r="2" fill="#3B82F6" />
              <circle cx="90" cy="40" r="2" fill="#3B82F6" />
              <circle cx="170" cy="35" r="2" fill="#3B82F6" />
              <circle cx="250" cy="25" r="2" fill="#3B82F6" />
              <circle cx="330" cy="20" r="2" fill="#3B82F6" />
            </svg>
            <div class="absolute bottom-2 left-3 text-xs text-gray-500">
              7天耗电趋势
            </div>
          </div>
        </div>

        <!-- 航速优化建议 -->
        <div class="rounded-xl bg-gray-50 p-4">
          <h3 class="mb-3 text-gray-800 font-semibold">
            AI优化建议
          </h3>
          <div class="space-y-3">
            <div class="flex items-start rounded-lg bg-white p-3 space-x-3">
              <div class="mt-2 h-2 w-2 rounded-full bg-green-500" />
              <div class="flex-1">
                <div class="text-sm text-gray-800 font-medium">
                  航速优化
                </div>
                <div class="mt-1 text-xs text-gray-600">
                  建议将航速调整至10-12节，可节能15%
                </div>
              </div>
            </div>
            <div class="flex items-start rounded-lg bg-white p-3 space-x-3">
              <div class="mt-2 h-2 w-2 rounded-full bg-yellow-500" />
              <div class="flex-1">
                <div class="text-sm text-gray-800 font-medium">
                  路径规划
                </div>
                <div class="mt-1 text-xs text-gray-600">
                  优化路径可减少12%航行时间
                </div>
              </div>
            </div>
            <div class="flex items-start rounded-lg bg-white p-3 space-x-3">
              <div class="mt-2 h-2 w-2 rounded-full bg-red-500" />
              <div class="flex-1">
                <div class="text-sm text-gray-800 font-medium">
                  电量预警
                </div>
                <div class="mt-1 text-xs text-gray-600">
                  船舶#003电量低于20%，建议返航充电
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史查询 -->
        <div class="rounded-xl bg-gray-50 p-4">
          <h3 class="mb-3 text-gray-800 font-semibold">
            历史记录
          </h3>
          <div class="flex space-x-3">
            <button class="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white font-medium">
              轨迹回放
            </button>
            <button class="flex-1 border border-gray-200 rounded-lg bg-white py-2 text-sm text-gray-700 font-medium">
              数据导出
            </button>
          </div>
        </div>

        <!-- 智能预警 -->
        <div class="border border-orange-200 rounded-xl from-orange-50 to-red-50 bg-gradient-to-r p-4">
          <div class="mb-2 flex items-center space-x-2">
            <svg class="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              />
            </svg>
            <span class="text-sm text-orange-800 font-semibold">智能预警</span>
          </div>
          <div class="text-sm text-orange-700">
            检测到3艘船舶电量不足，建议及时充电或返航
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// AI Manager page logic here
</script>

<style scoped>
/* Scoped styles for AI Manager page */
</style>
