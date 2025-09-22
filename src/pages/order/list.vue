<script lang="ts" setup>
import type { IOrderListItem } from '@/api/types/order'
import { computed, ref } from 'vue'
import { getOrderList } from '@/api/order'
import { usePagination } from '@/hooks/usePagination'

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
const searchKeyword = ref('')
const orderList = ref<IOrderListItem[]>([])

const paginationParams = computed(() => ({
  keyword: searchKeyword.value,
  type: currentStatus.value,
}))

const { paging, query: queryList } = usePagination<IOrderListItem>({
  api: getOrderList,
  initialParams: paginationParams,
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

onShow(() => {
  paging.value?.reload() // 页面加载时重新加载列表
})

// 切换状态筛选
function switchStatus(status: number) {
  console.log(`🚀 - switchStatus - status--------------:`, status)
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
            paging.value?.reload() // 取消成功后重新加载列表
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
  <view class="bg-gray-50">
    <!-- 订单列表 -->
    <z-paging
      ref="paging"
      v-model="orderList"
      class="p-4 space-y-4"
      empty-view-text="暂无订单"
      @query="queryList"
    >
      <template #top>
        <!-- 搜索栏 -->
        <view class="bg-gray-100 p-2">
          <wd-input
            v-model="searchKeyword"
            prefix-icon="search"
            no-border
            custom-class="bg-white rounded-full p-2"
          />
        </view>

        <!-- 分类选项 -->
        <view class="bg-gray-100 p-2 pb-3">
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
      </template>
      <template #bottom>
        <view class="h-12 p-safe" />
      </template>
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
    </z-paging>
  </view>
</template>
