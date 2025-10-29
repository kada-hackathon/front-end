"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { FileIcon, ExternalLink } from "lucide-react"
import { 
  formatFileSize, 
  getFileExtension,
  isBlobUrl,
  isGoogleDocsSupported,
  openDocumentViewer
} from "@/lib/document-utils"
import "@/components/tiptap-node/document-node/document-node.scss"

export const DocumentNode = (props) => {
  const { src, filename, filesize } = props.node.attrs
  const [isLoading, setIsLoading] = React.useState(false)

  const isBlob = isBlobUrl(src)
  const canPreview = !isBlob && isGoogleDocsSupported(filename)

  const handleClick = async (e) => {
    e.stopPropagation()
    
    if (!src) return
    
    setIsLoading(true)
    
    try {
      await openDocumentViewer(src, filename)
    } catch (error) {
      console.error('Error opening document:', error)
      alert('Failed to open document. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <NodeViewWrapper className="tiptap-document-node">
      <div 
        className={`tiptap-document-wrapper ${isLoading ? 'loading' : ''}`}
        onClick={handleClick}
      >
        <div className="tiptap-document-icon">
          <div className="tiptap-document-icon-bg">
            <FileIcon size={24} />
          </div>
          <span className="tiptap-document-ext">{getFileExtension(filename)}</span>
        </div>
        <div className="tiptap-document-info">
          <div className="tiptap-document-filename">{filename || 'Untitled Document'}</div>
          <div className="tiptap-document-meta">
            {filesize && <span className="tiptap-document-filesize">{formatFileSize(filesize)}</span>}
            {isBlob && (
              <span className="tiptap-document-preview-badge dev">Development Mode</span>
            )}
            {canPreview && (
              <span className="tiptap-document-preview-badge prod">Google Docs Preview</span>
            )}
            {!isBlob && !canPreview && (
              <span className="tiptap-document-preview-badge">Direct View</span>
            )}
          </div>
        </div>
        <div className="tiptap-document-action">
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <ExternalLink size={20} />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}
