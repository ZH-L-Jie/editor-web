import Heading from '@tiptap/extension-heading'
import { Level } from '@tiptap/extension-heading'

export const CustomHeading = Heading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3] as Level[],
      HTMLAttributes: {
        class: 'custom-heading',
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-1': () => this.editor.commands.toggleHeading({ level: 1 }),
      'Mod-Alt-2': () => this.editor.commands.toggleHeading({ level: 2 }),
      'Mod-Alt-3': () => this.editor.commands.toggleHeading({ level: 3 }),
    }
  },
}) 