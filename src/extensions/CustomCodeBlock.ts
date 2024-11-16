import { Node } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockView from '../components/CodeBlockView.vue'

export interface CodeBlockOptions {
  HTMLAttributes: Record<string, any>,
  languageList: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    codeBlock: {
      setCodeBlock: (attributes?: { language: string }) => ReturnType
      toggleCodeBlock: (attributes?: { language: string }) => ReturnType
    }
  }
}

export const CustomCodeBlock = Node.create<CodeBlockOptions>({
  name: 'codeBlock',
  
  addOptions() {
    return {
      HTMLAttributes: {},
      languageList: [
        'javascript',
        'typescript',
        'html',
        'css',
        'python',
        'java',
        'c',
        'cpp',
        'csharp',
        'go',
        'rust',
        'php',
        'ruby',
        'swift',
        'kotlin',
        'sql',
        'shell',
        'markdown',
        'json',
        'yaml',
        'xml',
        'bash',
        'powershell',
        'dockerfile',
        'vue'
      ],
    }
  },

  addAttributes() {
    return {
      language: {
        default: 'plain',
        parseHTML: element => element.getAttribute('data-language'),
        renderHTML: attributes => ({
          'data-language': attributes.language,
        }),
      },
      'data-description': {
        default: null,
        parseHTML: element => element.getAttribute('data-description'),
        renderHTML: attributes => ({
          'data-description': attributes['data-description'],
        }),
      },
    }
  },

  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['pre', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['code', {}, 0]]
  },

  addNodeView() {
    console.log('初始化代码块节点视图')
    return VueNodeViewRenderer(CodeBlockView)
  },

  addCommands() {
    return {
      setCodeBlock:
        attributes => ({ commands }) => {
          console.log('设置代码块:', {
            attributes,
            name: this.name
          })
          const { language = 'plain' } = attributes || {}
          return commands.setNode(this.name, { 
            language,
            'data-description': null 
          })
        },
      toggleCodeBlock:
        attributes => ({ commands }) => {
          console.log('切换代码块:', {
            attributes,
            name: this.name
          })
          const { language = 'plain' } = attributes || {}
          return commands.toggleNode(this.name, 'paragraph', { 
            language,
            'data-description': null 
          })
        },
    }
  },
}) 