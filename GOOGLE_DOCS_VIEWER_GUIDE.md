# 📄 Google Docs Viewer Integration Guide

This guide explains how the Google Docs Viewer integration works and what you need to do when integrating with your backend.

## 🎯 Current State (Development)

**Right Now:**
- Uses **blob URLs** (temporary local files)
- Works perfectly for testing and development
- Files are stored in browser memory only
- Different file types show different behaviors:
  - ✅ **PDF**: Opens in custom viewer with browser's PDF plugin
  - ✅ **Images**: Opens in custom image viewer
  - ✅ **Text files**: Opens in custom text viewer
  - ⚠️ **Word/Excel/PowerPoint**: Shows download prompt (can't preview blob URLs)

## 🚀 Production State (After Backend Integration)

**After you connect to backend:**
- Uses **public URLs** (permanent server-hosted files)
- Files stored in cloud storage (AWS S3, Cloudinary, Firebase, etc.)
- **Google Docs Viewer** automatically previews Office documents
- Works for:
  - ✅ **Word** (.doc, .docx)
  - ✅ **Excel** (.xls, .xlsx)
  - ✅ **PowerPoint** (.ppt, .pptx)
  - ✅ **PDF** (.pdf)
  - ✅ **Images** (.jpg, .png, etc.)
  - ✅ **Text files** (.txt, .md, etc.)

---

## 🔧 What You Need to Do

### Step 1: Set Up File Storage

Choose a cloud storage provider:

#### Option A: AWS S3 (Recommended)
```bash
npm install aws-sdk multer
```

#### Option B: Cloudinary
```bash
npm install cloudinary multer
```

#### Option C: Firebase Storage
```bash
npm install firebase
```

### Step 2: Create Backend Upload API

**Example using Node.js + Express + AWS S3:**

```javascript
// backend/routes/upload.js
const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')
const router = express.Router()

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
})

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const file = req.file
    const fileName = `uploads/${Date.now()}-${file.originalname}`

    // Upload to S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Make file publicly accessible
      CacheControl: 'max-age=31536000' // Cache for 1 year
    }

    const result = await s3.upload(params).promise()

    // Return the public URL
    res.json({
      success: true,
      url: result.Location, // This is the public URL!
      filename: file.originalname,
      size: file.size,
      type: file.mimetype
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

module.exports = router
```

### Step 3: Update Frontend `handleImageUpload` Function

**Location:** `src/lib/tiptap-utils.js`

Replace the current implementation with:

```javascript
export const handleImageUpload = async (file, onProgress, abortSignal) => {
  // Validate file
  if (!file) {
    throw new Error("No file provided")
  }

  if (file.size > MAX_FILE_SIZE * 2) {
    throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE * 2 / (1024 * 1024)}MB)`)
  }

  try {
    // Create FormData
    const formData = new FormData()
    formData.append('file', file)

    // Upload to your backend
    const response = await fetch('https://your-api.com/api/upload', {
      method: 'POST',
      body: formData,
      signal: abortSignal,
      headers: {
        // Add your auth token if needed
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    
    // Track progress (if your backend supports it)
    onProgress?.({ progress: 100 })
    
    // Return the public URL from your server
    return data.url // e.g., "https://your-bucket.s3.amazonaws.com/uploads/file.pdf"
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error("Upload cancelled")
    }
    throw error
  }
}
```

### Step 4: Configure CORS

**Backend CORS Configuration:**

```javascript
// backend/index.js
const cors = require('cors')

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-production-domain.com'],
  credentials: true
}))
```

**S3 Bucket CORS Configuration:**

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

## 📋 Environment Variables

Create a `.env` file in your backend:

```env
# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# API
PORT=3000
NODE_ENV=production
```

---

## 🎨 How It Works

### Development Mode (Current)
```
User uploads file → Creates blob URL → Shows in editor
                                     ↓
                          Click to view → Custom HTML viewer
