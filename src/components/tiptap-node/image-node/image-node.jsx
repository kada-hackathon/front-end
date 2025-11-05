"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { X } from "lucide-react"
import "@/components/tiptap-node/image-node/image-node.scss"

export const ImageNode = (props) => {
  const { src, alt, title } = props.node.attrs
  const { deleteNode } = props

  const handleDelete = async (e) => {
    e.stopPropagation()
    console.log("[ImageNode] Delete button clicked for:", src)
    
    if (confirm('Are you sure you want to delete this image?')) {
      console.log("[ImageNode] Deletion confirmed")
      
      // Import media manager
      const { mediaManager } = await import("@/lib/media-manager")
      
      // Mark for deletion (will be deleted on save)
      console.log("[ImageNode] Calling addPendingDeletion for:", src)
      mediaManager.addPendingDeletion(src)
      
      // Verify it was added
      const pending = mediaManager.getPendingDeletions()
      console.log("[ImageNode] Pending deletions after adding:", pending)
      
      // Remove from editor immediately
      console.log("[ImageNode] Removing node from editor")
      deleteNode()
    } else {
      console.log("[ImageNode] Deletion cancelled by user")
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
