"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { X } from "lucide-react"
import "@/components/tiptap-node/video-node/video-node.scss"

export const VideoNode = (props) => {
  const { src, title, controls } = props.node.attrs
  const { deleteNode } = props

  const handleDelete = async (e) => {
    e.stopPropagation()
    console.log("[VideoNode] Delete button clicked for:", src)
    
    if (confirm('Are you sure you want to delete this video?')) {
      const { mediaManager } = await import("@/lib/media-manager")
      mediaManager.addPendingDeletion(src)
      console.log("[VideoNode] Added to pending deletions:", mediaManager.getPendingDeletions())
      deleteNode()
    }
  }

  return (
    <NodeViewWrapper className="tiptap-video-node">
      <div className="tiptap-video-wrapper">
        <button
          className="tiptap-video-delete"
          onClick={handleDelete}
          title="Delete video"
          aria-label="Delete video"
        >
          <X size={16} />
        </button>
        <video
          src={src}
          title={title}
          controls={controls}
          className="tiptap-video"
        >
          Your browser does not support the video tag.
        </video>
        {title && <div className="tiptap-video-caption">{title}</div>}
      </div>
    </NodeViewWrapper>
  )
}
