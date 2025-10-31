import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";
import { useState } from "react";

const WorkLogVersion = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const friends = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

  const workLogVersions = [
    { id: "1", author: "Arrizal anru M", division: "Nama_Divisi", message: "MESSAGE......", updatedAt: "Updated 2 days ago", avatar: "/placeholder.svg" },
    { id: "2", author: "Arrizal anru M", division: "Nama_Divisi", message: "MESSAGE......", updatedAt: "Updated 2 days ago", avatar: "/placeholder.svg" },
    { id: "3", author: "Arrizal anru M", division: "Nama_Divisi", message: "MESSAGE......", updatedAt: "Updated 2 days ago", avatar: "/placeholder.svg" },
    { id: "4", author: "Arrizal anru M", division: "Nama_Divisi", message: "MESSAGE......", updatedAt: "Updated 2 days ago", avatar: "/placeholder.svg" },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-foreground"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <h1 className="text-3xl font-bold">Name of Project</h1>
            </div>

            <div className="space-y-4 max-w-4xl">
              {workLogVersions.map((version) => (
                <div key={version.id} className="bg-card border border-border p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={version.avatar}
                        alt={version.author}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-lg">{version.author}</p>
                        <p className="text-sm text-muted-foreground">{version.division}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{version.updatedAt}</span>
                  </div>
                  <p className="font-semibold text-base">{version.message}</p>
                </div>
              ))}
            </div>
          </div>

          <FriendsList friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default WorkLogVersion;
