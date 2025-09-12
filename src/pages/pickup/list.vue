<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '我的取件',
  },
})

// 取件状态筛选
const statusTabs = ref([
  { label: '全部', value: 'all' },
  { label: '待取件', value: 'pending' },
  { label: '已取件', value: 'completed' }
])

const currentStatus = ref('all')

// 模拟取件数据
const pickupList = ref([
  {
    id: 1,
    name: '商品名称A',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
    status: 'pending',
    statusText: '待取件',
    statusColor: '#f59e0b',
    pickupCode: 'PK001',
    location: '快递柜A-01',
    createTime: '2024-08-29 10:30:00'
  },
  {
    id: 2,
    name: '商品名称B',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop',
    status: 'completed',
    statusText: '已取件',
    statusColor: '#10b981',
    pickupCode: 'PK002',
    location: '快递柜B-05',
    createTime: '2024-08-28 14:20:00'
  }
])

// 筛选后的取件列表
const filteredPickups = computed(() => {
  if (currentStatus.value === 'all') {
    return pickupList.value
  }
  return pickupList.value.filter(pickup => pickup.status === currentStatus.value)
})

// 切换状态筛选
function switchStatus(status: string) {
  currentStatus.value = status
}

// 查看取件详情
function viewDetail(id: number) {
  uni.navigateTo({ url: `/pages/pickup/detail?id=${id}` })
}

// 取件操作
function handlePickup(id: number) {
  uni.showModal({
    title: '确认取件',
    content: '确定已完成取件吗？',
    success: (res) => {
      if (res.confirm) {
        const pickup = pickupList.value.find(item => item.id === id)
        if (pickup) {
          pickup.status = 'completed'
          pickup.statusText = '已取件'
          pickup.statusColor = '#10b981'
        }
        uni.showToast({ title: '取件成功', icon: 'success' })
      }
    }
  })
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 状态筛选 -->
    <view class="flex space-x-4 px-4 py-3 bg-white border-b border-gray-100">
      <view
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="[
          'px-3 py-1 text-sm rounded-full',
          currentStatus === tab.value
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600'
        ]"
        @click="switchStatus(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 取件列表 -->
    <view class="space-y-4 p-4">
      <view v-if="filteredPickups.length === 0" class="text-center py-20">
        <uni-icons type="car" color="#d1d5db" size="48" />
        <text class="block mt-4 text-gray-500">暂无取件</text>
      </view>

      <view
        v-for="pickup in filteredPickups"
        :key="pickup.id"
        class="bg-white border border-gray-200 rounded-lg p-4"
        @click="viewDetail(pickup.id)"
      >
        <view class="flex justify-between items-start">
          <!-- 左侧信息 -->
          <view class="flex-1">
            <view class="flex justify-between items-center mb-2">
              <text class="font-medium text-gray-800">{{ pickup.name }}</text>
              <text class="text-sm" :style="{ color: pickup.statusColor }">{{ pickup.statusText }}</text>
            </view>

            <text class="text-sm text-gray-600 block">取件码：{{ pickup.pickupCode }}</text>
            <text class="text-sm text-gray-600 block">位置：{{ pickup.location }}</text>
            <text class="text-xs text-gray-500 block mt-1">{{ pickup.createTime }}</text>

            <!-- 操作按钮 -->
            <view v-if="pickup.status === 'pending'" class="mt-3">
              <wd-button size="small" type="primary" @click.stop="handlePickup(pickup.id)">
                确认取件
              </wd-button>
            </view>
          </view>

          <!-- 右侧商品图片 -->
          <image :src="pickup.image" class="w-20 h-20 rounded-lg ml-4" mode="aspectFill" />
        </view>
      </view>
    </view>
  </view>
</template>
