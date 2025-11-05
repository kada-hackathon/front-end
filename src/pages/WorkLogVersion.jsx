import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Menubar from "@/components/Menubar/Menubar";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "@/components/FriendsList/FriendsList";
import { WORKLOG_ENDPOINTS } from "../config/api";

const WorkLogVersion = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id WorkLog nya
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [versions, setVersions] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedHistory, setSelectedHistory] = useState(null);

  console.log("ID DARI ROUTER:", id);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await fetch(WORKLOG_ENDPOINTS.VERSIONS(id), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          credentials: "include"
        });

        const data = await res.json();

        console.log("VERSIONS DATA", data);

        setVersions(data?.versions ?? []);  // fallback aman
        setTitle(data?.title ?? "");
      } catch (err) {
        console.error("fetchVersions error:", err);
      }
    };

    if (!id) return;

    fetchVersions();
  }, [id]);

  const fetchSingleHistory = async (hid) => {
    const token = localStorage.getItem("token");
    console.log("[DEBUG] GET LOGHISTORY URL:", WORKLOG_ENDPOINTS.LOGHISTORY_ONE(hid));

    const res = await fetch(WORKLOG_ENDPOINTS.LOGHISTORY_ONE(hid), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log("[DEBUG] DETAIL HISTORY:", data);

    setSelectedHistory(data);
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
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>

            <div className="space-y-4 max-w-4xl">
              {Array.isArray(versions) && versions.map(v => (
                <div key={v._id} className="bg-card border border-border p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={v.user?.profile_photo ?? "/placeholder.svg"}
                        alt={v.user?.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-lg">{v.user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {v.user?.division}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {/* kalau backend udah kirim datetime → format */}
                      {new Date(v.datetime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-semibold text-base">{v.message}</p>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await fetchSingleHistory(v._id);
                      navigate(`/blog-post?id=${id}`, {
                        state: {
                          snapshot: v.snapshot,
                          historyId: v._id
                        }
                      });
                    }}
                  >
                    Look this version
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <FriendsList/>
        </div>
      </main>
    </div>
  );
};

export default WorkLogVersion;

