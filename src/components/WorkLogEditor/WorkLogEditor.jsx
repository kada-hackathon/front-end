import { useState } from "react";
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
import "./WorkLogEditor.css";

const WorkLogEditor = ({ onBack }) => {
  const navigate = useNavigate();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commitMessage, setCommitMessage] = useState("");

  const friends = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

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

  const handleSaveWorklog = () => {
    console.log("Saving worklog with message:", commitMessage);
    setSaveOpen(false);
    setCommitMessage("");
  };

  const handleVersion = () => {
    navigate("/worklog/version");
  };

  return (
    <div className="worklog-content">
      <div className="worklog-header">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="back-button"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="worklog-title">Untitled-1</h1>
        <div className="worklog-actions">
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

          <Button variant="outline" onClick={handleVersion}>Version</Button>

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

      <textarea
        className="worklog-editor"
        placeholder="Start writing your work log..."
      />
    </div>
  );
};

export default WorkLogEditor;