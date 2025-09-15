<script lang="ts" setup>
import type { IAddressEditParams } from '@/api/types/address'
import { addAddressAPI, editAddressAPI } from '@/api/address'
import RegionPicker from '@/components/RegionPicker.vue'
import { useTokenStore } from '@/store/token'

// 页面参数
const addressId = ref<number>(0)

definePage({
  style: {
    navigationBarTitleText: '编辑地址',
  },
})

// 初始化token
const tokenStore = useTokenStore()
tokenStore.setFixedToken()

// 表单数据
const formData = reactive<IAddressEditParams>({
  real_name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  post_code: '',
  is_default: 0,
  province_id: 0,
  city_id: 0,
  district_id: 0,
})

// 这些代码已经不需要了，因为我们使用了新的RegionPicker组件

// 页面状态
const loading = ref(false)
const isEdit = ref(false)

// 省市区选择器的值
const regionValue = ref({
  province: '',
  city: '',
  district: '',
  provinceId: 0,
  cityId: 0,
  districtId: 0,
})

// 页面加载时获取数据
onLoad((options) => {
  if (options?.id) {
    addressId.value = Number(options.id)
    isEdit.value = true
    // 这里可以根据需要加载地址详情
  }
})

// 省市区选择变化
function onRegionChange(value: any) {
  formData.province = value.province
  formData.city = value.city
  formData.district = value.district
  formData.province_id = value.provinceId
  formData.city_id = value.cityId
  formData.district_id = value.districtId

  // 同步更新regionValue
  regionValue.value = value
}

// 表单验证
function validateForm(): boolean {
  if (!formData.real_name.trim()) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return false
  }

  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return false
  }

  if (!formData.province.trim() || !formData.city.trim() || !formData.district.trim()) {
    uni.showToast({ title: '请选择省市区', icon: 'none' })
    return false
  }

  if (!formData.detail.trim() || formData.detail.trim().length < 5) {
    uni.showToast({ title: '请输入详细地址，至少5个字符', icon: 'none' })
    return false
  }

  return true
}

// 保存地址
async function saveAddress() {
  if (!validateForm())
    return

  try {
    loading.value = true

    if (isEdit.value && addressId.value) {
      // 更新地址
      const res = await editAddressAPI({ ...formData, id: addressId.value })
      if (res.data.status === 200) {
        uni.showToast({
          title: '地址更新成功',
          icon: 'success',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
      else {
        throw new Error(res.data.msg || '更新失败')
      }
    }
    else {
      // 创建地址
      const res = await addAddressAPI(formData)
      if (res.data.status === 200) {
        uni.showToast({
          title: '地址添加成功',
          icon: 'success',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
      else {
        throw new Error(res.data.msg || '添加失败')
      }
    }
  }
  catch (error: any) {
    console.error('保存地址失败:', error)
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none',
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 表单内容 -->
    <view class="bg-white">
      <!-- 收货人信息 -->
      <view class="border-b border-gray-100 px-4 py-3">
        <view class="mb-3 flex items-center">
          <text class="w-20 text-sm text-gray-600">收货人</text>
          <input
            v-model="formData.real_name"
            class="ml-4 flex-1 text-sm text-gray-800"
            placeholder="请输入收货人姓名"
            :maxlength="10"
          >
        </view>
      </view>

      <!-- 手机号码 -->
      <view class="border-b border-gray-100 px-4 py-3">
        <view class="flex items-center">
          <text class="w-20 text-sm text-gray-600">手机号码</text>
          <input
            v-model="formData.phone"
            class="ml-4 flex-1 text-sm text-gray-800"
            placeholder="请输入手机号码"
            type="number"
            :maxlength="11"
          >
        </view>
      </view>

      <!-- 省市区选择 -->
      <view class="border-b border-gray-100 px-4 py-3">
        <view class="flex items-center">
          <text class="w-20 text-sm text-gray-600">省市区</text>
          <view class="ml-4 flex-1">
            <RegionPicker
              v-model="regionValue"
              placeholder="请选择省市区"
              @change="onRegionChange"
            />
          </view>
        </view>
      </view>

      <!-- 详细地址 -->
      <view class="border-b border-gray-100 px-4 py-3">
        <view class="flex items-start">
          <text class="mt-1 w-20 text-sm text-gray-600">详细地址</text>
          <textarea
            v-model="formData.detail"
            class="ml-4 min-h-20 flex-1 text-sm text-gray-800"
            placeholder="请输入详细地址，如街道、楼栋号、门牌号等"
            :maxlength="100"
            auto-height
          />
        </view>
      </view>

      <!-- 邮编 -->
      <view class="border-b border-gray-100 px-4 py-3">
        <view class="flex items-center">
          <text class="w-20 text-sm text-gray-600">邮编</text>
          <input
            v-model="formData.post_code"
            class="ml-4 flex-1 text-sm text-gray-800"
            placeholder="请输入邮编（可选）"
            type="number"
            :maxlength="6"
          >
        </view>
      </view>

      <!-- 设为默认地址 -->
      <view class="px-4 py-3">
        <view class="flex items-center justify-between">
          <text class="text-sm text-gray-600">设为默认地址</text>
          <wd-switch v-model="formData.is_default" />
        </view>
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4">
      <wd-button
        type="primary"
        block
        :loading="loading"
        @click="saveAddress"
      >
        {{ isEdit ? '更新地址' : '保存地址' }}
      </wd-button>
    </view>
  </view>
</template>

<style scoped>
.min-h-20 {
  min-height: 80rpx;
}
</style>
