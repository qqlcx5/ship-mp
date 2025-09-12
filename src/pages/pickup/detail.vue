<script lang="ts" setup>
definePage({
  style: {
    navigationBarTitleText: '取件详情',
  },
})

const pickupId = ref('')

// 模拟取件详情数据
const pickupDetail = ref({
  id: 1,
  name: '商品名称A',
  status: 'pending',
  statusText: '包裹待取件',
  statusColor: '#f59e0b',
  pickupCode: 'PK001',
  location: '快递柜A-01',
  items: [
    {
      name: '商品名称a',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop'
    },
    {
      name: '商品名称b',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&h=150&fit=crop'
    }
  ],
  documents: [
    {
      name: '取件凭证.pdf',
      size: '245 KB',
      url: '#'
    }
  ],
  createTime: '2024-08-29 10:30:00',
  expireTime: '2024-09-05 23:59:59'
})

onLoad((options) => {
  if (options?.id) {
    pickupId.value = options.id
    // 这里可以根据ID获取详情数据
  }
})

// 查看PDF
function viewDocument(doc: any) {
  uni.showToast({ title: '查看PDF文档', icon: 'none' })
}

// 分享取件码
function sharePickupCode() {
  uni.showToast({ title: '分享取件码', icon: 'none' })
}

// 联系快递员
function contactCourier() {
  uni.showToast({ title: '联系快递员', icon: 'none' })
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 状态卡片 -->
    <view class="mx-4 mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <view class="flex items-center">
        <view class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
          <uni-icons type="car" color="#ea580c" size="20" />
        </view>
        <view>
          <text class="font-semibold text-orange-800 block">{{ pickupDetail.statusText }}</text>
          <text class="text-sm text-orange-600">请在有效期内及时取件</text>
        </view>
      </view>
    </view>

    <!-- 取件信息 -->
    <view class="mx-4 mt-4 bg-white border border-gray-200 rounded-lg p-4">
      <text class="font-semibold text-gray-800 block mb-4">取件信息</text>
      <view class="space-y-3">
        <view class="flex justify-between">
          <text class="text-gray-600">取件码：</text>
          <text class="text-gray-800 font-medium">{{ pickupDetail.pickupCode }}</text>
        </view>
        <view class="flex justify-between">
          <text class="text-gray-600">取件位置：</text>
          <text class="text-gray-800">{{ pickupDetail.location }}</text>
        </view>
        <view class="flex justify-between">
          <text class="text-gray-600">到达时间：</text>
          <text class="text-gray-800">{{ pickupDetail.createTime }}</text>
        </view>
        <view class="flex justify-between">
          <text class="text-gray-600">有效期至：</text>
          <text class="text-red-500">{{ pickupDetail.expireTime }}</text>
        </view>
      </view>
    </view>

    <!-- 商品信息 -->
    <view class="mx-4 mt-4 bg-white border border-gray-200 rounded-lg p-4">
      <text class="font-semibold text-gray-800 block mb-4">商品信息</text>
      <view v-for="(item, index) in pickupDetail.items" :key="index" class="space-y-3">
        <view class="flex justify-between">
          <text class="text-gray-600">{{ item.name }}：</text>
        </view>
        <image :src="item.image" class="w-full h-32 rounded-lg object-cover" mode="aspectFill" />
      </view>
    </view>

    <!-- PDF查看 -->
    <view class="mx-4 mt-4 bg-white border border-gray-200 rounded-lg p-4">
      <text class="font-semibold text-gray-800 block mb-3">相关文档</text>
      <view
        v-for="doc in pickupDetail.documents"
        :key="doc.name"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        @click="viewDocument(doc)"
      >
        <view class="flex items-center">
          <uni-icons type="paperplane-filled" color="#dc2626" size="20" class="mr-3" />
          <view>
            <text class="text-sm font-medium text-gray-800 block">{{ doc.name }}</text>
            <text class="text-xs text-gray-500">{{ doc.size }}</text>
          </view>
        </view>
        <wd-button size="small" type="primary">
          <uni-icons type="eye" color="white" size="12" class="mr-1" />
          查看
        </wd-button>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="p-4 mt-8 space-y-3">
      <wd-button type="primary" block @click="sharePickupCode">
        分享取件码
      </wd-button>
      <wd-button type="default" block @click="contactCourier">
        联系快递员
      </wd-button>
    </view>
  </view>
</template>
