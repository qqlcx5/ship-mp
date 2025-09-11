<script lang="ts" setup>
import type { IAddress } from '@/api/shop'

defineOptions({
  name: 'AddressEdit'
})

definePage({
  style: {
    navigationBarTitleText: '编辑地址'
  }
})

const formData = ref({
  name: '',
  phone: '',
  address: '',
  isDefault: false
})

const isEdit = ref(false)
const addressId = ref('')

const goBack = () => {
  uni.navigateBack()
}

const saveAddress = () => {
  if (!formData.value.name.trim()) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return
  }
  
  if (!formData.value.phone.trim()) {
    uni.showToast({ title: '请输入手机号码', icon: 'none' })
    return
  }
  
  if (!formData.value.address.trim()) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return
  }
  
  // 模拟保存操作
  uni.showToast({ 
    title: isEdit.value ? '地址更新成功' : '地址添加成功', 
    icon: 'success' 
  })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}

onLoad((options: any) => {
  if (options.id) {
    isEdit.value = true
    addressId.value = options.id
    
    // 模拟加载地址数据
    formData.value = {
      name: '张三',
      phone: '138****8888',
      address: '北京市朝阳区望京街道科技园区A座1001室',
      isDefault: true
    }
  }
})
</script>

<template>
  <view class="bg-gray-50 min-h-screen">
    <!-- 头部导航 -->
    <view class="flex items-center p-4 bg-white border-b border-gray-100">
      <view @click="goBack" class="mr-4">
        <uni-icons type="left" size="20" color="#666" />
      </view>
      <text class="text-lg font-semibold text-gray-800">
        {{ isEdit ? '编辑地址' : '新增地址' }}
      </text>
    </view>

    <!-- 表单内容 -->
    <view class="p-4">
      <view class="bg-white rounded-lg p-4 space-y-4">
        <!-- 收货人姓名 -->
        <view>
          <text class="text-sm font-medium text-gray-700 block mb-2">收货人姓名</text>
          <input
            v-model="formData.name"
            type="text"
            placeholder="请输入收货人姓名"
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </view>

        <!-- 手机号码 -->
        <view>
          <text class="text-sm font-medium text-gray-700 block mb-2">手机号码</text>
          <input
            v-model="formData.phone"
            type="tel"
            placeholder="请输入手机号码"
            class="w-full p-3 border border-gray-300 rounded-lg"
          />
        </view>

        <!-- 详细地址 -->
        <view>
          <text class="text-sm font-medium text-gray-700 block mb-2">详细地址</text>
          <textarea
            v-model="formData.address"
            placeholder="请输入详细地址"
            class="w-full p-3 border border-gray-300 rounded-lg"
            :style="{ height: '80px' }"
          />
        </view>

        <!-- 设为默认地址 -->
        <view class="flex items-center justify-between py-2">
          <text class="text-sm font-medium text-gray-700">设为默认地址</text>
          <switch
            v-model="formData.isDefault"
            :checked="formData.isDefault"
            color="#3b82f6"
          />
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="mt-6">
        <button
          class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium"
          @click="saveAddress"
        >
          {{ isEdit ? '保存修改' : '添加地址' }}
        </button>
      </view>
    </view>
  </view>
</template>

<style scoped>
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}
</style>