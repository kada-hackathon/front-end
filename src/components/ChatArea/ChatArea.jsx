import { Send, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import "./ChatArea.css";

const ChatArea = ({ messages, inputValue, onInputChange, onSendMessage, onKeyPress, userProfile }) => {
  return (
    <div className="chat-area">
      <ScrollArea className="chat-area-scroll">
        {messages.length === 0 ? (
          <div className="chat-area-empty">
            <div className="chat-area-empty-content">
              <h2 className="chat-area-empty-title">
                Where should we begin?
              </h2>
            </div>
          </div>
        ) : (
          <div className="chat-area-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "chat-message",
                  message.sender === "user" ? "chat-message-user" : "chat-message-bot"
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="chat-message-avatar">
                    <AvatarFallback className="chat-message-avatar-bot">AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "chat-message-bubble",
                    message.sender === "user"
                      ? "chat-message-bubble-user"
                      : "chat-message-bubble-bot"
                  )}
                >
                  <p className="chat-message-text">{message.text}</p>
                </div>
                {message.sender === "user" && (
                  <Avatar className="chat-message-avatar">
                    <AvatarImage src={userProfile?.profilePicture || "/placeholder.svg"} />
                    <AvatarFallback>{userProfile?.name?.substring(0, 2).toUpperCase() || "GA"}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="chat-area-input-wrapper">
        <div className="chat-area-input-container">
          <div className="chat-area-input">
            
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Ask Anything"
              className="chat-area-input-field"
            />
            <Button
              size="icon"
              className="chat-area-send-button"
              onClick={onSendMessage}
              disabled={!inputValue.trim()}
            >
              <Send className="chat-area-send-icon" />
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
