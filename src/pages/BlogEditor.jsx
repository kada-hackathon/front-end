import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Users, MessageSquare, Save, X } from "lucide-react";
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
import FriendsList from "@/components/FriendsList/FriendsList";

const BlogEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  const postId = searchParams.get("id");
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

  // Fetch worklog detail
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
        setBlogContent(data.content || "");
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // Check access (owner atau collaborator)
  useEffect(() => {
    if (post && currentUserId) {
      const isOwner = post.user?._id === currentUserId || post.user?.id === currentUserId;
      const isCollaborator = post.collaborators?.some(collab => 
        collab._id === currentUserId || collab.id === currentUserId
      );
      const canAccess = isOwner || isCollaborator;
      
      setHasAccess(canAccess);
      
      if (!canAccess) {
        console.warn('Access denied: Not owner or collaborator');
        navigate(-1); // Go back jika tidak punya akses
      }
    }
  }, [post, currentUserId, navigate]);

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

  const filteredFriends = friends.filter((friend) =>
    (friend.name || friend.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  ).map((friend) => ({
    id: friend._id || friend.id,
    name: friend.name || friend.full_name || "Unknown",
    division: friend.division || "Unknown",
    avatar: friend.profilePicture || friend.profile_photo || "/placeholder.svg"
  }));

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleInvite = () => {
    console.log("Inviting friends:", selectedFriends);
    setInviteOpen(false);
    setSelectedFriends([]);
    setSearchQuery("");
  };

  const handleSaveBlog = async () => {
    console.log("Saving blog with message:", commitMessage);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/worklogs/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: post.title,
          content: blogContent,
          tag: post.tag || [],
          collaborators: selectedFriends
        })
      });
      const data = await response.json();
      console.log('Blog saved:', data);
      setSaveOpen(false);
      setCommitMessage("");
      navigate("/");
    } catch (err) {
      console.error('Error saving blog:', err);
    }
  };

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
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h1 className="flex-1 text-3xl font-bold text-foreground">
                {loading ? "Loading..." : post?.title || "Untitled"}
              </h1>

              <div className="flex gap-3">
                {/* INVITE DIALOG */}
                <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Users className="h-4 w-4" />
                      INVITE
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                      <div className="flex items-center justify-between">
                        <AlertDialogTitle className="text-xl font-bold flex-1 text-center">
                          INVITE YOUR PARTNER TEAM
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

                      <div className="flex gap-4 justify-center py-4">
                        {filteredFriends.map((friend) => (
                          <button
                            key={friend.id}
                            onClick={() => toggleFriendSelection(friend.id)}
                            className={`relative transition-all ${
                              selectedFriends.includes(friend.id)
                                ? "ring-2 ring-primary ring-offset-2 rounded-full"
                                : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={friend.avatar}
                              alt={friend.name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                          </button>
                        ))}
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
                </AlertDialog>

                {/* COMMIT BUTTON */}
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => navigate("/worklog/version")}
                >
                  <MessageSquare className="h-4 w-4" />
                  COMMIT
                </Button>

                {/* SAVE WORKLOG DIALOG */}
                <AlertDialog open={saveOpen} onOpenChange={setSaveOpen}>
                  <AlertDialogTrigger asChild>
                    <Button className="gap-2">
                      <Save className="h-4 w-4" />
                      SAVE WORKLOG
                    </Button>
                  </AlertDialogTrigger>
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

            <textarea
              className="w-full min-h-[500px] p-4 border border-border rounded-lg bg-card text-foreground resize-vertical focus:outline-none focus:border-primary"
              placeholder="Start writing your blog..."
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
            />
          </div>

          <FriendsList friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default BlogEditor;
