import * as React from "react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { useImageUpload } from "@/components/tiptap-ui/image-upload-button"
import { useVideoUpload } from "./use-video-upload"
import { useAudioUpload } from "./use-audio-upload"
import { useDocumentUpload } from "./use-document-upload"

export function MediaUploadButton({
  editor: providedEditor,
  type,
  text,
  showTooltip = true,
  onInserted,
}) {
  const { editor } = useTiptapEditor(providedEditor)

  const imageUpload = useImageUpload({ editor, onInserted })
  const videoUpload = useVideoUpload({ editor, onInserted })
  const audioUpload = useAudioUpload({ editor, onInserted })
  const documentUpload = useDocumentUpload({ editor, onInserted })

  const uploadMap = {
    image: imageUpload,
    video: videoUpload,
    audio: audioUpload,
    document: documentUpload,
  }

  const upload = uploadMap[type]

  if (!upload) return null

  const handleClick = (event) => {
    event.preventDefault()
    if (type === "image") upload.handleImage()
    if (type === "video") upload.handleVideo()
    if (type === "audio") upload.handleAudio()
    if (type === "document") upload.handleDocument()
  }

  const { Icon, label, canInsert, isActive } = upload

  return (
    <Button
      type="button"
      data-style="ghost-menu"
      data-active-state={isActive ? "on" : "off"}
      role="menuitem"
      tabIndex={-1}
      disabled={!canInsert}
      data-disabled={!canInsert}
      aria-label={label}
      tooltip={showTooltip ? label : undefined}
      onClick={handleClick}
      style={{ width: "100%", justifyContent: "flex-start" }}>
      <Icon className="tiptap-button-icon" />
      {text && <span className="tiptap-button-text">{text}</span>}
    </Button>
  );
}
