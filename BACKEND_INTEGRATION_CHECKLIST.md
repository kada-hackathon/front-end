# 🚀 Backend Integration - Quick Checklist

## 📦 What You Need to Install

**Backend Dependencies:**
```bash
npm install aws-sdk multer express cors dotenv
```

**OR if using Cloudinary:**
```bash
npm install cloudinary multer express cors dotenv
```

---

## ✅ Step-by-Step Checklist

### □ Step 1: Set Up Cloud Storage
- [ ] Create AWS S3 bucket (or Cloudinary account)
- [ ] Get access credentials (Access Key + Secret Key)
- [ ] Configure bucket to allow public read access
- [ ] Set up CORS policy on bucket

### □ Step 2: Create Upload API Endpoint
- [ ] Create `/api/upload` route in backend
- [ ] Configure multer for file handling
- [ ] Add file validation (size, type)
- [ ] Upload file to cloud storage
- [ ] Return public URL in response

### □ Step 3: Update Frontend Upload Function
- [ ] Open `src/lib/tiptap-utils.js`
- [ ] Replace `handleImageUpload` function
- [ ] Change from blob URL to API call
- [ ] Update to use your backend URL

### □ Step 4: Test Everything
- [ ] Upload image → Check S3 bucket
- [ ] Upload PDF → Try Google Docs Viewer
- [ ] Upload Word doc → Check preview
- [ ] Refresh page → Files should persist

---

## 🔑 Required Environment Variables

```env
# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=abc123...
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Backend
PORT=3000
NODE_ENV=production
FRONTEND_URL=http://localhost:5173
```

---

## 📝 Quick Backend Template

Save this as `backend/routes/upload.js`:

```javascript
const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `uploads/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    }

    const result = await s3.upload(params).promise()
    
    res.json({
      success: true,
      url: result.Location,
      filename: req.file.originalname,
      size: req.file.size
    })
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' })
  }
})

module.exports = router
```

---

## 🔧 Frontend Change (Only One File!)

Open `src/lib/tiptap-utils.js` and replace the `handleImageUpload` function:

```javascript
export const handleImageUpload = async (file, onProgress, abortSignal) => {
  if (!file) throw new Error("No file provided")
  if (file.size > MAX_FILE_SIZE * 2) {
    throw new Error(`File too large`)
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: formData,
    signal: abortSignal
  })

  if (!response.ok) throw new Error('Upload failed')
  
  const data = await response.json()
  onProgress?.({ progress: 100 })
  
  return data.url // Returns public S3 URL!
}
```

**That's it!** Everything else is already set up and ready! 🎉

---

## 🎯 Expected Behavior After Integration

### Before (Development)
```
Upload → Blob URL (blob:http://localhost:5173/abc123)
Click Word doc → Download prompt
Refresh page → Files disappear ❌
```

### After (Production)
```
Upload → Public URL (https://bucket.s3.amazonaws.com/file.docx)
Click Word doc → Google Docs Viewer opens ✅
Refresh page → Files still there ✅
```

---

## 🐛 Troubleshooting

**Error: "Access Denied"**
→ Check S3 bucket ACL is set to `public-read`

**Error: "CORS policy blocked"**
→ Add CORS configuration to S3 bucket

**Error: "Invalid credentials"**
→ Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env

**Files upload but preview doesn't work**
→ Verify file URL is publicly accessible (try opening in browser)

---

## 📊 What's Already Done ✅

- ✅ Google Docs Viewer integration code
- ✅ Auto-detection of blob vs public URLs
- ✅ Fallback viewers for all file types
- ✅ Loading states and error handling
- ✅ Visual indicators (dev/prod badges)
- ✅ SCSS styling for all states
- ✅ Support for Word, Excel, PowerPoint, PDF, images, text files

**You only need to:**
1. Set up cloud storage (AWS S3)
2. Create upload API endpoint
3. Update one function in `tiptap-utils.js`

That's it! 🚀
