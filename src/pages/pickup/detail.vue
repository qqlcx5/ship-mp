<script lang="ts" setup>
import { getPickupItemsAPI, type IPickupItem } from '@/api/shop'

defineOptions({
  name: 'PickupDetail'
})

definePage({
  style: {
    navigationBarTitleText: '取件详情'
  }
})

const pickupItem = ref<IPickupItem | null>(null)
const loading = ref(false)

const loadPickupDetail = async (id: string) => {
  loading.value = true
  try {
    const items = await getPickupItemsAPI()
    pickupItem.value = items.find(item => item.id === id) || null
  } catch (error) {
    console.error('Failed to load pickup detail:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '包裹待取件',
    completed: '包裹已取件'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'text-orange-800',
    completed: 'text-green-800'
  }
  return colorMap[status] || 'text-gray-800'
}

const getStatusBgColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'bg-orange-50 border-orange-200',
    completed: 'bg-green-50 border-green-200'
  }
  return colorMap[status] || 'bg-gray-50 border-gray-200'
}

const viewPDF = () => {
  if (!pickupItem.value?.pdfUrl) return
  
  // 模拟PDF查看功能
  uni.showToast({
    title: 'PDF查看功能待实现',
    icon: 'none'
  })
}

const sharePickupCode = () => {
  if (!pickupItem.value?.qrCode) return
  
  uni.showToast({
    title: '分享取件码功能待实现',
    icon: 'none'
  })
}

const contactCourier = () => {
  uni.showToast({
    title: '联系快递员功能待实现',
    icon: 'none'
  })
}

onLoad((options: any) => {
  if (options.id) {
    loadPickupDetail(options.id)
  }
})
</script>

<template>
  <view class="bg-gray-50 min-h-screen">
    <view v-if="loading" class="flex items-center justify-center h-64">
      <text class="text-gray-500">加载中...</text>
    </view>
    
    <view v-else-if="pickupItem" class="pb-20">
      <!-- 头部导航 -->
      <view class="flex items-center p-4 bg-white border-b border-gray-100">
        <view @click="goBack" class="mr-4">
          <uni-icons type="left" size="20" color="#666" />
        </view>
        <text class="text-lg font-semibold text-gray-800">取件详情</text>
      </view>

      <!-- 状态卡片 -->
      <view class="mx-4 mt-4">
        <view 
          class="p-4 border rounded-lg"
          :class="getStatusBgColor(pickupItem.status)"
        >
          <view class="flex items-center">
            <view class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <uni-icons 
                type="paperplane" 
                size="24" 
                :color="pickupItem.status === 'pending' ? '#ea580c' : '#16a34a'" 
              />
            </view>
            <view>
              <text 
                class="font-semibold block"
                :class="getStatusColor(pickupItem.status)"
              >
                {{ getStatusText(pickupItem.status) }}
              </text>
              <text 
                class="text-sm"
                :class="pickupItem.status === 'pending' ? 'text-orange-600' : 'text-green-600'"
              >
                {{ pickupItem.status === 'pending' ? '请在有效期内及时取件' : '感谢您的取件' }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 取件信息 -->
      <view class="mx-4 mt-4 bg-white border border-gray-200 rounded-lg p-4">
        <text class="font-semibold text-gray-800 block mb-4">取件信息</text>
        
        <view class="space-y-3">
          <view>
            <text class="text-gray-600 block mb-2">商品名称：{{ pickupItem.name }}</text>
            <image 
              :src="pickupItem.image" 
              class="w-full h-32 object-cover rounded-lg"
              mode="aspectFill"
            />
          </view>
          
          <view v-if="pickupItem.qrCode" class="flex justify-between items-center">
            <text class="text-gray-600">取件码：</text>
            <text class="font-semibold text-lg">{{ pickupItem.qrCode }}</text>
          </view>
        </view>
      </view>

      <!-- PDF查看 -->
      <view v-if="pickupItem.pdfUrl" class="mx-4 mt-4 bg-white border border-gray-200 rounded-lg p-4">
        <text class="font-semibold text-gray-800 block mb-3">相关文档</text>
        <view 
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          @click="viewPDF"
        >
          <view class="flex items-center">
            <uni-icons type="paperclip" size="20" color="#ef4444" class="mr-3" />
            <view>
              <text class="text-sm font-medium text-gray-800 block">取件凭证.pdf</text>
              <text class="text-xs text-gray-500">245 KB</text>
            </view>
          </view>
          <button class="text-blue-500 text-sm">
            <uni-icons type="eye" size="14" color="#3b82f6" class="mr-1" />
            查看
          </button>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view v-if="pickupItem.status === 'pending'" class="mx-4 mt-6 space-y-3">
        <button 
          class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
          @click="sharePickupCode"
        >
          分享取件码
        </button>
        <button 
          class="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium"
          @click="contactCourier"
        >
          联系快递员
        </button>
      </view>
    </view>

    <view v-else class="flex items-center justify-center h-64">
      <text class="text-gray-500">取件信息不存在</text>
    </view>
  </view>
</template>

<style scoped>
.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.75rem;
}
</style>