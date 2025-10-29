"use client"
import * as React from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { FileIcon, ExternalLink } from "lucide-react"
import "@/components/tiptap-node/document-node/document-node.scss"

export const DocumentNode = (props) => {
  const { src, filename, filesize } = props.node.attrs

  const formatFileSize = (bytes) => {
    if (!bytes) return ""
    const sizes = ["B", "KB", "MB", "GB"]
    if (bytes === 0) return "0 B"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const getFileExtension = (filename) => {
    if (!filename) return "FILE"
    const ext = filename.split('.').pop()?.toLowerCase()
    return ext ? ext.toUpperCase() : "FILE"
  }

  const handleClick = (e) => {
    e.stopPropagation()
    
    if (!src) return
    
    // For blob URLs or any document, create an HTML viewer page
    fetch(src)
      .then(response => response.blob())
      .then(async (blob) => {
        const fileExt = filename?.split('.').pop()?.toLowerCase() || ''
        const mimeType = blob.type
        
        let htmlContent = ''
        
        // Handle text files by reading their content
        if (mimeType?.startsWith('text/') || ['txt', 'md', 'json', 'xml', 'csv'].includes(fileExt)) {
          const text = await blob.text()
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>${filename || 'Document Preview'}</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Courier New', monospace;
                  background: #f5f5f5;
                }
                .header {
                  background: white;
                  padding: 16px 24px;
                  border-bottom: 1px solid #e5e7eb;
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  position: sticky;
                  top: 0;
                  z-index: 10;
                }
                .filename {
                  font-weight: 600;
                  color: #111827;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                .content {
                  background: white;
                  padding: 24px;
                  margin: 20px;
                  border-radius: 8px;
                  max-width: 1200px;
                  margin: 20px auto;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                  white-space: pre-wrap;
                  word-wrap: break-word;
                  line-height: 1.6;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <span>📄</span>
                <span class="filename">${filename || 'Document'}</span>
              </div>
              <div class="content">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </body>
            </html>
          `
        } else {
          // For PDFs, images, and other binary files, use blob URL
          const url = URL.createObjectURL(blob)
          
          let viewerContent = ''
          
          // Images
          if (mimeType?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(fileExt)) {
            viewerContent = `<img src="${url}" alt="Image preview" />`
          }
          // PDFs
          else if (mimeType === 'application/pdf' || fileExt === 'pdf') {
            viewerContent = `<embed src="${url}" type="application/pdf" />`
          }
          // Default: try embed
          else {
            viewerContent = `<embed src="${url}" type="${mimeType || 'application/octet-stream'}" />`
          }
          
          htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>${filename || 'Document Preview'}</title>
              <style>
                body {
                  margin: 0;
                  padding: 0;
                  font-family: system-ui, -apple-system, sans-serif;
                  background: #f5f5f5;
                }
                .header {
                  background: white;
                  padding: 16px 24px;
                  border-bottom: 1px solid #e5e7eb;
                  display: flex;
                  align-items: center;
                  gap: 12px;
                }
                .filename {
                  font-weight: 600;
                  color: #111827;
                }
                .content {
                  width: 100%;
                  height: calc(100vh - 57px);
                }
                iframe, embed, object {
                  width: 100%;
                  height: 100%;
                  border: none;
                }
                img {
                  max-width: 90%;
                  max-height: 90vh;
                  margin: 20px auto;
                  display: block;
                  background: white;
                  padding: 20px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
              </style>
            </head>
            <body>
              <div class="header">
                <span>📄</span>
                <span class="filename">${filename || 'Document'}</span>
              </div>
              <div class="content">
                ${viewerContent}
              </div>
            </body>
            </html>
          `
        }
        
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' })
        const htmlUrl = URL.createObjectURL(htmlBlob)
        window.open(htmlUrl, '_blank', 'noopener,noreferrer')
        
        // Don't revoke URLs immediately - let them persist
        // They'll be cleaned up when the page closes
      })
      .catch(error => {
        console.error('Error opening document:', error)
        // Fallback: try opening directly
        window.open(src, '_blank', 'noopener,noreferrer')
      })
  }

  return (
    <NodeViewWrapper className="tiptap-document-node">
      <div className="tiptap-document-wrapper" onClick={handleClick}>
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
            <span className="tiptap-document-preview-badge">Click to open</span>
          </div>
        </div>
        <div className="tiptap-document-action">
          <ExternalLink size={20} />
        </div>
      </div>
    </NodeViewWrapper>
  )
}
