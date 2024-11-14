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

      <!-- 添加图片上传按钮 -->
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

      <!-- 添加链接按钮组 -->
      <n-button-group>
        <n-button 
          @click="handleLink"
          :type="editor.isActive('link') ? 'primary' : 'default'"
        >
          链接
        </n-button>
      </n-button-group>
    </div>
    
    <!-- 编辑器内容区域 -->
    <editor-content :editor="editor" class="editor-content" />

    <!-- 图片上下文菜单 -->
    <n-dropdown
      :show="showImageMenu"
      :options="imageMenuOptions"
      :x="menuX"
      :y="menuY"
      placement="bottom-start"
      @select="handleImageResize"
      @clickoutside="closeImageMenu"
    />

    <!-- 自定义尺寸对话框 -->
    <n-modal
      v-model:show="showCustomSizeModal"
      title="自定义图片尺寸"
      preset="dialog"
      positive-text="确认"
      negative-text="取消"
      @positive-click="handleCustomSize"
      @negative-click="closeCustomSizeModal"
      :mask-closable="false"
      :close-on-esc="false"
    >
      <n-input-group>
        <n-input-number
          v-model:value="customSize"
          :min="1"
          :max="500"
          :precision="0"
        />
        <n-button-group>
          <n-button>%</n-button>
        </n-button-group>
      </n-input-group>
      <n-text depth="3" style="margin-top: 10px; display: block;">
        请输入 1-500 之间的数值
      </n-text>
    </n-modal>
  </div>
</template>

<script setup>
// 导入必要的依赖
import { ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3' // Tiptap核心组件
import StarterKit from '@tiptap/starter-kit' // Tiptap基础功能包
import TextAlign from '@tiptap/extension-text-align' // 文本对齐扩展
import Highlight from '@tiptap/extension-highlight' // 文本高亮扩展
import Image from '@tiptap/extension-image' // 图片扩展
import Link from '@tiptap/extension-link' // 添加链接扩展导入
import { NButton, NButtonGroup, NUpload, NDropdown, NModal, NInputNumber, NInputGroup, NText } from 'naive-ui' // Naive UI组件
import { onBeforeUnmount } from 'vue' // Vue生命周期钩子
import { TextSelection } from '@tiptap/pm/state' // 添加这行导入

// 图片菜单状态
const showImageMenu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const selectedImage = ref(null)

// 添加自定义尺寸相关的状态
const showCustomSizeModal = ref(false)
const customSize = ref(100)

// 存储当前处理的图片
const currentImage = ref(null)

// 更新图片尺寸选项，启用自定义选项
const imageMenuOptions = [
  { label: '25%', key: '25' },
  { label: '33%', key: '33' },
  { label: '50%', key: '50' },
  { label: '67%', key: '67' },
  { label: '75%', key: '75' },
  { label: '100%', key: '100' },
  { label: '133%', key: '133' },
  { label: '150%', key: '150' },
  { type: 'divider' },
  { label: '自定义', key: 'custom' },
]

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

// 添加上传前的验证函数
const beforeUpload = (data) => {
  const file = data.file
  
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    window.$message.error('只能上传 JPG、PNG、GIF 或 WebP 格式的图片')
    return false
  }
  
  // 检查文件大小（2MB）
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    window.$message.error('图片大小不能超过 2MB')
    return false
  }
  
  return true
}

// 图片相关功能注释
const handleImageUpload = (data) => {
  console.log('开始处理图片上传:', {
    file: data.file,
    fileType: data.file?.file?.type,
    fileName: data.file?.file?.name
  })

  const { file } = data
  if (!file) {
    console.warn('没有获取到文件')
    return
  }

  // 使用 FileReader 读取图片文件
  const reader = new FileReader()
  reader.onload = (e) => {
    console.log('文件读取完成，开始插入图片')
    try {
      // 插入图片节点，使用 type: 'image' 确保图片正确渲染
      editor.value.chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: {
            src: e.target.result,
            alt: file.file.name,
            title: file.file.name,
            class: 'resizable-image', // 添加类名以支持大小调整
          }
        })
        .focus('end') // 将光标移动到图片后
        .run()

      console.log('图片插入完成')
      window.$message.success('片插入成功')
    } catch (error) {
      console.error('插入图片时出错:', error)
      console.error('错误堆栈:', error.stack)
      window.$message.error('图片插入失败')
    }
  }

  reader.onerror = (error) => {
    console.error('读取文件失败:', error)
    window.$message.error('图片读取失败')
  }

  try {
    console.log('开始读取文件')
    reader.readAsDataURL(file.file)
  } catch (error) {
    console.error('读取文件时出错:', error)
    console.error('错误堆栈:', error.stack)
    window.$message.error('图片读取失败')
  }
}

