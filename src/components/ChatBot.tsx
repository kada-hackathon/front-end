import { useState } from "react";
import { Send, Search, Settings, Home, MessageCircle, ClipboardList, ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  const [activeMenu, setActiveMenu] = useState("home");

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
      {/* Left Sidebar */}
      <aside
        className={cn(
          "bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-text))] transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {!sidebarCollapsed && (
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
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white hover:bg-[hsl(var(--sidebar-hover))]"
          >
            <ChevronLeft className={cn("transition-transform", sidebarCollapsed && "rotate-180")} />
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <div className="mb-6">
            {!sidebarCollapsed && <p className="text-sm text-white/60 mb-3">Menus</p>}
            <div className="space-y-2">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white hover:bg-[hsl(var(--sidebar-hover))]",
                  activeMenu === "home" && "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--sidebar-active))]"
                )}
                onClick={() => setActiveMenu("home")}
              >
                <Home className="w-5 h-5" />
                {!sidebarCollapsed && <span>Home</span>}
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white hover:bg-[hsl(var(--sidebar-hover))]",
                  activeMenu === "chat" && "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--sidebar-active))]"
                )}
                onClick={() => setActiveMenu("chat")}
              >
                <MessageCircle className="w-5 h-5" />
                {!sidebarCollapsed && <span>Chat Bot</span>}
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white hover:bg-[hsl(var(--sidebar-hover))]",
                  activeMenu === "work" && "bg-[hsl(var(--sidebar-active))] text-[hsl(var(--primary))] hover:bg-[hsl(var(--sidebar-active))]"
                )}
                onClick={() => setActiveMenu("work")}
              >
                <ClipboardList className="w-5 h-5" />
                {!sidebarCollapsed && <span>Work Log</span>}
              </Button>
            </div>
          </div>

          {!sidebarCollapsed && (
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="border-0 bg-secondary/50 focus-visible:ring-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>GA</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Gideon A siagian</p>
                <p className="text-xs text-muted-foreground">Nama_Divisi</p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-[hsl(var(--accent))] mb-8">
                      Where should we begin?
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.sender === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === "bot" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-accent text-accent-foreground text-xs">AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 max-w-[70%]",
                          message.sender === "user"
                            ? "bg-[hsl(var(--chat-bubble-user))] text-white"
                            : "bg-[hsl(var(--chat-bubble-bot))] text-foreground"
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      {message.sender === "user" && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>GA</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2 border border-border">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Anything"
                    className="border-0 bg-transparent focus-visible:ring-0 flex-1"
                  />
                  <Button
                    size="icon"
                    className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground h-10 w-10"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Friends Sidebar */}
          <aside className="w-72 border-l border-border bg-card p-6 hidden lg:block">
            <h3 className="font-bold text-lg mb-6">Your Friends</h3>
            <div className="space-y-4">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3 hover:bg-secondary/50 p-2 rounded-lg cursor-pointer transition-colors">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={friend.avatar} />
                    <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.division}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ChatBot;
