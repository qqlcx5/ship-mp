<script lang="ts" setup>
import type { IOrderConfirmData, IOrderCreateData, IOrderPayData } from '@/api/types/order'
import { confirmOrder, createOrder, payOrder } from '@/api/order'
import useRequest from '@/hooks/useRequest'

definePage({
  style: {
    navigationBarTitleText: '确认订单',
  },
})

const cartId = ref<string>('')

// 获取订单确认信息
const { loading: confirmLoading, data: orderData, run: loadOrderConfirm } = useRequest<IOrderConfirmData>(() =>
  confirmOrder({ cartId: cartId.value, new: 1, shipping_type: 1, addressId: 0 }),
)

// 创建订单
const orderParams = ref<any>()
const { loading: createLoading, run: runCreateOrder } = useRequest<IOrderCreateData>(() =>
  createOrder(orderData.value.orderKey, orderParams.value),
)

// 支付订单状态
const payLoading = ref(false)

onLoad((options) => {
  if (options?.cartId) {
    cartId.value = options.cartId
    loadOrderConfirm()
  }
})

// 格式化价格显示
function formatPrice(price?: number) {
  if (!price)
    return '0.00'
  return (price).toFixed(2)
}

// 提交订单并支付
async function handleSubmitOrder() {
  if (!cartId.value)
    return
  try {
    console.log('orderData.value', orderData.value)

    orderParams.value = {
      addressId: orderData.value.addressInfo.id,
      ...orderData.value.addressInfo,
      new: 1,
      shipping_type: 1,
    }
    // 第一步：创建订单
    const orderResult = await runCreateOrder()
    console.log('orderResult', orderResult)
    if (!orderResult?.result?.orderId) {
      return
    }

    uni.showToast({
      title: '订单创建成功',
      icon: 'success',
    })

    // 第二步：支付订单
    payLoading.value = true
    try {
      const payResult = await payOrder({ paytype: 'weixin', type: 0, uni: orderResult?.result?.orderId })
      const payConfig = payResult.result.jsConfig
      payConfig.timeStamp = payConfig.timestamp
      uni.requestPayment(payConfig)
        .then((res) => {
          uni.showToast({
            title: '支付成功',
            icon: 'success',
          })
          // 跳转到订单列表
          setTimeout(() => {
            uni.redirectTo({
              url: '/pages/order/list?type=0',
            })
          }, 1500)
        })
        .catch((err) => {
          console.log('err', err)
        })
        .finally(() => {
          payLoading.value = false
        })
    }
    finally {
      payLoading.value = false
    }
  }
  catch (error) {
    console.error('提交订单失败:', error)
  }
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 加载状态 -->
    <view v-if="confirmLoading" class="flex items-center justify-center py-20">
      <text class="text-gray-500">加载中...</text>
    </view>

    <!-- 订单确认内容 -->
    <view v-else-if="orderData">
      <!-- 收货地址 -->
      <view v-if="orderData.addressInfo" class="mb-2 bg-white p-4">
        <view class="mb-2 flex items-center">
          <view class="i-carbon-location-filled mr-2 text-[16px] text-[#f59e0b]" />
          <text class="text-gray-800 font-medium">收货地址</text>
        </view>
        <view>
          <text class="text-gray-800 font-medium">{{ orderData.addressInfo.real_name }}</text>
          <text class="ml-2 text-sm text-gray-600">{{ orderData.addressInfo.phone }}</text>
        </view>
        <text class="block break-all text-sm text-gray-600">{{ orderData.addressInfo.province }}{{ orderData.addressInfo.city }}{{ orderData.addressInfo.district }}{{ orderData.addressInfo.detail }}</text>
      </view>

      <!-- 商品列表 -->
      <view class="mb-2 bg-white">
        <view class="border-b border-gray-100 p-4">
          <text class="text-gray-800 font-medium">商品清单</text>
        </view>
        <view
          v-for="product in orderData.cartInfo"
          :key="product.id"
          class="flex items-center border-b border-gray-50 p-4 last:border-b-0"
        >
          <image
            :src="product.image"
            class="mr-3 h-16 w-16 rounded-lg"
            mode="aspectFill"
          />
          <view class="flex-1">
            <text class="block text-gray-800 font-medium">{{ product.name }}</text>
            <view class="mt-1 flex items-center justify-between">
              <text class="text-sm text-gray-600">数量：{{ product.quantity }}</text>
              <text class="text-red-500 font-medium">¥{{ formatPrice(product.price) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 费用明细 -->
      <view class="mb-2 bg-white p-4">
        <view class="mb-2 text-gray-800 font-medium">
          费用明细
        </view>
        <view class="flex items-center justify-between py-1">
          <text class="text-gray-600">商品总价</text>
          <text class="text-gray-800">¥{{ formatPrice(Number(orderData.priceGroup.totalPrice)) }}</text>
        </view>
        <view class="flex items-center justify-between py-1">
          <text class="text-gray-600">运费</text>
          <text class="text-gray-800">¥{{ formatPrice(Number(orderData.priceGroup.storePostage)) }}</text>
        </view>
        <view class="mt-2 flex items-center justify-between border-t border-gray-100 pt-2">
          <text class="text-gray-800 font-medium">实付款</text>
          <text class="text-xl text-red-500 font-bold">¥{{ formatPrice(Number(orderData.priceGroup.payPrice)) }}</text>
        </view>
      </view>

      <!-- 底部占位 -->
      <view class="h-20" />
    </view>

    <!-- 订单不存在提示 -->
    <view v-else class="flex flex-col items-center justify-center py-20">
      <view class="i-carbon-shopping-cart text-[48px] text-[#d1d5db]" />
      <text class="mt-4 text-gray-500">订单信息不存在</text>
    </view>

    <!-- 底部提交按钮 -->
    <view v-if="orderData" class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
      <view class="flex items-center justify-between">
        <view>
          <text class="text-sm text-gray-600">实付款：</text>
          <text class="text-xl text-red-500 font-bold">¥{{ formatPrice(Number(orderData.priceGroup.payPrice)) }}</text>
        </view>
        <wd-button
          type="primary"
          :loading="createLoading || payLoading"
          :disabled="createLoading || payLoading"
          @click="handleSubmitOrder"
        >
          {{ createLoading ? '创建中...' : payLoading ? '支付中...' : '提交订单' }}
        </wd-button>
      </view>
    </view>
  </view>
</template>
