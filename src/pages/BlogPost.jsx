import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";
import { ADMIN_ENDPOINTS, AUTH_ENDPOINTS, WORKLOG_ENDPOINTS, UPLOAD_ENDPOINTS } from "../config/api";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

const BlogPost = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const snapshot = location.state?.snapshot;
  const historyId = location.state?.historyId;

  const [searchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const postId = searchParams.get("id");
  const [post, setPost] = useState(null);
  const [displayPost, setDisplayPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateTime, setDateTime] = useState(null);
  const [friends, setFriends] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

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
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch detail worklog dari backend
  useEffect(() => {
    if (!postId) return;
    
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
        console.log('Post media array:', data.media);
        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

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

  // Check apakah user adalah owner atau collaborator
  const isOwner = post && currentUserId && (post.user?._id === currentUserId || post.user?.id === currentUserId);
  const isCollaborator = post && currentUserId && 
    post.collaborators?.some(collab => 
      collab._id === currentUserId || collab.id === currentUserId
    );
  const canEdit = isOwner || isCollaborator;

  const handleEditClick = () => {
    navigate(`/blog-editor?id=${postId}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // Helper function to extract media URLs from content (for deletion)
  const extractMediaUrls = (content, mediaArray = []) => {
    const urls = [];
    
    // Extract from media array (it's an array of URL strings)
    if (Array.isArray(mediaArray)) {
      mediaArray.forEach(mediaUrl => {
        if (typeof mediaUrl === 'string' && mediaUrl.includes('digitaloceanspaces.com')) {
          urls.push(mediaUrl);
        }
      });
    }
    
    // Extract from HTML content (images and videos)
    if (content && typeof content === 'string') {
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      const videoRegex = /<video[^>]+src="([^">]+)"/g;
      const sourceRegex = /<source[^>]+src="([^">]+)"/g;
      
      let match;
      while ((match = imgRegex.exec(content)) !== null) {
        if (match[1] && match[1].includes('digitaloceanspaces.com')) {
          urls.push(match[1]);
        }
      }
      
      while ((match = videoRegex.exec(content)) !== null) {
        if (match[1] && match[1].includes('digitaloceanspaces.com')) {
          urls.push(match[1]);
        }
      }
      
      while ((match = sourceRegex.exec(content)) !== null) {
        if (match[1] && match[1].includes('digitaloceanspaces.com')) {
          urls.push(match[1]);
        }
      }
    }
    
    // Remove duplicates
    return [...new Set(urls)];
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      const token = sessionStorage.getItem('token');
      
      console.log('Full post object:', post);
      console.log('Post content:', post?.content);
      console.log('Post media:', post?.media);
      
      // Step 1: Extract and delete media files first
      if (post && (post.content || post.media)) {
        const mediaUrls = extractMediaUrls(post.content, post.media);
        
        console.log('Extracted media URLs:', mediaUrls);
        
        if (mediaUrls.length > 0) {
          console.log('Attempting to delete media files:', mediaUrls);
          
          const deleteMediaResponse = await fetch(UPLOAD_ENDPOINTS.DELETE_MULTIPLE, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ urls: mediaUrls })
          });
          
          const deleteResult = await deleteMediaResponse.json();
          console.log('Delete media response:', deleteResult);
          
          if (!deleteMediaResponse.ok) {
            console.warn('Failed to delete some media files:', deleteResult);
          } else {
            console.log('Media files deleted successfully');
          }
        } else {
          console.log('No media URLs found to delete');
        }
      }
      
      // Step 2: Delete the worklog
      const response = await fetch(WORKLOG_ENDPOINTS.ONE(postId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setShowDeleteDialog(false);
        toast({
          title: "✅ Work log deleted successfully!",
          description: "The work log has been removed.",
          duration: 3000,
        });
        // Navigate after showing success message
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        const data = await response.json();
        toast({
          title: "Failed to delete work log",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
        setIsDeleting(false);
      }
    } catch (err) {
      console.error('Error deleting work log:', err);
      toast({
        title: "Failed to delete work log",
        description: "Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  // FETCH LOG HISTORY + MERGE SNAPSHOT
  useEffect(() => {
    // case 1: buka versi history
    if (snapshot && historyId) {
      console.log("[DEBUG] MODE HISTORY – fetch loghistory:", historyId);

      const token = sessionStorage.getItem("token");

      fetch(WORKLOG_ENDPOINTS.LOGHISTORY_ONE(historyId), {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => {
          console.log("[DEBUG] loghistory status:", r.status);
          return r.json();
        })
        .then(json => {
          console.log("[DEBUG] loghistory JSON:", json);

          // MERGE
          setDisplayPost({
            ...snapshot,        // isi content
            datetime: json.datetime, // datetime history
            media: post?.media || [] // preserve media from main post
          });
        })
        .catch(err => console.error("[DEBUG] ERROR fetch loghistory:", err));

      return; // <— STOP disini, jangan jalan bagian post
    }

    // case 2: normal post (tanpa versi)
    if (post) {
      console.log("[DEBUG] MODE NORMAL POST – pakai post data");
      console.log("[DEBUG] Post media:", post.media);
      setDisplayPost(post);
    }
  }, [snapshot, historyId, post]);

  if (loading || !displayPost) {
    return <Loading fullScreen message="Loading work log..." />;
  }

  if (!post) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                {!snapshot && canEdit && (
                  <div className="flex gap-2">
                    <Button onClick={handleEditClick} className="gap-2 h-9">
                      <Pencil className="h-4 w-4" />
                      Edit Work Log
                    </Button>
                    {isOwner && (
                      <Button 
                        onClick={handleDeleteClick} 
                        className="gap-2 h-9 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Work Log
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={post.user?.profilePicture || post.user?.profile_photo || "/placeholder.svg"} />
                      <AvatarFallback>
                        {(post.user?.name || "Unknown").substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg text-foreground">{post.user?.name || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">{post.user?.division || "N/A"}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>
                      {new Date(displayPost.datetime || displayPost.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <p>
                      {new Date(displayPost.datetime || displayPost.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} WIB
                    </p>
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4 text-foreground">{displayPost.title}</h1>

                {displayPost.tag && displayPost.tag.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {displayPost.tag.map((t) => t.startsWith('#') ? t : `#${t}`).join(" ")}
                  </p>
                )}

                <div 
                  className="prose prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: displayPost.content || '' }}
                />
              </div>
            </div>
          </div>

          <FriendsList/>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-center text-destructive">
                Delete Work Log
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="py-3">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-center font-semibold text-foreground mb-2">
                This action cannot be undone!
              </p>
              <p className="text-center text-sm text-muted-foreground">
                All content, media files, and version history will be permanently deleted.
              </p>
            </div>
            
            <p className="text-center text-muted-foreground">
              Are you sure you want to delete this work log?
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={confirmDelete}
              variant="destructive"
              className="w-full"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </div>
              ) : (
                'Yes, Delete Permanently'
              )}
            </Button>
            <Button
              onClick={() => {
                setShowDeleteDialog(false);
              }}
              variant="outline"
              className="w-full"
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogPost;

