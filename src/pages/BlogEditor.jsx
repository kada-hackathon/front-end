import { useState, useEffect } from "react";
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
import FriendsList from "@/components/FriendsList/FriendsList";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { ADMIN_ENDPOINTS, AUTH_ENDPOINTS, WORKLOG_ENDPOINTS } from "../config/api";

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
  const [blogTitle, setBlogTitle] = useState("");
  const [blogTags, setBlogTags] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [postOwnerId, setPostOwnerId] = useState(null);
  const [postCollaborators, setPostCollaborators] = useState([]);

  const postId = searchParams.get("id");
  const isEditMode = !!postId; // Determine if we're editing or creating

  // Get current user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
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

  // Fetch worklog detail (only in edit mode)
  useEffect(() => {
    if (!postId) {
      // CREATE MODE: Set initial empty state
      setBlogTitle("");
      setBlogTags([]);
      setBlogContent("");
      return;
    }

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(WORKLOG_ENDPOINTS.ONE, {
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
        
        // Set data
        setBlogTitle(data.title || "");
        setBlogTags(data.tag || []);
        setBlogContent(data.content || "");
        setPostOwnerId(data.user?._id || data.user?.id);
        setPostCollaborators(data.collaborators || []);
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
        const token = localStorage.getItem('token');
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
      
      if (isEditMode) {
        // EDIT MODE: Update existing worklog
        const response = await fetch(WORKLOG_ENDPOINTS.ONE, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: blogTitle || "Untitled Work Log",
            content: blogContent,
            tag: blogTags || [],
            collaborators: selectedFriends,
            commitMessage: commitMessage
          })
        });
        const data = await response.json();
        console.log('Blog updated:', data);
      } else {
        // CREATE MODE: Create new worklog
        const response = await fetch(WORKLOG_ENDPOINTS.LIST, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: blogTitle || "Untitled Work Log",
            content: blogContent,
            tag: blogTags || [],
            collaborators: selectedFriends,
            commitMessage: commitMessage
          })
        });
        const data = await response.json();
        console.log('Blog created:', data);
      }
      
      setSaveOpen(false);
      setCommitMessage("");
      navigate("/worklog");
    } catch (err) {
      console.error('Error saving blog:', err);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col relative">
            {/* SimpleEditor with toolbar - toolbar will be sticky */}
            <div className="flex-1 overflow-y-auto">
              <SimpleEditor
                initialContent={blogContent}
                onContentChange={(content) => setBlogContent(content)}
                initialTitle={blogTitle}
                initialTags={blogTags}
                onTitleChange={(title) => setBlogTitle(title)}
                onTagsChange={(tags) => setBlogTags(tags)}
                sidebarCollapsed={sidebarCollapsed}
                onBack={() => navigate(-1)}
                onVersion={() => navigate("/worklog/version")}
              />
            </div>

            {/* Sticky Action Buttons - stick to bottom right of editor area */}
            <div className="sticky bottom-6 self-end mr-6 mb-6 flex flex-col gap-3 z-50" style={{ marginTop: '-120px' }}>
              {/* INVITE DIALOG */}
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

          <FriendsList friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default BlogEditor;
