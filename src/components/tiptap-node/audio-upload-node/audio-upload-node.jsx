"use client";
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { Button } from "@/components/tiptap-ui-primitive/button"
import "@/components/tiptap-node/audio-upload-node/audio-upload-node.scss"
import { focusNextNode, isValidPosition } from "@/lib/tiptap-utils"
import {
  useFileUpload,
  CloudUploadIcon,
  FileDocIcon,
  FileCornerIcon,
  UploadPreview,
  UploadDragArea,
} from "@/components/tiptap-node/shared/upload-utils"

const DropZoneContent = ({ maxSize, limit }) => (
  <>
    <div className="tiptap-audio-upload-dropzone">
      <FileDocIcon className="tiptap-audio-upload-dropzone-rect-primary" />
      <FileCornerIcon className="tiptap-audio-upload-dropzone-rect-secondary" />
      <div className="tiptap-audio-upload-icon-container">
        <CloudUploadIcon className="tiptap-audio-upload-icon" />
      </div>
    </div>

    <div className="tiptap-audio-upload-content">
      <span className="tiptap-audio-upload-text">
        <em>Click to upload</em> or drag and drop
      </span>
      <span className="tiptap-audio-upload-subtext">
        Maximum {limit} audio{limit === 1 ? "" : "s"}, {maxSize / 1024 / 1024}MB each.
      </span>
    </div>
  </>
)

export const AudioUploadNode = (props) => {
  const { accept, limit, maxSize } = props.node.attrs
  const inputRef = React.useRef(null)
  const extension = props.extension

  const uploadOptions = {
    maxSize,
    limit,
    accept,
    upload: extension.options.upload,
    onSuccess: extension.options.onSuccess,
    onError: extension.options.onError,
  }

  const { fileItems, uploadFiles, removeFileItem, clearAllFiles } =
    useFileUpload(uploadOptions)

  const handleUpload = async (files) => {
    const urls = await uploadFiles(files)

    if (urls.length > 0) {
      const pos = props.getPos()

      if (isValidPosition(pos)) {
        const audioNodes = urls.map((url, index) => {
          const filename =
            files[index]?.name.replace(/\.[^/.]+$/, "") || "unknown"
          return {
            type: "audio",
            attrs: {
              src: url,
              title: filename,
              controls: true,
            },
          }
        })

        props.editor
          .chain()
          .focus()
          .deleteRange({ from: pos, to: pos + props.node.nodeSize })
          .insertContentAt(pos, audioNodes)
          .run()

        focusNextNode(props.editor)
      }
    }
  }

  const handleChange = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      extension.options.onError?.(new Error("No file selected"))
      return
    }
    handleUpload(Array.from(files))
  }

  const handleClick = () => {
    if (inputRef.current && fileItems.length === 0) {
      inputRef.current.value = ""
      inputRef.current.click()
    }
  }

  const hasFiles = fileItems.length > 0

  return (
    <NodeViewWrapper className="tiptap-audio-upload" tabIndex={0} onClick={handleClick}>
      {!hasFiles && (
        <UploadDragArea onFile={handleUpload} className="tiptap-audio-upload-drag-area">
          <DropZoneContent maxSize={maxSize} limit={limit} />
        </UploadDragArea>
      )}
      {hasFiles && (
        <div className="tiptap-audio-upload-previews">
          {fileItems.length > 1 && (
            <div className="tiptap-audio-upload-header">
              <span>Uploading {fileItems.length} files</span>
              <Button
                type="button"
                data-style="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  clearAllFiles()
                }}>
                Clear All
              </Button>
            </div>
          )}
          {fileItems.map((fileItem) => (
            <UploadPreview
              key={fileItem.id}
              fileItem={fileItem}
              onRemove={() => removeFileItem(fileItem.id)}
              className="tiptap-audio-upload-preview"
              iconClass="tiptap-audio-upload-file-icon"
              textClass="tiptap-audio-upload-text"
              subtextClass="tiptap-audio-upload-subtext"
              progressClass="tiptap-audio-upload-progress"
              progressTextClass="tiptap-audio-upload-progress-text" />
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        name="file"
        accept={accept}
        type="file"
        multiple={limit > 1}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()} />
    </NodeViewWrapper>
  );
}
