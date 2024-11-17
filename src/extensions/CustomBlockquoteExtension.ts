import Blockquote from '@tiptap/extension-blockquote'

export interface BlockquoteOptions {
  HTMLAttributes: Record<string, any>;
  types: Array<{
    key: string;
    label: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  }>;
}

/**
 * 自定义引用块扩展
 * 提供多种样式的引用块，支持右键菜单切换样式
 */
export const CustomBlockquoteExtension = Blockquote.extend<BlockquoteOptions>({
  name: 'blockquote',
  
  addOptions() {
    return {
      HTMLAttributes: {
        class: 'custom-blockquote',
      },
      // 预定义的引用块样式
      types: [
        {
          key: 'default',
          label: '默认样式',
          backgroundColor: '#f3f4f6',
          borderColor: '#9ca3af',
          textColor: '#4b5563',
        },
        {
          key: 'info',
          label: '信息提示',
          backgroundColor: '#e1f5fe',
          borderColor: '#03a9f4',
          textColor: '#0277bd',
        },
        {
          key: 'success',
          label: '成功提示',
          backgroundColor: '#e8f5e9',
          borderColor: '#4caf50',
          textColor: '#2e7d32',
        },
        {
          key: 'warning',
          label: '警告提示',
          backgroundColor: '#fff3e0',
          borderColor: '#ff9800',
          textColor: '#ef6c00',
        },
        {
          key: 'error',
          label: '错误提示',
          backgroundColor: '#ffebee',
          borderColor: '#f44336',
          textColor: '#c62828',
        },
      ],
    }
  },

  addAttributes() {
    return {
      type: {
        default: 'default',
        parseHTML: element => element.getAttribute('data-type') || 'default',
        renderHTML: attributes => ({
          'data-type': attributes.type,
        }),
      },
    }
  },

  addCommands() {
    return {
      ...this.parent?.(),
      /**
       * 设置引用块类型
       * @param type 引用块类型
       */
      setBlockquoteType: (type: string) => ({ commands }) => {
        return commands.updateAttributes('blockquote', { type })
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-b': () => this.editor.commands.toggleBlockquote(),
    }
  },
}) 