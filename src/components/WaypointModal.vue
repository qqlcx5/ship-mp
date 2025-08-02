<template>
  <view class="modal-overlay" @click="handleOverlayClick">
    <view class="modal-content" @click.stop>
      <!-- 标题栏 -->
      <view class="modal-header">
        <text class="modal-title">航点设置</text>
        <button class="close-btn" @click="$emit('close')">
          <text class="close-icon">✕</text>
        </button>
      </view>
      
      <!-- 表单内容 -->
      <view class="form-content">
        <!-- 航点名称 -->
        <view class="form-group">
          <text class="form-label">航点名称</text>
          <input 
            class="form-input"
            v-model="formData.name"
            placeholder="请输入航点名称"
            maxlength="20"
          />
        </view>
        
        <!-- 坐标信息 -->
        <view class="form-group">
          <text class="form-label">坐标位置</text>
          <view class="coordinate-inputs">
            <view class="coordinate-item">
              <text class="coordinate-label">纬度</text>
              <input 
                class="coordinate-input"
                v-model="formData.lat"
                type="digit"
                placeholder="26.0614"
              />
            </view>
            <view class="coordinate-item">
              <text class="coordinate-label">经度</text>
              <input 
                class="coordinate-input"
                v-model="formData.lng"
                type="digit"
                placeholder="119.3061"
              />
            </view>
          </view>
        </view>
        
        <!-- 航行速度 -->
        <view class="form-group">
          <text class="form-label">航行速度 (节)</text>
          <view class="slider-group">
            <slider 
              class="speed-slider"
              :value="formData.speed"
              :min="1"
              :max="15"
              :step="0.5"
              @change="handleSpeedChange"
              activeColor="#4FD1C7"
              backgroundColor="rgba(255,255,255,0.2)"
            />
            <text class="slider-value">{{ formData.speed }} 节</text>
          </view>
        </view>
        
        <!-- 等待时间 -->
        <view class="form-group">
          <text class="form-label">等待时间 (秒)</text>
          <view class="time-buttons">
            <button 
              v-for="time in waitTimeOptions"
              :key="time"
              class="time-btn"
              :class="{ active: formData.waitTime === time }"
              @click="formData.waitTime = time"
            >
              {{ time === 0 ? '无' : `${time}s` }}
            </button>
          </view>
          <view class="custom-time" v-if="showCustomTime">
            <input 
              class="time-input"
              v-model="customWaitTime"
              type="number"
              placeholder="自定义时间"
              @blur="handleCustomTimeBlur"
            />
          </view>
          <button class="custom-btn" @click="toggleCustomTime">
            {{ showCustomTime ? '取消自定义' : '自定义时间' }}
          </button>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="action-buttons">
        <button class="action-btn cancel" @click="$emit('close')">
          取消
        </button>
        <button class="action-btn save" @click="handleSave">
          保存
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface Waypoint {
  id: string
  lat: number
  lng: number
  name: string
  speed: number
  waitTime: number
}

interface Props {
  waypoint: Waypoint | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  save: [waypoint: Waypoint]
  close: []
}>()

const showCustomTime = ref(false)
const customWaitTime = ref('')

const waitTimeOptions = [0, 60, 300, 600, 900, 1800]

const formData = reactive({
  id: '',
  name: '',
  lat: 0,
  lng: 0,
  speed: 6,
  waitTime: 300
})

// 监听waypoint变化，更新表单数据
watch(() => props.waypoint, (newWaypoint) => {
  if (newWaypoint) {
    formData.id = newWaypoint.id
    formData.name = newWaypoint.name
    formData.lat = newWaypoint.lat
    formData.lng = newWaypoint.lng
    formData.speed = newWaypoint.speed
    formData.waitTime = newWaypoint.waitTime
  }
}, { immediate: true })

const handleOverlayClick = () => {
  emit('close')
}

const handleSpeedChange = (e: any) => {
  formData.speed = e.detail.value
}

const toggleCustomTime = () => {
  showCustomTime.value = !showCustomTime.value
  if (!showCustomTime.value) {
    customWaitTime.value = ''
  }
}

const handleCustomTimeBlur = () => {
  const time = parseInt(customWaitTime.value)
  if (!isNaN(time) && time >= 0) {
    formData.waitTime = time
  }
}

