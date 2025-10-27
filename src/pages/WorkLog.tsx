import { useState } from "react";
import Menubar from "@/components/Menubar";
import Navbar from "@/components/Navbar";
import FriendsList from "@/components/FriendsList";
import WorkLogContent from "@/components/WorkLogContent";

interface Friend {
  id: string;
  name: string;
  division: string;
  avatar: string;
}

const WorkLog = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const friends: Friend[] = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

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
          <WorkLogContent />
          <FriendsList friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default WorkLog;
