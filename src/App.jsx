import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChatBotPage from "./pages/ChatBotPage";
import WorkLog from "./pages/WorkLog";
import WorkLogVersion from "./pages/WorkLogVersion";
import Profile from "./pages/Profile";
import BlogEditor from "./pages/BlogEditor";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import employee from "./pages/Employee/Employee";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/employee" element={<employee />} />
          <Route path="/" element={<Index />} />
          <Route path="/chatbot" element={<ChatBotPage />} />
          <Route path="/worklog" element={<WorkLog />} />
          <Route path="/worklog/version" element={<WorkLogVersion />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/blog-editor" element={<BlogEditor />} />
          <Route path="/blog-post" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
