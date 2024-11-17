import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockView from '../components/CodeBlockView.vue'
import { common, createLowlight } from 'lowlight'

// 创建 lowlight 实例
const lowlight = createLowlight(common)

// 注册你想要支持的语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import swift from 'highlight.js/lib/languages/swift'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'

// 注册所有语言
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('cpp', cpp)
lowlight.register('csharp', csharp)
lowlight.register('go', go)
lowlight.register('rust', rust)
lowlight.register('php', php)
lowlight.register('ruby', ruby)
lowlight.register('swift', swift)
lowlight.register('sql', sql)
lowlight.register('bash', bash)
lowlight.register('json', json)
lowlight.register('yaml', yaml)
lowlight.register('markdown', markdown)

export const CustomCodeBlock = CodeBlockLowlight.extend({
  name: 'codeBlock',

  // addOptions() {
  //   return {
  //     ...this.parent?.(),
  //     lowlight,
  //     defaultLanguage: 'plain',
  //     HTMLAttributes: {
  //       class: 'custom-code-block',
  //     },
  //   }
  // },

  // addAttributes() {
  //   return {
  //     ...this.parent?.(),
  //     language: {
  //       default: 'plain',
  //       parseHTML: element => element.getAttribute('language') || 'plain',
  //       renderHTML: attributes => ({
  //         language: attributes.language,
  //         class: `language-${attributes.language}`,
  //       }),
  //     },
  //     'data-description': {
  //       default: null,
  //       parseHTML: element => element.getAttribute('data-description'),
  //       renderHTML: attributes => ({
  //         'data-description': attributes['data-description'],
  //       }),
  //     },
  //   }
  // },

  addNodeView() {
    return VueNodeViewRenderer(CodeBlockView)
  },
  }).configure({
  lowlight,
  defaultLanguage: 'plain',


  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
    }
  },

  // parseHTML() {
  //   return [
  //     {
  //       tag: 'pre',
  //       preserveWhitespace: 'full',
  //     },
  //   ]
  // },
}) 