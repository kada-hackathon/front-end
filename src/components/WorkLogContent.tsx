import { UserPlus, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const WorkLogContent = () => {
  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="border-b border-border p-6">
        <div className="flex gap-4 mb-6">
          <Button className="gap-2 bg-[hsl(var(--sidebar-bg))] text-white hover:bg-[hsl(var(--sidebar-bg))]/90">
            <UserPlus className="w-4 h-4" />
            INVITE
          </Button>
          <Button className="gap-2 bg-[hsl(var(--sidebar-bg))] text-white hover:bg-[hsl(var(--sidebar-bg))]/90">
            <FileText className="w-4 h-4" />
            Version
          </Button>
          <Button className="gap-2 bg-[hsl(var(--sidebar-bg))] text-white hover:bg-[hsl(var(--sidebar-bg))]/90">
            <Save className="w-4 h-4" />
            SAVE WORKLOG
          </Button>
        </div>
        <h1 className="text-4xl font-bold">Untitled-1</h1>
      </div>
      
      <div className="flex-1 p-6">
        {/* Work log content area */}
      </div>
    </div>
  );
};

export default WorkLogContent;
