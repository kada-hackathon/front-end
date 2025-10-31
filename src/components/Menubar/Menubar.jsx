import { Home, MessageCircle, ClipboardList, ChevronLeft, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import "./Menubar.css";
import logoWithText from "@/assets/Logo/Logo with Text_White.png";
import logoOnly from "@/assets/Logo/Logo Only_White.png";

const Menubar = ({ collapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeMenu = location.pathname;
  const [recentProjects, setRecentProjects] = useState([]);

  // Fetch 3 newest work logs from current user
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Get current user ID
        const userResponse = await fetch('http://localhost:5000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = await userResponse.json();
        const currentUserId = userData.user?.id || userData.user?._id || userData.id || userData._id;
        
        // Fetch all worklogs
        const worklogsResponse = await fetch('http://localhost:5000/api/worklogs/filter', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        const worklogsData = await worklogsResponse.json();
        let allWorklogs = Array.isArray(worklogsData) ? worklogsData : (worklogsData?.worklogs || []);
        
        // Filter: only works created by current user (owner)
        const userWorklogs = allWorklogs.filter(worklog => {
          const isOwner = worklog.user?._id === currentUserId || worklog.user?.id === currentUserId;
          return isOwner;
        });
        
        // Sort by date (newest first) and take top 3
        const sortedWorklogs = userWorklogs.sort((a, b) => {
          const dateA = new Date(a.datetime || a.createdAt);
          const dateB = new Date(b.datetime || b.createdAt);
          return dateB - dateA; // Descending order
        });
        
        const recent3 = sortedWorklogs.slice(0, 3).map(worklog => ({
          id: worklog._id || worklog.id,
          title: worklog.title || "Untitled"
        }));
        
        setRecentProjects(recent3);
      } catch (err) {
        console.error('Error fetching recent projects:', err);
        setRecentProjects([]);
      }
    };
    
    fetchRecentProjects();
  }, []);

  const handleRecentProjectClick = (projectId) => {
    navigate(`/blog-post?id=${projectId}`);
  };

  return (
    <aside className={cn("menubar", collapsed && "menubar-collapsed")}>
      {collapsed ? (
        <div className="menubar-collapsed-logo">
          <img src={logoOnly} alt="NebWork" className="menubar-collapsed-logo-img" />
        </div>
      ) : (
        <div className="menubar-header">
          <div className="menubar-logo">
            <img src={logoWithText} alt="NebWork" className="menubar-logo-img" />
          </div>
        </div>
      )}

      <nav className="menubar-nav">
        <div className="menubar-toggle-container">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="menubar-toggle-btn"
          >
            <ChevronLeft className={cn("menubar-toggle-icon", collapsed && "menubar-toggle-icon-collapsed")} />
          </Button>
        </div>
        <div className="menubar-nav-section">
          {!collapsed && <p className="menubar-nav-label">Menus</p>}
          <div className="menubar-nav-items">
            <Link to="/">
              <Button
                variant="ghost"
                className={cn(
                  "menubar-nav-button",
                  activeMenu === "/" && "menubar-nav-button-active"
                )}
              >
                <Home className="menubar-nav-icon" />
                {!collapsed && <span>Home</span>}
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button
                variant="ghost"
                className={cn(
                  "menubar-nav-button",
                  activeMenu === "/chatbot" && "menubar-nav-button-active"
                )}
              >
                <MessageCircle className="menubar-nav-icon" />
                {!collapsed && <span>Chat Bot</span>}
              </Button>
            </Link>
            <Link to="/worklog">
              <Button
                variant="ghost"
                className={cn(
                  "menubar-nav-button",
                  activeMenu === "/worklog" && "menubar-nav-button-active"
                )}
              >
                <ClipboardList className="menubar-nav-icon" />
                {!collapsed && <span>Work Log</span>}
              </Button>
            </Link>
          </div>
        </div>

        {!collapsed && (
          <div className="menubar-recent-section">
            <p className="menubar-nav-label">Recent Work</p>
            <div className="menubar-recent-items">
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <button
                    key={project.id}
                    className="menubar-recent-button"
                    onClick={() => handleRecentProjectClick(project.id)}
                    title={project.title}
                  >
                    {project.title}
                  </button>
                ))
              ) : (
                <p className="text-sm text-white px-3 py-2">No recent work</p>
              )}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Menubar;