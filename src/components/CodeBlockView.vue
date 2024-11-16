<template>
  <node-view-wrapper class="code-block-wrapper">
    <!-- 代码块描述 -->
    <input
      v-model="description"
      class="code-block-description"
      placeholder="输入代码块描述..."
      @input="updateDescription"
    />
    
    <div class="code-block-header">
      <!-- 语言选择器 -->
      <select
        :value="selectedLanguage"
        class="language-selector"
        @change="updateLanguage($event)"
      >
        <option v-for="lang in languageList" :key="lang" :value="lang">
          {{ lang }}
        </option>
      </select>

      <!-- 复制按钮 -->
      <button class="copy-button" @click="copyCode">
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>

    <pre
      ref="preElement"
      class="code-block"
      :class="`language-${selectedLanguage}`"
    ><code ref="codeElement"><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
// 导入其他语言支持...

const props = defineProps<{
  node: {
    attrs: {
      language: string;
      'data-description': string | null;
    };
    textContent: string;
  };
  updateAttributes: (attrs: Record<string, any>) => void;
}>()

const preElement = ref<HTMLElement | null>(null)
const codeElement = ref<HTMLElement | null>(null)
const copied = ref(false)
const description = ref(props.node.attrs['data-description'] || '')

const languageList = [
  'plain',
  'javascript',
  'typescript',
  'html',
  'css',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'sql',
  'shell',
  'markdown',
  'json',
  'yaml',
  'xml',
  'bash',
  'powershell',
  'dockerfile',
  'vue'
]

const selectedLanguage = ref(props.node.attrs.language || 'plain')

const updateLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  console.log('更新代码语言:', {
    oldLanguage: selectedLanguage.value,
    newLanguage: target.value
  })
  selectedLanguage.value = target.value
  props.updateAttributes({
    language: target.value,
  })
}

const updateDescription = () => {
  console.log('更新代码描述:', {
    description: description.value
  })
  props.updateAttributes({
    'data-description': description.value,
  })
}

const copyCode = async () => {
  if (codeElement.value) {
    try {
      await navigator.clipboard.writeText(codeElement.value.textContent || '')
      console.log('代码复制成功')
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (error) {
      console.error('代码复制失败:', error)
    }
  }
}

const highlightCode = () => {
  if (codeElement.value) {
    const codeContent = codeElement.value.textContent || ''
    console.log('执行代码高亮:', {
      language: selectedLanguage.value,
      codeLength: codeContent.length,
      beforeHighlight: {
        code: codeContent,
        innerHTML: codeElement.value.innerHTML
      }
    })
    
    try {
      Prism.highlightElement(codeElement.value)
      
      // 等待下一个 tick，确保高亮已经应用
      setTimeout(() => {
        console.log('代码高亮完成:', {
          language: selectedLanguage.value,
          afterHighlight: {
            code: codeElement.value?.textContent,
            code1: codeElement.value,
            innerHTML: codeElement.value?.innerHTML
          }
        })
        Prism.highlightAll()// 全局代码高亮
      }, 100)
    } catch (error) {
      console.error('代码高亮失败:', {
        error,
        language: selectedLanguage.value,
        code: codeContent
      })
    }
  }
}

onMounted(() => {
  console.log('代码块组件挂载完成:', {
    language: props.node.attrs.language,
    description: props.node.attrs['data-description'],
    hasContent: Boolean(props.node.textContent)
  })
  highlightCode()
})

watch(() => props.node.textContent, (newContent, oldContent) => {
  console.log('代码内容变化:', {
    oldLength: oldContent?.length || 0,
    newLength: newContent?.length || 0,
    language: selectedLanguage.value
  })
  highlightCode()
})

watch(() => selectedLanguage.value, (newLang, oldLang) => {
  console.log('语言变化:', {
    oldLanguage: oldLang,
    newLanguage: newLang
  })
  highlightCode()
})
</script>

<style scoped>
.code-block-wrapper {
  position: relative;
  margin: 1em 0;
}

.code-block-description {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.language-selector {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.copy-button {
  padding: 4px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.copy-button:hover {
  background: #45a049;
}

.code-block {
  margin: 0;
  padding: 1em;
  background: #f8f8f8;
  border-radius: 4px;
  overflow-x: auto;
}

:deep(.code-block code) {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style> 