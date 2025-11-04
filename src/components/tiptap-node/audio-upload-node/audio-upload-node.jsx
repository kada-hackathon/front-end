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
  CloseIcon,
} from "@/components/tiptap-node/shared/upload-utils"

const DropZoneContent = ({ maxSize, limit, onDelete }) => (
  <>
    <button
      type="button"
      className="tiptap-audio-upload-delete-zone"
      onClick={(e) => {
        e.stopPropagation()
        onDelete()
      }}
      title="Remove upload area"
    >
      <CloseIcon />
    </button>
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
    console.log("Audio upload started, files:", files)
    
    // Check authentication before upload
    const token = localStorage.getItem('token')
    if (!token) {
      console.error("No authentication token found")
      alert("You must be logged in to upload files. Please log in and try again.")
      return
    }
    
    try {
      const urls = await uploadFiles(files)
      console.log("Audio upload completed, URLs:", urls)

      if (urls.length > 0) {
        const pos = props.getPos()

        if (isValidPosition(pos)) {
          const audioNodes = urls.map((url, index) => {
            const filename =
              files[index]?.name.replace(/\.[^/.]+$/, "") || "unknown"
            console.log("Creating audio node:", { url, filename })
            return {
              type: "audio",
              attrs: {
                src: url,
                title: filename,
                controls: true,
              },
            }
          })

          console.log("Inserting audio nodes:", audioNodes)
          props.editor
            .chain()
            .focus()
            .deleteRange({ from: pos, to: pos + props.node.nodeSize })
            .insertContentAt(pos, audioNodes)
            .run()

          focusNextNode(props.editor)
        } else {
          console.error("Invalid position for audio insertion")
        }
      } else {
        console.error("No URLs returned from upload")
        alert("Upload failed. Please check your connection and try again.")
      }
    } catch (error) {
      console.error("Audio upload error:", error)
      alert(`Upload failed: ${error.message}`)
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

  const handleDeleteNode = () => {
    props.deleteNode()
  }

  return (
    <NodeViewWrapper className="tiptap-audio-upload" tabIndex={0} onClick={handleClick}>
      {!hasFiles && (
        <UploadDragArea onFile={handleUpload} className="tiptap-audio-upload-drag-area">
          <DropZoneContent maxSize={maxSize} limit={limit} onDelete={handleDeleteNode} />
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
