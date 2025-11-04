"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { X } from "lucide-react"
import { deleteMediaFile } from "@/lib/tiptap-utils"
import "@/components/tiptap-node/audio-node/audio-node.scss"

export const AudioNode = (props) => {
  const { src, title, controls } = props.node.attrs
  const { deleteNode } = props

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this audio?')) {
      // Delete from DigitalOcean first
      await deleteMediaFile(src)
      // Then remove from editor
      deleteNode()
    }
  }

  return (
    <NodeViewWrapper className="tiptap-audio-node">
      <div className="tiptap-audio-wrapper">
        <button
          className="tiptap-audio-delete"
          onClick={handleDelete}
          title="Delete audio"
          aria-label="Delete audio"
        >
          <X size={16} />
        </button>
        <audio
          src={src}
          title={title}
          controls={controls}
          className="tiptap-audio"
        >
          Your browser does not support the audio tag.
        </audio>
        {title && <div className="tiptap-audio-caption">{title}</div>}
      </div>
    </NodeViewWrapper>
  )
}
