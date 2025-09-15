<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { IAddress } from '@/api/types/address'
import {
  getAddressListAPI,
  deleteAddressAPI,
  setDefaultAddressAPI
} from '@/api/address'

definePage({
  style: {
    navigationBarTitleText: '收货地址',
  },
})

// 地址列表数据
const addressList = ref<IAddress[]>([])
const loading = ref(false)

// 页面初始化
onMounted(() => {
  loadAddressList()
})

// 加载地址列表
async function loadAddressList() {
  try {
    loading.value = true
    const res = await getAddressListAPI()
    if (res.code === 200) {
      addressList.value = res.data.list || []
    } else {
      throw new Error(res.msg || '获取地址列表失败')
    }
  } catch (error: any) {
    console.error('加载地址列表失败:', error)
    uni.showToast({
      title: error.message || '加载失败',
      icon: 'none'
    })
    // 如果API调用失败，使用模拟数据作为后备
    addressList.value = [
      {
        id: 1,
        name: '张三',
        phone: '138****8888',
        province: '北京市',
        city: '北京市',
        district: '朝阳区',
        detail: '望京街道科技园区A座1001室',
        address: '北京市朝阳区望京街道科技园区A座1001室',
        isDefault: true
      },
      {
        id: 2,
        name: '李四',
        phone: '139****9999',
        province: '上海市',
        city: '上海市',
        district: '浦东新区',
        detail: '陆家嘴金融中心B座2002室',
        address: '上海市浦东新区陆家嘴金融中心B座2002室',
        isDefault: false
      }
    ]
  } finally {
    loading.value = false
  }
}

// 新增地址
function addAddress() {
  uni.navigateTo({ url: '/pages/address/form' })
}

// 编辑地址
function editAddress(id: number) {
  uni.navigateTo({ url: `/pages/address/form?id=${id}` })
}

// 删除地址
async function deleteAddress(id: number) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个地址吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const apiRes = await deleteAddressAPI(id)
          if (apiRes.code === 200) {
            uni.showToast({ title: '删除成功', icon: 'success' })
            // 重新加载列表
            await loadAddressList()
          } else {
            throw new Error(apiRes.msg || '删除失败')
          }
        } catch (error: any) {
          console.error('删除地址失败:', error)
          uni.showToast({
            title: error.message || '删除失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 设为默认地址
async function setDefaultAddress(id: number) {
  try {
    const res = await setDefaultAddressAPI(id)
    if (res.code === 200) {
      uni.showToast({ title: '设置成功', icon: 'success' })
      // 重新加载列表
      await loadAddressList()
    } else {
      throw new Error(res.msg || '设置失败')
    }
  } catch (error: any) {
    console.error('设置默认地址失败:', error)
    uni.showToast({
      title: error.message || '设置失败',
      icon: 'none'
    })
  }
}
</script>

<template>
  <view class="min-h-screen bg-gray-50">
    <!-- 头部操作栏 -->
    <view class="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <text class="text-lg font-semibold text-gray-800">收货地址</text>
      <wd-button size="small" type="primary" @click="addAddress">
        <uni-icons type="plus" color="white" size="14" class="mr-1" />
        新增
      </wd-button>
    </view>

    <!-- 地址列表 -->
    <view class="space-y-4 p-4">
      <!-- 加载状态 -->
      <view v-if="loading" class="text-center py-20">
        <wd-loading type="spinner" />
        <text class="block mt-4 text-gray-500">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="addressList.length === 0" class="text-center py-20">
        <uni-icons type="location" color="#d1d5db" size="48" />
        <text class="block mt-4 text-gray-500">暂无地址</text>
        <wd-button type="primary" class="mt-4" @click="addAddress">
          添加地址
        </wd-button>
      </view>

      <view
        v-for="address in addressList"
        :key="address.id"
        class="bg-white border border-gray-200 rounded-lg p-4 relative"
      >
        <!-- 默认标签 -->
        <view v-if="address.isDefault" class="absolute top-4 right-4">
          <text class="text-xs bg-red-500 text-white px-2 py-1 rounded">默认</text>
        </view>

        <!-- 地址信息 -->
        <view :class="address.isDefault ? 'pr-12' : ''">
          <view class="flex items-center mb-2">
            <text class="font-medium text-gray-800 mr-2">{{ address.name }}</text>
            <text class="text-sm text-gray-600">{{ address.phone }}</text>
          </view>
          <text class="text-sm text-gray-600 leading-relaxed">{{ address.address }}</text>
        </view>

        <!-- 操作按钮 -->
        <view class="flex justify-between items-center mt-4">
          <wd-button
            v-if="!address.isDefault"
            size="small"
            type="default"
            @click="setDefaultAddress(address.id)"
          >
            设为默认
          </wd-button>
          <view v-else></view>

          <view class="space-x-2">
            <wd-button size="small" type="primary" @click="editAddress(address.id)">
              编辑
            </wd-button>
            <wd-button size="small" type="error" @click="deleteAddress(address.id)">
              删除
            </wd-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
