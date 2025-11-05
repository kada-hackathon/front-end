import { useState, useEffect } from "react";
import Menubar from "../Menubar/Menubar";
import Navbar from "../Navbar/Navbar";
import FriendsList from "../FriendsList/FriendsList";
import ChatArea from "../ChatArea/ChatArea";
import ChatHistory from "../ChatHistory/ChatHistory";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "User",
    profilePicture: "/placeholder.svg"
  });

  // Fetch user profile for avatar and load chat history
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    // Fetch user profile
    fetch('http://localhost:5000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const userData = data.user || data;
        setUserProfile({
          name: userData.name || "User",
          profilePicture: userData.profile_photo || userData.profilePicture || "/placeholder.svg"
        });
      })
      .catch(err => console.error('Error fetching user profile:', err));

    // Load chat history
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/chats/history', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.chats) {
        setChatHistory(data.chats.map(chat => ({
          id: chat.session_id,
          title: chat.title,
          lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : '',
          timestamp: new Date(chat.updated_at),
          messages: chat.messages
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatToBackend = async (sessionId, title, messages) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch('http://localhost:5000/api/chats/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ session_id: sessionId, title, messages })
      });
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const recentProjects = ["NEW-Project", "Project-KADA", "Pembuatan-chatbot"];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // If no current session, create a new one
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = Date.now().toString();
      setCurrentSessionId(sessionId);
    }

    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue("");

    // Save to backend immediately
    const title = updatedMessages.length === 1 ? inputValue.substring(0, 50) + (inputValue.length > 50 ? "..." : "") : `Chat ${sessionId}`;
    await saveChatToBackend(sessionId, title, updatedMessages);

    // Simulate bot response
    setTimeout(async () => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! I'm here to help you with anything you need.",
        sender: "bot",
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      await saveChatToBackend(sessionId, title, finalMessages);

      // Reload chat history to update the preview
      loadChatHistory();
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectChat = async (sessionId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/chats/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.chat) {
        setMessages(data.chat.messages || []);
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
  };

  const handleDeleteChat = async (sessionId) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`http://localhost:5000/api/chats/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      // Reload chat history
      loadChatHistory();
      if (currentSessionId === sessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const handleNewChat = async () => {
    const newSessionId = Date.now().toString();
    const title = "New Chat";

    // Create new chat session in backend immediately
    try {
      const token = sessionStorage.getItem('token');
      await fetch('http://localhost:5000/api/chats/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: newSessionId,
          title,
          messages: []
        })
      });

      // Update state
      setCurrentSessionId(newSessionId);
      setMessages([]);
      setInputValue("");

      // Reload chat history to include the new chat
      loadChatHistory();
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  return (
    <div className="chatbot-container">
      <Menubar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="chatbot-main">
        <Navbar />

        <div className="chatbot-content">
          <ChatArea
            messages={messages}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            userProfile={userProfile}
          />

          <div className="chatbot-sidebar">
            <ChatHistory
              history={chatHistory}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
              onNewChat={handleNewChat}
            />

         
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatBot;
