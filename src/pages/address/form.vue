<script lang="ts" setup>
import type { IAddressParams } from '@/api/types/address'
import { onMounted, reactive, ref } from 'vue'
import { createAddressAPI, getAddressDetailAPI, updateAddressAPI } from '@/api/address'

// 页面参数
const query = defineProps<{
  id?: string
}>()

definePage({
  style: {
    navigationBarTitleText: '编辑地址',
  },
})

// 表单数据
const formData = reactive<IAddressParams>({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  province: [
    { required: true, message: '请输入省份', trigger: 'blur' },
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' },
  ],
  district: [
    { required: true, message: '请输入区县', trigger: 'blur' },
  ],
  detail: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 100, message: '详细地址长度在 5 到 100 个字符', trigger: 'blur' },
  ],
}

// 页面状态
const loading = ref(false)
const isEdit = ref(false)

// 初始化页面
onMounted(async () => {
  if (query.id) {
    isEdit.value = true
    await loadAddressDetail()
  }
})

// 加载地址详情
async function loadAddressDetail() {
  if (!query.id)
    return

  try {
    loading.value = true
    const res = await getAddressDetailAPI(Number(query.id))
    if (res.code === 200) {
      const address = res.data.data
      Object.assign(formData, {
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        detail: address.detail,
        isDefault: address.isDefault,
      })
    }
  }
  catch (error) {
    console.error('加载地址详情失败:', error)
    uni.showToast({
      title: '加载地址信息失败',
      icon: 'none',
    })
  }
  finally {
    loading.value = false
  }
}


// 表单验证
function validateForm(): boolean {
  if (!formData.name.trim()) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return false
  }

  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return false
  }

  if (!formData.province.trim() || !formData.city.trim() || !formData.district.trim()) {
    uni.showToast({ title: '请输入完整的省市区信息', icon: 'none' })
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

    if (isEdit.value && query.id) {
      // 更新地址
      const res = await updateAddressAPI(Number(query.id), formData)
      if (res.code === 200) {
        uni.showToast({
          title: '地址更新成功',
          icon: 'success',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
      else {
        throw new Error(res.msg || '更新失败')
      }
    }
    else {
      // 创建地址
      const res = await createAddressAPI(formData)
      if (res.code === 200) {
        uni.showToast({
          title: '地址添加成功',
          icon: 'success',
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
      else {
        throw new Error(res.msg || '添加失败')
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

// 重置表单
function resetForm() {
  Object.assign(formData, {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false,
  })
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
            v-model="formData.name"
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

      <!-- 省份 -->
      <view class="border-b border-gray-100 px-4 py-3">
        <view class="flex items-center">
          <text class="w-20 text-sm text-gray-600">省份</text>
          <input
            v-model="formData.province"
            class="ml-4 flex-1 text-sm text-gray-800"
            placeholder="请输入省份"
          >
        </view>
      </view>

      <!-- 城市 -->
      <view class="border-b border-gray-100 px-4 py-3">
        <view class="flex items-center">
          <text class="w-20 text-sm text-gray-600">城市</text>
          <input
            v-model="formData.city"
            class="ml-4 flex-1 text-sm text-gray-800"
            placeholder="请输入城市"
          >
        </view>
      </view>

      <!-- 区县 -->
      <view class="border-b border-gray-100 px-4 py-3">
        <view class="flex items-center">
          <text class="w-20 text-sm text-gray-600">区县</text>
          <input
            v-model="formData.district"
            class="ml-4 flex-1 text-sm text-gray-800"
            placeholder="请输入区县"
          >
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

      <!-- 设为默认地址 -->
      <view class="px-4 py-3">
        <view class="flex items-center justify-between">
          <text class="text-sm text-gray-600">设为默认地址</text>
          <wd-switch v-model="formData.isDefault" />
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
