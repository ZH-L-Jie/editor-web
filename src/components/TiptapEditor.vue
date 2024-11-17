<template>
  <div class="editor-container">
    <div class="editor">
      <!-- 工具栏 -->
      <div v-if="editor" class="menubar">
        <div class="button-groups">
          <!-- 撤销重做组 -->
          <div class="button-group">
            <n-button-group>
              <n-button @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()">
                撤销
              </n-button>
              <n-button @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()">
                重做
              </n-button>
            </n-button-group>
          </div>

          <!-- 文本格式组 -->
          <div class="button-group">
            <n-button-group>
              <n-button @click="editor.chain().focus().toggleBold().run()"
                :type="editor.isActive('bold') ? 'primary' : 'default'">
                粗体
              </n-button>
              <n-button @click="editor.chain().focus().toggleItalic().run()"
                :type="editor.isActive('italic') ? 'primary' : 'default'">
                斜体
              </n-button>
              <n-button @click="editor.chain().focus().toggleStrike().run()"
                :type="editor.isActive('strike') ? 'primary' : 'default'">
                删除线
              </n-button>
              <n-button @click="editor.chain().focus().unsetAllMarks().run()">
                清除格式
              </n-button>
            </n-button-group>
          </div>

          <!-- 标题组 -->
          <div class="button-group">
            <n-button-group>
              <n-button v-for="level in [1, 2, 3]" :key="level"
                @click="editor.chain().focus().toggleHeading({ level }).run()"
                :type="editor.isActive('heading', { level }) ? 'primary' : 'default'">
                H{{ level }}
              </n-button>
            </n-button-group>
          </div>

          <!-- 列表组 -->
          <div class="button-group">
            <n-button-group>
              <n-button @click="editor.chain().focus().toggleBulletList().run()"
                :type="editor.isActive('bulletList') ? 'primary' : 'default'">
                无序列表
              </n-button>
              <n-button @click="editor.chain().focus().toggleOrderedList().run()"
                :type="editor.isActive('orderedList') ? 'primary' : 'default'">
                有序列表
              </n-button>
            </n-button-group>
          </div>

          <!-- 引用和代码块组 -->
          <div class="button-group">
            <n-button-group>
              <n-button @click="editor.chain().focus().toggleBlockquote().run()"
                :type="editor.isActive('blockquote') ? 'primary' : 'default'">
                引用
              </n-button>
              <n-button @click="editor.chain().focus().toggleCodeBlock().run()"
                :type="editor.isActive('codeBlock') ? 'primary' : 'default'">
                代码块
              </n-button>
            </n-button-group>
          </div>

          <!-- 其他功能组 -->
          <div class="button-group">
            <n-button-group>
              <n-button @click="editor.chain().focus().setHardBreak().run()">
                换行
              </n-button>
              <n-button @click="insertHorizontalRule">
                分割线
              </n-button>
              <n-button @click="editor.chain().focus().clearNodes().run()">
                清除节点
              </n-button>
            </n-button-group>
          </div>

          <!-- 图片上传组 -->
          <div class="button-group">
            <n-upload :show-file-list="false" @change="handleImageUpload" accept=".jpg,.jpeg,.png,.gif,.webp"
              :max-size="2097152" @before-upload="beforeUpload">
              <n-button>插入图片</n-button>
            </n-upload>
          </div>

          <!-- 高亮按钮组 -->
          <div class="button-group color-button-group">
            <n-color-picker :show-alpha="false" :actions="['confirm', 'clear']" default-value="#18A058" :swatches="[
              '#FFFFFF',
              '#18A058',
              '#2080F0',
              '#F0A020',
              'rgba(208, 48, 80, 1)'
            ]" @confirm="setHighlight" @clear="editor.chain().focus().unsetHighlight().run()">
            </n-color-picker>
          </div>
        </div>
      </div>

      <!-- 编辑器内容区 -->
      <editor-content :editor="editor" class="editor-content" />
    </div>

    <!-- 图片菜单 -->
    <n-dropdown :show="showImageMenu" :options="imageMenuOptions" :x="menuX" :y="menuY" placement="bottom-start"
      @select="handleImageResize" @clickoutside="closeImageMenu" />

    <!-- 自定义尺寸对话框 -->
    <n-modal v-model:show="showCustomSizeModal" title="自定义图片尺寸" preset="dialog" positive-text="确认" negative-text="取消"
      @positive-click="handleCustomSize" @negative-click="closeCustomSizeModal">
      <n-input-group>
        <n-input-number v-model:value="customSize" :min="1" :max="500" :precision="0" />
        <n-button-group>
          <n-button>%</n-button>
        </n-button-group>
      </n-input-group>
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import { NButton, NButtonGroup, NUpload, NDropdown, NModal, NInputGroup, NInputNumber, NColorPicker } from 'naive-ui'
import {
  CustomDocument,
  CustomHeading,
  CustomParagraph,
  CustomBulletList,
  CustomOrderedList,
  CustomBlockquote,
  CustomCodeBlock,
} from '../extensions'
import Placeholder from '@tiptap/extension-placeholder'
import Document from '@tiptap/extension-document'

