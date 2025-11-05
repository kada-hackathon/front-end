import { useState, useEffect } from "react";
import Menubar from "../Menubar/Menubar";
import Navbar from "../Navbar/Navbar";
import ChatArea from "../ChatArea/ChatArea";
import ChatHistory from "../ChatHistory/ChatHistory";
import "./ChatBot.css";
import { AUTH_ENDPOINTS, CHATBOT_ENDPOINTS } from "../../config/api";

/**
 * ================================================================
 * CHATBOT COMPONENT - FULL INTEGRATION WITH AI BACKEND
 * ================================================================
 * 
 * Features:
 * - Real AI integration (not mock responses)
 * - Pagination for chat history (load more)
 * - Auto-save after each message exchange
 * - Proper session management with UUID
 * - Loading states & error handling
 * - Optimistic UI updates
 * 
 * Backend Endpoints Used:
 * - POST /api/chatbot - Send message, get AI response (auto-saves)
 * - GET /api/chatbot/history?page=1&limit=10 - List sessions with pagination
 * - GET /api/chatbot/session/:id - Get all messages in session
 * - DELETE /api/chatbot/session/:id - Delete entire session
 * ================================================================
 */
const ChatBot = () => {
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================
  const [messages, setMessages] = useState([]);           // Current session messages
  const [inputValue, setInputValue] = useState("");       // User input text
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);     // List of all sessions
  const [currentSessionId, setCurrentSessionId] = useState(null); // Active session UUID
  const [isLoading, setIsLoading] = useState(false);      // AI response loading
  const [isLoadingHistory, setIsLoadingHistory] = useState(false); // History loading
  const [historyPage, setHistoryPage] = useState(1);      // Pagination current page
  const [hasMoreHistory, setHasMoreHistory] = useState(true); // Pagination flag
  const [userProfile, setUserProfile] = useState({
    name: "User",
    profilePicture: "/placeholder.svg"
  });

  // ============================================================
  // INITIAL DATA LOADING
  // ============================================================
  // On component mount: Fetch user profile & load chat history (page 1)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Fetch user profile for avatar display
    fetch(AUTH_ENDPOINTS.PROFILE, {
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

    // Load first page of chat history
    loadChatHistory(1);
  }, []);

  /**
   * ================================================================
   * LOAD CHAT HISTORY WITH PAGINATION
   * ================================================================
   * 
   * Purpose: Fetch list of all chat sessions with metadata
   * 
   * Backend Response Format:
   * {
   *   chats: [
   *     {
   *       session_id: "session-123",
   *       title: "What did John work on...",      // Truncated first message
   *       last_message: "According to logs...",    // Truncated last response
   *       message_count: 5,
   *       created_at: "2024-01-15T10:00:00Z",
   *       updated_at: "2024-01-15T12:30:00Z"
   *     }
   *   ],
   *   pagination: {
   *     current_page: 1,
   *     total_pages: 5,
   *     total_sessions: 45,
   *     has_next: true,
   *     has_prev: false
   *   }
   * }
   * 
   * @param {number} page - Page number to load (1-indexed)
   * @param {boolean} append - If true, append to existing history (load more)
   * ================================================================
   */
  const loadChatHistory = async (page = 1, append = false) => {
    try {
      setIsLoadingHistory(true);
      const token = localStorage.getItem('token');
      
      // Call paginated history endpoint
      const response = await fetch(`${CHATBOT_ENDPOINTS.GET_HISTORY}?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load history: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform backend format to frontend format
      const transformedChats = data.chats.map(chat => ({
        id: chat.session_id,
        title: chat.title,
        lastMessage: chat.last_message,        // Already truncated by backend
        timestamp: new Date(chat.updated_at),
        messageCount: chat.message_count       // Add count for UI display
      }));

      // Append or replace history based on load more vs initial load
      if (append) {
        setChatHistory(prev => [...prev, ...transformedChats]);
      } else {
        setChatHistory(transformedChats);
      }

      // Update pagination state
      setHistoryPage(page);
      setHasMoreHistory(data.pagination?.has_next || false);

    } catch (error) {
      console.error('Error loading chat history:', error);
      // Show empty state on error
      if (!append) {
        setChatHistory([]);
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  /**
   * ================================================================
   * LOAD MORE HISTORY (PAGINATION)
   * ================================================================
   * 
   * Called when user clicks "Load More" button
   * Fetches next page and appends to existing history
   * ================================================================
   */
  const loadMoreHistory = () => {
    if (!isLoadingHistory && hasMoreHistory) {
      loadChatHistory(historyPage + 1, true);
    }
  };

  /**
   * ================================================================
   * GENERATE SESSION ID
   * ================================================================
   * 
   * Format: session-{timestamp}
   * Example: session-1699876543210
   * 
   * Why this format?
   * - Sortable by creation time
   * - Unique across users (timestamp + random collision unlikely)
   * - Human-readable for debugging
   * ================================================================
   */
  const generateSessionId = () => {
    return `session-${Date.now()}`;
  };

  /**
   * ================================================================
   * SEND MESSAGE TO AI & GET RESPONSE
   * ================================================================
   * 
   * Flow:
   * 1. Generate session ID if new conversation
   * 2. Add user message to UI (optimistic update)
   * 3. Clear input & show loading state
   * 4. Call backend AI endpoint
   * 5. Backend auto-saves to database
   * 6. Add AI response to UI
   * 7. Reload history sidebar to show updated preview
   * 
   * Backend Endpoint: POST /api/chatbot
   * Request: { message: "user question", session_id: "session-123" }
   * Response: { 
   *   session_id, 
   *   message, 
   *   response,           // AI answer (RAG-enhanced)
   *   context_logs_count, // How many worklogs used
   *   processing_time,    // Performance metrics
   *   timestamp 
   * }
   * 
   * Important: Backend auto-saves after generating response!
   * No need for separate save call.
   * ================================================================
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    // Generate session ID if this is a new conversation
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = generateSessionId();
      setCurrentSessionId(sessionId);
    }

    // Optimistic UI update: Show user message immediately
    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const userQuestion = inputValue; // Save before clearing
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call AI backend endpoint
      const response = await fetch(CHATBOT_ENDPOINTS.SEND_MESSAGE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userQuestion,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`AI request failed: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response to UI
      const botMessage = {
        id: `bot-${Date.now()}`,
        text: data.response,
        sender: "bot",
        timestamp: new Date(data.timestamp),
        contextUsed: data.context_logs_count,  // Show how many worklogs were used
        processingTime: data.processing_time   // Show performance
      };

      setMessages(prev => [...prev, botMessage]);

      // Reload history sidebar to show updated "last message" preview
      // Only reload page 1 to see the updated session at top
      loadChatHistory(1, false);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message in chat
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I couldn't process your message. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * ================================================================
   * SELECT & LOAD CHAT SESSION
   * ================================================================
   * 
   * Called when user clicks a chat in history sidebar
   * 
   * Backend Endpoint: GET /api/chatbot/session/:session_id
   * Response: {
   *   messages: [
   *     {
   *       _id: "...",
   *       user: "...",
   *       session_id: "session-123",
   *       message: "User's question",
   *       response: "AI's answer",
   *       context_used: 3,
   *       createdAt: "2024-01-15T10:00:00Z"
   *     },
   *     ...
   *   ],
   *   session_id: "session-123",
   *   total: 5
   * }
   * 
   * Transform to frontend format:
   * - Each exchange becomes 2 messages (user + bot)
   * - Flat array for chat display
   * ================================================================
   */
  const handleSelectChat = async (sessionId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(CHATBOT_ENDPOINTS.GET_MESSAGES(sessionId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load session: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform backend format (1 doc = 1 exchange) to frontend format (2 messages)
      const transformedMessages = [];
      
      if (data.messages && Array.isArray(data.messages)) {
        data.messages.forEach((exchange, index) => {
          // User message
          transformedMessages.push({
            id: `user-${exchange._id}`,
            text: exchange.message,
            sender: "user",
            timestamp: new Date(exchange.createdAt)
          });
          
          // Bot response
          transformedMessages.push({
            id: `bot-${exchange._id}`,
            text: exchange.response,
            sender: "bot",
            timestamp: new Date(exchange.createdAt),
            contextUsed: exchange.context_used
          });
        });
      }

      setMessages(transformedMessages);
      setCurrentSessionId(sessionId);

    } catch (error) {
      console.error('Error loading chat session:', error);
      alert('Failed to load chat session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ================================================================
   * DELETE CHAT SESSION
   * ================================================================
   * 
   * Permanently deletes all messages in the session
   * 
   * Backend Endpoint: DELETE /api/chatbot/session/:session_id
   * Response: {
   *   message: "Chat session deleted successfully",
   *   session_id: "session-123",
   *   deleted_count: 10
   * }
   * 
   * UI Updates:
   * - Remove from history sidebar
   * - Clear chat area if currently viewing deleted session
   * - Show confirmation before deleting
   * ================================================================
   */
  const handleDeleteChat = async (sessionId) => {
    // Confirm deletion
    const confirmed = window.confirm(
      'Are you sure you want to delete this chat? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(CHATBOT_ENDPOINTS.DELETE_SESSION(sessionId), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Deleted ${data.deleted_count} messages from session ${sessionId}`);

      // Remove from history sidebar (optimistic update)
      setChatHistory(prev => prev.filter(chat => chat.id !== sessionId));

      // Clear chat area if viewing deleted session
      if (currentSessionId === sessionId) {
        setMessages([]);
        setCurrentSessionId(null);
      }

      // Reload history to get accurate pagination
      loadChatHistory(1, false);

    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  /**
   * ================================================================
   * START NEW CHAT
   * ================================================================
   * 
   * Creates a new empty conversation
   * 
   * Design Decision: Don't save empty session to backend
   * Why?
   * - Backend auto-saves on first message anyway
   * - Avoid empty sessions cluttering database
   * - Simpler flow (no unnecessary API call)
   * 
   * Just clear local state and generate new session ID
   * Session will be created when user sends first message
   * ================================================================
   */
  const handleNewChat = () => {
    // Clear current session
    setCurrentSessionId(null);
    setMessages([]);
    setInputValue("");
    
    // Note: Session ID will be generated when user sends first message
    // No need to call backend here (reduces unnecessary API calls)
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
            isLoading={isLoading}  // Pass loading state for AI response
          />

          <div className="chatbot-sidebar">
            <ChatHistory
              history={chatHistory}
              onSelectChat={handleSelectChat}
              onDeleteChat={handleDeleteChat}
              onNewChat={handleNewChat}
              isLoading={isLoadingHistory}     // Pass loading state
              hasMore={hasMoreHistory}          // Pagination flag
              onLoadMore={loadMoreHistory}      // Load more callback
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatBot;