<template>
  <n-config-provider>
    <div class="app-container">
      <h1>Tiptap 富文本编辑器</h1>
      <tiptap-editor />
    </div>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider } from 'naive-ui'
import TiptapEditor from './components/TiptapEditor.vue'
</script>

<style>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
}
</style> 