const CustomDocument2 = Document.extend({
  content: 'heading block*',
})

const showImageMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const selectedImage = ref(null)
const showCustomSizeModal = ref(false)
const customSize = ref(100)
const currentImage = ref(null)

const imageMenuOptions = [
  { label: '25%', key: '25' },
  { label: '50%', key: '50' },
  { label: '75%', key: '75' },
  { label: '100%', key: '100' },
  { label: '150%', key: '150' },
  { type: 'divider' },
  { label: '自定义', key: 'custom' },
]

const setHighlight = (color) => {
  if (!editor.value) return

  const { from, to } = editor.value.state.selection
  if (from === to) {
    window.$message.warning('请先选择要高亮的文本')
    return
  }

  try {
    editor.value.chain()
      .focus()
      .setHighlight({ color })
      .setTextSelection(to)
      .unsetHighlight()
      .run()
  } catch (error) {
    console.error('设置高亮时出错:', error)
    window.$message.error('设置高亮失败')
  }
}

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      document: false,
      heading: false,
      paragraph: false,
      bulletList: false,
      orderedList: false,
      blockquote: false,
      codeBlock: false,
      history: true,
    }),
    CustomDocument2,
    CustomHeading,
    CustomParagraph,
    CustomBulletList,
    CustomOrderedList,
    CustomBlockquote,
    CustomCodeBlock,
    Highlight.configure({
      multicolor: true,
      HTMLAttributes: {
        class: 'highlight-text'
      }
    }),
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'resizable-image',
      },
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return '请输入标题...'
        }
        return '请输入正文内容...'
      },
      includeChildren: true,
      showOnlyCurrent: true,
      showOnlyWhenEditable: true,
    }),
  ],
  content: '',
  autofocus: true,
  editable: true,
  onCreate: ({ editor }) => {
    editor.view.dom.addEventListener('contextmenu', handleImageContextMenu)
  },
  onDestroy: ({ editor }) => {
    editor.view.dom?.removeEventListener('contextmenu', handleImageContextMenu)
  }
})

const beforeUpload = (data) => {
  const file = data.file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    window.$message.error('只能上传 JPG、PNG、GIF 或 WebP 格式的图片')
    return false
  }
  if (file.size > 2 * 1024 * 1024) {
    window.$message.error('图片大小不能超过 2MB')
    return false
  }
  return true
}

const handleImageUpload = (data) => {
  const { file } = data
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    editor.value.chain()
      .focus()
      .setImage({ src: e.target.result })
      .run()
  }
  reader.readAsDataURL(file.file)
}

const handleImageContextMenu = (event) => {
  const target = event.target
  if (target.tagName === 'IMG') {
    event.preventDefault()
    showImageMenu.value = true
    menuX.value = event.clientX
    menuY.value = event.clientY
    selectedImage.value = target
    currentImage.value = target
  }
}

