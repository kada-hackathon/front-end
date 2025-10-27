import { useState } from "react";
import Menubar from "./Menubar";
import Navbar from "./Navbar";
import FriendsList from "./FriendsList";
import ChatArea from "./ChatArea";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface Friend {
  id: string;
  name: string;
  division: string;
  avatar: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const friends: Friend[] = [
    { id: "1", name: "Arrizal anru M", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "2", name: "Regina alhajiz", division: "Nama_Divisi", avatar: "/placeholder.svg" },
    { id: "3", name: "Jovan munthe", division: "Nama_Divisi", avatar: "/placeholder.svg" },
  ];

  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'm here to help you with anything you need.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        recentProjects={recentProjects}
      />

      <main className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          <ChatArea
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
          />

          <FriendsList friends={friends} />
        </div>
      </main>
    </div>
  );
};

export default ChatBot;
