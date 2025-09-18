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
  return orderData.value || []
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
function formatPrice(price?: number | string) {
  if (!price)
    return '0.00'
  return price
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
    <view class="border-b border-gray-100 bg-white px-4 py-3">
      <scroll-view scroll-x>
        <view class="flex items-center space-x-2">
          <view
            v-for="tab in statusTabs"
            :key="tab.value"
            class="whitespace-nowrap rounded-full px-3 py-1 text-sm" :class="[
              currentStatus === tab.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600',
            ]"
            @click="switchStatus(tab.value)"
          >
            {{ tab.label }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="flex items-center justify-center py-20">
      <text class="text-gray-500">加载中...</text>
    </view>

    <!-- 订单列表 -->
    <view v-else class="p-4 space-y-4">
      <view v-if="orderList.length === 0" class="py-20 text-center">
        <view class="i-carbon-list text-[48px] text-[#d1d5db]" />
        <text class="mt-4 block text-gray-500">暂无订单</text>
      </view>

      <view
        v-for="order in orderList"
        :key="order.id"
        class="border border-gray-200 rounded-lg bg-white p-4"
      >
        <!-- 订单头部 -->
        <view class="mb-3 flex items-start justify-between">
          <view class="flex-1">
            <text class="text-sm text-gray-500">订单号：{{ order.order_id }}</text>
            <text class="mt-1 block text-xs text-gray-400">创建时间：{{ order._add_time }}</text>
          </view>
          <text class="text-sm" :style="{ color: getStatusColor(order.status) }">{{ order._status._title }}</text>
        </view>

        <!-- 商品列表 -->
        <view v-for="product in order.cartInfo " :key="product.id" class="mb-3 flex space-x-3">
          <image :src="product.productInfo.image" class="h-15 w-15 rounded-lg" mode="aspectFill" />
          <view class="flex-1">
            <text class="block text-sm text-gray-800 font-medium">{{ product.productInfo.store_name }}</text>
            <view class="mt-2 flex items-center justify-between">
              <text class="text-sm text-red-500 font-semibold">¥{{ formatPrice(product.productInfo.price) }}</text>
              <text class="text-xs text-gray-500">x{{ product.cart_num }}</text>
            </view>
          </view>
        </view>

        <!-- 订单总价 -->
        <view class="mb-3 flex items-center justify-between border-t border-gray-100 pt-2">
          <text class="text-sm text-gray-600">订单总价</text>
          <text class="text-lg text-red-500 font-bold">¥{{ formatPrice(order.pay_price) }}</text>
        </view>

        <!-- 订单操作 -->
        <view class="mt-3 flex justify-end gap-2">
          <template v-if="order.offlinePayStatus === 0">
            <wd-button size="small" type="info" @click="handleOrderAction('cancel', String(order.order_id))">
              取消订单
            </wd-button>
            <wd-button size="small" class="rounded bg-blue-500 px-3 py-1 text-sm text-white" @click="handleOrderAction('pay', String(order.order_id))">
              立即支付
            </wd-button>
          </template>
          <template v-else-if="order.offlinePayStatus === 3">
            <wd-button size="small" type="info" @click="handleOrderAction('detail', order.order_id)">
              查看详情
            </wd-button>
            <wd-button size="small" @click="handleOrderAction('reorder', order.order_id)">
              再次购买
            </wd-button>
          </template>
          <template v-else>
            <wd-button size="small" type="info" @click="handleOrderAction('detail', order.order_id)">
              查看详情
            </wd-button>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>
