# Document Preview Options

## Current Implementation ✅

You already have document preview working! Here's what's currently supported:

### For Blob URLs (Before Save):
- ✅ **PDF** - Full browser preview with embed/iframe
- ✅ **Text Files** (.txt) - Formatted text viewer
- ✅ **Images** - Full image viewer
- ✅ **Office Docs** (Word, Excel, PowerPoint) - Info card with "save first" message

### For Saved Documents (Public URLs):
- ✅ **Office Docs** - Microsoft Office Online Viewer
- ✅ **PDF & Text** - Google Docs Viewer
- ✅ **All others** - Direct download

---

## Enhanced Preview Libraries

### Option 1: react-file-viewer (Added to package.json ✅)
```bash
npm install react-file-viewer
```

**Supports:**
- 📄 PDF
- 📝 Word (DOCX)
- 📊 Excel (XLSX) 
- 📽️ PowerPoint (PPTX)
- 🖼️ Images
- 📹 Video
- 🎵 Audio
- 📄 CSV

**Usage:**
```jsx
import FileViewer from 'react-file-viewer';

<FileViewer
  fileType="xlsx"
  filePath={blobUrl}
  errorComponent={<div>Error loading file</div>}
  onError={(e) => console.error(e)}
/>
```

### Option 2: @cyntler/react-doc-viewer (Already Installed ✅)
You already have this in your dependencies! It supports:
- DOCX, XLSX, PPTX
- PDF
- Images
- Video

**Usage:**
```jsx
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

<DocViewer
  documents={[{ uri: blobUrl, fileName: filename }]}
  pluginRenderers={DocViewerRenderers}
  config={{
    header: {
      disableHeader: false,
      disableFileName: false,
    }
  }}
/>
```

### Option 3: Mammoth.js (For Word Docs)
```bash
npm install mammoth
```

Converts .docx to HTML for preview:
```jsx
import mammoth from 'mammoth';

const arrayBuffer = await blob.arrayBuffer();
const result = await mammoth.convertToHtml({ arrayBuffer });
// result.value contains HTML
```

### Option 4: SheetJS (For Excel Files)
```bash
npm install xlsx
```

**Best for Excel preview:**
```jsx
import * as XLSX from 'xlsx';

const arrayBuffer = await blob.arrayBuffer();
const workbook = XLSX.read(arrayBuffer);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const html = XLSX.utils.sheet_to_html(worksheet);
// Display HTML in preview
```

---

## Recommended Solution

Use **@cyntler/react-doc-viewer** (already installed!) + **SheetJS** for Excel:

```bash
npm install xlsx
```

Then update your `createOfficePreviewHTML` to use these libraries for actual previews!

---

## Quick Implementation

Add to `package.json`:
```json
"xlsx": "^0.18.5",
"mammoth": "^1.8.0"
```

Then run:
```bash
npm install
```

Would you like me to implement one of these solutions?
