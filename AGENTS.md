# AGENTS.md

此文件为代理在处理此代码库时提供指导。

## 构建/Lint/测试命令

*   **开发 (H5):** `pnpm dev`
*   **开发 (微信小程序):** `pnpm dev:mp`
*   **开发 (移动应用):** `pnpm dev:app`
*   **构建 (H5):** `pnpm build:h5`
*   **构建 (微信小程序):** `pnpm build:mp`
*   **构建 (移动应用):** `pnpm build:app`
*   **Lint:** `pnpm lint`
*   **Lint 并修复:** `pnpm lint:fix`
*   **类型检查:** `pnpm type-check` (使用 `vue-tsc --noEmit`)
*   **OpenAPI TS 请求生成:** `pnpm openapi-ts-request`
*   **Pre-commit 钩子:** `husky` 对暂存文件运行 `eslint --fix`。

## 代码风格指南

*   **样式:** 仅使用 UnoCSS 工具类。禁止在 `<style>` 标签中使用自定义样式。
*   **Vue SFC 块顺序:** `<script>`, `<template>`, 然后 `<style>`。
*   **ESLint 忽略:** `src/uni_modules/`, `dist`, `auto-import.d.ts`, `uni-pages.d.ts`, `src/pages.json`, `src/manifest.json`, `src/service/**`。
*   **UnoCSS 兼容性:** `presetLegacyCompat` 与 `commaStyleColorFunction: true` 一起使用，以获得更好的应用程序兼容性。动态图标必须添加到 `uno.config.ts` 的 `safelist` 中或在 Vue 页面中注释。

## 关键模式

*   **配置生成:** `pages.config.ts` 生成 `src/pages.json`，`manifest.config.ts` 生成 `src/manifest.json`。
*   **HTTP 拦截器:** `src/http/interceptor.ts` 自动添加 `Bearer` 令牌，处理基本 URL、60 秒超时、平台头，并根据 `__VITE_APP_PROXY__` 对 H5 代理进行前缀处理。
*   **路由拦截器:** `src/router/interceptor.ts` 根据 `src/router/config.ts` 中的 `LOGIN_STRATEGY` (黑名单/白名单) 管理登录/身份验证。它还处理相对路径和 tabbar 索引同步。`src/router/config.ts` 中的 `LOGIN_PAGE_ENABLE_IN_MP` 控制小程序中的 H5 登录逻辑。
*   **Tabbar 配置:** `src/tabbar/config.ts` 定义 tabbar 策略。`pages.json` 中 `tabBar` 的 `custom` 属性仅在微信小程序中支持。
*   **API 回退:** 如果 API 调用失败，则使用模拟数据作为回退 (例如，在 `src/pages/address/README.md` 中)。
*   **环境变量:** 环境变量从 `env` 目录中使用 `loadEnv` 在 `manifest.config.ts` 中加载。

## CLAUDE.md 规则

*   **必须做的事**：
    *   在写完整个代码之前，不要问任何澄清问题，从头到尾写完代码
    *   所有交互使用中文回答
    *   每个任务必须创建 todo 列表
    *   深入理解需求本质，识别根本问题
    *   发现并指出任何重复代码或逻辑（DRY原则）
    *   评估方案的技术债务和长期维护成本
    *   信息不足时主动提问收集必要信息
*   **禁止**：在完成分析前修改代码；急于给出解决方案；跳过理解分析步骤