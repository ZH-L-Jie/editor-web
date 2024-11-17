import CodeBlock from '@tiptap/extension-code-block'

export const CustomCodeBlock = CodeBlock.extend({
  name: 'codeBlock',
  
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-code-block',
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
    }
  },
}) 