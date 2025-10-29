import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Users, MessageSquare, Save } from "lucide-react";
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

interface WorkLogEditorProps {
  onBack: () => void;
}

const WorkLogEditor = ({ onBack }: WorkLogEditorProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [versionOpen, setVersionOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [commitMessage, setCommitMessage] = useState("");

  const friends = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleInvite = () => {
    console.log("Inviting friends:", selectedFriends);
    setInviteOpen(false);
    setSelectedFriends([]);
    setSearchQuery("");
  };

  const handleSaveWorkLog = () => {
    console.log("Saving work log with message:", commitMessage);
    setSaveOpen(false);
    setCommitMessage("");
  };

  const workLogVersions = [
    { id: "1", author: "Arrizal anru M", division: "Nama_Divisi", message: "MESSAGE......", updatedAt: "Updated 2 days ago", avatar: "/placeholder.svg" },
    { id: "2", author: "Arrizal anru M", division: "Nama_Divisi", message: "MESSAGE......", updatedAt: "Updated 2 days ago", avatar: "/placeholder.svg" },
    { id: "3", author: "Arrizal anru M", division: "Nama_Divisi", message: "MESSAGE......", updatedAt: "Updated 2 days ago", avatar: "/placeholder.svg" },
    { id: "4", author: "Arrizal anru M", division: "Nama_Divisi", message: "MESSAGE......", updatedAt: "Updated 2 days ago", avatar: "/placeholder.svg" },
  ];

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
          <AlertDialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                INVITE
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-xl font-bold mb-4">
                  INVITE YOUR PARTNER TEAM
                </AlertDialogTitle>
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
                          ? 'ring-2 ring-primary ring-offset-2 rounded-full'
                          : 'opacity-70 hover:opacity-100'
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

          <AlertDialog open={versionOpen} onOpenChange={setVersionOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                COMMIT
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl max-h-[80vh]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold">
                  Name of Project
                </AlertDialogTitle>
              </AlertDialogHeader>
              
              <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2">
                {workLogVersions.map((version) => (
                  <div key={version.id} className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={version.avatar}
                          alt={version.author}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{version.author}</p>
                          <p className="text-sm text-muted-foreground">{version.division}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{version.updatedAt}</span>
                    </div>
                    <p className="font-semibold">{version.message}</p>
                  </div>
                ))}
              </div>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={saveOpen} onOpenChange={setSaveOpen}>
            <AlertDialogTrigger asChild>
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                SAVE WORK LOG
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-center text-xl font-bold mb-4">
                  SAVE YOUR WORK LOG
                </AlertDialogTitle>
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
                    onClick={handleSaveWorkLog}
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
