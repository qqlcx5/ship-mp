<script setup lang="ts">
import { ref } from 'vue'
import FgTabbar from '@/tabbar/index.vue'
import { isPageTabbar } from './tabbar/store'
import { currRoute } from './utils'

const isCurrentPageTabbar = ref(true)
onShow(() => {
  console.log('App.ku.vue onShow', currRoute())
  const { path } = currRoute()
  isCurrentPageTabbar.value = isPageTabbar(path)
  console.log(`🚀 - isPageTabbar(path):`, isPageTabbar(path), path)
})

const helloKuRoot = ref('Hello AppKuVue')

const exposeRef = ref('this is form app.Ku.vue')

defineExpose({
  exposeRef,
})
</script>

<template>
  <!-- 这个先隐藏了，知道这样用就行 -->
  <view class="hidden text-center">
    {{ helloKuRoot }}，这里可以配置全局的东西
  </view>
  <sar-toast-agent />
  <sar-dialog-agent />
  <sar-notify-agent />
  <KuRootView />

  <FgTabbar v-if="isCurrentPageTabbar" />
</template>