const handleSave = () => {
  // 验证表单数据
  if (!formData.name.trim()) {
    uni.showToast({
      title: '请输入航点名称',
      icon: 'none'
    })
    return
  }
  
  if (formData.lat < -90 || formData.lat > 90) {
    uni.showToast({
      title: '纬度范围应在-90到90之间',
      icon: 'none'
    })
    return
  }
  
  if (formData.lng < -180 || formData.lng > 180) {
    uni.showToast({
      title: '经度范围应在-180到180之间',
      icon: 'none'
    })
    return
  }
  
  // 发送保存事件
  emit('save', {
    id: formData.id || Date.now().toString(),
    name: formData.name.trim(),
    lat: Number(formData.lat),
    lng: Number(formData.lng),
    speed: formData.speed,
    waitTime: formData.waitTime
  })
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10rpx);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
}

.modal-content {
  background: rgba(0, 0, 0, 0.9);
  border: 2rpx solid rgba(79, 209, 199, 0.5);
  border-radius: 24rpx;
  padding: 48rpx;
  max-width: 640rpx;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
  
  .modal-title {
    color: white;
    font-size: 36rpx;
    font-weight: bold;
  }
  
  .close-btn {
    width: 64rpx;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .close-icon {
      color: white;
      font-size: 24rpx;
    }
  }
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.form-group {
  .form-label {
    color: #4FD1C7;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .form-input {
    width: 100%;
    height: 80rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 12rpx;
    padding: 0 24rpx;
    color: white;
    font-size: 28rpx;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:focus {
      border-color: #4FD1C7;
      background: rgba(79, 209, 199, 0.1);
    }
  }
}

.coordinate-inputs {
  display: flex;
  gap: 24rpx;
}

.coordinate-item {
  flex: 1;
  
  .coordinate-label {
    color: rgba(255, 255, 255, 0.7);
    font-size: 24rpx;
    margin-bottom: 8rpx;
    display: block;
  }
  
  .coordinate-input {
    width: 100%;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 8rpx;
    padding: 0 16rpx;
    color: white;
    font-size: 24rpx;
    
    &:focus {
      border-color: #4FD1C7;
    }
  }
}

.slider-group {
  display: flex;
  align-items: center;
  gap: 24rpx;
  
  .speed-slider {
    flex: 1;
  }
  
  .slider-value {
    color: #4FD1C7;
    font-size: 28rpx;
    font-weight: 600;
    min-width: 120rpx;
    text-align: right;
  }
}

.time-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.time-btn {
  height: 64rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.2);
  border-radius: 8rpx;
  color: white;
  font-size: 24rpx;
  transition: all 0.3s ease;
  
  &.active {
    background: rgba(79, 209, 199, 0.3);
    border-color: #4FD1C7;
    color: #4FD1C7;
  }
  
  &:hover {
    background: rgba(79, 209, 199, 0.2);
  }
}

.custom-time {
  margin-bottom: 16rpx;
  
  .time-input {
    width: 100%;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    border-radius: 8rpx;
    padding: 0 16rpx;
    color: white;
    font-size: 24rpx;
    
    &:focus {
      border-color: #4FD1C7;
    }
  }
}

.custom-btn {
  width: 100%;
  height: 64rpx;
  background: rgba(79, 209, 199, 0.2);
  border: 2rpx solid rgba(79, 209, 199, 0.5);
  border-radius: 8rpx;
  color: #4FD1C7;
  font-size: 24rpx;
  
  &:hover {
    background: rgba(79, 209, 199, 0.3);
  }
}

.action-buttons {
  display: flex;
  gap: 24rpx;
  margin-top: 32rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &.cancel {
    background: rgba(255, 255, 255, 0.1);
    border: 2rpx solid rgba(255, 255, 255, 0.2);
    color: white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  &.save {
    background: linear-gradient(to right, #4FD1C7, #60A5FA);
    color: white;
    
    &:hover {
      background: linear-gradient(to right, #2DD4BF, #3B82F6);
      transform: translateY(-2rpx);
    }
  }
}

/* 横屏适配 */
@media (orientation: landscape) {
  .modal-content {
    max-width: 800rpx;
    padding: 32rpx;
  }
  
  .coordinate-inputs {
    gap: 16rpx;
  }
  
  .time-buttons {
    grid-template-columns: repeat(6, 1fr);
    gap: 12rpx;
  }
}

/* 竖屏适配 */
@media (orientation: portrait) {
  .modal-content {
    max-height: 90vh;
  }
  
  .coordinate-inputs {
    flex-direction: column;
    gap: 16rpx;
  }
  
  .time-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
