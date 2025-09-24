<template>
  <div class="h-full w-full bg-white">
    <!-- 顶部导航 -->
    <div class="from-gray-600 to-gray-800 bg-gradient-to-r p-4 text-white">
      <h1 class="mb-4 text-xl font-semibold">
        综合管理
      </h1>
      <div class="grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div class="font-bold">
            7
          </div>
          <div class="text-gray-300">
            船舶总数
          </div>
        </div>
        <div>
          <div class="font-bold">
            5
          </div>
          <div class="text-gray-300">
            在线船舶
          </div>
        </div>
        <div>
          <div class="font-bold">
            3
          </div>
          <div class="text-gray-300">
            操作人员
          </div>
        </div>
      </div>
    </div>

    <!-- 船舶管理列表 -->
    <div class="p-4">
      <h3 class="mb-3 text-gray-800 font-semibold">
        船舶管理
      </h3>
      <div class="space-y-3">
        <div class="rounded-xl bg-gray-50 p-4">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 rounded-full bg-green-500" />
              <span class="font-medium">船舶 #001</span>
            </div>
            <span class="text-sm text-green-600">在线</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>电量: 85%</div>
            <div>航速: 12.5节</div>
            <div>位置: 119.50°E, 26.07°N</div>
            <div>状态: 自动巡航</div>
          </div>
        </div>

        <div class="rounded-xl bg-gray-50 p-4">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 rounded-full bg-green-500" />
              <span class="font-medium">船舶 #002</span>
            </div>
            <span class="text-sm text-green-600">在线</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>电量: 72%</div>
            <div>航速: 8.3节</div>
            <div>位置: 119.52°E, 26.09°N</div>
            <div>状态: 手动控制</div>
          </div>
        </div>

        <div class="rounded-xl bg-gray-50 p-4">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="h-3 w-3 rounded-full bg-red-500" />
              <span class="font-medium">船舶 #003</span>
            </div>
            <span class="text-sm text-red-600">离线</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>电量: 15%</div>
            <div>航速: 0节</div>
            <div>位置: 119.48°E, 26.05°N</div>
            <div>状态: 低电量停航</div>
          </div>
        </div>
      </div>

      <!-- 人员管理 -->
      <h3 class="mb-3 mt-6 text-gray-800 font-semibold">
        人员管理
      </h3>
      <div class="space-y-2">
        <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div class="flex items-center space-x-3">
            <div
              class="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-sm text-white font-medium"
            >
              张
            </div>
            <div>
              <div class="text-sm font-medium">
                张三
              </div>
              <div class="text-xs text-gray-600">
                高级操作员
              </div>
            </div>
          </div>
          <div class="text-xs text-green-600">
            在线
          </div>
        </div>

        <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div class="flex items-center space-x-3">
            <div
              class="h-8 w-8 flex items-center justify-center rounded-full bg-green-500 text-sm text-white font-medium"
            >
              李
            </div>
            <div>
              <div class="text-sm font-medium">
                李四
              </div>
              <div class="text-xs text-gray-600">
                普通操作员
              </div>
            </div>
          </div>
          <div class="text-xs text-gray-600">
            离线
          </div>
        </div>

        <div class="flex items-center justify-between rounded-lg bg-gray-50 p-3">
          <div class="flex items-center space-x-3">
            <div
              class="h-8 w-8 flex items-center justify-center rounded-full bg-purple-500 text-sm text-white font-medium"
            >
              王
            </div>
            <div>
              <div class="text-sm font-medium">
                王五
              </div>
              <div class="text-xs text-gray-600">
                系统管理员
              </div>
            </div>
          </div>
          <div class="text-xs text-green-600">
            在线
          </div>
        </div>
      </div>

      <!-- 系统概览 -->
      <h3 class="mb-3 mt-6 text-gray-800 font-semibold">
        系统概览
      </h3>
      <div class="rounded-xl from-blue-50 to-indigo-50 bg-gradient-to-br p-4">
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <div class="text-lg text-blue-600 font-bold">
              1,245
            </div>
            <div class="text-xs text-gray-600">
              总航行里程(km)
            </div>
          </div>
          <div>
            <div class="text-lg text-green-600 font-bold">
              98.5%
            </div>
            <div class="text-xs text-gray-600">
              系统稳定性
            </div>
          </div>
          <div>
            <div class="text-lg text-orange-600 font-bold">
              156
            </div>
            <div class="text-xs text-gray-600">
              今日任务数
            </div>
          </div>
          <div>
            <div class="text-lg text-purple-600 font-bold">
              24/7
            </div>
            <div class="text-xs text-gray-600">
              监控时长
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Comprehensive Management page logic here
</script>

<style scoped>
/* Scoped styles for Comprehensive Management page */
</style>
