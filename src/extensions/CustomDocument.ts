import Document from '@tiptap/extension-document'
import { mergeAttributes } from '@tiptap/core'

export interface CustomDocumentOptions {
  // 定义自定义选项接口
  heading?: {
    levels?: number[]
    defaultLevel?: number
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customDocument: {
      // 定义自定义命令
      setHeading: (attributes: { level: number }) => ReturnType
    }
  }
}

// 扩展 Document 扩展
export const CustomDocument = Document.extend<CustomDocumentOptions>({
  name: 'customDocument',

  // 定义文档内容规则
  content: 'heading block*',

  // 添加扩展配置选项
  addOptions() {
    return {
      ...this.parent?.(),
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
        defaultLevel: 1
      }
    }
  },

  // 添加扩展方法
  addCommands() {
    return {
      ...this.parent?.(),
      setHeading: attributes => ({ commands }) => {
        return commands.setNode('heading', attributes)
      }
    }
  },

  // 添加键盘快捷键
  addKeyboardShortcuts() {
    return {
      ...this.parent?.(),
      // 添加标题快捷键
      'Mod-Alt-1': () => this.editor.commands.setHeading({ level: 1 }),
      'Mod-Alt-2': () => this.editor.commands.setHeading({ level: 2 }),
      'Mod-Alt-3': () => this.editor.commands.setHeading({ level: 3 }),
      'Mod-Alt-4': () => this.editor.commands.setHeading({ level: 4 }),
      'Mod-Alt-5': () => this.editor.commands.setHeading({ level: 5 }),
      'Mod-Alt-6': () => this.editor.commands.setHeading({ level: 6 }),
    }
  },

  // 添加输入规则
  addInputRules() {
    const rules = this.parent?.() || []
    
    // 添加标题的输入规则
    const headingLevels = this.options.heading?.levels || [1, 2, 3, 4, 5, 6]
    
    headingLevels.forEach(level => {
      rules.push({
        find: new RegExp(`^(#{${level}})\\s$`),
        replace: () => this.editor.commands.setHeading({ level })
      })
    })

    return rules
  },

  // 添加节点规则
  addNodeRules() {
    return {
      // 定义文档节点的HTML结构
      toDOM: () => ['div', { class: 'custom-document' }, 0],
      // 解析HTML
      parseDOM: [{
        tag: 'div.custom-document',
      }]
    }
  },

  // 添加属性
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: 'custom-document',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => ({
          class: mergeAttributes(attributes, { class: 'custom-document' }).class
        })
      }
    }
  }
}) 