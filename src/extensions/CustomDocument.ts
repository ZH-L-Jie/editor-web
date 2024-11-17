import Document from '@tiptap/extension-document'

export const CustomDocument = Document.extend({
  content: 'heading block*', // 允许一个标题和多个块级内容

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-document',
      },
    }
  },
}) 