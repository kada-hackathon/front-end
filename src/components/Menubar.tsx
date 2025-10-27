import { Home, MessageCircle, ClipboardList, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenubarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  recentProjects: string[];
}

const Menubar = ({ collapsed, onToggleCollapse, activeMenu, onMenuChange, recentProjects }: MenubarProps) => {
  return (
    <aside
      className={cn(
        "bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-text))] transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[hsl(var(--sidebar-bg))]">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
              </svg>
            </div>
            <span className="font-bold text-lg">NebWork</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="text-white hover:bg-[hsl(var(--sidebar-hover))]"
        >
          <ChevronLeft className={cn("transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6">
          {!collapsed && <p className="text-sm text-white/60 mb-3">Menus</p>}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-white hover:bg-[hsl(var(--sidebar-hover))]",
                activeMenu === "home" && "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--sidebar-active))]"
              )}
              onClick={() => onMenuChange("home")}
            >
              <Home className="w-5 h-5" />
              {!collapsed && <span>Home</span>}
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-white hover:bg-[hsl(var(--sidebar-hover))]",
                activeMenu === "chat" && "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--sidebar-active))]"
              )}
              onClick={() => onMenuChange("chat")}
            >
              <MessageCircle className="w-5 h-5" />
              {!collapsed && <span>Chat Bot</span>}
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-white hover:bg-[hsl(var(--sidebar-hover))]",
                activeMenu === "work" && "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--sidebar-active))]"
              )}
              onClick={() => onMenuChange("work")}
            >
              <ClipboardList className="w-5 h-5" />
              {!collapsed && <span>Work Log</span>}
            </Button>
          </div>
        </div>

        {!collapsed && (
          <div className="border-t border-white/10 pt-6">
            <p className="text-sm text-white/60 mb-3">Recent Project</p>
            <div className="space-y-2">
              {recentProjects.map((project, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[hsl(var(--sidebar-hover))] rounded-lg transition-colors"
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
