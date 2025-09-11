<script lang="ts" setup>
import { getPickupItemsAPI, type IPickupItem } from '@/api/shop'

defineOptions({
  name: 'PickupList'
})

definePage({
  style: {
    navigationBarTitleText: '我的取件'
  }
})

const pickupItems = ref<IPickupItem[]>([])
const loading = ref(false)
const selectedStatus = ref('全部')

const statusOptions = [
  { label: '全部', value: '全部' },
  { label: '待取件', value: 'pending' },
  { label: '已取件', value: 'completed' }
]

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待取件',
    completed: '已取件'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'text-orange-500',
    completed: 'text-green-500'
  }
  return colorMap[status] || 'text-gray-500'
}

const loadPickupItems = async () => {
  loading.value = true
  try {
    pickupItems.value = await getPickupItemsAPI(
      selectedStatus.value === '全部' ? undefined : selectedStatus.value
    )
  } catch (error) {
    console.error('Failed to load pickup items:', error)
  } finally {
    loading.value = false
  }
}

const onStatusChange = (status: string) => {
  selectedStatus.value = status
  loadPickupItems()
}

const goBack = () => {
  uni.navigateBack()
}

const viewPickupDetail = (item: IPickupItem) => {
  uni.navigateTo({ url: `/pages/pickup/detail?id=${item.id}` })
}

onLoad(() => {
  loadPickupItems()
})
</script>

<template>
  <view class="bg-gray-50 min-h-screen">
    <!-- 头部导航 -->
    <view class="flex items-center p-4 bg-white border-b border-gray-100">
      <view @click="goBack" class="mr-4">
        <uni-icons type="left" size="20" color="#666" />
      </view>
      <text class="text-lg font-semibold text-gray-800">我的取件</text>
    </view>

    <!-- 筛选选项 -->
    <view class="flex space-x-4 px-4 py-3 bg-white border-b border-gray-100">
      <view 
        v-for="status in statusOptions" 
        :key="status.value"
        class="px-3 py-1 text-sm rounded-full transition-colors"
        :class="selectedStatus === status.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'"
        @click="onStatusChange(status.value)"
      >
        {{ status.label }}
      </view>
    </view>

    <!-- 取件列表 -->
    <view class="p-4">
      <view v-if="loading" class="text-center py-8">
        <text class="text-gray-500">加载中...</text>
      </view>
      
      <view v-else class="space-y-4">
        <view 
          v-for="item in pickupItems" 
          :key="item.id"
          class="bg-white border border-gray-200 rounded-lg p-4"
          @click="viewPickupDetail(item)"
        >
          <view class="flex justify-between items-start">
            <view class="flex-1">
              <view class="flex justify-between items-start mb-2">
                <text class="font-medium text-gray-800">{{ item.name }}</text>
                <text class="text-sm" :class="getStatusColor(item.status)">{{ getStatusText(item.status) }}</text>
              </view>
            </view>
            <image 
              :src="item.image" 
              class="w-20 h-20 object-cover rounded-lg ml-4"
              mode="aspectFill"
            />
          </view>
          
          <view v-if="item.qrCode && item.status === 'pending'" class="mt-3 p-3 bg-orange-50 rounded-lg">
            <text class="text-sm text-orange-800">取件码：{{ item.qrCode }}</text>
          </view>
        </view>
      </view>

      <view v-if="!loading && pickupItems.length === 0" class="text-center py-8">
        <text class="text-gray-500">暂无取件信息</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 1rem;
}

.w-20 {
  width: 5rem;
}

.h-20 {
  height: 5rem;
}
</style>