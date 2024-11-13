<template>
  <div class="editor-wrapper">
    <!-- 工具栏部分，只有在编辑器实例存在时才显示 -->
    <div class="editor-menu-bar" v-if="editor">
      <!-- 文本样式按钮组 -->
      <n-button-group>
        <!-- 粗体按钮：点击时调用formatText方法，根据当前状态显示不同样式 -->
        <n-button @click="formatText('bold')" 
                 :type="editor.isActive('bold') ? 'primary' : 'default'">
          粗体
        </n-button>
        <!-- 斜体按钮 -->
        <n-button @click="formatText('italic')"
                 :type="editor.isActive('italic') ? 'primary' : 'default'">
          斜体
        </n-button>
        <!-- 删除线按钮 -->
        <n-button @click="formatText('strike')"
                 :type="editor.isActive('strike') ? 'primary' : 'default'">
          删除线
        </n-button>
      </n-button-group>

      <!-- 文本对齐按钮组 -->
      <n-button-group>
        <!-- 左对齐按钮 -->
        <n-button @click="editor.chain().focus().setTextAlign('left').run()"
                 :type="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'">
          左对齐
        </n-button>
        <!-- 居中对齐按钮 -->
        <n-button @click="editor.chain().focus().setTextAlign('center').run()"
                 :type="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'">
          居中
        </n-button>
        <!-- 右对齐按钮 -->
        <n-button @click="editor.chain().focus().setTextAlign('right').run()"
                 :type="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'">
          右对齐
        </n-button>
      </n-button-group>
    </div>
    
    <!-- 编辑器内容区域 -->
    <editor-content :editor="editor" class="editor-content" />
  </div>
</template>

<script setup>
// 导入必要的依赖
import { useEditor, EditorContent } from '@tiptap/vue-3' // Tiptap核心组件
import StarterKit from '@tiptap/starter-kit' // Tiptap基础功能包
import TextAlign from '@tiptap/extension-text-align' // 文本对齐扩展
import Highlight from '@tiptap/extension-highlight' // 文本高亮扩展
import { NButton, NButtonGroup } from 'naive-ui' // Naive UI组件
import { onBeforeUnmount } from 'vue' // Vue生命周期钩子

/**
 * 格式化选中文本的方法
 * @param {string} format - 要应用的格式类型（'bold'|'italic'|'strike'）
 */
const formatText = (format) => {
  if (!editor.value) return
  
  // 获取当前选区
  const { from, to } = editor.value.state.selection
  
  // 如果没有选中文本，直接返回
  if (from === to) {
    return
  }

  // 根据不同的格式类型应用相应的样式
  switch (format) {
    case 'bold':
      // 切换粗体状态：如果已经是粗体则取消，否则应用粗体
      if (editor.value.isActive('bold')) {
        editor.value.chain().focus().unsetBold().run()
      } else {
        editor.value.chain().focus().setBold().run()
      }
      break
    case 'italic':
      // 切换斜体状态
      if (editor.value.isActive('italic')) {
        editor.value.chain().focus().unsetItalic().run()
      } else {
        editor.value.chain().focus().setItalic().run()
      }
      break
    case 'strike':
      // 切换删除线状态
      if (editor.value.isActive('strike')) {
        editor.value.chain().focus().unsetStrike().run()
      } else {
        editor.value.chain().focus().setStrike().run()
      }
      break
  }
}

// 初始化Tiptap编辑器
const editor = useEditor({
  // 配置编辑器扩展
  extensions: [
    // 配置StarterKit，包含基础编辑功能
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6] // 支持6级标题
      }
    }),
    // 配置文本对齐功能
    TextAlign.configure({
      types: ['heading', 'paragraph'], // 可以对齐的元素类型
      defaultAlignment: 'left', // 默认左对齐
    }),
    Highlight, // 启用文本高亮功能
  ],
  content: '<p>开始编辑吧!</p>', // 编辑器初始内容
  autofocus: true, // 自动获取焦点
  editable: true, // 可编辑
})

// 组件卸载前清理编辑器实例
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
/* 编辑器外层容器样式 */
.editor-wrapper {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 20px;
}

/* 编辑器内容区域样式 */
.editor-content {
  padding: 20px;
  min-height: 200px;
}

/* 工具栏样式 */
.editor-menu-bar {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  gap: 10px;
}

/* 编辑器核心区域样式 */
:deep(.ProseMirror) {
  outline: none;
  min-height: 200px;
}

/* 段落样式 */
:deep(.ProseMirror p) {
  margin: 1em 0;
}

/* 标题样式 */
:deep(.ProseMirror h1) {
  font-size: 2em;
  margin: 0.67em 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  margin: 0.75em 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.17em;
  margin: 0.83em 0;
}

/* 文本对齐样式 */
:deep(.ProseMirror *[style*="text-align: left"]) {
  text-align: left;
}

:deep(.ProseMirror *[style*="text-align: center"]) {
  text-align: center;
}

:deep(.ProseMirror *[style*="text-align: right"]) {
  text-align: right;
}

/* 空内容占位符样式 */
:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style> 