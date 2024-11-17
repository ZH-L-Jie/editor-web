import Document from '@tiptap/extension-document'
import { Plugin } from '@tiptap/pm/state'



export const CustomDocument = Document.extend({
  name: 'customDocument',

  content: 'heading block*',

//   addProseMirrorPlugins() {
//     const plugin = new Plugin({
//       appendTransaction: (transactions, oldState, newState) => {
//         // 如果没有任何改变，直接返回
//         if (!transactions.some(tr => tr.docChanged)) return null

//         const { doc, tr } = newState
//         let transaction = tr

//         // 如果文档为空，插入标题
//         if (doc.content.size === 0) {
//           const { heading } = newState.schema.nodes
//           transaction = transaction.insert(0, heading.create({ level: 1 }))
//           return transaction
//         }

//         // 检查第一个节点
//         const firstNode = doc.firstChild
//         if (firstNode && firstNode.type.name !== 'heading') {
//           const { heading } = newState.schema.nodes
//           // 在文档开始处插入标题
//           transaction = transaction.insert(0, heading.create({ level: 1 }))
//           return transaction
//         }

//         return null
//       },
//     })

//     return [plugin]
//   },
}) 