// 图片右键菜单处理
const handleImageContextMenu = (event) => {
  const target = event.target
  console.log('右键点击目标:', target)
  if (target.tagName === 'IMG') {
    event.preventDefault() // 阻止默认右键菜单
    showImageMenu.value = true // 显示自定义菜单
    // 设置菜单位置为鼠标点击位置
    menuX.value = event.clientX
    menuY.value = event.clientY
    // 保存当前选中的图片引用
    selectedImage.value = target
    currentImage.value = target
    console.log('选中图片:', {
      naturalWidth: target.naturalWidth,
      currentWidth: target.offsetWidth,
      src: target.src
    })
  }
}

// 关闭图片菜单
const closeImageMenu = () => {
  console.log('关闭图片菜单')
  showImageMenu.value = false
  // 不清除 currentImage，因为可能还需要用于自定义尺寸
  if (!showCustomSizeModal.value) {
    selectedImage.value = null
    currentImage.value = null
  }
}

// 关闭自定义尺寸对话框
const closeCustomSizeModal = () => {
  showCustomSizeModal.value = false
  customSize.value = 100
  // 清除所有引用
  selectedImage.value = null
  currentImage.value = null
}

// 处理自定义尺寸
const handleCustomSize = () => {
  console.log('处理自定义尺寸:', {
    currentImage: currentImage.value,
    customSize: customSize.value
  })
  
  if (!currentImage.value) {
    console.warn('没有选中的图片')
    return
  }

  // 获取图片原始尺寸
  const originalWidth = currentImage.value.naturalWidth
  console.log('原始宽度:', originalWidth)
  
  // 计算新的宽度
  const newWidth = (originalWidth * customSize.value) / 100
  console.log('计算的新宽度:', newWidth)
  
  try {
    // 使用 currentImage 而不是 selectedImage
    currentImage.value.style.width = `${newWidth}px`
    currentImage.value.style.height = 'auto'
    console.log('已设置新的宽度和高度')
  } catch (error) {
    console.error('设置图片尺寸时出错:', error)
  }
  
  // 关闭对话框
  showCustomSizeModal.value = false
  // 清除引用
  selectedImage.value = null
  currentImage.value = null
}

// 图片尺寸调整处理
const handleImageResize = (size) => {
  console.log('处理图片尺寸:', size)
  
  if (size === 'custom') {
    // 如果选择自定义尺寸，打开自定义尺寸对话框
    currentImage.value = selectedImage.value
    showCustomSizeModal.value = true
    showImageMenu.value = false
    return
  }

  if (!selectedImage.value) {
    console.warn('没有选中的图片')
    return
  }

  // 处理预设尺寸调整
  const originalWidth = selectedImage.value.naturalWidth
  const sizeValue = parseInt(size)
  const newWidth = (originalWidth * sizeValue) / 100
  
  // 设置新的宽度，保持宽高比
  selectedImage.value.style.width = `${newWidth}px`
  selectedImage.value.style.height = 'auto'
  
  // 关闭菜单并清除引用
  showImageMenu.value = false
  selectedImage.value = null
  currentImage.value = null
}

// 添加新的函数来处理点击外部
const handleClickOutside = () => {
  console.log('点击外部，当前状态:', {
    selectedImage: selectedImage.value,
    showImageMenu: showImageMenu.value,
    showCustomSizeModal: showCustomSizeModal.value
  })
  closeImageMenu()
}

// 添加链接处理函数
const handleLink = () => {
  // 获取剪贴板内容
  navigator.clipboard.readText().then(url => {
    // 检查是否是有效的URL
    try {
      new URL(url)
      // 如果是有效的URL，设置链接
      editor.value.chain()
        .focus()
        .setLink({ href: url })
        .run()
    } catch {
      window.$message.error('请复制有效的URL地址')
    }
  }).catch(() => {
    window.$message.error('无法读取剪贴板内容')
  })
}

// 添加链接点击处理函数
const handleLinkClick = (event) => {
  const link = event.target.closest('a')
  if (link) {
    link.setAttribute('data-visited', 'true')
  }
}

