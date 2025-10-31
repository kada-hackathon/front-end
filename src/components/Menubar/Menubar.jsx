import { Home, MessageCircle, ClipboardList, ChevronLeft, FileText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./Menubar.css";
import logoWithText from "@/assets/Logo/Logo with Text_White.png";
import logoOnly from "@/assets/Logo/Logo Only_White.png";

const Menubar = ({ collapsed, onToggleCollapse, recentProjects }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeMenu = location.pathname;

  const handleRecentProjectClick = (project) => {
    navigate(`/blog-editor?project=${encodeURIComponent(project)}`);
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
            <p className="menubar-nav-label">Recent Project</p>
            <div className="menubar-recent-items">
              {recentProjects.map((project, index) => (
                <button
                  key={index}
                  className="menubar-recent-button"
                  onClick={() => handleRecentProjectClick(project)}
                >
                  {project}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Menubar;