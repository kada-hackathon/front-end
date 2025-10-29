# Media Upload Testing Guide

## How to Test Media Display

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Open the Editor Page
Navigate to the page that uses the TiptapEditor/simple-editor

### 3. Test Each Media Type

#### Video Upload:
1. Click "Add Media" button
2. Select "Video" option
3. Choose a video file (MP4, WebM, etc.)
4. After upload completes, you should see:
   - A video player embedded in the editor
   - Play/pause controls
   - Volume control
   - Full screen option
   - Video title below the player

#### Audio Upload:
1. Click "Add Media" button
2. Select "Audio" option
3. Choose an audio file (MP3, WAV, etc.)
4. After upload completes, you should see:
   - An audio player embedded in the editor
   - Play/pause controls
   - Timeline scrubber
   - Volume control
   - Audio title below the player

#### Document Upload:
1. Click "Add Media" button
2. Select "Document" option
3. Choose a document file (PDF, DOC, TXT, etc.)
4. After upload completes, you should see:
   - A styled file card with file icon
   - File extension badge (PDF, DOC, etc.)
   - Filename and file size
   - Clicking opens the document in a new tab

## Troubleshooting

### If media doesn't appear:

1. **Check Browser Console** (F12)
   - Look for any JavaScript errors
   - Check if the upload completed successfully
   - Verify the URL was generated

2. **Check Network Tab**
   - Verify the upload request succeeded
   - Check if files are actually being uploaded

3. **Verify File Types**
   - Videos: .mp4, .webm, .ogg
   - Audio: .mp3, .wav, .ogg
   - Documents: .pdf, .doc, .docx, .txt

4. **Check File Size Limits**
   - Images: 5MB max, 3 files
   - Videos: 10MB max, 1 file
   - Audio: 5MB max, 1 file
   - Documents: 5MB max, 1 file

### Current Implementation Status:

✅ Video Node - Displays HTML5 video player with full controls
✅ Audio Node - Displays HTML5 audio player with full controls
✅ Document Node - Displays file card with file info and download link
✅ All nodes integrated into editor extensions
✅ Upload nodes convert to display nodes after upload
✅ **Media now appears directly on screen using Blob URLs**

### Important Notes:

- The `handleImageUpload` function now creates **Blob URLs** from uploaded files
- **Videos, audio, and documents will display immediately** after upload
- Blob URLs work perfectly for local testing and preview
- **For production**, you need to implement actual file upload to persist files

### How It Works Now:

1. **Select a file** → Upload progress shown
2. **File uploaded** → Blob URL created (e.g., `blob:http://localhost:3000/abc123...`)
3. **Display node inserted** → Media appears directly in the editor:
   - 🎬 **Videos**: Playable video with controls
   - 🎵 **Audio**: Playable audio with controls  
   - 📄 **Documents**: Clickable file card with icon and info
4. **Media stays visible** as long as the page is open

### Limitations of Current Implementation:

⚠️ **Blob URLs are temporary** - They expire when:
- Page is refreshed
- Browser is closed
- User navigates away

### Next Steps for Production:

1. Implement real file upload backend API
2. Replace `handleImageUpload` with actual upload logic
3. Store uploaded files on server or cloud storage (AWS S3, Cloudinary, etc.)
4. Return real URLs that persist after page reload
