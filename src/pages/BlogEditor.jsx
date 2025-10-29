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

  const postId = searchParams.get("id");

  // Mock data for posts (same as in HomeContent)
  const posts = [
    {
      id: "1",
      author: {
        name: "Moriee al haji",
        division: "Nama_Divisi",
        avatar: "/placeholder.svg",
      },
      date: "23 Nov 2025",
      title: "Cara Membuat Telur Gulung",
      hashtags: ["#Telur Gulu", "#makanan"],
      content:
        "Misi kami di Cookpad adalah untuk membuat masak sehari-hari menyenangkan, karena kami percaya bahwa memasak adalah kunci menuju kehidupan yang lebih bahagia dan lebih sehat bagi manusia, komunitas, dan bumi .......",
    },
    {
      id: "2",
      author: {
        name: "Netta muji maju",
        division: "Nama_Divisi",
        avatar: "/placeholder.svg",
      },
      date: "23 Nov 2025",
      title: "PEMBUATAN IOT BERBASIS AI",
      hashtags: ["#AI", "#IOT", "#Tanaman"],
      content: "",
      image: "/placeholder.svg",
    },
    {
      id: "3",
      author: {
        name: "Regina alhajiz",
        division: "Nama_Divisi",
        avatar: "/placeholder.svg",
      },
      date: "23 Nov 2025",
      title: "Menghapus Postingan dari akun",
      hashtags: [],
      content: "",
    },
  ];

  const currentPost = posts.find(post => post.id === postId);

  useEffect(() => {
    if (currentPost) {
      setBlogContent(currentPost.content);
    }
  }, [currentPost]);

  const friends = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleSaveBlog = () => {
    console.log("Saving blog with message:", commitMessage);
    setSaveOpen(false);
    setCommitMessage("");
    navigate("/");
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
              <Button variant="ghost" size="icon" onClick={() => navigate("/worklog")}>
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h1 className="flex-1 text-3xl font-bold text-foreground">{currentPost ? currentPost.title : "Untitled-1"}</h1>

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
