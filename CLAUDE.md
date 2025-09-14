# CLAUDE.md

- **必须做的事**：
  - 所有交互回答都使用中文
  - 深入理解需求本质，而不仅仅是表面问题。
  - 搜索所有相关代码（基于我提供的上下文）。
  - 识别问题的真正根因。
  - 发现潜在的架构性问题或设计缺陷。
  - 如果信息不足，必须主动向我提问以收集必要信息。
  - 清晰地评估每个方案的优缺点（例如：实现复杂度、性能影响、可维护性、扩展性等）。
  - 每个任务必须触发 to-do-list
- **融入的原则**：
  - **系统性思维**：从整体架构和长远影响出发看问题。
  - **第一性原理**：回归功能本质，挑战现有假设。
  - **DRY 原则**：发现任何形式的重复代码或逻辑，必须明确指出。
  - **长远考虑**：始终评估方案可能带来的技术债务和长期维护成本。
- **绝对禁止**:
  - 在没有完成分析前，修改任何代码。
  - 急于给出任何解决方案。
  - 跳过理解和分析步骤。
- **必须做的事**：
  - 严格按照选定的方案实现所有代码变更。
  - 不用考虑是否存在 tailwind 等库，始终使用 tailwind 写 class样式
  执行相关代码功能变更

### 每次回复前的强制自我检查

在生成任何回复之前，你必须在内心回答以下问题：

1. 我的行为是否严格符合当前阶段的“必须做的事”和“绝对禁止”？

请确认你已完全理解以上规则，并在后续所有交互中严格遵守。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform application framework based on uniapp + Vue3 + TypeScript + Vite5 + UnoCSS. It supports development for H5, mini-programs, and APP platforms without requiring HBuilderX.

## Common Development Commands

- `pnpm dev` - Run development server for H5 platform
- `pnpm dev:mp` - Run development server for WeChat mini-program
- `pnpm dev:app` - Run development server for mobile app
- `pnpm build` - Build production version
- `pnpm build:h5` - Build H5 production version
- `pnpm build:mp` - Build WeChat mini-program production version
- `pnpm build:app` - Build mobile app production version
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm type-check` - Run TypeScript type checking

## Code Architecture

### Core Configuration Files
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `pages.config.ts` - Page routing configuration
- `manifest.config.ts` - Application manifest configuration
- `uno.config.ts` - UnoCSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration

### Directory Structure
- `src/pages/` - Page components
- `src/pages-sub/` - Sub-package pages
- `src/components/` - Reusable components
- `src/api/` - API interface definitions
- `src/http/` - HTTP request encapsulation
- `src/store/` - State management (Pinia)
- `src/tabbar/` - Bottom navigation bar configuration
- `src/router/` - Routing configuration and interceptors
- `src/hooks/` - Custom Vue composition functions
- `src/utils/` - Utility functions
- `src/style/` - Global styles
- `src/static/` - Static assets (images, icons)

### HTTP Layer
The project uses a custom HTTP wrapper around uni.request with the following features:
- Automatic token refresh handling
- Request/response interceptors
- Error handling and toast notifications
- Support for GET, POST, PUT, DELETE methods
- Integration with both native HTTP and alova.js

### State Management
Uses Pinia for state management with persistent storage support:
- `src/store/token.ts` - Token management
- `src/store/user.ts` - User information

### Routing
- Uses convention-based routing where file names determine routes
- Route interceptors for authentication handling
- Tabbar configuration with multiple strategies (native/custom)

### Styling
- Uses UnoCSS (equivalent to TailwindCSS) for atomic CSS
- Prohibits writing custom styles in style tags
- Uses utility classes exclusively for styling

### Component Development
- Uses `<script setup>` syntax with Composition API
- Follows uni-app component specifications
- Supports conditional compilation for platform differences
- Uses wot-design-uni component library