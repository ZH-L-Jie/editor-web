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

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-b': () => this.editor.commands.toggleBlockquote(),
    }
  },
}) 