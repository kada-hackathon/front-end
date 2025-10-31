import { useState, useEffect } from "react";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";
import WorkLogList from "@/components/WorkLogList/WorkLogList";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tiptap-ui-primitive/tooltip";
import "./WorkLog.css";

function WorkLog() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

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
        console.log('Friends response:', data);
        const friendsList = data.data || data.employees || data || [];
        setFriends(friendsList);
        setLoadingFriends(false);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setLoadingFriends(false);
      }
    };
    fetchFriends();
  }, []);



  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

  // Filter friends berdasarkan search query
  const filteredFriends = friends.filter((friend) => 
    (friend.name || friend.full_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  ).map((friend) => ({
    id: friend._id || friend.id,
    name: friend.name || friend.full_name || "Unknown",
    avatar: friend.profilePicture || friend.profile_photo || "/placeholder.svg"
  }));

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends((prev) => prev.includes(friendId)
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

  const handleSaveWorklog = () => {
    console.log("Saving worklog with message:", commitMessage);
    setSaveOpen(false);
    setCommitMessage("");
  };

  const handleVersion = () => {
    navigate("/worklog/version");
  };

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        recentProjects={recentProjects} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          {showEditor ? (
            <>
              <div className="flex-1 flex flex-col">
                {/* SimpleEditor with toolbar - toolbar will be sticky */}
                <div className="flex-1 overflow-y-auto">
                  <SimpleEditor
                    onBack={() => setShowEditor(false)}
                    onVersion={handleVersion}
                    sidebarCollapsed={sidebarCollapsed} />
                </div>

                {/* Action Buttons - circular icon-only buttons stacked vertically */}
                <div className="flex flex-col gap-2 px-4 py-2 items-end">
                  {/* INVITE DIALOG */}
                  <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <Tooltip delay={200}>
                      <AlertDialogTrigger asChild>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-14 w-14"
                          >
                            <Users className="h-7 w-7" />
                          </Button>
                        </TooltipTrigger>
                      </AlertDialogTrigger>
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
                          <Input
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10" />
                        </div>

                        <div className="flex gap-4 justify-center py-4">
                          {filteredFriends.map((friend) => (
                            <button
                              key={friend.id}
                              onClick={() => toggleFriendSelection(friend.id)}
                              className={`relative transition-all ${selectedFriends.includes(friend.id)
                                  ? "ring-2 ring-primary ring-offset-2 rounded-full"
                                  : "opacity-70 hover:opacity-100"}`}
                            >
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-20 h-20 rounded-full object-cover" />
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
                      <AlertDialogTrigger asChild>
                        <TooltipTrigger asChild>
                          <Button
                            variant="default"
                            size="icon"
                            className="rounded-full h-14 w-14"
                          >
                            <Save className="h-7 w-7" />
                          </Button>
                        </TooltipTrigger>
                      </AlertDialogTrigger>
                      <TooltipContent>Save Worklog</TooltipContent>
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
                            placeholder="Describe your changes..." />
                        </div>

                        <div className="flex justify-center pt-4">
                          <Button
                            onClick={handleSaveWorklog}
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
            </>
          ) : (
            <WorkLogList onCreateNew={() => setShowEditor(true)} />
          )}
          <FriendsList />
        </div>
      </main>
    </div>
  );
}

export default WorkLog;

