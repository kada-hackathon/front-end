/**
 * Media Manager - Tracks pending uploads and deletions
 * Media is only uploaded/deleted when user saves the work log
 */

class MediaManager {
  constructor() {
    // Track pending uploads: { blobUrl: File }
    this.pendingUploads = new Map()
    
    // Track pending deletions: Set of DigitalOcean URLs
    // Load from localStorage to persist across page reloads
    const savedDeletions = localStorage.getItem('pendingMediaDeletions')
    this.pendingDeletions = savedDeletions ? new Set(JSON.parse(savedDeletions)) : new Set()
    
    // Track blob URL to DigitalOcean URL mapping
    this.blobToUrlMap = new Map()
    
    console.log(`[MediaManager] Initialized with ${this.pendingDeletions.size} pending deletions from storage`)
  }
  
  /**
   * Save pending deletions to localStorage
   */
  saveDeletionsToStorage() {
    localStorage.setItem('pendingMediaDeletions', JSON.stringify(Array.from(this.pendingDeletions)))
  }

  /**
   * Add a file for pending upload
   * @param {File} file - The file to upload
   * @returns {string} - Blob URL for preview
   */
  addPendingUpload(file) {
    const blobUrl = URL.createObjectURL(file)
    this.pendingUploads.set(blobUrl, file)
    console.log(`[MediaManager] Added pending upload: ${file.name} -> ${blobUrl}`)
    return blobUrl
  }

  /**
   * Mark a media URL for deletion
   * @param {string} url - DigitalOcean URL or blob URL
   */
  addPendingDeletion(url) {
    // If it's a blob URL (not uploaded yet), just revoke it
    if (url.startsWith('blob:')) {
      console.log(`[MediaManager] Removing pending upload: ${url}`)
      this.pendingUploads.delete(url)
      URL.revokeObjectURL(url)
      return
    }
    
    // If it's a DigitalOcean URL, mark for deletion
    // Accept both direct and CDN URLs
    const isDigitalOceanUrl = url.includes('nebwork-storage') || 
                              url.includes('digitaloceanspaces.com') ||
                              url.includes('.cdn.digitaloceanspaces.com')
    
    if (isDigitalOceanUrl) {
      console.log(`[MediaManager] ✅ Marked for deletion: ${url}`)
      this.pendingDeletions.add(url)
      this.saveDeletionsToStorage() // Persist to localStorage
      console.log(`[MediaManager] Saved to localStorage, total pending deletions: ${this.pendingDeletions.size}`)
    } else {
      console.warn(`[MediaManager] ⚠️ URL not recognized as DigitalOcean URL: ${url}`)
    }
  }

  /**
   * Get all pending uploads
   * @returns {Array<{blobUrl: string, file: File}>}
   */
  getPendingUploads() {
    return Array.from(this.pendingUploads.entries()).map(([blobUrl, file]) => ({
      blobUrl,
      file
    }))
  }

  /**
   * Get all pending deletions
   * @returns {Array<string>}
   */
  getPendingDeletions() {
    return Array.from(this.pendingDeletions)
  }

  /**
   * Upload all pending files to DigitalOcean
   * @param {Function} uploadFn - Upload function from tiptap-utils
   * @returns {Promise<Map<string, string>>} - Map of blob URL to DigitalOcean URL
   */
  async uploadAllPending(uploadFn) {
    const uploads = this.getPendingUploads()
    console.log(`[MediaManager] Uploading ${uploads.length} pending files...`)
    
    const urlMap = new Map()
    
    for (const { blobUrl, file } of uploads) {
      try {
        console.log(`[MediaManager] Uploading ${file.name}...`)
        const digitalOceanUrl = await uploadFn(file)
        urlMap.set(blobUrl, digitalOceanUrl)
        this.blobToUrlMap.set(blobUrl, digitalOceanUrl)
        console.log(`[MediaManager] Uploaded: ${blobUrl} -> ${digitalOceanUrl}`)
      } catch (error) {
        console.error(`[MediaManager] Failed to upload ${file.name}:`, error)
        throw error
      }
    }
    
    // Clear pending uploads after successful upload
    this.pendingUploads.clear()
    
    return urlMap
  }

  /**
   * Delete all pending files from DigitalOcean
   * @param {Function} deleteFn - Delete function from tiptap-utils
   */
  async deleteAllPending(deleteFn) {
    const deletions = this.getPendingDeletions()
    console.log(`[MediaManager] ========== DELETION PROCESS STARTED ==========`)
    console.log(`[MediaManager] Total files to delete: ${deletions.length}`)
    console.log(`[MediaManager] Files to delete:`, deletions)
    
    if (deletions.length === 0) {
      console.log(`[MediaManager] No files to delete, skipping`)
      return
    }
    
    let successCount = 0
    let failCount = 0
    
    for (const url of deletions) {
      try {
        console.log(`[MediaManager] [${successCount + failCount + 1}/${deletions.length}] Deleting: ${url}`)
        const result = await deleteFn(url)
        if (result) {
          console.log(`[MediaManager] ✅ Successfully deleted: ${url}`)
          successCount++
        } else {
          console.error(`[MediaManager] ❌ Delete returned false for: ${url}`)
          failCount++
        }
      } catch (error) {
        console.error(`[MediaManager] ❌ Failed to delete ${url}:`, error)
        failCount++
        // Continue with other deletions even if one fails
      }
    }
    
    console.log(`[MediaManager] ========== DELETION PROCESS COMPLETED ==========`)
    console.log(`[MediaManager] Success: ${successCount}, Failed: ${failCount}, Total: ${deletions.length}`)
    
    // Clear pending deletions
    this.pendingDeletions.clear()
    this.saveDeletionsToStorage() // Clear from localStorage too
    console.log(`[MediaManager] Cleared all pending deletions from memory and storage`)
  }

