<template>
  <div class="margin-20px relative inline-block h-812px w-375px overflow-hidden border-8 border-[#1a1a1a] rounded-36px bg-white align-top shadow-xl">
    <div class="h-full w-full flex flex-col items-center justify-center from-[#667eea] to-[#764ba2] bg-gradient-to-br p-8">
      <div class="mb-12 text-center">
        <div class="mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-full bg-white">
          <svg class="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
            />
          </svg>
        </div>
        <h1 class="mb-2 text-3xl text-white font-bold">
          船舶监控
        </h1>
        <p class="text-white text-opacity-80">
          智能海域管理系统
        </p>
      </div>

      <div class="w-full space-y-4">
        <div class="border border-white/20 rounded-2xl bg-white/10 p-4 backdrop-blur-20px">
          <input
            type="text"
            placeholder="用户名"
            class="w-full bg-transparent text-lg text-white outline-none placeholder-white placeholder-opacity-70"
          >
        </div>

        <div class="border border-white/20 rounded-2xl bg-white/10 p-4 backdrop-blur-20px">
          <input
            type="password"
            placeholder="密码"
            class="w-full bg-transparent text-lg text-white outline-none placeholder-white placeholder-opacity-70"
          >
        </div>

        <div class="flex items-center justify-between pt-2">
          <label class="flex items-center text-white text-opacity-80">
            <input type="checkbox" class="mr-2 rounded">
            记住密码
          </label>
          <a href="#" class="text-white text-opacity-80 underline">忘记密码</a>
        </div>

        <button
          class="mt-8 w-full rounded-2xl bg-white py-4 text-blue-600 font-semibold transition-all hover:bg-opacity-90"
        >
          登录
        </button>

        <div class="mt-8 flex space-x-4">
          <div class="h-2 w-2 rounded-full bg-white bg-opacity-50" />
          <div class="h-2 w-8 rounded-full bg-white" />
          <div class="h-2 w-2 rounded-full bg-white bg-opacity-50" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Login page logic here
</script>

<style scoped>
/* Scoped styles for Login page */
</style>
