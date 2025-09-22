<script setup lang="ts">
import type { IOrderDetailData } from '@/api/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getOrderDetail, takeOrder } from '@/api/order'

const orderDetail = ref<IOrderDetailData>()
const isLoading = ref(false)
definePage({
  style: {
    navigationBarTitleText: '我的订单',
  },
})
onLoad(async (options) => {
  const { id } = options as { id: string }
  if (id) {
    orderDetail.value = await getOrderDetail(id)
  }
})

// 确定收货
async function handleTakeOrder() {
  if (!orderDetail.value || isLoading.value)
    return

  uni.showModal({
    title: '确认收货',
    content: '确定已收到商品吗？',
    success: async (res) => {
      if (res.confirm) {
        isLoading.value = true
        await takeOrder(orderDetail.value.order_id)
        uni.showToast({
          title: '收货成功',
          icon: 'success',
        })
        // 重新获取订单详情
        orderDetail.value = await getOrderDetail(orderDetail.value.id.toString())
      }
    },
  })
}
</script>

<template>
  <view class="bg-white p-4 shadow-md">
    <view class="mb-2 text-lg font-bold">
      订单号：{{ orderDetail?.order_id }}
    </view>
    <view class="mb-4 text-gray-500">
      下单时间：{{ orderDetail?._add_time }}
    </view>
    <view class="mb-4 text-gray-500">
      订单状态：<text class="text-red-500">{{ orderDetail?._status?._title }}</text>
    </view>
    <view class="mb-4 rounded-lg bg-gray-50 p-3">
      <view class="mb-2 font-bold">
        收货人信息
      </view>
      <view class="text-gray-600">
        姓名：{{ orderDetail?.real_name }}
      </view>
      <view class="text-gray-600">
        电话：{{ orderDetail?.user_phone }}
      </view>
      <view class="text-gray-600">
        地址：{{ orderDetail?.user_address }}
      </view>
    </view>
    <!-- 物流信息 -->
    <view v-if="orderDetail?.delivery_name || orderDetail?.delivery_code" class="mb-4 rounded-lg bg-gray-50 p-3">
      <view class="mb-2 font-bold">
        物流信息
      </view>
      <view v-if="orderDetail?.delivery_name" class="text-gray-600">
        快递公司：{{ orderDetail?.delivery_name }}
      </view>
      <view v-if="orderDetail?.delivery_id" class="text-gray-600">
        快递单号：{{ orderDetail?.delivery_id }}
      </view>
    </view>
    <view
      v-for="product in orderDetail?.cartInfo"
      :key="product.id"
      class="mb-4 flex items-center"
    >
      <image :src="product.productInfo.image" class="mr-4 h-20 w-20 rounded-md" />
      <view class="flex-1">
        <view class="font-bold">
          {{ product.productInfo.store_name }}
        </view>
        <view class="text-gray-500">
          数量：{{ product.cart_num }}
        </view>
      </view>
      <view class="text-lg font-bold">
        ¥{{ product.truePrice }}
      </view>
    </view>
    <view class="mb-2 flex items-center justify-end">
      <view class="mr-2 text-gray-500">
        商品总价：
      </view>
      <view class="text-lg font-bold">
        ¥{{ orderDetail?.total_price }}
      </view>
    </view>
    <view class="flex items-center justify-end">
      <view class="mr-2 text-gray-500">
        支付金额：
      </view>
      <view class="text-lg text-red-500 font-bold">
        ¥{{ orderDetail?.pay_price }}
      </view>
    </view>

    <!-- 确定收货按钮 -->
    <!-- <view v-if="orderDetail?._status._type === OrderStatus.PENDING_RECEIPT" class="mt-4">
      <button
        class="w-full rounded-lg bg-blue-500 py-3 text-white font-medium"
        :disabled="isLoading"
        @click="handleTakeOrder"
      >
        {{ isLoading ? '处理中...' : '确定收货' }}
      </button>
    </view> -->
  </view>
</template>
