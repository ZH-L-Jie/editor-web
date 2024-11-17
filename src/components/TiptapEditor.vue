<template>
  <div class="editor">
    <div v-if="editor" class="menubar">
      <n-button-group>
        <n-button 
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
        >
          撤销
        </n-button>
        <n-button 
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
        >
          重做
        </n-button>
      </n-button-group>

      <n-button-group>
        <n-button 
          @click="editor.chain().focus().toggleBold().run()"
          :type="editor.isActive('bold') ? 'primary' : 'default'"
        >
          粗体
        </n-button>
        <n-button 
          @click="editor.chain().focus().toggleItalic().run()"
          :type="editor.isActive('italic') ? 'primary' : 'default'"
        >
          斜体
        </n-button>
        <n-button 
          @click="editor.chain().focus().toggleStrike().run()"
          :type="editor.isActive('strike') ? 'primary' : 'default'"
        >
          删除线
        </n-button>
        <n-button @click="editor.chain().focus().unsetAllMarks().run()">
          清除格式
        </n-button>
      </n-button-group>

      <n-button-group>
        <n-button 
          v-for="level in [1, 2, 3]" 
          :key="level"
          @click="editor.chain().focus().toggleHeading({ level }).run()"
          :type="editor.isActive('heading', { level }) ? 'primary' : 'default'"
        >
          H{{ level }}
        </n-button>
      </n-button-group>

      <n-button-group>
        <n-button 
          @click="editor.chain().focus().toggleBulletList().run()"
          :type="editor.isActive('bulletList') ? 'primary' : 'default'"
        >
          无序列表
        </n-button>
        <n-button 
          @click="editor.chain().focus().toggleOrderedList().run()"
          :type="editor.isActive('orderedList') ? 'primary' : 'default'"
        >
          有序列表
        </n-button>
      </n-button-group>

      <n-button-group>
        <n-button 
          @click="editor.chain().focus().toggleBlockquote().run()"
          :type="editor.isActive('blockquote') ? 'primary' : 'default'"
        >
          引用
        </n-button>
        <n-button 
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :type="editor.isActive('codeBlock') ? 'primary' : 'default'"
        >
          代码块
        </n-button>
      </n-button-group>

      <n-button-group>
        <n-button @click="editor.chain().focus().setHardBreak().run()">
          换行
        </n-button>
        <n-button @click="insertHorizontalRule">
          分割线
        </n-button>
      </n-button-group>

      <n-button-group>
        <n-button @click="editor.chain().focus().clearNodes().run()">
          清除节点
        </n-button>
      </n-button-group>

      <n-button-group>
        <n-upload 
          :show-file-list="false" 
          @change="handleImageUpload" 
          accept=".jpg,.jpeg,.png,.gif,.webp"
          :max-size="2097152" 
          @before-upload="beforeUpload"
        >
          <n-button>插入图片</n-button>
        </n-upload>
      </n-button-group>
    </div>

    <editor-content :editor="editor" />

    <n-dropdown 
      :show="showImageMenu" 
      :options="imageMenuOptions" 
      :x="menuX" 
      :y="menuY" 
      placement="bottom-start"
      @select="handleImageResize" 
      @clickoutside="closeImageMenu" 
    />

    <n-modal 
      v-model:show="showCustomSizeModal" 
      title="自定义图片尺寸" 
      preset="dialog"
      positive-text="确认" 
      negative-text="取消"
      @positive-click="handleCustomSize" 
      @negative-click="closeCustomSizeModal"
    >
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
import { NButton, NButtonGroup, NUpload, NDropdown, NModal, NInputGroup, NInputNumber } from 'naive-ui'
import { CustomDocument } from '../extensions'

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

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      document: false,
      history: true,
      horizontalRule: true,
      hardBreak: true,
    }),
    CustomDocument,
    Image.configure({
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'resizable-image',
      },
    }),
  ],
  content: '<h1>Hi there!</h1><p>This is a basic example of Tiptap.</p>',
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
.editor {
  border: 1px solid #ccc;
  border-radius: 4px;
}

.menubar {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  gap: 0.5rem;
}

:deep(.ProseMirror) {
  padding: 1rem;
  min-height: 200px;
  outline: none;

  > * + * {
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
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
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

  hr + * {
    margin-top: 1rem;
  }

  * + hr {
    margin-top: 1rem;
  }
}

:deep(.resizable-image) {
  display: block;
  max-width: 100%;
  height: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1em 0;
}

:deep(.resizable-image:hover) {
  box-shadow: 0 0 0 2px #68cef8;
}
</style>