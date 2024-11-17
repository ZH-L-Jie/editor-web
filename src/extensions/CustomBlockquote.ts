import Blockquote from '@tiptap/extension-blockquote'

export const CustomBlockquote = Blockquote.extend({
  name: 'blockquote',
  
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-blockquote',
      },
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
      setBlockquoteType: (type) => ({ commands }) => {
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