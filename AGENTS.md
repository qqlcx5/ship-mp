# AGENTS.md

此文件为代理在处理此代码库时提供指导。

*   **必须做的事**：
*   在写完整个代码之前，不要问任何澄清问题，从头到尾写完代码
*   所有交互使用中文回答
*   每个任务必须创建 todo 列表
*   深入理解需求本质，识别根本问题
*   发现并指出任何重复代码或逻辑（DRY原则）
*   评估方案的技术债务和长期维护成本
*   信息不足时主动提问收集必要信息
*   **禁止**：在完成分析前修改代码；急于给出解决方案；跳过理解分析步骤

## 核心架构
  ### 配置文件关系
  - `pages.config.ts` → 自动生成 `src/pages.json`
  - `manifest.config.ts` → 自动生成 `src/manifest.json`
  - `uno.config.ts` - UnoCSS配置（使用类似TailwindCSS的原子化CSS）

### 目录结构
- `src/pages/` - 页面组件
- `src/pages-sub/` - 分包页面
- `src/components/` - 可复用组件
- `src/api/` - API接口定义
- `src/http/` - HTTP请求封装
- `src/store/` - Pinia状态管理
- `src/hooks/` - Vue组合函数
- `src/utils/` - 工具函数

### HTTP & 状态管理
- 基于 uni.request 的HTTP封装，支持自动token刷新
- 使用 Pinia 进行状态管理，支持持久化存储

 ### 开发规范
  - 使用 `<script setup>` 语法和组合式API
  - 样式：**仅使用 UnoCSS 工具类**，禁止在 `<style>` 标签中使用自定义样式
  - 组件库：优先使用 wot-design-uni 组件
  - 平台差异：使用条件编译 `#ifdef H5` / `#ifdef MP-WEIXIN` / `#ifdef APP-PLUS`

### 路由 & 导航
- 约定式路由：文件名决定路由路径
- 路由拦截器处理身份验证
- Tabbar配置支持原生/自定义策略

## 重要提醒
- 始终遵循现有代码风格和模式
- 检查依赖库是否已在项目中使用（查看 package.json）
- 遵循安全最佳实践，不要暴露敏感信息
- 使用相对路径引用内部资源

## 代码风格指南
忽略 读取 编辑 `src/service/**`目录中的文件
*   **Vue SFC 块顺序:** `<script>`, `<template>`, 然后 `<style>`。
*   **ESLint 忽略:** `src/uni_modules/`, `dist`, `auto-import.d.ts`, `uni-pages.d.ts`, `src/pages.json`, `src/manifest.json`
*   **UnoCSS 兼容性:** `presetLegacyCompat` 与 `commaStyleColorFunction: true` 一起使用，以获得更好的应用程序兼容性。动态图标必须添加到 `uno.config.ts` 的 `safelist` 中或在 Vue 页面中注释。

## 关键模式

*   **配置生成:** `pages.config.ts` 生成 `src/pages.json`，`manifest.config.ts` 生成 `src/manifest.json`。
*   **HTTP 拦截器:** `src/http/interceptor.ts` 自动添加 `Bearer` 令牌，处理基本 URL、60 秒超时、平台头，并根据 `__VITE_APP_PROXY__` 对 H5 代理进行前缀处理。
*   **路由拦截器:** `src/router/interceptor.ts` 根据 `src/router/config.ts` 中的 `LOGIN_STRATEGY` (黑名单/白名单) 管理登录/身份验证。它还处理相对路径和 tabbar 索引同步。`src/router/config.ts` 中的 `LOGIN_PAGE_ENABLE_IN_MP` 控制小程序中的 H5 登录逻辑。
*   **Tabbar 配置:** `src/tabbar/config.ts` 定义 tabbar 策略。`pages.json` 中 `tabBar` 的 `custom` 属性仅在微信小程序中支持。
*   **环境变量:** 环境变量从 `env` 目录中使用 `loadEnv` 在 `manifest.config.ts` 中加载。
