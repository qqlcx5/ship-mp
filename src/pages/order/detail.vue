<script setup lang="ts">
import type { IOrderDetailData } from '@/api/types/order'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getOrderDetail } from '@/api/order'

const orderDetail = ref<IOrderDetailData>()
onLoad(async (options) => {
  const { id } = options as { id: string }
  if (id) {
    orderDetail.value = await getOrderDetail(id)
  }
})

// 格式化价格显示
function formatPrice(price?: string | number) {
  if (price === undefined || price === null || price === '')
    return '0.00'
  return price
}
</script>

<template>
  <view class="p-4">
    <view class="rounded-lg bg-white p-4 shadow-md">
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
          ¥{{ formatPrice(product.truePrice) }}
        </view>
      </view>
      <view class="mb-2 flex items-center justify-end">
        <view class="mr-2 text-gray-500">
          商品总价：
        </view>
        <view class="text-lg font-bold">
          ¥{{ formatPrice(orderDetail?.total_price) }}
        </view>
      </view>
      <view class="flex items-center justify-end">
        <view class="mr-2 text-gray-500">
          支付金额：
        </view>
        <view class="text-lg text-red-500 font-bold">
          ¥{{ formatPrice(orderDetail?.pay_price) }}
        </view>
      </view>
    </view>
  </view>
</template>
