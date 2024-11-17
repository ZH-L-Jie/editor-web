import Paragraph from '@tiptap/extension-paragraph'

export const CustomParagraph = Paragraph.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-paragraph',
      },
    }
  },
}) 