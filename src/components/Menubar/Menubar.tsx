import { Home, MessageCircle, ClipboardList, ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./Menubar.css";

interface MenubarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  recentProjects: string[];
}

const Menubar = ({ collapsed, onToggleCollapse, recentProjects }: MenubarProps) => {
  const location = useLocation();
  const activeMenu = location.pathname;

  return (
    <aside className={cn("menubar", collapsed && "menubar-collapsed")}>
      <div className="menubar-header">
        {!collapsed && (
          <div className="menubar-logo">
            <div className="menubar-logo-icon">
              <svg viewBox="0 0 24 24" className="menubar-logo-svg">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </svg>
            </div>
            <span className="menubar-logo-text">NebWork</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="menubar-toggle-btn"
        >
          <ChevronLeft className={cn("menubar-toggle-icon", collapsed && "menubar-toggle-icon-collapsed")} />
        </Button>
      </div>

      <nav className="menubar-nav">
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
