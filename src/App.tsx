import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ResidentDashboard from "./pages/ResidentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CommunicationHub from "./pages/admin/CommunicationHub";
import Settings from "./pages/admin/Settings";
import Documents from "./pages/admin/Documents";
import Announcements from "./pages/admin/Announcements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/resident" element={<ResidentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/communication" element={<CommunicationHub />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/documents" element={<Documents />} />
          <Route path="/admin/announcements" element={<Announcements />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;