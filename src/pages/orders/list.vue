<script lang="ts" setup>
import { getOrdersAPI, type IOrder } from '@/api/shop'

defineOptions({
  name: 'OrderList'
})

definePage({
  style: {
    navigationBarTitleText: '我的订单'
  }
})

const orders = ref<IOrder[]>([])
const loading = ref(false)
const selectedStatus = ref('全部')

const statusOptions = [
  { label: '全部', value: '全部' },
  { label: '待付款', value: 'pending' },
  { label: '配送中', value: 'shipping' },
  { label: '已完成', value: 'completed' }
]

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待付款',
    paid: '已付款',
    shipping: '配送中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'text-orange-500',
    paid: 'text-blue-500',
    shipping: 'text-purple-500',
    completed: 'text-green-500',
    cancelled: 'text-gray-500'
  }
  return colorMap[status] || 'text-gray-500'
}

const loadOrders = async () => {
  loading.value = true
  try {
    orders.value = await getOrdersAPI(
      selectedStatus.value === '全部' ? undefined : selectedStatus.value
    )
  } catch (error) {
    console.error('Failed to load orders:', error)
  } finally {
    loading.value = false
  }
}

const onStatusChange = (status: string) => {
  selectedStatus.value = status
  loadOrders()
}

const goBack = () => {
  uni.navigateBack()
}

const handleOrderAction = (order: IOrder, action: string) => {
  switch (action) {
    case 'cancel':
      uni.showModal({
        title: '确认取消',
        content: '确定要取消这个订单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '订单已取消', icon: 'success' })
            loadOrders()
          }
        }
      })
      break
    case 'pay':
      uni.showToast({ title: '跳转支付页面', icon: 'none' })
      break
    case 'detail':
      uni.navigateTo({ url: `/pages/orders/detail?id=${order.id}` })
      break
    case 'buy-again':
      uni.showToast({ title: '已添加到购物车', icon: 'success' })
      break
  }
}

onLoad(() => {
  loadOrders()
})
</script>

<template>
  <view class="bg-gray-50 min-h-screen">
    <!-- 头部导航 -->
    <view class="flex items-center p-4 bg-white border-b border-gray-100">
      <view @click="goBack" class="mr-4">
        <uni-icons type="left" size="20" color="#666" />
      </view>
      <text class="text-lg font-semibold text-gray-800">我的订单</text>
    </view>

    <!-- 状态筛选 -->
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

    <!-- 订单列表 -->
    <view class="p-4">
      <view v-if="loading" class="text-center py-8">
        <text class="text-gray-500">加载中...</text>
      </view>
      
      <view v-else class="space-y-4">
        <view 
          v-for="order in orders" 
          :key="order.id"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <!-- 订单头部 -->
          <view class="flex justify-between items-start mb-3">
            <text class="text-sm text-gray-500">订单号：{{ order.orderNo }}</text>
            <text class="text-sm" :class="getStatusColor(order.status)">{{ getStatusText(order.status) }}</text>
          </view>
          
          <!-- 商品列表 -->
          <view class="space-y-3 mb-3">
            <view 
              v-for="product in order.products" 
              :key="product.id"
              class="flex space-x-3"
            >
              <image 
                :src="product.image" 
                class="w-15 h-15 rounded-lg flex-shrink-0"
                mode="aspectFill"
              />
              <view class="flex-1 min-w-0">
                <text class="text-sm font-medium text-gray-800 block">{{ product.name }}</text>
                <text v-if="product.color" class="text-xs text-gray-500 block mt-1">颜色：{{ product.color }}</text>
                <text v-if="product.size" class="text-xs text-gray-500 block">尺码：{{ product.size }}</text>
                <view class="flex justify-between items-center mt-2">
                  <text class="text-sm text-red-500 font-semibold">¥{{ product.price }}</text>
                  <text class="text-xs text-gray-500">x{{ product.quantity }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 总金额 -->
          <view class="text-right mb-3">
            <text class="text-sm text-gray-600">总计：</text>
            <text class="text-lg font-semibold text-red-500">¥{{ order.totalAmount }}</text>
          </view>
          
          <!-- 操作按钮 -->
          <view class="flex justify-end space-x-2">
            <template v-if="order.status === 'pending'">
              <button 
                class="px-4 py-1 border border-gray-300 text-gray-600 text-sm rounded"
                @click="handleOrderAction(order, 'cancel')"
              >
                取消订单
              </button>
              <button 
                class="px-4 py-1 bg-blue-500 text-white text-sm rounded"
                @click="handleOrderAction(order, 'pay')"
              >
                立即支付
              </button>
            </template>
            
            <template v-else-if="order.status === 'completed'">
              <button 
                class="px-4 py-1 border border-gray-300 text-gray-600 text-sm rounded"
                @click="handleOrderAction(order, 'detail')"
              >
                查看详情
              </button>
              <button 
                class="px-4 py-1 border border-gray-300 text-gray-600 text-sm rounded"
                @click="handleOrderAction(order, 'buy-again')"
              >
                再次购买
              </button>
            </template>
            
            <template v-else>
              <button 
                class="px-4 py-1 border border-gray-300 text-gray-600 text-sm rounded"
                @click="handleOrderAction(order, 'detail')"
              >
                查看详情
              </button>
            </template>
          </view>
          
          <!-- 订单时间 -->
          <view class="text-xs text-gray-400 mt-2">
            下单时间：{{ order.createTime }}
          </view>
        </view>
      </view>

      <view v-if="!loading && orders.length === 0" class="text-center py-8">
        <text class="text-gray-500">暂无订单</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.w-15 {
  width: 3.75rem;
}

.h-15 {
  height: 3.75rem;
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.75rem;
}

.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 0.5rem;
}

.space-x-3 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 0.75rem;
}

.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 1rem;
}

.min-w-0 {
  min-width: 0;
}
</style>