import BulletList from '@tiptap/extension-bullet-list'

export const CustomBulletList = BulletList.extend({
  name: 'bulletList',
  
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-bullet-list',
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
    }
  },
}) 