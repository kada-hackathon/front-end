"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { X } from "lucide-react"
import { deleteMediaFile } from "@/lib/tiptap-utils"
import "@/components/tiptap-node/video-node/video-node.scss"

export const VideoNode = (props) => {
  const { src, title, controls } = props.node.attrs
  const { deleteNode } = props

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this video?')) {
      // Delete from DigitalOcean first
      await deleteMediaFile(src)
      // Then remove from editor
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