const closeImageMenu = () => {
  showImageMenu.value = false
  if (!showCustomSizeModal.value) {
    selectedImage.value = null
    currentImage.value = null
  }
}

const handleImageResize = (size) => {
  if (size === 'custom') {
    currentImage.value = selectedImage.value
    showCustomSizeModal.value = true
    showImageMenu.value = false
    return
  }

  if (!selectedImage.value) return

  const originalWidth = selectedImage.value.naturalWidth
  const sizeValue = parseInt(size)
  const newWidth = (originalWidth * sizeValue) / 100

  selectedImage.value.style.width = `${newWidth}px`
  selectedImage.value.style.height = 'auto'

  showImageMenu.value = false
  selectedImage.value = null
  currentImage.value = null
}

const handleCustomSize = () => {
  if (!currentImage.value) return

  const originalWidth = currentImage.value.naturalWidth
  const newWidth = (originalWidth * customSize.value) / 100

  currentImage.value.style.width = `${newWidth}px`
  currentImage.value.style.height = 'auto'

  showCustomSizeModal.value = false
  selectedImage.value = null
  currentImage.value = null
}

const closeCustomSizeModal = () => {
  showCustomSizeModal.value = false
  customSize.value = 100
  selectedImage.value = null
  currentImage.value = null
}

const insertHorizontalRule = () => {
  editor.value.chain()
    .focus()
    .setHorizontalRule()
    .run()

  setTimeout(() => {
    editor.value.chain()
      .focus()
      .insertContent('<p></p>')
      .run()
  }, 0)
}
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #f5f5f5;
}

.editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.menubar {
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.button-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
}

.button-group {
  display: flex;
  align-items: center;
  /* width: 80px; */
}

.button-group :deep(.n-button) {
  padding: 0 0.75rem;
  height: 32px;
  font-size: 0.875rem;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #fff;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .editor-container {
    padding: 0.75rem;
  }

  .button-groups {
    gap: 0.375rem;
  }

  .button-group :deep(.n-button) {
    padding: 0 0.5rem;
    height: 28px;
    font-size: 0.8125rem;
  }
}

@media (max-width: 768px) {
  .editor-container {
    padding: 0.5rem;
  }

  .menubar {
    padding: 0.5rem;
  }

  .button-groups {
    gap: 0.25rem;
  }

  .button-group :deep(.n-button) {
    padding: 0 0.375rem;
    height: 26px;
    font-size: 0.75rem;
  }

  .editor-content {
    padding: 1rem;
  }
}

/* 编辑器内容样式 */
:deep(.ProseMirror) {
  min-height: 100%;
  outline: none;
  word-wrap: break-word;

  >*+* {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
    padding: 0.2em 0.4em;
    border-radius: 0.25em;
  }

  pre {
    background: #f6f8fa;
    color: #24292e;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin: 1rem 0;
    overflow-x: auto;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.875rem;
      font-family: inherit;
      tab-size: 4;
    }
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
    color: rgba(#0D0D0D, 0.8);
  }

  hr {
    height: 2px;
    border-width: 0;
    background-color: #e5e7eb;
    margin: 2rem 0;
    padding: 0;

    &:hover {
      background-color: #d1d5db;
    }
  }

  hr+* {
    margin-top: 1rem;
  }

  *+hr {
    margin-top: 1rem;
  }

  mark {
    border-radius: 2px;
    padding: 0 2px;
  }

  .highlight-text {
    border-radius: 2px;
    padding: 0 2px;
  }
}

:deep(.resizable-image) {
  display: block;
  max-width: 100%;
  height: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1em 0;

  &:hover {
    box-shadow: 0 0 0 2px #68cef8;
  }
}

/* 自定义滚动条样式 */
.editor-content::-webkit-scrollbar {
  width: 8px;
}

.editor-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.editor-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.editor-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 修改颜色选择器按钮组样式 */
.color-button-group {
  width: 80px;
}
</style>