```

### Production Mode (After Backend)
```
User uploads file → Sends to backend → Stores in S3 → Returns public URL
                                                      ↓
                                            Shows in editor
                                                      ↓
                            Click to view → Google Docs Viewer (Office files)
                                         → Direct view (PDF/images)
```

---

## 🔍 Code Detection Logic

The system automatically detects whether you're in development or production:

```javascript
// From document-utils.js
export const isBlobUrl = (url) => {
  return url?.startsWith('blob:') || false
}

// In document-node.jsx
const isBlob = isBlobUrl(src)
const canPreview = !isBlob && isGoogleDocsSupported(filename)

if (isBlob) {
  // Development: Use custom viewer or download
} else if (canPreview) {
  // Production: Use Google Docs Viewer
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`
  window.open(viewerUrl, '_blank')
}
```

---

## 🎯 Visual Indicators

The UI shows different badges based on the mode:

- 🟡 **"Development Mode"** - Yellow badge for blob URLs
- 🟢 **"Google Docs Preview"** - Green badge for supported Office files
- 🔵 **"Direct View"** - Blue badge for other files (PDF, images)

---

## ✅ Testing Checklist

### Development (Current)
- [x] Upload image → Shows immediately
- [x] Upload video → Plays in editor
- [x] Upload audio → Plays in editor
- [x] Upload PDF → Opens in custom viewer
- [x] Upload text file → Shows content
- [ ] Upload Word/Excel → Shows download prompt (expected)

### Production (After Backend)
- [ ] Upload image → Stores in S3 → Shows with public URL
- [ ] Upload Word doc → Opens in Google Docs Viewer
- [ ] Upload Excel file → Opens in Google Docs Viewer
- [ ] Upload PowerPoint → Opens in Google Docs Viewer
- [ ] Upload PDF → Opens in browser
- [ ] Files persist after page refresh

---

## 🚨 Important Notes

### 1. File Accessibility
Google Docs Viewer requires **publicly accessible URLs**. Your S3 bucket or file storage must allow public read access.

### 2. URL Encoding
Always encode URLs when passing to Google Docs Viewer:
```javascript
const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
```

### 3. File Size Limits
Google Docs Viewer has size limits:
- **Documents**: ~25MB
- **Spreadsheets**: ~10MB
- **Presentations**: ~100MB

### 4. Rate Limiting
Google Docs Viewer is free but may have rate limits. For high-traffic applications, consider:
- Microsoft Office Online Viewer (alternative)
- Paid document preview services (Aspose, GroupDocs)
- Self-hosted solutions (LibreOffice Online, OnlyOffice)

---

## 🔗 Alternative Viewers

If Google Docs Viewer doesn't meet your needs:

### Microsoft Office Online Viewer
```javascript
const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`
```

### Paid Services
- **Cloudmersive Document Viewer API** - $0.0005 per page
- **Aspose.Cloud** - Free tier available
- **GroupDocs.Viewer Cloud** - 50 free conversions/month

---

## 📞 Need Help?

### Common Issues

**Q: Google Docs Viewer shows "Preview not available"**
- Check if URL is publicly accessible
- Verify file format is supported
- Try with direct URL in browser first

**Q: CORS errors when uploading**
- Configure CORS on your backend
- Configure CORS on S3 bucket
- Check browser console for specific error

**Q: Files don't persist after page refresh**
- This is expected in development (blob URLs are temporary)
- After backend integration, files will persist

---

## 🎉 Ready to Deploy!

Once you've completed steps 1-4, your document preview system will automatically:
1. ✅ Upload files to cloud storage
2. ✅ Store permanent URLs
3. ✅ Preview Word/Excel/PowerPoint in Google Docs Viewer
4. ✅ View PDFs and images directly
5. ✅ Work seamlessly across all devices

**No code changes needed in your React components!** The system automatically detects production URLs and uses the appropriate viewer. 🚀
