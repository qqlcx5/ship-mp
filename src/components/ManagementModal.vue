<template>
  <view v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <view class="modal-container" @click.stop>
      <view class="modal-header">
        <text class="modal-title">{{ getModalTitle() }}</text>
        <button class="close-btn" @click="handleClose">
          <text class="close-icon">×</text>
        </button>
      </view>
      
      <view class="modal-content">
        <!-- 船只表单 -->
        <view v-if="type === 'ship'" class="form-section">
          <view class="form-item">
            <text class="form-label">船只名称</text>
            <input v-model="formData.name" class="form-input" placeholder="请输入船只名称" />
          </view>
          <view class="form-item">
            <text class="form-label">船只类型</text>
            <input v-model="formData.type" class="form-input" placeholder="请输入船只类型" />
          </view>
          <view class="form-item">
            <text class="form-label">位置信息</text>
            <input v-model="formData.location" class="form-input" placeholder="请输入位置信息" />
          </view>
          <view class="form-item">
            <text class="form-label">电量 (%)</text>
            <input v-model="formData.battery" class="form-input" type="number" placeholder="请输入电量" />
          </view>
          <view class="form-item">
            <text class="form-label">航速 (节)</text>
            <input v-model="formData.speed" class="form-input" type="number" placeholder="请输入航速" />
          </view>
        </view>
        
        <!-- 人员表单 -->
        <view v-if="type === 'personnel'" class="form-section">
          <view class="form-item">
            <text class="form-label">姓名</text>
            <input v-model="formData.name" class="form-input" placeholder="请输入姓名" />
          </view>
          <view class="form-item">
            <text class="form-label">职位</text>
            <input v-model="formData.role" class="form-input" placeholder="请输入职位" />
          </view>
          <view class="form-item">
            <text class="form-label">部门</text>
            <input v-model="formData.department" class="form-input" placeholder="请输入部门" />
          </view>
          <view class="form-item">
            <text class="form-label">电话</text>
            <input v-model="formData.phone" class="form-input" placeholder="请输入电话" />
          </view>
          <view class="form-item">
            <text class="form-label">邮箱</text>
            <input v-model="formData.email" class="form-input" placeholder="请输入邮箱" />
          </view>
        </view>
        
        <!-- 任务表单 -->
        <view v-if="type === 'task'" class="form-section">
          <view class="form-item">
            <text class="form-label">任务标题</text>
            <input v-model="formData.title" class="form-input" placeholder="请输入任务标题" />
          </view>
          <view class="form-item">
            <text class="form-label">任务描述</text>
            <textarea v-model="formData.description" class="form-textarea" placeholder="请输入任务描述" />
          </view>
          <view class="form-item">
            <text class="form-label">负责人</text>
            <input v-model="formData.assignee" class="form-input" placeholder="请输入负责人" />
          </view>
          <view class="form-item">
            <text class="form-label">截止日期</text>
            <picker :value="formData.deadline" mode="date" class="form-picker" @change="handleDateChange">
              <view class="picker-text">{{ formData.deadline || '请选择截止日期' }}</view>
            </picker>
          </view>
          <view class="form-item">
            <text class="form-label">优先级</text>
            <picker :value="formData.priority" :range="priorityOptions" class="form-picker" @change="handlePriorityChange">
              <view class="picker-text">{{ getPriorityText(formData.priority) }}</view>
            </picker>
          </view>
        </view>
      </view>
      
      <view class="modal-footer">
        <button class="btn btn-cancel" @click="handleClose">取消</button>
        <button class="btn btn-confirm" @click="handleSave">保存</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  visible: boolean
  type: 'ship' | 'personnel' | 'task'
  data?: any
}

interface Emits {
  close: []
  save: [data: any]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formData = ref<any>({})
const priorityOptions = ['high', 'medium', 'low']

// 监听数据变化，初始化表单
watch(() => props.data, (newData) => {
  if (newData) {
    formData.value = { ...newData }
  } else {
    resetForm()
  }
}, { immediate: true })

// 重置表单
const resetForm = () => {
  if (props.type === 'ship') {
    formData.value = {
      name: '',
      type: '',
      location: '',
      battery: 100,
      speed: 0,
      status: 'active'
    }
  } else if (props.type === 'personnel') {
    formData.value = {
      name: '',
      role: '',
      department: '',
      phone: '',
      email: '',
      status: 'online'
    }
  } else if (props.type === 'task') {
    formData.value = {
      title: '',
      description: '',
      assignee: '',
      deadline: '',
      priority: 'medium',
      progress: 0,
      status: 'pending'
    }
  }
}

// 获取模态框标题
const getModalTitle = () => {
  const action = props.data?.id ? '编辑' : '添加'
  const typeMap = {
    ship: '船只',
    personnel: '人员',
    task: '任务'
  }
  return `${action}${typeMap[props.type]}`
}

// 获取优先级文本
const getPriorityText = (priority: string) => {
  const map = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[priority] || '中'
}

// 处理遮罩层点击
const handleOverlayClick = () => {
  handleClose()
}

// 处理关闭
const handleClose = () => {
  emit('close')
}

// 处理日期选择变化
const handleDateChange = (e: any) => {
  formData.value.deadline = e.detail.value
}

// 处理优先级选择变化
const handlePriorityChange = (e: any) => {
  const index = e.detail.value
  formData.value.priority = priorityOptions[index]
}

// 处理保存
const handleSave = () => {
  // 简单验证
  if (!formData.value.name && !formData.value.title) {
    uni.showToast({
      title: '请填写必要信息',
      icon: 'none'
    })
    return
  }
  
  emit('save', { ...formData.value })
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  background: rgba(0, 0, 0, 0.9);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  backdrop-filter: blur(20rpx);
  width: 90%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
  background: rgba(79, 209, 199, 0.1);
}

.modal-title {
  color: white;
  font-size: 32rpx;
  font-weight: 600;
}

.close-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  color: white;
  font-size: 32rpx;
  font-weight: bold;
}

.modal-content {
  flex: 1;
  padding: 32rpx;
  overflow-y: auto;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.form-label {
  color: #4fd1c7;
  font-size: 24rpx;
  font-weight: 500;
}

.form-input,
.form-textarea {
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
  color: white;
  font-size: 24rpx;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-color: #4fd1c7;
    background: rgba(79, 209, 199, 0.1);
  }
}

.form-textarea {
  min-height: 120rpx;
  resize: vertical;
}

.form-picker {
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
}

.picker-text {
  color: white;
  font-size: 24rpx;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
  padding: 32rpx;
  border-top: 2rpx solid rgba(255, 255, 255, 0.1);
}

.btn {
  flex: 1;
  height: 80rpx;
  border-radius: 16rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(107, 114, 128, 0.3);
  color: white;
  border: 2rpx solid rgba(107, 114, 128, 0.5);
  
  &:hover {
    background: rgba(107, 114, 128, 0.5);
  }
}

.btn-confirm {
  background: linear-gradient(135deg, #4fd1c7, #10b981);
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
}
</style>