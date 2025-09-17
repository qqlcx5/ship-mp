<script lang="ts" setup>
import type { IOrderListData } from '@/api/types/order'
import { getOrderList } from '@/api/order'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '我的订单',
  },
})

// 订单状态筛选
const statusTabs = ref([
  { label: '全部', value: 9 },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已收货', value: 3 },
])

const currentStatus = ref(9)
const currentPage = ref(1)
const pageSize = ref(20)

// 获取订单列表
const { loading, data: orderData, run: loadOrderList } = useRequest<IOrderListData>(() =>
  getOrderList({
    type: currentStatus.value,
    page: currentPage.value,
    limit: pageSize.value,
  }),
)

// 订单列表
const orderList = computed(() => {
  return orderData.value?.list || []
})

// 获取状态颜色
function getStatusColor(status: number) {
  switch (status) {
    case 0: return '#f59e0b' // 待付款
    case 1: return '#3b82f6' // 待发货
    case 2: return '#8b5cf6' // 待收货
    case 3: return '#10b981' // 已收货
    default: return '#6b7280'
  }
}

// 格式化价格显示
function formatPrice(price?: number) {
  if (!price)
    return '0.00'
  return (price / 100).toFixed(2)
}

onLoad((options) => {
  // 从URL参数获取初始状态
  if (options?.type !== undefined) {
    currentStatus.value = Number(options.type)
  }
  loadOrderList()
})

// 切换状态筛选
function switchStatus(status: number) {
  currentStatus.value = status
  currentPage.value = 1 // 重置页码
  loadOrderList()
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
        },
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
    <view class="flex border-b border-gray-100 bg-white px-4 py-3 space-x-4">
      <view
        v-for="tab in statusTabs"
        :key="tab.value"
        class="rounded-full px-3 py-1 text-sm" :class="[
          currentStatus === tab.value
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600',
        ]"
        @click="switchStatus(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="flex items-center justify-center py-20">
      <text class="text-gray-500">加载中...</text>
    </view>

    <!-- 订单列表 -->
    <view v-else class="p-4 space-y-4">
      <view v-if="orderList.length === 0" class="py-20 text-center">
        <uni-icons type="list" color="#d1d5db" size="48" />
        <text class="mt-4 block text-gray-500">暂无订单</text>
      </view>

      <view
        v-for="order in orderList"
        :key="order.id"
        class="border border-gray-200 rounded-lg bg-white p-4"
      >
        <!-- 订单头部 -->
        <view class="mb-3 flex items-start justify-between">
          <text class="text-sm text-gray-500">订单号：{{ order.orderNo }}</text>
          <text class="text-sm" :style="{ color: getStatusColor(order.status) }">{{ order.statusText }}</text>
        </view>

        <!-- 商品列表 -->
        <view v-for="product in order.products" :key="product.id" class="mb-3 flex space-x-3">
          <image :src="product.image" class="h-15 w-15 rounded-lg" mode="aspectFill" />
          <view class="flex-1">
            <text class="block text-sm text-gray-800 font-medium">{{ product.name }}</text>
            <view class="mt-2 flex items-center justify-between">
              <text class="text-sm text-red-500 font-semibold">¥{{ formatPrice(product.price) }}</text>
              <text class="text-xs text-gray-500">x{{ product.quantity }}</text>
            </view>
          </view>
        </view>

        <!-- 订单总价 -->
        <view class="mb-3 flex items-center justify-between border-t border-gray-100 pt-2">
          <text class="text-sm text-gray-600">订单总价</text>
          <text class="text-lg text-red-500 font-bold">¥{{ formatPrice(order.totalAmount) }}</text>
        </view>

        <!-- 订单操作 -->
        <view class="mt-3 flex justify-end space-x-2">
          <template v-if="order.status === 0">
            <button class="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600" @click="handleOrderAction('cancel', order.id)">
              取消订单
            </button>
            <button class="rounded bg-blue-500 px-3 py-1 text-sm text-white" @click="handleOrderAction('pay', order.id)">
              立即支付
            </button>
          </template>
          <template v-else-if="order.status === 3">
            <button class="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600" @click="handleOrderAction('detail', order.id)">
              查看详情
            </button>
            <button class="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600" @click="handleOrderAction('reorder', order.id)">
              再次购买
            </button>
          </template>
          <template v-else>
            <button class="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600" @click="handleOrderAction('detail', order.id)">
              查看详情
            </button>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>
