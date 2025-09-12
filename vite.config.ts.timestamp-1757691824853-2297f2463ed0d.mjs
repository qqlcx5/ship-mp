// vite.config.ts
import path from "node:path";
import process from "node:process";
import Uni from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/@uni-helper+plugin-uni@0.1.0_@dcloudio+vite-plugin-uni@3.0.0-4070620250821001_postcss@8_503dc63af2676d84e4261b501cb6a5a6/node_modules/@uni-helper/plugin-uni/src/index.js";
import Components from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/@uni-helper+vite-plugin-uni-components@0.2.0_rollup@4.50.1/node_modules/@uni-helper/vite-plugin-uni-components/dist/index.mjs";
import UniLayouts from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/@uni-helper+vite-plugin-uni-layouts@0.1.11_rollup@4.50.1/node_modules/@uni-helper/vite-plugin-uni-layouts/dist/index.mjs";
import UniManifest from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/@uni-helper+vite-plugin-uni-manifest@0.2.8_vite@5.2.8_@types+node@20.19.13_sass@1.77.8_terser@5.44.0_/node_modules/@uni-helper/vite-plugin-uni-manifest/dist/index.mjs";
import UniPages from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/@uni-helper+vite-plugin-uni-pages@0.3.9_vite@5.2.8_@types+node@20.19.13_sass@1.77.8_terser@5.44.0_/node_modules/@uni-helper/vite-plugin-uni-pages/dist/index.mjs";
import UniPlatform from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/@uni-helper+vite-plugin-uni-platform@0.0.5/node_modules/@uni-helper/vite-plugin-uni-platform/dist/index.mjs";
import Optimization from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/@uni-ku+bundle-optimizer@1.3.14_postcss@8.5.6_rollup@4.50.1_vite@5.2.8_@types+node@20.1_3ebf20ba455075554f01c5332859e119/node_modules/@uni-ku/bundle-optimizer/dist/index.mjs";
import UniKuRoot from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/@uni-ku+root@1.3.4_vite@5.2.8_@types+node@20.19.13_sass@1.77.8_terser@5.44.0_/node_modules/@uni-ku/root/dist/index.mjs";
import dayjs from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/dayjs@1.11.10/node_modules/dayjs/dayjs.min.js";
import { visualizer } from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/rollup-plugin-visualizer@6.0.3_rollup@4.50.1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import UnoCSS from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/unocss@66.0.0_postcss@8.5.6_vite@5.2.8_@types+node@20.19.13_sass@1.77.8_terser@5.44.0__vue@3.5.21_typescript@5.8.3_/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/unplugin-auto-import@20.1.0/node_modules/unplugin-auto-import/dist/vite.js";
import { defineConfig, loadEnv } from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/vite@5.2.8_@types+node@20.19.13_sass@1.77.8_terser@5.44.0/node_modules/vite/dist/node/index.js";
import ViteRestart from "file:///Users/another/Documents/simple-shop/node_modules/.pnpm/vite-plugin-restart@1.0.0_vite@5.2.8_@types+node@20.19.13_sass@1.77.8_terser@5.44.0_/node_modules/vite-plugin-restart/dist/index.js";
var vite_config_default = ({ command, mode }) => {
  console.log("command, mode -> ", command, mode);
  const { UNI_PLATFORM } = process.env;
  console.log("UNI_PLATFORM -> ", UNI_PLATFORM);
  const env = loadEnv(mode, path.resolve(process.cwd(), "env"));
  const {
    VITE_APP_PORT,
    VITE_SERVER_BASEURL,
    VITE_APP_TITLE,
    VITE_DELETE_CONSOLE,
    VITE_APP_PUBLIC_BASE,
    VITE_APP_PROXY_ENABLE,
    VITE_SERVER_HAS_API_PREFIX,
    VITE_APP_PROXY_PREFIX
  } = env;
  console.log("\u73AF\u5883\u53D8\u91CF env -> ", env);
  return defineConfig({
    envDir: "./env",
    // 自定义env目录
    base: VITE_APP_PUBLIC_BASE,
    plugins: [
      UniPages({
        exclude: ["**/components/**/**.*"],
        // homePage 通过 vue 文件的 route-block 的type="home"来设定
        // pages 目录为 src/pages，分包目录不能配置在pages目录下
        subPackages: ["src/pages-sub"],
        // 是个数组，可以配置多个，但是不能为pages里面的目录
        dts: "src/types/uni-pages.d.ts"
      }),
      UniLayouts(),
      UniPlatform(),
      UniManifest(),
      // UniXXX 需要在 Uni 之前引入
      {
        // 临时解决 dcloudio 官方的 @dcloudio/uni-mp-compiler 出现的编译 BUG
        // 参考 github issue: https://github.com/dcloudio/uni-app/issues/4952
        // 自定义插件禁用 vite:vue 插件的 devToolsEnabled，强制编译 vue 模板时 inline 为 true
        name: "fix-vite-plugin-vue",
        configResolved(config) {
          const plugin = config.plugins.find((p) => p.name === "vite:vue");
          if (plugin && plugin.api && plugin.api.options) {
            plugin.api.options.devToolsEnabled = false;
          }
        }
      },
      UnoCSS(),
      AutoImport({
        imports: ["vue", "uni-app"],
        dts: "src/types/auto-import.d.ts",
        dirs: ["src/hooks"],
        // 自动导入 hooks
        vueTemplate: true
        // default false
      }),
      // Optimization 插件需要 page.json 文件，故应在 UniPages 插件之后执行
      Optimization({
        enable: {
          "optimization": true,
          "async-import": true,
          "async-component": true
        },
        dts: {
          base: "src/types"
        },
        logger: false
      }),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ["vite.config.js"]
      }),
      // h5环境增加 BUILD_TIME 和 BUILD_BRANCH
      UNI_PLATFORM === "h5" && {
        name: "html-transform",
        transformIndexHtml(html) {
          return html.replace("%BUILD_TIME%", dayjs().format("YYYY-MM-DD HH:mm:ss")).replace("%VITE_APP_TITLE%", VITE_APP_TITLE);
        }
      },
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === "h5" && mode === "production" && visualizer({
        filename: "./node_modules/.cache/visualizer/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
      // 只有在 app 平台时才启用 copyNativeRes 插件
      // UNI_PLATFORM === 'app' && copyNativeRes(),
      Components({
        extensions: ["vue"],
        deep: true,
        // 是否递归扫描子目录，
        directoryAsNamespace: false,
        // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名，
        dts: "src/types/components.d.ts"
        // 自动生成的组件类型声明文件路径（用于 TypeScript 支持）
      }),
      // 若存在改变 pages.json 的插件，请将 UniKuRoot 放置其后
      UniKuRoot(),
      Uni()
    ],
    define: {
      __UNI_PLATFORM__: JSON.stringify(UNI_PLATFORM),
      __VITE_APP_PROXY__: JSON.stringify(VITE_APP_PROXY_ENABLE)
    },
    css: {
      postcss: {
        plugins: [
          // autoprefixer({
          //   // 指定目标浏览器
          //   overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // }),
        ]
      }
    },
    resolve: {
      alias: {
        "@": path.join(process.cwd(), "./src"),
        "@img": path.join(process.cwd(), "./src/static/images")
      }
    },
    server: {
      host: "0.0.0.0",
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY_ENABLE) ? {
        [VITE_APP_PROXY_PREFIX]: {
          target: VITE_SERVER_BASEURL,
          changeOrigin: true,
          // 后端有/api前缀则不做处理，没有则需要去掉
          rewrite: (path2) => JSON.parse(VITE_SERVER_HAS_API_PREFIX) ? path2 : path2.replace(new RegExp(`^${VITE_APP_PROXY_PREFIX}`), "")
        }
      } : void 0
    },
    esbuild: {
      drop: VITE_DELETE_CONSOLE === "true" ? ["console", "debugger"] : ["debugger"]
    },
    build: {
      sourcemap: false,
      // 方便非h5端调试
      // sourcemap: VITE_SHOW_SOURCEMAP === 'true', // 默认是false
      target: "es6",
      // 开发环境不用压缩
      minify: mode === "development" ? false : "esbuild"
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW5vdGhlci9Eb2N1bWVudHMvc2ltcGxlLXNob3BcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hbm90aGVyL0RvY3VtZW50cy9zaW1wbGUtc2hvcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYW5vdGhlci9Eb2N1bWVudHMvc2ltcGxlLXNob3Avdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdub2RlOnByb2Nlc3MnXG5pbXBvcnQgVW5pIGZyb20gJ0B1bmktaGVscGVyL3BsdWdpbi11bmknXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktY29tcG9uZW50cydcbi8vIEBzZWUgaHR0cHM6Ly91bmktaGVscGVyLmpzLm9yZy92aXRlLXBsdWdpbi11bmktbGF5b3V0c1xuaW1wb3J0IFVuaUxheW91dHMgZnJvbSAnQHVuaS1oZWxwZXIvdml0ZS1wbHVnaW4tdW5pLWxheW91dHMnXG4vLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1tYW5pZmVzdFxuaW1wb3J0IFVuaU1hbmlmZXN0IGZyb20gJ0B1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1tYW5pZmVzdCdcbi8vIEBzZWUgaHR0cHM6Ly91bmktaGVscGVyLmpzLm9yZy92aXRlLXBsdWdpbi11bmktcGFnZXNcbmltcG9ydCBVbmlQYWdlcyBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktcGFnZXMnXG4vLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1wbGF0Zm9ybVxuLy8gXHU5NzAwXHU4OTgxXHU0RTBFIEB1bmktaGVscGVyL3ZpdGUtcGx1Z2luLXVuaS1wYWdlcyBcdTYzRDJcdTRFRjZcdTRFMDBcdThENzdcdTRGN0ZcdTc1MjhcbmltcG9ydCBVbmlQbGF0Zm9ybSBmcm9tICdAdW5pLWhlbHBlci92aXRlLXBsdWdpbi11bmktcGxhdGZvcm0nXG4vKipcbiAqIFx1NTIwNlx1NTMwNVx1NEYxOFx1NTMxNlx1MzAwMVx1NkEyMVx1NTc1N1x1NUYwMlx1NkI2NVx1OERFOFx1NTMwNVx1OEMwM1x1NzUyOFx1MzAwMVx1N0VDNFx1NEVGNlx1NUYwMlx1NkI2NVx1OERFOFx1NTMwNVx1NUYxNVx1NzUyOFxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdW5pLWt1L2J1bmRsZS1vcHRpbWl6ZXJcbiAqL1xuaW1wb3J0IE9wdGltaXphdGlvbiBmcm9tICdAdW5pLWt1L2J1bmRsZS1vcHRpbWl6ZXInXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW5pLWt1L3Jvb3RcbmltcG9ydCBVbmlLdVJvb3QgZnJvbSAnQHVuaS1rdS9yb290J1xuaW1wb3J0IGRheWpzIGZyb20gJ2RheWpzJ1xuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCBWaXRlUmVzdGFydCBmcm9tICd2aXRlLXBsdWdpbi1yZXN0YXJ0J1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIC8vIEBzZWUgaHR0cHM6Ly91bm9jc3MuZGV2L1xuICAvLyBjb25zdCBVbm9DU1MgPSAoYXdhaXQgaW1wb3J0KCd1bm9jc3Mvdml0ZScpKS5kZWZhdWx0XG4gIC8vIGNvbnNvbGUubG9nKG1vZGUgPT09IHByb2Nlc3MuZW52Lk5PREVfRU5WKSAvLyB0cnVlXG5cbiAgLy8gbW9kZTogXHU1MzNBXHU1MjA2XHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU4RkQ4XHU2NjJGXHU1RjAwXHU1M0QxXHU3M0FGXHU1ODgzXG4gIGNvbnNvbGUubG9nKCdjb21tYW5kLCBtb2RlIC0+ICcsIGNvbW1hbmQsIG1vZGUpXG4gIC8vIHBucG0gZGV2Omg1IFx1NjVGNlx1NUY5N1x1NTIzMCA9PiBzZXJ2ZSBkZXZlbG9wbWVudFxuICAvLyBwbnBtIGJ1aWxkOmg1IFx1NjVGNlx1NUY5N1x1NTIzMCA9PiBidWlsZCBwcm9kdWN0aW9uXG4gIC8vIHBucG0gZGV2Om1wLXdlaXhpbiBcdTY1RjZcdTVGOTdcdTUyMzAgPT4gYnVpbGQgZGV2ZWxvcG1lbnQgKFx1NkNFOFx1NjEwRlx1NTMzQVx1NTIyQlx1RkYwQ2NvbW1hbmRcdTRFM0FidWlsZClcbiAgLy8gcG5wbSBidWlsZDptcC13ZWl4aW4gXHU2NUY2XHU1Rjk3XHU1MjMwID0+IGJ1aWxkIHByb2R1Y3Rpb25cbiAgLy8gcG5wbSBkZXY6YXBwIFx1NjVGNlx1NUY5N1x1NTIzMCA9PiBidWlsZCBkZXZlbG9wbWVudCAoXHU2Q0U4XHU2MTBGXHU1MzNBXHU1MjJCXHVGRjBDY29tbWFuZFx1NEUzQWJ1aWxkKVxuICAvLyBwbnBtIGJ1aWxkOmFwcCBcdTY1RjZcdTVGOTdcdTUyMzAgPT4gYnVpbGQgcHJvZHVjdGlvblxuICAvLyBkZXYgXHU1NDhDIGJ1aWxkIFx1NTQ3RFx1NEVFNFx1NTNFRlx1NEVFNVx1NTIwNlx1NTIyQlx1NEY3Rlx1NzUyOCAuZW52LmRldmVsb3BtZW50IFx1NTQ4QyAuZW52LnByb2R1Y3Rpb24gXHU3Njg0XHU3M0FGXHU1ODgzXHU1M0Q4XHU5MUNGXG5cbiAgY29uc3QgeyBVTklfUExBVEZPUk0gfSA9IHByb2Nlc3MuZW52XG4gIGNvbnNvbGUubG9nKCdVTklfUExBVEZPUk0gLT4gJywgVU5JX1BMQVRGT1JNKSAvLyBcdTVGOTdcdTUyMzAgbXAtd2VpeGluLCBoNSwgYXBwIFx1N0I0OVxuXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdlbnYnKSlcbiAgY29uc3Qge1xuICAgIFZJVEVfQVBQX1BPUlQsXG4gICAgVklURV9TRVJWRVJfQkFTRVVSTCxcbiAgICBWSVRFX0FQUF9USVRMRSxcbiAgICBWSVRFX0RFTEVURV9DT05TT0xFLFxuICAgIFZJVEVfQVBQX1BVQkxJQ19CQVNFLFxuICAgIFZJVEVfQVBQX1BST1hZX0VOQUJMRSxcbiAgICBWSVRFX1NFUlZFUl9IQVNfQVBJX1BSRUZJWCxcbiAgICBWSVRFX0FQUF9QUk9YWV9QUkVGSVgsXG4gIH0gPSBlbnZcbiAgY29uc29sZS5sb2coJ1x1NzNBRlx1NTg4M1x1NTNEOFx1OTFDRiBlbnYgLT4gJywgZW52KVxuXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xuICAgIGVudkRpcjogJy4vZW52JywgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5ZW52XHU3NkVFXHU1RjU1XG4gICAgYmFzZTogVklURV9BUFBfUFVCTElDX0JBU0UsXG4gICAgcGx1Z2luczogW1xuICAgICAgVW5pUGFnZXMoe1xuICAgICAgICBleGNsdWRlOiBbJyoqL2NvbXBvbmVudHMvKiovKiouKiddLFxuICAgICAgICAvLyBob21lUGFnZSBcdTkwMUFcdThGQzcgdnVlIFx1NjU4N1x1NEVGNlx1NzY4NCByb3V0ZS1ibG9jayBcdTc2ODR0eXBlPVwiaG9tZVwiXHU2NzY1XHU4QkJFXHU1QjlBXG4gICAgICAgIC8vIHBhZ2VzIFx1NzZFRVx1NUY1NVx1NEUzQSBzcmMvcGFnZXNcdUZGMENcdTUyMDZcdTUzMDVcdTc2RUVcdTVGNTVcdTRFMERcdTgwRkRcdTkxNERcdTdGNkVcdTU3MjhwYWdlc1x1NzZFRVx1NUY1NVx1NEUwQlxuICAgICAgICBzdWJQYWNrYWdlczogWydzcmMvcGFnZXMtc3ViJ10sIC8vIFx1NjYyRlx1NEUyQVx1NjU3MFx1N0VDNFx1RkYwQ1x1NTNFRlx1NEVFNVx1OTE0RFx1N0Y2RVx1NTkxQVx1NEUyQVx1RkYwQ1x1NEY0Nlx1NjYyRlx1NEUwRFx1ODBGRFx1NEUzQXBhZ2VzXHU5MUNDXHU5NzYyXHU3Njg0XHU3NkVFXHU1RjU1XG4gICAgICAgIGR0czogJ3NyYy90eXBlcy91bmktcGFnZXMuZC50cycsXG4gICAgICB9KSxcbiAgICAgIFVuaUxheW91dHMoKSxcbiAgICAgIFVuaVBsYXRmb3JtKCksXG4gICAgICBVbmlNYW5pZmVzdCgpLFxuICAgICAgLy8gVW5pWFhYIFx1OTcwMFx1ODk4MVx1NTcyOCBVbmkgXHU0RTRCXHU1MjREXHU1RjE1XHU1MTY1XG4gICAgICB7XG4gICAgICAgIC8vIFx1NEUzNFx1NjVGNlx1ODlFM1x1NTFCMyBkY2xvdWRpbyBcdTVCOThcdTY1QjlcdTc2ODQgQGRjbG91ZGlvL3VuaS1tcC1jb21waWxlciBcdTUxRkFcdTczQjBcdTc2ODRcdTdGMTZcdThCRDEgQlVHXG4gICAgICAgIC8vIFx1NTNDMlx1ODAwMyBnaXRodWIgaXNzdWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kY2xvdWRpby91bmktYXBwL2lzc3Vlcy80OTUyXG4gICAgICAgIC8vIFx1ODFFQVx1NUI5QVx1NEU0OVx1NjNEMlx1NEVGNlx1Nzk4MVx1NzUyOCB2aXRlOnZ1ZSBcdTYzRDJcdTRFRjZcdTc2ODQgZGV2VG9vbHNFbmFibGVkXHVGRjBDXHU1RjNBXHU1MjM2XHU3RjE2XHU4QkQxIHZ1ZSBcdTZBMjFcdTY3N0ZcdTY1RjYgaW5saW5lIFx1NEUzQSB0cnVlXG4gICAgICAgIG5hbWU6ICdmaXgtdml0ZS1wbHVnaW4tdnVlJyxcbiAgICAgICAgY29uZmlnUmVzb2x2ZWQoY29uZmlnKSB7XG4gICAgICAgICAgY29uc3QgcGx1Z2luID0gY29uZmlnLnBsdWdpbnMuZmluZChwID0+IHAubmFtZSA9PT0gJ3ZpdGU6dnVlJylcbiAgICAgICAgICBpZiAocGx1Z2luICYmIHBsdWdpbi5hcGkgJiYgcGx1Z2luLmFwaS5vcHRpb25zKSB7XG4gICAgICAgICAgICBwbHVnaW4uYXBpLm9wdGlvbnMuZGV2VG9vbHNFbmFibGVkID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgVW5vQ1NTKCksXG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgaW1wb3J0czogWyd2dWUnLCAndW5pLWFwcCddLFxuICAgICAgICBkdHM6ICdzcmMvdHlwZXMvYXV0by1pbXBvcnQuZC50cycsXG4gICAgICAgIGRpcnM6IFsnc3JjL2hvb2tzJ10sIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBob29rc1xuICAgICAgICB2dWVUZW1wbGF0ZTogdHJ1ZSwgLy8gZGVmYXVsdCBmYWxzZVxuICAgICAgfSksXG4gICAgICAvLyBPcHRpbWl6YXRpb24gXHU2M0QyXHU0RUY2XHU5NzAwXHU4OTgxIHBhZ2UuanNvbiBcdTY1ODdcdTRFRjZcdUZGMENcdTY1NDVcdTVFOTRcdTU3MjggVW5pUGFnZXMgXHU2M0QyXHU0RUY2XHU0RTRCXHU1NDBFXHU2MjY3XHU4ODRDXG4gICAgICBPcHRpbWl6YXRpb24oe1xuICAgICAgICBlbmFibGU6IHtcbiAgICAgICAgICAnb3B0aW1pemF0aW9uJzogdHJ1ZSxcbiAgICAgICAgICAnYXN5bmMtaW1wb3J0JzogdHJ1ZSxcbiAgICAgICAgICAnYXN5bmMtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgZHRzOiB7XG4gICAgICAgICAgYmFzZTogJ3NyYy90eXBlcycsXG4gICAgICAgIH0sXG4gICAgICAgIGxvZ2dlcjogZmFsc2UsXG4gICAgICB9KSxcblxuICAgICAgVml0ZVJlc3RhcnQoe1xuICAgICAgICAvLyBcdTkwMUFcdThGQzdcdThGRDlcdTRFMkFcdTYzRDJcdTRFRjZcdUZGMENcdTU3MjhcdTRGRUVcdTY1Mzl2aXRlLmNvbmZpZy5qc1x1NjU4N1x1NEVGNlx1NTIxOVx1NEUwRFx1OTcwMFx1ODk4MVx1OTFDRFx1NjVCMFx1OEZEMFx1ODg0Q1x1NEU1Rlx1NzUxRlx1NjU0OFx1OTE0RFx1N0Y2RVxuICAgICAgICByZXN0YXJ0OiBbJ3ZpdGUuY29uZmlnLmpzJ10sXG4gICAgICB9KSxcbiAgICAgIC8vIGg1XHU3M0FGXHU1ODgzXHU1ODlFXHU1MkEwIEJVSUxEX1RJTUUgXHU1NDhDIEJVSUxEX0JSQU5DSFxuICAgICAgVU5JX1BMQVRGT1JNID09PSAnaDUnICYmIHtcbiAgICAgICAgbmFtZTogJ2h0bWwtdHJhbnNmb3JtJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWwpIHtcbiAgICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKCclQlVJTERfVElNRSUnLCBkYXlqcygpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpKS5yZXBsYWNlKCclVklURV9BUFBfVElUTEUlJywgVklURV9BUFBfVElUTEUpXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gXHU2MjUzXHU1MzA1XHU1MjA2XHU2NzkwXHU2M0QyXHU0RUY2XHVGRjBDaDUgKyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTYyNERcdTVGMzlcdTUxRkFcbiAgICAgIFVOSV9QTEFURk9STSA9PT0gJ2g1J1xuICAgICAgJiYgbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nXG4gICAgICAmJiB2aXN1YWxpemVyKHtcbiAgICAgICAgZmlsZW5hbWU6ICcuL25vZGVfbW9kdWxlcy8uY2FjaGUvdmlzdWFsaXplci9zdGF0cy5odG1sJyxcbiAgICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgICB9KSxcbiAgICAgIC8vIFx1NTNFQVx1NjcwOVx1NTcyOCBhcHAgXHU1RTczXHU1M0YwXHU2NUY2XHU2MjREXHU1NDJGXHU3NTI4IGNvcHlOYXRpdmVSZXMgXHU2M0QyXHU0RUY2XG4gICAgICAvLyBVTklfUExBVEZPUk0gPT09ICdhcHAnICYmIGNvcHlOYXRpdmVSZXMoKSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICBleHRlbnNpb25zOiBbJ3Z1ZSddLFxuICAgICAgICBkZWVwOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdTkwMTJcdTVGNTJcdTYyNkJcdTYzQ0ZcdTVCNTBcdTc2RUVcdTVGNTVcdUZGMENcbiAgICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IGZhbHNlLCAvLyBcdTY2MkZcdTU0MjZcdTYyOEFcdTc2RUVcdTVGNTVcdTU0MERcdTRGNUNcdTRFM0FcdTU0N0RcdTU0MERcdTdBN0FcdTk1RjRcdTUyNERcdTdGMDBcdUZGMEN0cnVlIFx1NjVGNlx1N0VDNFx1NEVGNlx1NTQwRFx1NEUzQSBcdTc2RUVcdTVGNTVcdTU0MEQrXHU3RUM0XHU0RUY2XHU1NDBEXHVGRjBDXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9jb21wb25lbnRzLmQudHMnLCAvLyBcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTBcdTc2ODRcdTdFQzRcdTRFRjZcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdThERUZcdTVGODRcdUZGMDhcdTc1MjhcdTRFOEUgVHlwZVNjcmlwdCBcdTY1MkZcdTYzMDFcdUZGMDlcbiAgICAgIH0pLFxuICAgICAgLy8gXHU4MkU1XHU1QjU4XHU1NzI4XHU2NTM5XHU1M0Q4IHBhZ2VzLmpzb24gXHU3Njg0XHU2M0QyXHU0RUY2XHVGRjBDXHU4QkY3XHU1QzA2IFVuaUt1Um9vdCBcdTY1M0VcdTdGNkVcdTUxNzZcdTU0MEVcbiAgICAgIFVuaUt1Um9vdCgpLFxuICAgICAgVW5pKCksXG4gICAgXSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIF9fVU5JX1BMQVRGT1JNX186IEpTT04uc3RyaW5naWZ5KFVOSV9QTEFURk9STSksXG4gICAgICBfX1ZJVEVfQVBQX1BST1hZX186IEpTT04uc3RyaW5naWZ5KFZJVEVfQVBQX1BST1hZX0VOQUJMRSksXG4gICAgfSxcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIC8vIGF1dG9wcmVmaXhlcih7XG4gICAgICAgICAgLy8gICAvLyBcdTYzMDdcdTVCOUFcdTc2RUVcdTY4MDdcdTZENEZcdTg5QzhcdTU2NjhcbiAgICAgICAgICAvLyAgIG92ZXJyaWRlQnJvd3NlcnNsaXN0OiBbJz4gMSUnLCAnbGFzdCAyIHZlcnNpb25zJ10sXG4gICAgICAgICAgLy8gfSksXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG5cbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnLi9zcmMnKSxcbiAgICAgICAgJ0BpbWcnOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4vc3JjL3N0YXRpYy9pbWFnZXMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcwLjAuMC4wJyxcbiAgICAgIGhtcjogdHJ1ZSxcbiAgICAgIHBvcnQ6IE51bWJlci5wYXJzZUludChWSVRFX0FQUF9QT1JULCAxMCksXG4gICAgICAvLyBcdTRFQzUgSDUgXHU3QUVGXHU3NTFGXHU2NTQ4XHVGRjBDXHU1MTc2XHU0RUQ2XHU3QUVGXHU0RTBEXHU3NTFGXHU2NTQ4XHVGRjA4XHU1MTc2XHU0RUQ2XHU3QUVGXHU4RDcwYnVpbGRcdUZGMENcdTRFMERcdThENzBkZXZTZXJ2ZXIpXG4gICAgICBwcm94eTogSlNPTi5wYXJzZShWSVRFX0FQUF9QUk9YWV9FTkFCTEUpXG4gICAgICAgID8ge1xuICAgICAgICAgICAgW1ZJVEVfQVBQX1BST1hZX1BSRUZJWF06IHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiBWSVRFX1NFUlZFUl9CQVNFVVJMLFxuICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgICAgIC8vIFx1NTQwRVx1N0FFRlx1NjcwOS9hcGlcdTUyNERcdTdGMDBcdTUyMTlcdTRFMERcdTUwNUFcdTU5MDRcdTc0MDZcdUZGMENcdTZDQTFcdTY3MDlcdTUyMTlcdTk3MDBcdTg5ODFcdTUzQkJcdTYzODlcbiAgICAgICAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBKU09OLnBhcnNlKFZJVEVfU0VSVkVSX0hBU19BUElfUFJFRklYKVxuICAgICAgICAgICAgICAgID8gcGF0aFxuICAgICAgICAgICAgICAgIDogcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4ke1ZJVEVfQVBQX1BST1hZX1BSRUZJWH1gKSwgJycpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIH0sXG4gICAgZXNidWlsZDoge1xuICAgICAgZHJvcDogVklURV9ERUxFVEVfQ09OU09MRSA9PT0gJ3RydWUnID8gWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10gOiBbJ2RlYnVnZ2VyJ10sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICAgIC8vIFx1NjVCOVx1NEZCRlx1OTc1RWg1XHU3QUVGXHU4QzAzXHU4QkQ1XG4gICAgICAvLyBzb3VyY2VtYXA6IFZJVEVfU0hPV19TT1VSQ0VNQVAgPT09ICd0cnVlJywgLy8gXHU5RUQ4XHU4QkE0XHU2NjJGZmFsc2VcbiAgICAgIHRhcmdldDogJ2VzNicsXG4gICAgICAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMERcdTc1MjhcdTUzOEJcdTdGMjlcbiAgICAgIG1pbmlmeTogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyA/IGZhbHNlIDogJ2VzYnVpbGQnLFxuICAgIH0sXG4gIH0pXG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSLE9BQU8sVUFBVTtBQUMvUyxPQUFPLGFBQWE7QUFDcEIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBRXZCLE9BQU8sZ0JBQWdCO0FBRXZCLE9BQU8saUJBQWlCO0FBRXhCLE9BQU8sY0FBYztBQUdyQixPQUFPLGlCQUFp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
