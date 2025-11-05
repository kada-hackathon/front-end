import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import "./ChatHistory.css";

const ChatHistory = ({ history, onSelectChat, onDeleteChat, onNewChat }) => {
  const formatTime = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <aside className="chat-history">
      <div className="chat-history-header">
        <h2 className="chat-history-title">Chat History</h2>
        <Button 
          size="sm" 
          className="chat-history-new-button"
          onClick={onNewChat}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="chat-history-scroll">
        <div className="chat-history-list">
          {history.length === 0 ? (
            <div className="chat-history-empty">
              <p className="chat-history-empty-text">No chat history yet</p>
            </div>
          ) : (
            history.map((chat) => (
              <div
                key={chat.id}
                className="chat-history-item"
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="chat-history-item-content">
                  <div className="chat-history-item-header">
                    <h3 className="chat-history-item-title">{chat.title}</h3>
                    <span className="chat-history-item-time">
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>
                  <p className="chat-history-item-preview">{chat.lastMessage}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="chat-history-delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default ChatHistory;
