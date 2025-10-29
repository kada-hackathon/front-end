"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import "@/components/tiptap-node/video-node/video-node.scss"

export const VideoNode = (props) => {
  const { src, title, controls } = props.node.attrs

  return (
    <NodeViewWrapper className="tiptap-video-node">
      <div className="tiptap-video-wrapper">
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
