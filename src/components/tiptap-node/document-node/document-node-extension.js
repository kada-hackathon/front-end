import { mergeAttributes, Node } from "@tiptap/react"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { DocumentNode as DocumentNodeComponent } from "@/components/tiptap-node/document-node/document-node"

/**
 * A Tiptap node extension for displaying document content.
 */
export const DocumentNode = Node.create({
  name: "document",

  group: "block",

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => element.getAttribute('data-src'),
        renderHTML: attributes => {
          if (!attributes.src) {
            return {}
          }
          return { 'data-src': attributes.src }
        },
      },
      filename: {
        default: null,
        parseHTML: element => element.getAttribute('data-filename'),
        renderHTML: attributes => {
          if (!attributes.filename) {
            return {}
          }
          return { 'data-filename': attributes.filename }
        },
      },
      filesize: {
        default: null,
        parseHTML: element => element.getAttribute('data-filesize'),
        renderHTML: attributes => {
          if (!attributes.filesize) {
            return {}
          }
          return { 'data-filesize': attributes.filesize }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="document"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ 'data-type': 'document' }, this.options.HTMLAttributes, HTMLAttributes),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DocumentNodeComponent)
  },

  addCommands() {
    return {
      setDocument:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          })
        },
    }
  },
})

export default DocumentNode
