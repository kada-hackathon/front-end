/**
 * Media upload constants and configuration
 */

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const UPLOAD_LIMITS = {
  IMAGE: {
    maxFiles: 3,
    maxSize: MAX_FILE_SIZE,
    accept: "image/*",
  },
  VIDEO: {
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE * 2, // 10MB
    accept: "video/*",
  },
  AUDIO: {
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: "audio/*",
  },
  DOCUMENT: {
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    accept: ".pdf,.doc,.docx,.txt",
  },
}

export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
}

export const KEYBOARD_SHORTCUTS = {
  IMAGE: "mod+shift+i",
  VIDEO: "mod+shift+v",
  AUDIO: "mod+shift+a",
  DOCUMENT: "mod+shift+d",
}

export const PREVIEWABLE_EXTENSIONS = ['pdf', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']

export const TEXT_FILE_EXTENSIONS = ['txt', 'md', 'json', 'xml', 'csv']

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp']

// Google Docs Viewer supported formats
export const GOOGLE_DOCS_SUPPORTED = [
  'doc', 'docx',           // Microsoft Word
  'xls', 'xlsx',           // Microsoft Excel
  'ppt', 'pptx',           // Microsoft PowerPoint
  'pdf',                   // PDF
  'txt', 'rtf',            // Text files
  'pages', 'numbers', 'key' // Apple iWork
]

// Viewer configuration
export const VIEWER_CONFIG = {
  GOOGLE_DOCS_VIEWER_URL: 'https://docs.google.com/viewer',
  OFFICE_ONLINE_VIEWER_URL: 'https://view.officeapps.live.com/op/embed.aspx',
  POPUP_OPTIONS: 'width=1200,height=800,resizable=yes,scrollbars=yes,status=yes'
}
