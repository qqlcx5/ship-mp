# CLAUDE.md

  - 所有交互使用中文回答
  - 每个任务必须创建 todo 列表
  - 深入理解需求本质，识别根本问题
  - 发现并指出任何重复代码或逻辑（DRY原则）
  - 评估方案的技术债务和长期维护成本
  - 信息不足时主动提问收集必要信息
  - **禁止**：在完成分析前修改代码；急于给出解决方案；跳过理解分析步骤

  ## 项目概览
  基于 uniapp + Vue3 + TypeScript + Vite5 + UnoCSS 的跨平台应用框架，支持 H5、小程序、APP 平台开发。

  ## 开发命令
  - `pnpm dev` - H5开发服务器
  - `pnpm dev:mp` - 微信小程序开发
  - `pnpm dev:app` - 移动应用开发
  - `pnpm build` / `pnpm build:h5` / `pnpm build:mp` / `pnpm build:app` - 构建
  - `pnpm lint` / `pnpm lint:fix` - 代码检查
  - `pnpm type-check` - TypeScript类型检查

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
  - 集成 alova.js 作为HTTP客户端备选方案

  ### 开发规范
  - 使用 `<script setup>` 语法和组合式API
  - 样式：**仅使用 UnoCSS 工具类**，禁止写 style 标签中的自定义样式
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