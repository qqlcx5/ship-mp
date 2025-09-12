/**
 * 文档生成器脚本
 * 用于自动生成和更新项目文档
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class DocumentGenerator {
  constructor() {
    this.projectRoot = process.cwd()
    this.docsPath = path.join(this.projectRoot, 'docs')
    this.configPath = path.join(this.docsPath, '_config', 'doc-config.json')
    this.templatesPath = path.join(this.docsPath, '_templates')
  }

  /**
   * 初始化文档生成器
   */
  init() {
    console.log('🚀 初始化文档生成器...')
    this.ensureDirectories()
    this.loadConfig()
    console.log('✅ 文档生成器初始化完成')
  }

  /**
   * 确保必要的目录存在
   */
  ensureDirectories() {
    const directories = [
      this.docsPath,
      path.join(this.docsPath, '_config'),
      path.join(this.docsPath, '_templates'),
      path.join(this.docsPath, '_scripts'),
    ]

    directories.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log(`📁 创建目录: ${dir}`)
      }
    })
  }

  /**
   * 加载配置文件
   */
  loadConfig() {
    try {
      const configContent = fs.readFileSync(this.configPath, 'utf8')
      this.config = JSON.parse(configContent)
      console.log('📋 配置文件加载成功')
    }
    catch (error) {
      console.error('❌ 配置文件加载失败:', error.message)
      process.exit(1)
    }
  }

  /**
   * 扫描项目结构
   */
  scanProject() {
    console.log('🔍 扫描项目结构...')

    const projectStructure = {
      components: this.scanComponents(),
      apis: this.scanApis(),
      utils: this.scanUtils(),
      hooks: this.scanHooks(),
      stores: this.scanStores(),
    }

    return projectStructure
  }

  /**
   * 扫描组件
   */
  scanComponents() {
    const componentsPath = path.join(this.projectRoot, 'src', 'components')
    if (!fs.existsSync(componentsPath))
      return []

    const components = []
    const componentDirs = fs.readdirSync(componentsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())

    componentDirs.forEach((dir) => {
      const componentPath = path.join(componentsPath, dir.name)
      const vueFile = path.join(componentPath, `${dir.name}.vue`)

      if (fs.existsSync(vueFile)) {
        components.push({
          name: dir.name,
          path: vueFile,
          relativePath: `src/components/${dir.name}/${dir.name}.vue`,
        })
      }
    })

    console.log(`📦 发现 ${components.length} 个组件`)
    return components
  }

  /**
   * 扫描API文件
   */
  scanApis() {
    const apiPath = path.join(this.projectRoot, 'src', 'api')
    if (!fs.existsSync(apiPath))
      return []

    const apis = []
    const apiFiles = fs.readdirSync(apiPath)
      .filter(file => file.endsWith('.ts') && !file.includes('types'))

    apiFiles.forEach((file) => {
      apis.push({
        name: path.basename(file, '.ts'),
        path: path.join(apiPath, file),
        relativePath: `src/api/${file}`,
      })
    })

    console.log(`🌐 发现 ${apis.length} 个API文件`)
    return apis
  }

  /**
   * 扫描工具函数
   */
  scanUtils() {
    const utilsPath = path.join(this.projectRoot, 'src', 'utils')
    if (!fs.existsSync(utilsPath))
      return []

    const utils = []
    const utilFiles = fs.readdirSync(utilsPath)
      .filter(file => file.endsWith('.ts'))

    utilFiles.forEach((file) => {
      utils.push({
        name: path.basename(file, '.ts'),
        path: path.join(utilsPath, file),
        relativePath: `src/utils/${file}`,
      })
    })

    console.log(`🛠️ 发现 ${utils.length} 个工具文件`)
    return utils
  }

  /**
   * 扫描Hooks
   */
  scanHooks() {
    const hooksPath = path.join(this.projectRoot, 'src', 'hooks')
    if (!fs.existsSync(hooksPath))
      return []

    const hooks = []
    const hookFiles = fs.readdirSync(hooksPath)
      .filter(file => file.endsWith('.ts'))

    hookFiles.forEach((file) => {
      hooks.push({
        name: path.basename(file, '.ts'),
        path: path.join(hooksPath, file),
        relativePath: `src/hooks/${file}`,
      })
    })

    console.log(`🎣 发现 ${hooks.length} 个Hook文件`)
    return hooks
  }

  /**
   * 扫描状态管理
   */
  scanStores() {
    const storePath = path.join(this.projectRoot, 'src', 'store')
    if (!fs.existsSync(storePath))
      return []

    const stores = []
    const storeFiles = fs.readdirSync(storePath)
      .filter(file => file.endsWith('.ts') && file !== 'index.ts')

    storeFiles.forEach((file) => {
      stores.push({
        name: path.basename(file, '.ts'),
        path: path.join(storePath, file),
        relativePath: `src/store/${file}`,
      })
    })

    console.log(`🏪 发现 ${stores.length} 个Store文件`)
    return stores
  }

  /**
   * 生成文档索引
   */
  generateIndex() {
    console.log('📝 生成文档索引...')

    const indexContent = this.generateIndexContent()
    const indexPath = path.join(this.docsPath, 'INDEX.md')

    fs.writeFileSync(indexPath, indexContent, 'utf8')
    console.log('✅ 文档索引生成完成')
  }

  /**
   * 生成索引内容
   */
  generateIndexContent() {
    const { documentation } = this.config
    const docs = documentation.structure

    let content = `# 项目文档索引\n\n`
    content += `> 自动生成于: ${new Date().toLocaleString()}\n\n`

    // 按分类组织文档
    const categories = {}
    Object.entries(docs).forEach(([filename, info]) => {
      if (!categories[info.category]) {
        categories[info.category] = []
      }
      categories[info.category].push({ filename, ...info })
    })

    // 生成分类索引
    Object.entries(categories).forEach(([category, docList]) => {
      content += `## ${category}\n\n`

      docList
        .sort((a, b) => a.priority - b.priority)
        .forEach((doc) => {
          const aiIcon = doc.aiContext ? '🤖' : '📄'
          const tags = doc.tags.map(tag => `\`${tag}\``).join(' ')
          content += `- ${aiIcon} [${doc.title}](./${doc.filename}) - ${tags}\n`
        })

      content += '\n'
    })

    // 添加使用说明
    content += `## 使用说明\n\n`
    content += `### AI 辅助编码\n\n`
    content += `标记为 🤖 的文档适合用于 AI 辅助编码，使用方式：\n\n`
    content += `\`\`\`\n`
    content += `@docs/[文档名称]\n`
    content += `\`\`\`\n\n`
    content += `### 文档分类说明\n\n`
    content += `- **基础文档**: 项目概览、技术栈、开发指南\n`
    content += `- **核心功能**: API、组件、工具函数等核心功能文档\n`
    content += `- **构建部署**: 构建配置、部署流程、编码规范\n`
    content += `- **辅助文档**: 问题排查、AI集成等辅助性文档\n\n`

    return content
  }

  /**
   * 验证文档完整性
   */
  validateDocs() {
    console.log('🔍 验证文档完整性...')

    const { documentation } = this.config
    const missingDocs = []

    Object.entries(documentation.structure).forEach(([filename, info]) => {
      const docPath = path.join(this.docsPath, filename)
      if (!fs.existsSync(docPath)) {
        missingDocs.push({ filename, title: info.title })
      }
    })

    if (missingDocs.length > 0) {
      console.log('⚠️ 发现缺失的文档:')
      missingDocs.forEach((doc) => {
        console.log(`  - ${doc.filename} (${doc.title})`)
      })
    }
    else {
      console.log('✅ 所有文档都存在')
    }

    return missingDocs
  }

  /**
   * 运行完整的文档生成流程
   */
  run() {
    console.log('🎯 开始文档生成流程...\n')

    this.init()
    const projectStructure = this.scanProject()
    this.generateIndex()
    const missingDocs = this.validateDocs()

    console.log('\n📊 生成报告:')
    console.log(`- 组件: ${projectStructure.components.length}`)
    console.log(`- API: ${projectStructure.apis.length}`)
    console.log(`- 工具函数: ${projectStructure.utils.length}`)
    console.log(`- Hooks: ${projectStructure.hooks.length}`)
    console.log(`- Stores: ${projectStructure.stores.length}`)
    console.log(`- 缺失文档: ${missingDocs.length}`)

    if (missingDocs.length === 0) {
      console.log('\n🎉 文档生成完成！')
    }
    else {
      console.log('\n⚠️ 请创建缺失的文档文件')
    }
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  const generator = new DocumentGenerator()
  generator.run()
}

export default DocumentGenerator
