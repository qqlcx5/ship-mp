<template>
  <picker
    mode="multiSelector"
    :range="pickerRange"
    range-key="n"
    :value="pickerValue"
    class="region-picker"
    @columnchange="handleColumnChange"
    @change="handleChange"
  >
    <view class="picker-content">
      <text class="picker-text" :class="{ placeholder: !hasSelected }">
        {{ displayText }}
      </text>
      <uni-icons type="right" color="#9ca3af" size="14" />
    </view>
  </picker>
</template>

<script setup lang="ts">
import type { RegionItem } from '@/api/types/address'
import { getCityListAPI } from '@/api/address'
import useRequest from '@/hooks/useRequest'

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择省市区',
  disabled: false,
})

const emit = defineEmits<Emits>()

interface Props {
  modelValue?: {
    province?: string
    city?: string
    district?: string
    provinceId?: number
    cityId?: number
    districtId?: number
  }
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: {
    province: string
    city: string
    district: string
    provinceId: number
    cityId: number
    districtId: number
  }): void
  (e: 'change', value: {
    province: string
    city: string
    district: string
    provinceId: number
    cityId: number
    districtId: number
  }): void
}

// 选择器数据
const pickerRange = ref<RegionItem[][]>([])
const pickerValue = ref<number[]>([0, 0, 0])

// 当前选中的数据
const selectedData = ref({
  province: '',
  city: '',
  district: '',
  provinceId: 0,
  cityId: 0,
  districtId: 0,
})

// 是否已选择
const hasSelected = computed(() => {
  return selectedData.value.province && selectedData.value.city && selectedData.value.district
})

// 显示文本
const displayText = computed(() => {
  if (hasSelected.value) {
    return `${selectedData.value.province} ${selectedData.value.city} ${selectedData.value.district}`
  }
  return props.placeholder
})

// 初始化数据
const { loading: cityLoading, data: cityData, run: loadCityList } = useRequest(() => getCityListAPI())

const newRegionData = computed(() => {
  return cityData.value || []
})

function initPickerData() {
  if (!newRegionData.value.length)
    return

  // 初始化省份数据
  pickerRange.value[0] = newRegionData.value

  // 初始化城市数据（默认选择第一个省份的城市）
  if (newRegionData.value[0]?.c) {
    pickerRange.value[1] = newRegionData.value[0].c
  }

  // 初始化区县数据（默认选择第一个城市的区县）
  if (newRegionData.value[0]?.c?.[0]?.c) {
    pickerRange.value[2] = newRegionData.value[0].c[0].c
  }

  // 设置默认选中值
  updateSelectedData()
}

// 更新选中数据
function updateSelectedData() {
  const [provinceIndex, cityIndex, districtIndex] = pickerValue.value

  const province = pickerRange.value[0]?.[provinceIndex]
  const city = pickerRange.value[1]?.[cityIndex]
  const district = pickerRange.value[2]?.[districtIndex]

  if (province && city && district) {
    selectedData.value = {
      province: province.n,
      city: city.n,
      district: district.n,
      provinceId: province.v,
      cityId: city.v,
      districtId: district.v,
    }
  }
}

// 处理列变化
function handleColumnChange(e: any) {
  const { column, value } = e.detail
  const newPickerValue = [...pickerValue.value]
  newPickerValue[column] = value

  switch (column) {
    case 0: // 省份变化
      {
        const selectedProvince = pickerRange.value[0][value]
        if (selectedProvince?.c) {
          pickerRange.value[1] = selectedProvince.c
          // 重置城市和区县的选择
          newPickerValue[1] = 0
          newPickerValue[2] = 0

          // 更新区县数据
          if (selectedProvince.c[0]?.c) {
            pickerRange.value[2] = selectedProvince.c[0].c
          }
        }
      }
      break
    case 1: // 城市变化
      {
        const selectedCity = pickerRange.value[1][value]
        if (selectedCity?.c) {
          pickerRange.value[2] = selectedCity.c
          // 重置区县的选择
          newPickerValue[2] = 0
        }
      }
      break
  }

  pickerValue.value = newPickerValue
  updateSelectedData()
}

// 处理确认选择
function handleChange(e: any) {
  pickerValue.value = e.detail.value
  updateSelectedData()

  const result = {
    province: selectedData.value.province,
    city: selectedData.value.city,
    district: selectedData.value.district,
    provinceId: selectedData.value.provinceId,
    cityId: selectedData.value.cityId,
    districtId: selectedData.value.districtId,
  }

  emit('update:modelValue', result)
  emit('change', result)
}

// 从外部值设置选择器状态
function setValueFromProps() {
  if (!props.modelValue)
    return

  const { province, city, district } = props.modelValue
  if (!province || !city || !district)
    return

  // 查找对应的索引
  const provinceIndex = pickerRange.value[0]?.findIndex(p => p.n === province) ?? 0
  const cityIndex = pickerRange.value[1]?.findIndex(c => c.n === city) ?? 0
  const districtIndex = pickerRange.value[2]?.findIndex(d => d.n === district) ?? 0

  pickerValue.value = [provinceIndex, cityIndex, districtIndex]
  selectedData.value = {
    province,
    city,
    district,
    provinceId: props.modelValue.provinceId ?? 0,
    cityId: props.modelValue.cityId ?? 0,
    districtId: props.modelValue.districtId ?? 0,
  }
}

// 监听外部值变化
watch(() => props.modelValue, () => {
  setValueFromProps()
}, { immediate: true })

// 组件挂载时初始化
onMounted(async () => {
  await loadCityList()
  initPickerData()
  setValueFromProps()
})
</script>

<style scoped>
.region-picker {
  width: 100%;
}

.picker-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44rpx;
}

.picker-text {
  flex: 1;
  font-size: 28rpx;
  color: #1f2937;
}

.picker-text.placeholder {
  color: #9ca3af;
}
</style>
