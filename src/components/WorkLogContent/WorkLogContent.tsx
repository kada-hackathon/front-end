import { UserPlus, FileText, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./WorkLogContent.css";

const WorkLogContent = () => {
  return (
    <div className="worklog-content">
      <div className="worklog-header">
        <div className="worklog-actions">
          <Button className="worklog-button">
            <UserPlus className="worklog-button-icon" />
            INVITE
          </Button>
          <Button className="worklog-button">
            <FileText className="worklog-button-icon" />
            Version
          </Button>
          <Button className="worklog-button">
            <Save className="worklog-button-icon" />
            SAVE WORKLOG
          </Button>
        </div>
        <h1 className="worklog-title">Untitled-1</h1>
      </div>
      
      <div className="worklog-body">
        {/* Work log content area */}
      </div>
    </div>
  );
};

export default WorkLogContent;
