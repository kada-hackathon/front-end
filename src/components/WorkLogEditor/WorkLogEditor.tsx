import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import "./WorkLogEditor.css";

interface WorkLogEditorProps {
  onBack: () => void;
}

const WorkLogEditor = ({ onBack }: WorkLogEditorProps) => {
  return (
    <div className="worklog-content">
      <div className="worklog-header">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="back-button"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="worklog-title">Untitled-1</h1>
        <div className="worklog-actions">
          <Button variant="outline">INVITE</Button>
          <Button variant="outline">Version</Button>
          <Button>SAVE WORKLOG</Button>
        </div>
      </div>

      <textarea
        className="worklog-editor"
        placeholder="Start writing your work log..."
      />
    </div>
  );
};

export default WorkLogEditor;
