<template>
  <node-view-wrapper class="code-block-wrapper">
    <div class="code-block-header">
      <select :value="selectedLanguage" class="language-selector" @change="updateLanguage($event)">
        <option v-for="lang in languageList" :key="lang" :value="lang">
          {{ lang }}
        </option>
      </select>

      <input v-model="description" class="code-block-description" placeholder="输入代码块描述..." @input="updateDescription" />

      <button class="copy-button" @click="copyCode">
        {{ copied ? '已复制' : '复制' }}
      </button>
    </div>

    <pre><code ref="codeEl" :class="`language-${selectedLanguage}`"><node-view-content /></code></pre>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3'

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
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'sql',
  'bash',
  'json',
  'yaml',
  'markdown'
]

const selectedLanguage = ref(props.node.attrs.language || 'plain')

// 更新语言时重新高亮
const updateLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedLanguage.value = target.value
  props.updateAttributes({
    language: target.value,
  })
}

const updateDescription = () => {
  props.updateAttributes({
    'data-description': description.value,
  })
}

const copyCode = async () => {
  const code = props.node.textContent
  if (code) {
    try {
      await navigator.clipboard.writeText(code)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch (error) {
      console.error('复制失败:', error)
    }
  }
}
</script>

<style>
.code-block-wrapper {
  position: relative;
  margin: 1em 0;
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  gap: 10px;
}

.language-selector {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  min-width: 100px;
  flex: 0 0 auto;
}

.code-block-description {
  flex: 0 1 300px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  text-align: center;
  margin: 0;
  min-width: 150px;
}

.copy-button {
  padding: 4px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  white-space: nowrap;
  flex: 0 0 auto;
}

.copy-button:hover {
  background: #45a049;
}

/* 修改代码块背景色 */
.code-block-wrapper pre {
  background-color: #f6f8fa !important;
  margin: 0;
  padding: 1em;
  border-radius: 0 0 4px 4px;
  overflow-x: auto;
}

.code-block-wrapper pre code {
  background-color: transparent !important;
  display: block;
  padding: 0;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.5;
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

/* 添加高亮相关样式 */
.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em;
  color: #24292e;
  background: #f6f8fa;
}

.hljs-comment,
.hljs-quote {
  color: #6a737d;
  font-style: italic;
}

.hljs-keyword,
.hljs-selector-tag {
  color: #d73a49;
}

.hljs-string,
.hljs-doctag {
  color: #032f62;
}

.hljs-title,
.hljs-section,
.hljs-selector-id {
  color: #6f42c1;
}

.hljs-template-variable,
.hljs-variable {
  color: #e36209;
}

.hljs-type,
.hljs-tag {
  color: #22863a;
}

.hljs-attribute {
  color: #005cc5;
}

.hljs-symbol,
.hljs-bullet,
.hljs-built_in,
.hljs-builtin-name,
.hljs-meta,
.hljs-number {
  color: #005cc5;
}

.hljs-addition {
  color: #22863a;
  background-color: #f0fff4;
}

.hljs-deletion {
  color: #b31d28;
  background-color: #ffeef0;
}
</style>