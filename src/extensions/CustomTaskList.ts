import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'

export const CustomTaskList = TaskList.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-task-list',
      },
    }
  },
})

export const CustomTaskItem = TaskItem.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: {
        class: 'custom-task-item',
      },
      nested: true,
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-t': () => this.editor.commands.toggleTaskList(),
      Enter: () => {
        const { state } = this.editor
        const { selection } = state
        const { empty, $from } = selection

        if (empty) {
          const currentNodeText = $from.parent.textContent

          if (!currentNodeText) {
            return this.editor
              .chain()
              .lift(this.name)
              .deleteNode('taskList')
              .insertContent('<p></p>')
              .run()
          }

          return this.editor
            .chain()
            .splitListItem(this.name)
            .run()
        }
        return false
      },
    }
  },
}) 