  /**
   * Replace all blob URLs in HTML content with DigitalOcean URLs
   * @param {string} htmlContent - HTML content with blob URLs
   * @param {Map<string, string>} urlMap - Map of blob URL to DigitalOcean URL
   * @returns {string} - HTML content with DigitalOcean URLs
   */
  replaceBlobUrlsInContent(htmlContent, urlMap) {
    if (!htmlContent) {
      console.log(`[MediaManager] No content to replace URLs in`)
      return htmlContent
    }
    
    console.log(`[MediaManager] ==================== URL REPLACEMENT ====================`)
    console.log(`[MediaManager] Content length: ${htmlContent.length} characters`)
    console.log(`[MediaManager] Number of blob → DigitalOcean mappings: ${urlMap.size}`)
    
    let updatedContent = htmlContent
    let replacementCount = 0
    
    for (const [blobUrl, digitalOceanUrl] of urlMap.entries()) {
      // Count occurrences before replacement
      const beforeCount = (updatedContent.match(new RegExp(blobUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
      
      if (beforeCount === 0) {
        console.warn(`[MediaManager] ⚠️ Blob URL not found in content: ${blobUrl}`)
        console.warn(`[MediaManager] This blob URL was uploaded but not used in the document`)
      }
      
      // Replace all occurrences of blob URL with DigitalOcean URL
      updatedContent = updatedContent.replaceAll(blobUrl, digitalOceanUrl)
      
      // Verify replacement
      const digitalOceanCount = (updatedContent.match(new RegExp(digitalOceanUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
      
      console.log(`[MediaManager] 🔄 ${blobUrl.substring(0, 60)}...`)
      console.log(`[MediaManager]    → ${digitalOceanUrl}`)
      console.log(`[MediaManager]    ✅ Replaced ${beforeCount} occurrence(s)`)
      
      replacementCount += beforeCount
    }
    
    console.log(`[MediaManager] ==================== REPLACEMENT COMPLETE ====================`)
    console.log(`[MediaManager] ✅ Total replacements: ${replacementCount}`)
    console.log(`[MediaManager] ✅ Updated content length: ${updatedContent.length} characters`)
    
    // Verify no blob URLs remain
    const remainingBlobs = (updatedContent.match(/blob:http[^\s"')]+/g) || [])
    if (remainingBlobs.length > 0) {
      console.warn(`[MediaManager] ⚠️ WARNING: ${remainingBlobs.length} blob URL(s) still in content:`)
      remainingBlobs.forEach(blob => console.warn(`[MediaManager]    - ${blob}`))
    } else {
      console.log(`[MediaManager] ✅ No blob URLs remaining in content`)
    }
    
    return updatedContent
  }

  /**
   * Clean up blob URLs only (NOT deletions - they persist until save)
   */
  cleanup() {
    console.log(`[MediaManager] Cleaning up ${this.pendingUploads.size} blob URLs...`)
    console.log(`[MediaManager] Keeping ${this.pendingDeletions.size} pending deletions (will be deleted on save)`)
    
    for (const blobUrl of this.pendingUploads.keys()) {
      URL.revokeObjectURL(blobUrl)
    }
    
    // Only clear uploads and blob map, NOT deletions
    this.pendingUploads.clear()
    this.blobToUrlMap.clear()
    
    // DO NOT clear pendingDeletions - they should persist until save!
    // DO NOT clear localStorage - deletions must persist across page reloads!
  }

  /**
   * Check if there are any pending changes
   * @returns {boolean}
   */
  hasPendingChanges() {
    return this.pendingUploads.size > 0 || this.pendingDeletions.size > 0
  }

  /**
   * Reset the manager (clear all tracking - only call after successful save)
   */
  reset() {
    console.log(`[MediaManager] FULL RESET - Clearing all pending operations`)
    
    // Clean up blob URLs
    for (const blobUrl of this.pendingUploads.keys()) {
      URL.revokeObjectURL(blobUrl)
    }
    
    // Clear everything including deletions
    this.pendingUploads.clear()
    this.pendingDeletions.clear()
    this.blobToUrlMap.clear()
    
    // Clear from localStorage too
    this.saveDeletionsToStorage()
    
    console.log(`[MediaManager] Reset complete - all tracking cleared`)
  }
}

// Create a singleton instance
export const mediaManager = new MediaManager()

// Export for testing or multiple instances if needed
export default MediaManager

