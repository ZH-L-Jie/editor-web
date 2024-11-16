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
    ><code 
      ref="codeElement"
      :class="`language-${selectedLanguage}`"
    ><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/vue-3'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'

// 基础语言支持
import 'prismjs/components/prism-markup'  // HTML/XML 支持
import 'prismjs/components/prism-clike'   // C-like 语言基础支持
import 'prismjs/components/prism-javascript'  // JavaScript 支持

// 其他语言支持（按依赖顺序排列）
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-markup-templating'  // PHP 需要这个依赖
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-powershell'

// 语言别名映射
const languageAliases: Record<string, string> = {
  'html': 'markup',
  'shell': 'bash',
  'dockerfile': 'docker',
  'xml': 'markup',
  'vue': 'markup'
}

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
  
  // 更新 DOM 元素的类名
  if (codeElement.value) {
    // 移除旧的语言类
    codeElement.value.classList.forEach(className => {
      if (className.startsWith('language-')) {
        codeElement.value?.classList.remove(className)
      }
    })
    // 添加新的语言类
    codeElement.value.classList.add(`language-${target.value}`)
  }
  
  props.updateAttributes({
    language: target.value,
  })
  
  // 重新应用高亮
  highlightCode()
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
    // 获取实际的语言标识符
    const actualLanguage = languageAliases[selectedLanguage.value] || selectedLanguage.value
    
    console.log('执行代码高亮前:', {
      language: selectedLanguage.value,
      actualLanguage,
      codeLength: codeContent.length,
      rawCode: codeContent,
      beforeHighlight: {
        textContent: codeElement.value.textContent,
        innerHTML: codeElement.value.innerHTML,
        outerHTML: codeElement.value.outerHTML,
        classList: Array.from(codeElement.value.classList),
        style: codeElement.value.getAttribute('style')
      }
    })
    
    try {
      // 确保使用正确的语言标识符
      codeElement.value.className = `language-${actualLanguage}`
      Prism.highlightElement(codeElement.value)
      
      // 等待下一个 tick，确保高亮已经应用
      setTimeout(() => {
        if (codeElement.value) {
          const highlightedTokens = Array.from(codeElement.value.children).map(node => ({
            type: node.nodeType,
            className: node.className,
            textContent: node.textContent
          }))

          console.log('代码高亮完成:', {
            language: selectedLanguage.value,
            actualLanguage,
            afterHighlight: {
              textContent: codeElement.value.textContent,
              innerHTML: codeElement.value.innerHTML,
              outerHTML: codeElement.value.outerHTML,
              classList: Array.from(codeElement.value.classList),
              style: codeElement.value.getAttribute('style'),
              tokens: highlightedTokens
            },
            tokenCount: highlightedTokens.length,
            hasHighlightClasses: codeElement.value.innerHTML.includes('token')
          })
        }
        
        // 全局代码高亮
        Prism.highlightAll()
      }, 0)
    } catch (error) {
      console.error('代码高亮失败:', {
        error,
        language: selectedLanguage.value,
        actualLanguage,
        code: codeContent,
        element: {
          exists: !!codeElement.value,
          type: codeElement.value?.nodeType,
          classList: Array.from(codeElement.value?.classList || [])
        }
      })
    }
  } else {
    console.warn('代码元素不存在')
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

/* 添加全局样式以确保代码高亮正确显示 */
.code-block pre {
  background: #f5f5f5;
  padding: 1em;
  margin: .5em 0;
  overflow: auto;
  border-radius: 4px;
}

/* Prism.js 默认主题的一些重要样式 */
:deep(.token.comment),
:deep(.token.prolog),
:deep(.token.doctype),
:deep(.token.cdata) {
  color: #998;
  font-style: italic;
}

:deep(.token.function) {
  color: #dd4a68;
}

:deep(.token.keyword) {
  color: #07a;
}

:deep(.token.string) {
  color: #690;
}

:deep(.token.number) {
  color: #905;
}

:deep(.token.operator) {
  color: #9a6e3a;
}

:deep(.token.class-name) {
  color: #dd4a68;
}

:deep(.token.property) {
  color: #905;
}
</style> 