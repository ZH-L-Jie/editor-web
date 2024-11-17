import { Editor } from '@tiptap/vue-3'
import { MessageApi } from 'naive-ui'

interface DocumentData {
  content: any;
  meta?: {
    title?: string;
    createdAt?: string;
    updatedAt?: string;
    version?: string;
  };
}

export class DocumentHelper {
  private editor: Editor
  private message?: MessageApi

  constructor(editor: Editor, message?: MessageApi) {
    this.editor = editor
    this.message = message
  }

  /**
   * 导出文档到文件
   * @param filename 文件名（可选）
   */
  async exportDocument(filename?: string) {
    if (!this.editor) return

    try {
      const documentData: DocumentData = {
        content: this.editor.getJSON(),
        meta: {
          title: filename || 'document',
          createdAt: new Date().toISOString(),
          version: '1.0.0'
        }
      }

      const blob = new Blob([JSON.stringify(documentData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `${filename || 'document'}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      this.message?.success('文档导出成功')
    } catch (error) {
      console.error('导出文档失败:', error)
      this.message?.error('文档导出失败')
    }
  }

  /**
   * 从文件导入文档
   * @param file 文件对象
   */
  async importDocument(file: File): Promise<boolean> {
    if (!this.editor || !file) return false

    try {
      const content = await file.text()
      const documentData: DocumentData = JSON.parse(content)

      if (!documentData.content) {
        throw new Error('无效的文档格式')
      }

      this.editor.commands.setContent(documentData.content)
      this.message?.success('文档导入成功')
      return true
    } catch (error) {
      console.error('导入文档失败:', error)
      this.message?.error('文档导入失败')
      return false
    }
  }

  /**
   * 从 API 加载文档
   * @param documentId 文档ID
   * @param apiUrl API地址
   */
  async loadFromApi(documentId: string, apiUrl: string): Promise<boolean> {
    if (!this.editor) return false

    try {
      const response = await fetch(`${apiUrl}/documents/${documentId}`)
      if (!response.ok) {
        throw new Error('API请求失败')
      }

      const documentData: DocumentData = await response.json()
      if (!documentData.content) {
        throw new Error('无效的文档格式')
      }

      this.editor.commands.setContent(documentData.content)
      this.message?.success('文档加载成功')
      return true
    } catch (error) {
      console.error('加载文档失败:', error)
      this.message?.error('文档加载失败')
      return false
    }
  }

  /**
   * 保存文档到 API
   * @param documentId 文档ID
   * @param apiUrl API地址
   */
  async saveToApi(documentId: string, apiUrl: string): Promise<boolean> {
    if (!this.editor) return false

    try {
      const documentData: DocumentData = {
        content: this.editor.getJSON(),
        meta: {
          updatedAt: new Date().toISOString(),
        }
      }

      const response = await fetch(`${apiUrl}/documents/${documentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      })

      if (!response.ok) {
        throw new Error('API请求失败')
      }

      this.message?.success('文档保存成功')
      return true
    } catch (error) {
      console.error('保存文档失败:', error)
      this.message?.error('文档保存失败')
      return false
    }
  }
} 