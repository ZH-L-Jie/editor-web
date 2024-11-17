import OrderedList from '@tiptap/extension-ordered-list'

export const CustomOrderedList = OrderedList.extend({
  name: 'orderedList',
  
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-ordered-list',
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-7': () => this.editor.commands.toggleOrderedList(),
    }
  },
}) 