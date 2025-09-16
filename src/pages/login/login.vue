<script lang="ts" setup>
import { useTokenStore } from '@/store/token'
import { useUserStore } from '@/store/user'
import { tabbarList } from '@/tabbar/config'
import { isPageTabbar } from '@/tabbar/store'
import { ensureDecodeURIComponent } from '@/utils'
import { parseUrlToObj } from '@/utils/index'

definePage({
  style: {
    navigationBarTitleText: '登录',
  },
})

const redirectUrl = ref('')
onLoad((options) => {
  console.log('login options: ', options)
  if (options.redirect) {
    redirectUrl.value = ensureDecodeURIComponent(options.redirect)
  }
  else {
    redirectUrl.value = tabbarList[0].pagePath
  }
  console.log('redirectUrl.value: ', redirectUrl.value)
})

const userStore = useUserStore()
const tokenStore = useTokenStore()
async function doLogin() {
  if (tokenStore.hasLogin) {
    uni.navigateBack()
    return
  }
  try {
    // 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口（各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
    // 1/2 调用接口回来后设置token信息
    // 这里用单token来模拟
    tokenStore.setTokenInfo({
      token: '123456',
      expiresIn: 60 * 60 * 24 * 7,
    })

    // 2/2 调用接口回来后设置用户信息
    // const res = await login({
    //   username: '菲鸽',
    //   password: '123456',
    // })
    // console.log('接口拿到的登录信息：', res)
    userStore.setUserInfo({
      userId: 123456,
      username: 'abc123456',
      nickname: '菲鸽',
      avatar: 'https://oss.laf.run/ukw0y1-site/avatar.jpg',
    })

    console.log(redirectUrl.value)
  }
  catch (error) {
    console.log('登录失败', error)
  }
  let path = redirectUrl.value
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  const { path: _path, query } = parseUrlToObj(path)
  console.log('_path:', _path, 'query:', query, 'path:', path)
  console.log('isPageTabbar(_path):', isPageTabbar(_path))
  if (isPageTabbar(_path)) {
    // 经过我的测试 switchTab 不能带 query 参数, 不管是放到 url  还是放到 query ,
    // 最后跳转过去的时候都会丢失 query 信息
    uni.switchTab({
      url: path,
    })
    // uni.switchTab({
    //   url: _path,
    //   query,
    // })
  }
  else {
    console.log('redirectTo:', path)
    uni.redirectTo({
      url: path,
    })
  }
}
</script>

<template>
  <view class="login mt-10 flex items-center justify-center from-gray-50 to-white bg-gradient-to-b">
    <!-- 卡片 -->
    <view class="max-w-md w-3/5 rounded-2xl bg-white p-8 shadow-lg">
      <!-- 头像占位 -->
      <view class="mx-auto mb-6 h-18 w-18 flex items-center justify-center rounded-full from-blue-400 to-indigo-500 bg-gradient-to-r">
        <text class="i-carbon-user text-3xl text-white" />
      </view>

      <view class="mb-2 text-center text-lg text-gray-700 font-semibold">
        欢迎回来
      </view>
      <view class="mb-8 text-center text-sm text-gray-400">
        登录后可同步您的数据
      </view>

      <!-- 登录按钮 -->
      <button
        class="h-12 w-full rounded-full from-blue-500 to-indigo-600 bg-gradient-to-r text-white font-medium shadow-md transition-transform active:scale-95"
        @click="doLogin"
      >
        一键登录
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
//
</style>
