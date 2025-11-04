"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { X } from "lucide-react"
import { deleteMediaFile } from "@/lib/tiptap-utils"
import "@/components/tiptap-node/image-node/image-node.scss"

export const ImageNode = (props) => {
  const { src, alt, title } = props.node.attrs
  const { deleteNode } = props

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this image?')) {
      // Delete from DigitalOcean first
      await deleteMediaFile(src)
      // Then remove from editor
      deleteNode()
    }
  }

  return (
    <NodeViewWrapper className="tiptap-image-node">
      <div className="tiptap-image-wrapper">
        <button
          className="tiptap-image-delete"
          onClick={handleDelete}
          title="Delete image"
          aria-label="Delete image"
        >
          <X size={16} />
        </button>
        <img
          src={src}
          alt={alt || ''}
          title={title || ''}
          className="tiptap-image"
        />
      </div>
    </NodeViewWrapper>
  )
}
