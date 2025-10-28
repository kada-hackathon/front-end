import { Button } from "@/components/ui/button";
import "./WorkLogList.css";

interface WorkLogItem {
  id: string;
  type: string;
  title: string;
  hashtags: string[];
  description: string;
  date: string;
  time: string;
}

interface WorkLogListProps {
  onCreateNew: () => void;
}

const WorkLogList = ({ onCreateNew }: WorkLogListProps) => {
  const workLogs: WorkLogItem[] = [
    {
      id: "1",
      type: "Individual",
      title: "Cara agar menjadi waras saat masalah melanda anda",
      hashtags: ["#Administration", "#Financial"],
      description:
        "Banyak manusia yang mengakhiri hidupnya ketika dia menghadapi sebuah masalah, ini disebabkan karena seseorang yang belum siap dalam kondisi mental......",
      date: "28 November 2025",
      time: "19.00 WIB",
    },
    {
      id: "2",
      type: "Individual",
      title: "Cara agar menjadi waras saat masalah melanda anda",
      hashtags: ["#Administration", "#Financial"],
      description:
        "Banyak manusia yang mengakhiri hidupnya ketika dia menghadapi sebuah masalah, ini disebabkan karena seseorang yang belum siap dalam kondisi mental......",
      date: "28 November 2025",
      time: "19.00 WIB",
    },
    {
      id: "3",
      type: "Individual",
      title: "Cara agar menjadi waras saat masalah melanda anda",
      hashtags: ["#Administration", "#Financial"],
      description:
        "Banyak manusia yang mengakhiri hidupnya ketika dia menghadapi sebuah masalah, ini disebabkan karena seseorang yang belum siap dalam kondisi mental......",
      date: "28 November 2025",
      time: "19.00 WIB",
    },
  ];

  return (
    <div className="worklog-list">
      <Button onClick={onCreateNew} className="create-new-button">
        <span className="create-new-icon">📋</span>
        CREATE NEW
      </Button>

      <h2 className="worklog-list-title">MY WORK PROJECT</h2>

      <div className="worklog-items-container">
        {workLogs.map((log) => (
          <article key={log.id} className="worklog-item">
            <div className="worklog-item-header">
              <span className="worklog-item-type">• {log.type}</span>
            </div>

            <h3 className="worklog-item-title">{log.title}</h3>

            <p className="worklog-item-hashtags">{log.hashtags.join(" ")}</p>

            <p className="worklog-item-description">{log.description}</p>

            <div className="worklog-item-footer">
              <span className="worklog-item-date">
                {log.date}
                <br />
                {log.time}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default WorkLogList;
