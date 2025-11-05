import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, Users, Save, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useSearchParams } from "react-router-dom";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import CollabList from "@/components/CollabList/CollabList";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { AUTH_ENDPOINTS, WORKLOG_ENDPOINTS, ADMIN_ENDPOINTS, COLLABORATION_ENDPOINTS } from "../config/api";
import { apiHandler } from "../utils/apiHandler";
import { toast } from "sonner";
import BASE_URL from "../config/api";
import { useToast } from "@/hooks/use-toast";
import { createCollaborationProvider, destroyCollaborationProvider } from "@/lib/collaboration-provider";

  const BlogEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogTags, setBlogTags] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [owner, setOwner] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [editorKey, setEditorKey] = useState(0); // Key to force re-mount editor
  
  // Collaboration state (always enabled in edit mode)
  const [collaborationProvider, setCollaborationProvider] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Ref to track if we're programmatically updating content (to avoid triggering unsaved changes)
  const isProgrammaticUpdate = useRef(false);

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [collaboratorToRemove, setCollaboratorToRemove] = useState(null);
  const [showInviteConfirmDialog, setShowInviteConfirmDialog] = useState(false);
  const [selectedFriendsToInvite, setSelectedFriendsToInvite] = useState([]);
  const postId = searchParams.get("id");
  const isEditMode = !!postId; // Determine if we're editing or creating

  // Prevent navigation when there are unsaved changes (browser back/refresh)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup blob URLs when component unmounts (but keep pending deletions)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Only clean up blob URLs, NOT pending deletions
      import("@/lib/media-manager").then(({ mediaManager }) => {
        mediaManager.cleanup(); // This now only cleans blob URLs, keeps deletions
        console.log("[BlogEditor] Component unmounted - cleaned up blob URLs (kept pending deletions)");
      });
    };
  }, [hasUnsavedChanges]);

  // Get current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(AUTH_ENDPOINTS.PROFILE, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        const userData = data.user || data;
        setCurrentUserId(userData.id || userData._id);
        
        // Set current user for collaboration
        setCurrentUser({
          name: userData.name || userData.username || "Anonymous",
          color: '#958DF1', // You can generate random color per user
        });
        
        // Set owner as current user (for both create and edit mode)
        setOwner({
          id: userData.id || userData._id,
          name: userData.name || "Unknown",
          division: userData.division || "Unknown",
          avatar: userData.profilePicture || userData.profile_photo || "/placeholder.svg"
        });
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch worklog detail (only in edit mode)
  useEffect(() => {
    if (!postId) {
      // CREATE MODE: Set initial empty state
      isProgrammaticUpdate.current = true;
      setBlogTitle("");
      setBlogTags([]);
      setBlogContent("");
      
      // Reset media manager for new post
      import("@/lib/media-manager").then(({ mediaManager }) => {
        mediaManager.reset();
        console.log("[BlogEditor] Media manager reset for new post");
      });
      
      // Reset flag after state updates
      setTimeout(() => {
        isProgrammaticUpdate.current = false;
      }, 100);
      
      return;
    }

    const fetchPost = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(WORKLOG_ENDPOINTS.ONE(postId), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Post response:', data);
        
        // Check access before setting data
        if (currentUserId) {
          const isOwner = data.user?._id === currentUserId || data.user?.id === currentUserId;
          const isCollaborator = data.collaborators?.some(collab => 
            collab._id === currentUserId || collab.id === currentUserId
          );
          
          if (!isOwner && !isCollaborator) {
            console.warn('Access denied: Not owner or collaborator');
            navigate(-1);
            return;
          }
        }
        
        // Set flag before loading initial data
        isProgrammaticUpdate.current = true;
        
        // Set data
        setBlogTitle(data.title || "");
        setBlogTags(data.tag || []);
        setBlogContent(data.content || "");
        
        // Reset media manager when loading existing content
        const { mediaManager } = await import("@/lib/media-manager");
        mediaManager.reset();
        console.log("[BlogEditor] Media manager reset for existing content");
        
        // Set owner for CollabList
        if (data.user) {
          setOwner({
            id: data.user._id || data.user.id,
            name: data.user.name || "Unknown",
            division: data.user.division || "Unknown",
            avatar: data.user.profilePicture || data.user.profile_photo || "/placeholder.svg"
          });
        }
        
        // Set collaborators for CollabList
        if (data.collaborators && data.collaborators.length > 0) {
          setCollaborators(data.collaborators.map(collab => ({
            id: collab._id || collab.id,
            name: collab.name || "Unknown",
            division: collab.division || "Unknown",
            avatar: collab.profilePicture || collab.profile_photo || "/placeholder.svg"
          })));
        }
        
        // Reset the programmatic update flag after the state has been updated
        setTimeout(() => {
          isProgrammaticUpdate.current = false;
        }, 100);
        
        // Reset editor to clear undo history after loading content
        setEditorKey(prev => prev + 1);
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        navigate(-1);
      }
    };
    fetchPost();
  }, [postId, currentUserId, navigate]);

  // Fetch friends dari backend
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(ADMIN_ENDPOINTS.EMPLOYEES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        const friendsList = data.data || data.employees || data || [];
        setFriends(friendsList);
      } catch (err) {
        console.error('Error fetching friends:', err);
      }
    };
    fetchFriends();
  }, []);

  // Initialize collaboration automatically in edit mode
  // Wait for content to be loaded first before setting up collaboration
  useEffect(() => {
    if (isEditMode && postId && currentUser) {
      console.log('[Collaboration] Initializing collaboration for document:', postId);
      
      const { provider, ydoc } = createCollaborationProvider({
        documentId: postId,
        user: currentUser,
        // websocketUrl is already set to COLLABORATION_ENDPOINTS.WEBSOCKET by default
      });

      setCollaborationProvider({ provider, ydoc });

      // Cleanup on unmount
      return () => {
        console.log('[Collaboration] Cleaning up collaboration provider');
        destroyCollaborationProvider(provider);
        setCollaborationProvider(null);
      };
    }
  }, [isEditMode, postId, currentUser]);

  // Get collaborator IDs for easier checking
  const collaboratorIds = collaborators.map(c => c.id);

  // Map friends and sort: collaborators first, then others
  const allFriends = friends
    .filter((friend) => {
  const friendId = friend._id || friend.id;
  // Filter out current user (owner)
  if (friendId === currentUserId) return false;  // ← PENAMBAHAN INI
  // Filter by search query
  return (friend.name || friend.full_name || "").toLowerCase().includes(searchQuery.toLowerCase());
})
    .map((friend) => ({
      id: friend._id || friend.id,
      name: friend.name || friend.full_name || "Unknown",
      division: friend.division || "Unknown",
      avatar: friend.profilePicture || friend.profile_photo || "/placeholder.svg"
    }));

  // Sort: collaborators first, then others
  const filteredFriends = allFriends.sort((a, b) => {
    const aIsCollab = collaboratorIds.includes(a.id);
    const bIsCollab = collaboratorIds.includes(b.id);
    if (aIsCollab && !bIsCollab) return -1;
    if (!aIsCollab && bIsCollab) return 1;
    return 0;
  });

  const toggleFriendSelection = (friendId) => {
    // Don't allow unchecking if already a collaborator
    if (collaboratorIds.includes(friendId)) {
      return;
    }
    
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

 const handleInvite = () => {
    if (selectedFriends.length === 0) return;
    
    // Prepare data for confirmation
    const friendsToInvite = allFriends.filter(friend => 
      selectedFriends.includes(friend.id)
    );
    setSelectedFriendsToInvite(friendsToInvite);
    
    // Close invite dialog and show confirmation
    setInviteOpen(false);
    setShowInviteConfirmDialog(true);
  };

  const confirmInvite = async () => {
    console.log("Inviting friends:", selectedFriends);
    
    // Get all selected friends (including already added collaborators)
    const allSelectedIds = [...new Set([...collaboratorIds, ...selectedFriends])];
    const newCollaborators = allFriends.filter(friend => 
      allSelectedIds.includes(friend.id)
    );
    setCollaborators(newCollaborators);
    
    // Auto-save collaborators if in edit mode
    if (isEditMode && postId) {
      try {
        const token = sessionStorage.getItem('token');
        const mediaFiles = extractMediaFromContent(blogContent);
        await fetch(WORKLOG_ENDPOINTS.ONE(postId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: blogTitle,
            content: blogContent,
            tag: blogTags,
            collaborators: allSelectedIds,
            media: mediaFiles,
          })
        });
        console.log("Collaborators auto-saved");
      } catch (err) {
        console.error('Error auto-saving collaborators:', err);
      }
    }
    
    // Close confirmation dialog and reset
    setShowInviteConfirmDialog(false);
    setSelectedFriendsToInvite([]);
    setSelectedFriends([]);
    setSearchQuery("");
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    // Remove from collaborators list
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    setCollaboratorToRemove(collaborator);
    setShowRemoveDialog(true);
  };
    
     const confirmRemoveCollaborator = async () => {
    if (!collaboratorToRemove) return;
    
    const collaboratorId = collaboratorToRemove.id;
    
    // Remove from collaborators list
    const updatedCollaborators = collaborators.filter(c => c.id !== collaboratorId);
    setCollaborators(updatedCollaborators);
    // Also remove from selectedFriends if present
    setSelectedFriends(prev => prev.filter(id => id !== collaboratorId));
    
    // Auto-save collaborator removal if in edit mode
    if (isEditMode && postId) {
      try {
        const token = sessionStorage.getItem('token');
        const updatedCollaboratorIds = updatedCollaborators.map(c => c.id);
        const mediaFiles = extractMediaFromContent(blogContent);
        await fetch(WORKLOG_ENDPOINTS.ONE(postId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: blogTitle,
            content: blogContent,
            tag: blogTags,
            collaborators: updatedCollaboratorIds,
            media: mediaFiles,
          })
        });
        console.log("Collaborator removal auto-saved");
      } catch (err) {
        console.error('Error auto-saving collaborator removal:', err);
      }
    }
    
    // Close dialog and reset
    setShowRemoveDialog(false);
    setCollaboratorToRemove(null);
  };

  const handleNavigationAttempt = (path) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowUnsavedDialog(true);
    } else {
      if (typeof path === 'function') {
        path();
      } else if (typeof path === 'number') {
        navigate(path);
      } else {
        navigate(path);
      }
    }
  };

  const handleContinueWithoutSaving = async () => {
    // FULL RESET - clear everything including pending deletions
    const { mediaManager } = await import("@/lib/media-manager");
    mediaManager.reset(); // Full reset - clears uploads AND deletions
    console.log("[BlogEditor] Full reset - discarded all pending changes including deletions");
    
    setShowUnsavedDialog(false);
    setHasUnsavedChanges(false);
    if (pendingNavigation !== null) {
      if (typeof pendingNavigation === 'function') {
        pendingNavigation();
      } else if (typeof pendingNavigation === 'number') {
        navigate(pendingNavigation);
      } else {
        navigate(pendingNavigation);
      }
      setPendingNavigation(null);
    }
  };

  const handleSaveAndContinue = () => {
    setSaveOpen(true);
    setShowUnsavedDialog(false);
  };

  // Extract media URLs from HTML content
  const extractMediaFromContent = (htmlContent) => {
    const media = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Extract images
    const images = doc.querySelectorAll('img[src]');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.includes('nebwork-storage')) {
        media.push(src); // Only push the URL string
      }
    });

    // Extract videos
    const videos = doc.querySelectorAll('video source[src], video[src]');
    videos.forEach(video => {
      const src = video.getAttribute('src');
      if (src && src.includes('nebwork-storage')) {
        media.push(src); // Only push the URL string
      }
    });

    // Extract audio
    const audios = doc.querySelectorAll('audio source[src], audio[src]');
    audios.forEach(audio => {
      const src = audio.getAttribute('src');
      if (src && src.includes('nebwork-storage')) {
        media.push(src); // Only push the URL string
      }
    });

    // Extract documents from TipTap document nodes
    const documentNodes = doc.querySelectorAll('div[data-type="document"][data-src]');
    documentNodes.forEach(docNode => {
      const src = docNode.getAttribute('data-src');
      if (src && src.includes('nebwork-storage')) {
        media.push(src); // Only push the URL string
      }
    });

    // Also extract documents from regular links and iframes (fallback)
    const documents = doc.querySelectorAll('a[href*="nebwork-storage"], iframe[src*="nebwork-storage"]');
    documents.forEach(doc => {
      const src = doc.getAttribute('href') || doc.getAttribute('src');
      if (src && src.includes('nebwork-storage') && !media.includes(src)) {
        const extension = src.split('.').pop().toLowerCase();
        const isDoc = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension);
        if (isDoc) {
          media.push(src); // Only push the URL string
        }
      }
    });

    return media;
  };

  const handleSaveBlog = async () => {
    console.log("Saving blog with message:", commitMessage);

    try {
      const token = sessionStorage.getItem('token');
      let createdOrUpdatedWorklog;

      // Import media manager and upload functions
      const { mediaManager } = await import("@/lib/media-manager");
      const { handleImageUpload, deleteMediaFile } = await import("@/lib/tiptap-utils");

      // Step 1: Upload all pending media files
      console.log("[BlogEditor] ========== SAVE STARTED ==========");
      console.log("[BlogEditor] Current content length:", blogContent.length);
      console.log("[BlogEditor] Pending uploads count:", mediaManager.getPendingUploads().length);
      
      const urlMap = await mediaManager.uploadAllPending(handleImageUpload);
      console.log("[BlogEditor] Upload complete, mapped URLs:", urlMap.size);
      
      // Step 2: Replace blob URLs with DigitalOcean URLs in content
      let finalContent = mediaManager.replaceBlobUrlsInContent(blogContent, urlMap);
      console.log("[BlogEditor] Final content length after URL replacement:", finalContent.length);
      
      // Step 3: Delete removed media from DigitalOcean
      const pendingDeletions = mediaManager.getPendingDeletions();
      console.log("[BlogEditor] ==========================================");
      console.log("[BlogEditor] STEP 3: DELETE REMOVED MEDIA");
      console.log("[BlogEditor] Pending deletions count:", pendingDeletions.length);
      console.log("[BlogEditor] Pending deletion URLs:", pendingDeletions);
      console.log("[BlogEditor] ==========================================");
      
      if (pendingDeletions.length > 0) {
        console.log("[BlogEditor] 🗑️ CALLING deleteAllPending() with deleteMediaFile function");
        console.log("[BlogEditor] deleteMediaFile function:", typeof deleteMediaFile);
        
        await mediaManager.deleteAllPending(deleteMediaFile);
        
        console.log("[BlogEditor] ✅ deleteAllPending() completed");
      } else {
        console.log("[BlogEditor] ⚠️ No files to delete");
      }

      // Step 4: Extract media from final content
      const mediaFiles = extractMediaFromContent(finalContent);
      console.log("[BlogEditor] Extracted media files:", mediaFiles.length);

      if (isEditMode) {
        // update
        const response = await fetch(WORKLOG_ENDPOINTS.ONE(postId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: blogTitle || "Untitled Work Log",
            content: finalContent,
            tag: blogTags || [],
            collaborators: collaborators.map(c => c.id),
            media: mediaFiles,
          })
        });
        createdOrUpdatedWorklog = await response.json();

      } else {
        // create
        const response = await fetch(WORKLOG_ENDPOINTS.LIST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: blogTitle || "Untitled Work Log",
            content: finalContent,
            tag: blogTags || [],
            collaborators: collaborators.map(c => c.id),
            media: mediaFiles,
          })
        });
        createdOrUpdatedWorklog = await response.json();
      }

      // ADD VERSION (LOG HISTORY)
      const worklogId = createdOrUpdatedWorklog?._id;
      if (worklogId) {
        const token = localStorage.getItem('token');
        await fetch(WORKLOG_ENDPOINTS.VERSIONS(worklogId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            message: commitMessage
          })
        });
      }

      console.log("[BlogEditor] Save response:", createdOrUpdatedWorklog);
      console.log("[BlogEditor] ========== SAVE COMPLETED ==========");
      
      // CRITICAL: Update the editor content with final content (blob URLs replaced with DigitalOcean URLs)
      // Set flag to prevent triggering unsaved changes
      isProgrammaticUpdate.current = true;
      setBlogContent(finalContent);
      console.log("[BlogEditor] Editor content updated with DigitalOcean URLs (undo history preserved)");
      
      // Reset the flag after a brief delay to allow content update to propagate
      setTimeout(() => {
        isProgrammaticUpdate.current = false;
      }, 100);
      
      // Reset media manager after successful save
      mediaManager.reset();
      console.log("[BlogEditor] Media manager reset after save");
      
      setSaveOpen(false);
      setCommitMessage("");
      setHasUnsavedChanges(false);
      
      // Show success toast notification
      toast({
        title: "✅ Work log saved successfully!",
        description: "Your changes have been saved.",
        duration: 3000,
      });
      
      // Only navigate if there's a pending navigation (user tried to leave while editing)
      if (pendingNavigation !== null) {
        if (typeof pendingNavigation === 'function') {
          pendingNavigation();
        } else if (typeof pendingNavigation === 'number') {
          navigate(pendingNavigation);
        } else {
          navigate(pendingNavigation);
        }
        setPendingNavigation(null);
      }
      // Otherwise stay on the page - don't navigate to /worklog
    } catch (err) {
      console.error('Error saving blog:', err);
      
      // Handle validation errors
      if (err.validationErrors) {
        // Display each validation error
        const fieldNames = {
          title: 'Title',
          content: 'Content',
          tag: 'Tags'
        };
        
        Object.entries(err.validationErrors).forEach(([field, message]) => {
          const fieldName = fieldNames[field] || field;
          toast.error(`${fieldName}: ${message}`);
        });
      } else if (err.message === 'No authentication token found') {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to save worklog. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNavigate={handleNavigationAttempt}
      />

      <main className="flex-1 flex flex-col">
        <Navbar onNavigate={handleNavigationAttempt} />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col relative">
            {/* SimpleEditor with toolbar - toolbar will be sticky */}
            <div className="flex-1 overflow-y-auto">
              <SimpleEditor
                key={editorKey}
                initialContent={blogContent}
                onContentChange={(content) => {
                  setBlogContent(content);
                  // Only mark as unsaved if it's a real user change (not programmatic update)
                  if (!isProgrammaticUpdate.current) {
                    setHasUnsavedChanges(true);
                  }
                }}
                initialTitle={blogTitle}
                initialTags={blogTags}
                onTitleChange={(title) => {
                  setBlogTitle(title);
                  if (!isProgrammaticUpdate.current) {
                    setHasUnsavedChanges(true);
                  }
                }}
                onTagsChange={(tags) => {
                  setBlogTags(tags);
                  if (!isProgrammaticUpdate.current) {
                    setHasUnsavedChanges(true);
                  }
                }}
                sidebarCollapsed={sidebarCollapsed}
                onBack={() => handleNavigationAttempt(-1)}
                onVersion={() => handleNavigationAttempt(`/worklogs/${postId}/versions`)}
                enableCollaboration={isEditMode}
                collaborationProvider={collaborationProvider}
                currentUser={currentUser}
              />
            </div>

            {/* Sticky Action Buttons - stick to bottom right of editor area */}
            <div className="sticky bottom-6 self-end mr-6 mb-6 flex flex-col gap-3 z-50" style={{ marginTop: '-120px' }}>
              {/* INVITE DIALOG - Only visible to owner */}
              {currentUserId === owner?.id && (
              <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <Tooltip delay={200}>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-14 w-14"
                      >
                        <Users style={{ width: '20px', height: '20px' }} />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Invite</TooltipContent>
                </Tooltip>
                  <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                      <div className="flex items-center justify-between">
                        <AlertDialogTitle className="text-xl font-bold flex-1 text-center">
                          Invite Your Collaborators
                        </AlertDialogTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setInviteOpen(false)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDialogHeader>

                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="flex flex-col gap-3 py-4 h-96 overflow-y-auto">
                        {filteredFriends.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">User not found!</p>
                          </div>
                        ) : (
                          filteredFriends.map((friend) => {
                            const isCollaborator = collaboratorIds.includes(friend.id);
                            const isSelected = selectedFriends.includes(friend.id) || isCollaborator;
                            
                            return (
                              <div
                                key={friend.id}
                                onClick={() => toggleFriendSelection(friend.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                  isCollaborator 
                                    ? "border-primary bg-accent/30 cursor-not-allowed opacity-75"
                                    : `cursor-pointer hover:bg-accent/50 ${
                                        isSelected
                                          ? "border-primary bg-accent/30"
                                          : "border-border"
                                      }`
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={isCollaborator}
                                  onChange={() => {}}
                                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                                />
                                <img
                                  src={friend.avatar}
                                  alt={friend.name}
                                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate">{friend.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{friend.division}</p>
                                </div>
                                {isCollaborator && (
                                  <span className="text-xs text-primary font-medium">Added</span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={handleInvite}
                          disabled={selectedFriends.length === 0}
                          className="px-12"
                        >
                          INVITE
                        </Button>
                      </div>
                    </div>
                  </AlertDialogContent>
              </AlertDialog>)}

              {/* SAVE WORKLOG DIALOG */}
              <AlertDialog open={saveOpen} onOpenChange={setSaveOpen}>
                <Tooltip delay={200}>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="default"
                        size="icon"
                        className="rounded-full h-14 w-14"
                      >
                        <Save style={{ width: '20px', height: '20px' }} />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Save Work Log</TooltipContent>
                </Tooltip>
                  <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                      <div className="flex items-center justify-between">
                        <AlertDialogTitle className="text-xl font-bold flex-1 text-center">
                          SAVE YOUR WORK LOG
                        </AlertDialogTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSaveOpen(false)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDialogHeader>

                    <div className="space-y-4">
                      <div>
                        <label className="text-center block mb-2 font-medium">
                          What task/changes did you do?
                        </label>
                        <Textarea
                          value={commitMessage}
                          onChange={(e) => setCommitMessage(e.target.value)}
                          className="min-h-[200px] resize-none"
                          placeholder="Describe your changes..."
                        />
                      </div>

                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={handleSaveBlog}
                          disabled={!commitMessage.trim()}
                          className="px-12"
                        >
                          SUBMIT
                        </Button>
                      </div>
                    </div>
                  </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <CollabList 
            owner={owner} 
            collaborators={collaborators} 
            onRemoveCollaborator={currentUserId === owner?.id ? handleRemoveCollaborator : undefined}
            isOwner={currentUserId === owner?.id}
            onNavigate={handleNavigationAttempt}
          />
        </div>
      </main>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Unsaved Changes
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Changes have not been saved. Do you want to save the changes?
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleSaveAndContinue}
              className="w-full"
            >
              Save Changes
            </Button>
            <Button
              onClick={handleContinueWithoutSaving}
              variant="outline"
              className="w-full"
            >
              Continue without saving
            </Button>
            <Button
              onClick={() => {
                setShowUnsavedDialog(false);
                setPendingNavigation(null);
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
         {/* Remove Collaborator Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Remove Collaborator
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-4">
            <p className="text-center text-muted-foreground">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {collaboratorToRemove?.name}
              </span>{" "}
              from this work log?
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={confirmRemoveCollaborator}
              variant="destructive"
              className="w-full"
            >
              Yes, Remove
            </Button>
            <Button
              onClick={() => {
                setShowRemoveDialog(false);
                setCollaboratorToRemove(null);
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {/* Remove Collaborator Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        {/* ... kode remove dialog ... */}
      </AlertDialog>

      {/* TAMBAHKAN DIALOG INI: */}
      {/* Invite Collaborator Confirmation Dialog */}
      <AlertDialog open={showInviteConfirmDialog} onOpenChange={setShowInviteConfirmDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-center">
              Invite Collaborators
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-4 space-y-3">
            <p className="text-center text-muted-foreground">
              Are you sure you want to invite the following collaborator{selectedFriendsToInvite.length > 1 ? 's' : ''}?
            </p>
            
            {/* List of collaborators to invite */}
            <div className="max-h-48 overflow-y-auto space-y-2 px-2">
              {selectedFriendsToInvite.map((friend) => (
                <div 
                  key={friend.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-accent/30 border border-border"
                >
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{friend.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{friend.division}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={confirmInvite}
              className="w-full"
            >
              Yes, Invite
            </Button>
            <Button
              onClick={() => {
                setShowInviteConfirmDialog(false);
                setSelectedFriendsToInvite([]);
                setInviteOpen(true); // Reopen invite dialog
              }}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

  
    </div>
  );
};

export default BlogEditor;
