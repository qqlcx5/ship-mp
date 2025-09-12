#!/usr/bin/env node

/**
 * 文档生成器脚本 (CommonJS版本)
 * 用于自动生成和更新项目文档
 */

const fs = require('node:fs')
const path = require('node:path')

class DocumentGenerator {
  constructor() {
    this.projectRoot = process.cwd()
    this.docsPath = path.join(this.projectRoot, 'docs')
    this.configPath = path.join(this.docsPath, '_config', 'doc-config.json')
  }

  /**
   * 生成文档索引
   */
  generateIndex() {
    console.log('📝 生成文档索引...')

    try {
      // 读取配置文件
      const configContent = fs.readFileSync(this.configPath, 'utf8')
      const config = JSON.parse(configContent)

      const indexContent = this.generateIndexContent(config)
      const indexPath = path.join(this.docsPath, 'INDEX.md')

      fs.writeFileSync(indexPath, indexContent, 'utf8')
      console.log('✅ 文档索引生成完成')
    }
    catch (error) {
      console.error('❌ 生成索引失败:', error.message)
    }
  }

  /**
   * 生成索引内容
   */
  generateIndexContent(config) {
    const { documentation } = config
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

    return content
  }

  /**
   * 验证文档完整性
   */
  validateDocs() {
    console.log('🔍 验证文档完整性...')

    try {
      const configContent = fs.readFileSync(this.configPath, 'utf8')
      const config = JSON.parse(configContent)
      const { documentation } = config
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
    catch (error) {
      console.error('❌ 验证失败:', error.message)
      return []
    }
  }

  /**
   * 运行文档生成
   */
  run() {
    console.log('🎯 开始文档生成...\n')

    this.generateIndex()
    const missingDocs = this.validateDocs()

    if (missingDocs.length === 0) {
      console.log('\n🎉 文档检查完成！')
    }
    else {
      console.log(`\n⚠️ 发现 ${missingDocs.length} 个缺失的文档，请创建相应文件`)
    }
  }
}

// 运行脚本
if (require.main === module) {
  const generator = new DocumentGenerator()
  generator.run()
}

module.exports = DocumentGenerator
