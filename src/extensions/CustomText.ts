import Text from '@tiptap/extension-text'

export const CustomText = Text.extend({
  name: 'customText',

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-text',
      },
    }
  }
}) 