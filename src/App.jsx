import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import ChatBotPage from "./pages/ChatBotPage";
import WorkLog from "./pages/WorkLog";
import WorkLogVersion from "./pages/WorkLogVersion";
import Profile from "./pages/Profile";
import BlogEditor from "./pages/BlogEditor";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import Login from "./components/Login/Login";
import ProtectedRoute from './components/ProtectedRoute';
import { validateAndCleanupToken } from './utils/authUtils';

const queryClient = new QueryClient();

const App = () => {
  // Validate token on app load
  useEffect(() => {
    validateAndCleanupToken();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />
            
            {/* PROTECTED ROUTES */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatBotPage /></ProtectedRoute>} />
            <Route path="/worklog" element={<ProtectedRoute><WorkLog /></ProtectedRoute>} />
            <Route path="/worklog/version" element={<ProtectedRoute><WorkLogVersion /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/blog-editor" element={<ProtectedRoute><BlogEditor /></ProtectedRoute>} />
            <Route path="/blog-post" element={<ProtectedRoute><BlogPost /></ProtectedRoute>} />
            
            {/* CATCH-ALL ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
