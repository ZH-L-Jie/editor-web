import Document from '@tiptap/extension-document'
import { Plugin } from '@tiptap/pm/state'

export const CustomDocument = Document.extend({
  name: 'customDocument',

  // 保持内容规则为任意块级元素
  // content: 'heading{1} block+',有Bug所有的自定义组件回车会多一行
  content: 'block+',

  // addProseMirrorPlugins() {
  //   const plugin = new Plugin({
  //     // appendTransaction: (transactions, oldState, newState) => {
  //     //   console.log('transactions', transactions)
  //     //   console.log('oldState', oldState)
  //     //   console.log('newState', newState)
  //     //   // 如果没有任何改变，直接返回
  //     //   if (!transactions.some(tr => tr.docChanged)) return null
  //     //   console.log('docChanged')
  //     //   const { doc, tr } = newState
  //     //   let transaction = tr

  //     //   // 情况1: 如果文档为空，插入 h1 标题
  //     //   if (doc.content.size === 0) {
  //     //     const { heading } = newState.schema.nodes
  //     //     transaction = transaction.insert(0, heading.create({ level: 1 }))
  //     //     console.log('1')
  //     //     return null
  //     //   }

  //     //   // 情况2: 检查第一个节点是否为 h1
  //     //   const firstNode = doc.firstChild
  //     //   if (firstNode && firstNode.type.name !== 'heading') {
  //     //     const { heading } = newState.schema.nodes
  //     //     // 在文档开始处插入 h1 标题
  //     //     transaction = transaction.insert(0, heading.create({ level: 1 }))
  //     //     console.log('2')
  //     //     return null
  //     //   }

  //     //   // 情况3: 如果第一个节点是 heading 但不是 h1
  //     //   if (firstNode && 
  //     //       firstNode.type.name === 'heading' && 
  //     //       firstNode.attrs.level !== 1) {
  //     //     // 将现有标题级别改为 h1
  //     //     transaction = transaction.setNodeMarkup(0, undefined, { level: 1 })
  //     //     console.log('3')
  //     //     return null
  //     //   }
  //     //   console.log('4')
  //     //   return null
  //     // },

  //     props: {
  //       // 处理回车键
  //       handleKeyDown: (view, event) => {
  //         if (event.key === 'Enter' && !event.shiftKey) {
  //           const { state } = view
  //           const { selection } = state
  //           const { $from } = selection
  //           console.log('state', state)
            

  //           console.log(4)
  //           // 如果在第一个 h1 中按回车
  //           if ($from.parent.type.name === 'paragraph' && $from.depth === 1) {
  //             const isEmpty = $from.parent.textContent.trim() === ''
  //           console.log(7)
  //             // 如果标题为空，阻止创建新行
  //             if (isEmpty) {
  //               return true
  //             }
  //                         console.log(5)
  //             // 如果标题不为空，创建新段落
  //             const transaction = state.tr
  //               .split($from.pos)
  //               .scrollIntoView()
              
  //             view.dispatch(transaction)
  //             return true
  //           }
  //         }
  //                     console.log(6)
  //         return false
  //       },
  //     },
  //   })

  //   return [plugin]
  // },
})