// 初始化Tiptap编辑器
const editor = useEditor({
  // 配置编辑器扩展
  extensions: [
    // 配置StarterKit，包含基础编辑功能
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: 'heading',
        }
      }
    }),
    // 配置文本对齐功能
    TextAlign.configure({
      types: ['heading', 'paragraph', 'image'], // 可以对齐的元素类型
      defaultAlignment: 'left', // 默认左对齐
    }),
    Highlight, // 启用文本高亮功能
    // 配置图片扩展
    Image.configure({
      inline: false, // 图片独占一行
      allowBase64: true, // 允许 base64 图片
      HTMLAttributes: {
        class: 'resizable-image',
        draggable: false // 禁用拖拽
      },
    }),
    // 修改链接扩展配置
    Link.configure({
      openOnClick: true,
      HTMLAttributes: {
        class: 'custom-link',
        target: '_blank', // 在新标签页打开
        rel: 'noopener noreferrer', // 安全属性
      },
    }),
  ],
  content: '<p>开始编辑吧!</p>', // 编辑器初始内容
  autofocus: true, // 自动获取焦点
  editable: true, // 可编辑
  onCreate: ({ editor }) => {
    console.log('编辑器创建完成')
    editor.view.dom.addEventListener('contextmenu', handleImageContextMenu)
    // 添加链接点击事件监听
    editor.view.dom.addEventListener('click', handleLinkClick)
  },
  onUpdate: ({ editor }) => {
    console.log('编辑器内容更新:', {
      isEmpty: editor.isEmpty,
      contentSize: editor.state.doc.content.size
    })
  },
  onPaste: ({ editor, event }) => {
    // 检查事件对象是否存在
    if (!event?.clipboardData) {
      console.warn('无法获取粘贴内容')
      return
    }

    console.log('触发粘贴事件')
    const items = Array.from(event.clipboardData.items || [])
    console.log('粘贴内容:', items.map(item => ({
      type: item.type,
      kind: item.kind
    })))
    
    const imageItem = items.find(item => item.type.startsWith('image'))
    if (imageItem) {
      console.log('发现图片内容:', imageItem.type)
      event.preventDefault()
      const file = imageItem.getAsFile()
      
      if (file) {
        console.log('获取到图片文件:', {
          name: file.name,
          type: file.type,
          size: file.size
        })
        
        const reader = new FileReader()
        reader.onload = (e) => {
          console.log('图片文件读取完成')
          try {
            editor.chain()
              .focus()
              .insertContent('<p></p>')
              .insertContent({
                type: 'image',
                attrs: {
                  src: e.target.result,
                  alt: 'Pasted image',
                  class: 'resizable-image',
                }
              })
              .insertContent('<p></p>')
              .focus('end')
              .run()
            console.log('粘贴图片插入完成')
          } catch (error) {
            console.error('插入粘贴图片时出错:', error)
          }
        }

        reader.onerror = (error) => {
          console.error('读取粘贴图片失败:', error)
        }

        reader.readAsDataURL(file)
      }
    }
  },
  onDestroy: ({ editor }) => {
    console.log('编辑器销毁')
    editor.view.dom?.removeEventListener('contextmenu', handleImageContextMenu)
    // 移除链接点击事件监听
    editor.view.dom?.removeEventListener('click', handleLinkClick)
  }
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
:deep(.ProseMirror h1.heading) {
  font-size: 2em;
  margin: 0.67em 0;
  text-align: left !important; /* 强制左对齐 */
}

:deep(.ProseMirror h2.heading) {
  font-size: 1.5em;
  margin: 0.75em 0;
}

:deep(.ProseMirror h3.heading) {
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

/* 修改图片样式 */
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

/* 添加自定义尺寸对话框样式 */
:deep(.n-input-group) {
  width: 200px;
}

/* 修改链接样式 */
:deep(.ProseMirror .custom-link) {
  color: #1890ff !important; /* 默认蓝色，使用 !important 确保优先级 */
  text-decoration: underline; /* 下划线 */
  cursor: pointer;
  transition: color 0.3s; /* 添加颜色过渡效果 */
}

:deep(.ProseMirror .custom-link:hover) {
  opacity: 0.8;
}

/* 只在点击后变为红色 */
:deep(.ProseMirror .custom-link[data-visited="true"]) {
  color: #f5222d !important; /* 点击后变红色 */
}
</style> 