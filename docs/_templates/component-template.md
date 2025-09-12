# 组件文档模板

## 组件概述

**组件名称**: [ComponentName]  
**组件路径**: [src/components/ComponentName/ComponentName.vue]  
**组件类型**: [基础组件/业务组件/布局组件]  
**平台支持**: [H5/小程序/App]  

## 组件描述

[详细描述组件的功能和用途]

## 基础用法

```vue
<!-- @description: 基础使用示例 -->
<!-- @example: 最简单的使用方式 -->

<template>
  <ComponentName 
    :prop1="value1"
    :prop2="value2"
    @event1="handleEvent1"
  >
    默认插槽内容
  </ComponentName>
</template>

<script setup lang="ts">
const value1 = ref('示例值')
const value2 = ref(42)

const handleEvent1 = (data: any) => {
  console.log('事件触发:', data)
}
</script>
```

## Props 属性

| 属性名 | 类型 | 默认值 | 必填 | 说明 | 可选值 |
|--------|------|--------|------|------|--------|
| prop1 | string | '' | 是 | 属性1的描述 | - |
| prop2 | number | 0 | 否 | 属性2的描述 | - |
| prop3 | boolean | false | 否 | 属性3的描述 | true/false |
| prop4 | string | 'default' | 否 | 属性4的描述 | 'option1'/'option2'/'option3' |

### Props 类型定义

```typescript
interface ComponentProps {
  prop1: string           // 必填属性
  prop2?: number         // 可选属性
  prop3?: boolean        // 可选布尔属性
  prop4?: 'option1' | 'option2' | 'option3'  // 枚举属性
}
```

## Events 事件

| 事件名 | 参数 | 说明 | 示例 |
|--------|------|------|------|
| event1 | (data: any) => void | 事件1的描述 | @event1="handleEvent1" |
| event2 | (value: string) => void | 事件2的描述 | @event2="handleEvent2" |

### 事件类型定义

```typescript
interface ComponentEmits {
  event1: [data: any]      // 事件1的参数类型
  event2: [value: string]  // 事件2的参数类型
}
```

## Slots 插槽

| 插槽名 | 说明 | 作用域参数 |
|--------|------|------------|
| default | 默认插槽 | - |
| header | 头部插槽 | { title: string } |
| footer | 底部插槽 | { actions: Action[] } |

### 插槽使用示例

```vue
<template>
  <ComponentName>
    <!-- 默认插槽 -->
    <div>默认内容</div>
    
    <!-- 具名插槽 -->
    <template #header="{ title }">
      <h2>{{ title }}</h2>
    </template>
    
    <template #footer="{ actions }">
      <button 
        v-for="action in actions" 
        :key="action.id"
        @click="action.handler"
      >
        {{ action.label }}
      </button>
    </template>
  </ComponentName>
</template>
```

## 使用示例

### 基础示例

```vue
<!-- @description: 基础功能演示 -->
<!-- @example: 展示组件的基本功能 -->

<template>
  <div class="example-container">
    <ComponentName 
      :prop1="basicValue"
      @event1="handleBasicEvent"
    />
  </div>
</template>

<script setup lang="ts">
const basicValue = ref('基础示例')

const handleBasicEvent = (data: any) => {
  uni.showToast({
    title: `接收到数据: ${data}`,
    icon: 'none'
  })
}
</script>
```

### 高级示例

```vue
<!-- @description: 高级功能演示 -->
<!-- @example: 展示组件的高级用法和配置 -->

<template>
  <div class="advanced-example">
    <ComponentName 
      :prop1="advancedValue"
      :prop2="42"
      :prop3="true"
      prop4="option2"
      @event1="handleAdvancedEvent"
      @event2="handleStringEvent"
    >
      <template #header="{ title }">
        <div class="custom-header">
          <icon name="star" />
          <span>{{ title }}</span>
        </div>
      </template>
      
      <div class="custom-content">
        自定义内容区域
      </div>
      
      <template #footer="{ actions }">
        <div class="custom-footer">
          <button 
            v-for="action in actions"
            :key="action.id"
            :class="['action-btn', action.type]"
            @click="action.handler"
          >
            {{ action.label }}
          </button>
        </div>
      </template>
    </ComponentName>
  </div>
</template>

<script setup lang="ts">
const advancedValue = ref('高级示例')

const handleAdvancedEvent = (data: any) => {
  console.log('高级事件处理:', data)
}

const handleStringEvent = (value: string) => {
  console.log('字符串事件:', value)
}
</script>

<style scoped>
.advanced-example {
  padding: 20rpx;
}

.custom-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.custom-content {
  padding: 20rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
}

.custom-footer {
  display: flex;
  gap: 10rpx;
  justify-content: flex-end;
}

.action-btn {
  padding: 10rpx 20rpx;
  border-radius: 4rpx;
  border: none;
}

.action-btn.primary {
  background-color: #007aff;
  color: white;
}

.action-btn.secondary {
  background-color: #f0f0f0;
  color: #333;
}
</style>
```

## 样式定制

### CSS 变量

```css
/* 组件支持的CSS变量 */
.component-name {
  --component-bg-color: #ffffff;
  --component-text-color: #333333;
  --component-border-color: #e0e0e0;
  --component-border-radius: 8rpx;
  --component-padding: 20rpx;
}
```

### 样式覆盖

```vue
<template>
  <ComponentName class="custom-component" />
</template>

<style scoped>
.custom-component {
  --component-bg-color: #f0f8ff;
  --component-text-color: #2c5aa0;
}

/* 深度选择器覆盖内部样式 */
.custom-component :deep(.internal-class) {
  font-size: 32rpx;
  font-weight: bold;
}
</style>
```

## 注意事项

### 使用注意事项
- 注意事项1
- 注意事项2
- 注意事项3

### 平台差异

| 平台 | 支持情况 | 注意事项 |
|------|----------|----------|
| H5 | ✅ 完全支持 | 无特殊限制 |
| 微信小程序 | ✅ 完全支持 | 需要注意XXX |
| App | ⚠️ 部分支持 | 不支持XXX功能 |

### 性能建议
- 性能优化建议1
- 性能优化建议2
- 性能优化建议3

## 相关组件

- [相关组件1](./related-component-1.md)
- [相关组件2](./related-component-2.md)

## 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.0.0 | 2025-01-12 | 初始版本 |

---

*组件版本: v1.0.0 | 最后更新: [YYYY-MM-DD]*