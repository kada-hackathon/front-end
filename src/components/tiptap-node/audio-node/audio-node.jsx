"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import "@/components/tiptap-node/audio-node/audio-node.scss"

export const AudioNode = (props) => {
  const { src, title, controls } = props.node.attrs

  return (
    <NodeViewWrapper className="tiptap-audio-node">
      <div className="tiptap-audio-wrapper">
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
