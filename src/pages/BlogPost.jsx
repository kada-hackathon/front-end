import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";
import { ADMIN_ENDPOINTS, AUTH_ENDPOINTS, WORKLOG_ENDPOINTS } from "../config/api";

const BlogPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // ini hasil dari klik WorkLogVersion
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

  const handleDeleteClick = async () => {
    if (!window.confirm('Are you sure you want to delete this work log? This action cannot be undone.')) {
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(WORKLOG_ENDPOINTS.ONE(postId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Work log deleted successfully!');
        navigate('/');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete work log');
      }
    } catch (err) {
      console.error('Error deleting work log:', err);
      alert('Failed to delete work log. Please try again.');
    }
  };

  // FETCH LOG HISTORY + MERGE SNAPSHOT
  useEffect(() => {
    // case 1: buka versi history
    if (snapshot && historyId) {
      console.log("[DEBUG] MODE HISTORY – fetch loghistory:", historyId);

      const token = localStorage.getItem("token");

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
            datetime: json.datetime // datetime history
          });
        })
        .catch(err => console.error("[DEBUG] ERROR fetch loghistory:", err));

      return; // <— STOP disini, jangan jalan bagian post
    }

    // case 2: normal post (tanpa versi)
    if (post) {
      console.log("[DEBUG] MODE NORMAL POST – pakai post data");
      setDisplayPost(post);
    }
  }, [snapshot, historyId, post]);

  // const displayPost = snapshot || post;

  if (loading || !displayPost) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <p>Loading post...</p>
      </div>
    );
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

              {/* TOP BAR ACTION */}
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

              {/* CONTENT CARD */}
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8">

                {/* HEADER BAR */}
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

                {/* TITLE */}
                <h1 className="text-3xl font-bold mb-4 text-foreground">{displayPost.title}</h1>

                {/* TAGS */}
                {displayPost.tag && displayPost.tag.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {displayPost.tag.map(t => t.startsWith('#') ? t : `#${t}`).join(" ")}
                  </p>
                )}

                {/* CONTENT */}
                <div
                  className="prose prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: displayPost.content || '' }}
                />

                {/* MEDIA */}
                {displayPost.media && displayPost.media.length > 0 && (
                  <div className="mt-6">
                    {displayPost.media.map((mediaUrl, index) => (
                      <img
                        key={index}
                        src={mediaUrl}
                        alt={`Media ${index + 1}`}
                        className="max-w-full rounded-lg"
                      />
                    ))}
                  </div>
                )}

              </div>{/* end card */}

            </div>{/* end max-w */}
          </div>{/* end content left */}
          <FriendsList friends={friends} />
        </div>

      </main>
    </div>
  );
};

export default BlogPost;

