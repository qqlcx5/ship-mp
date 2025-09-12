<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '我的订单',
  },
})

// 订单状态筛选
const statusTabs = ref([
  { label: '全部', value: 'all' },
  { label: '待付款', value: 'pending' },
  { label: '配送中', value: 'shipping' },
  { label: '已完成', value: 'completed' }
])

const currentStatus = ref('all')

// 模拟订单数据
const orderList = ref([
  {
    id: '202408290001',
    status: 'pending',
    statusText: '待付款',
    statusColor: '#f59e0b',
    items: [
      {
        id: 1,
        name: '无线蓝牙耳机',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop',
        spec: '颜色：白色',
        price: 299.00,
        quantity: 1
      }
    ],
    totalAmount: 299.00,
    createTime: '2024-08-29 10:30:00'
  },
  {
    id: '202408280002',
    status: 'completed',
    statusText: '已完成',
    statusColor: '#10b981',
    items: [
      {
        id: 2,
        name: '运动鞋',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop',
        spec: '尺码：42',
        price: 599.00,
        quantity: 1
      }
    ],
    totalAmount: 599.00,
    createTime: '2024-08-28 14:20:00'
  }
])

// 筛选后的订单列表
const filteredOrders = computed(() => {
  if (currentStatus.value === 'all') {
    return orderList.value
  }
  return orderList.value.filter(order => order.status === currentStatus.value)
})

// 切换状态筛选
function switchStatus(status: string) {
  currentStatus.value = status
}

// 订单操作
function handleOrderAction(action: string, orderId: string) {
  switch (action) {
    case 'pay':
      uni.showToast({ title: '跳转支付', icon: 'none' })
      break
    case 'cancel':
      uni.showModal({
        title: '确认取消',
        content: '确定要取消这个订单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '订单已取消', icon: 'success' })
          }
        }
      })
      break
    case 'detail':
      uni.navigateTo({ url: `/pages/order/detail?id=${orderId}` })
      break
    case 'reorder':
      uni.showToast({ title: '再次购买', icon: 'none' })
      break
  }
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

    <!-- 订单列表 -->
    <view class="space-y-4 p-4">
      <view v-if="filteredOrders.length === 0" class="text-center py-20">
        <uni-icons type="list" color="#d1d5db" size="48" />
        <text class="block mt-4 text-gray-500">暂无订单</text>
      </view>

      <view
        v-for="order in filteredOrders"
        :key="order.id"
        class="bg-white border border-gray-200 rounded-lg p-4"
      >
        <!-- 订单头部 -->
        <view class="flex justify-between items-start mb-3">
          <text class="text-sm text-gray-500">订单号：{{ order.id }}</text>
          <text class="text-sm" :style="{ color: order.statusColor }">{{ order.statusText }}</text>
        </view>

        <!-- 商品列表 -->
        <view v-for="item in order.items" :key="item.id" class="flex space-x-3 mb-3">
          <image :src="item.image" class="w-15 h-15 rounded-lg" mode="aspectFill" />
          <view class="flex-1">
            <text class="text-sm font-medium text-gray-800 block">{{ item.name }}</text>
            <text class="text-xs text-gray-500 block mt-1">{{ item.spec }}</text>
            <view class="flex justify-between items-center mt-2">
              <text class="text-sm text-red-500 font-semibold">¥{{ item.price.toFixed(2) }}</text>
              <text class="text-xs text-gray-500">x{{ item.quantity }}</text>
            </view>
          </view>
        </view>

        <!-- 订单操作 -->
        <view class="flex justify-end mt-3 space-x-2">
          <template v-if="order.status === 'pending'">
            <wd-button size="small" type="default" @click="handleOrderAction('cancel', order.id)">
              取消订单
            </wd-button>
            <wd-button size="small" type="primary" @click="handleOrderAction('pay', order.id)">
              立即支付
            </wd-button>
          </template>
          <template v-else-if="order.status === 'completed'">
            <wd-button size="small" type="default" @click="handleOrderAction('detail', order.id)">
              查看详情
            </wd-button>
            <wd-button size="small" type="default" @click="handleOrderAction('reorder', order.id)">
              再次购买
            </wd-button>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>
