<script lang="ts" setup>
import { getAddressesAPI, type IAddress } from '@/api/shop'

defineOptions({
  name: 'AddressList'
})

definePage({
  style: {
    navigationBarTitleText: '收货地址'
  }
})

const addresses = ref<IAddress[]>([])
const loading = ref(false)

const loadAddresses = async () => {
  loading.value = true
  try {
    addresses.value = await getAddressesAPI()
  } catch (error) {
    console.error('Failed to load addresses:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  uni.navigateBack()
}

const addNewAddress = () => {
  uni.navigateTo({ url: '/pages/address/edit' })
}

const editAddress = (address: IAddress) => {
  uni.navigateTo({ url: `/pages/address/edit?id=${address.id}` })
}

const deleteAddress = (address: IAddress) => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个收货地址吗？',
    success: (res) => {
      if (res.confirm) {
        // 模拟删除操作
        addresses.value = addresses.value.filter(addr => addr.id !== address.id)
        uni.showToast({ title: '删除成功', icon: 'success' })
      }
    }
  })
}

const setDefaultAddress = (address: IAddress) => {
  // 模拟设置默认地址
  addresses.value = addresses.value.map(addr => ({
    ...addr,
    isDefault: addr.id === address.id
  }))
  uni.showToast({ title: '设置成功', icon: 'success' })
}

onLoad(() => {
  loadAddresses()
})
</script>

<template>
  <view class="bg-gray-50 min-h-screen">
    <!-- 头部导航 -->
    <view class="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <view class="flex items-center">
        <view @click="goBack" class="mr-4">
          <uni-icons type="left" size="20" color="#666" />
        </view>
        <text class="text-lg font-semibold text-gray-800">收货地址</text>
      </view>
      <button 
        class="text-blue-500 text-sm"
        @click="addNewAddress"
      >
        <uni-icons type="plus" size="14" color="#3b82f6" class="mr-1" />
        新增
      </button>
    </view>

    <!-- 地址列表 -->
    <view class="p-4">
      <view v-if="loading" class="text-center py-8">
        <text class="text-gray-500">加载中...</text>
      </view>
      
      <view v-else class="space-y-4">
        <view 
          v-for="address in addresses" 
          :key="address.id"
          class="bg-white border border-gray-200 rounded-lg p-4 relative"
        >
          <!-- 默认标签 -->
          <view v-if="address.isDefault" class="absolute top-4 right-4">
            <text class="text-xs bg-red-500 text-white px-2 py-1 rounded">默认</text>
          </view>
          
          <!-- 地址信息 -->
          <view class="pr-12">
            <view class="flex items-center mb-2">
              <text class="font-medium text-gray-800 mr-2">{{ address.name }}</text>
              <text class="text-sm text-gray-600">{{ address.phone }}</text>
            </view>
            <text class="text-sm text-gray-600 leading-relaxed">{{ address.address }}</text>
          </view>
          
          <!-- 操作按钮 -->
          <view class="flex justify-between items-center mt-4">
            <view>
              <button 
                v-if="!address.isDefault"
                class="text-gray-500 text-sm"
                @click="setDefaultAddress(address)"
              >
                设为默认
              </button>
            </view>
            <view class="flex space-x-4">
              <button 
                class="text-blue-500 text-sm"
                @click="editAddress(address)"
              >
                编辑
              </button>
              <button 
                class="text-gray-500 text-sm"
                @click="deleteAddress(address)"
              >
                删除
              </button>
            </view>
          </view>
        </view>
      </view>

      <view v-if="!loading && addresses.length === 0" class="text-center py-8">
        <text class="text-gray-500">暂无收货地址</text>
        <view class="mt-4">
          <button 
            class="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm"
            @click="addNewAddress"
          >
            添加收货地址
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.space-x-4 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 1rem;
}
</style>