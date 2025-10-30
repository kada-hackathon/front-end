import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";

const BlogPost = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const postId = searchParams.get("id");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

  // Get current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/auth/profile', {
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
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/worklogs/${postId}`, {
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
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/employees', {
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

  if (loading) {
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
        recentProjects={recentProjects}
      />

      <main className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto bg-background">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="max-w-4xl mx-auto">
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
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{new Date(post.datetime || post.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                      <p>19.00 WIB</p>
                    </div>
                    {canEdit && (
                      <Button onClick={handleEditClick} className="gap-2">
                        EDIT
                      </Button>
                    )}
                  </div>
                </div>

                <h1 className="text-3xl font-bold mb-4 text-foreground">{post.title}</h1>

                {post.tag && post.tag.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {post.tag.map((t) => `#${t}`).join(" ")}
                  </p>
                )}

                <div className="prose prose-lg max-w-none text-foreground">
                  {post.content && post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {post.media && post.media.length > 0 && (
                  <div className="mt-6">
                    {post.media.map((mediaUrl, index) => (
                      <img 
                        key={index}
                        src={mediaUrl} 
                        alt={`Media ${index + 1}`}
                        className="max-w-full rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <FriendsList friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default BlogPost;
