# CLAUDE.md

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