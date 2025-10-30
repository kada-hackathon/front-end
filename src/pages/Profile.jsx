import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";

const Profile = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const friends = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="text-foreground"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-4xl font-bold text-foreground">Your Profile</h1>
            </div>

            <div className="max-w-3xl bg-card/50 backdrop-blur-sm rounded-2xl p-8 space-y-6">
              <div className="flex items-start gap-8">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-foreground font-medium">Photo:</span>
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>GA</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col gap-3 pt-6">
                  <Button variant="default" className="w-48">
                    Upload Photo
                  </Button>
                  <Button variant="outline" className="w-48">
                    Delete Photo
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Name:</label>
                    <Input placeholder="Type name" className="flex-1" />
                  </div>
                  <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Division:</label>
                    <Input placeholder="Division Name" className="flex-1" />
                  </div>
                  <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium min-w-[120px]">Email:</label>
                    <Input placeholder="Type email" type="email" className="flex-1" />
                  </div>
                  <p className="text-sm text-destructive italic text-right">Cannot be changed</p>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-foreground font-medium min-w-[120px]">Date of Join:</label>
                  <Input placeholder="Date of join" type="date" className="flex-1" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 pt-4">
                <Button onClick={handleSave} className="w-64">
                  SAVE
                </Button>
                {showSuccess && (
                  <p className="text-sm text-green-600 font-medium">
                    Your profile has successfully updated!
                  </p>
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

export default Profile;
