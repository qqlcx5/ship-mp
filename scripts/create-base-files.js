// 生成 src/manifest.json 和 src/pages.json
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 获取当前文件的目录路径（替代 CommonJS 中的 __dirname）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const manifest = {
  name: 'minimal',
  description: 'minimal 电商',
  versionName: '1.0.0',
  versionCode: '100',
}

const pages = {
  pages: [
    {
      path: 'pages/index/index',
      style: {
        navigationBarTitleText: 'minimal',
      },
    },
  ],
}

// 使用修复后的 __dirname 来解析文件路径
fs.writeFileSync(path.resolve(__dirname, '../src/manifest.json'), JSON.stringify(manifest, null, 2))
fs.writeFileSync(path.resolve(__dirname, '../src/pages.json'), JSON.stringify(pages, null, 2))
