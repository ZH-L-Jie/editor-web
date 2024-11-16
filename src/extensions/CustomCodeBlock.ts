import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CodeBlockView from '../components/CodeBlockView.vue'

// 创建 lowlight 实例，用于代码语法高亮
const lowlight = createLowlight(common)

// 导入所有支持的编程语言高亮规则
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

// 为 lowlight 注册所有支持的语言
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

/**
 * 自定义代码块扩展
 * 基于 CodeBlockLowlight 扩展，添加了以下功能：
 * 1. 支持多种编程语言的语法高亮
 * 2. 可选择编程语言
 * 3. 支持代码块描述
 * 4. 一键复制代码功能
 */
export const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return VueNodeViewRenderer(CodeBlockView)
  },
}).configure({
  lowlight,
  defaultLanguage: 'plain',
}) 