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

// Import resident pages
import ResidentAnnouncements from "./pages/resident/Announcements";
import ResidentMaintenance from "./pages/resident/Maintenance";
import ResidentAmenityBookings from "./pages/resident/AmenityBookings";
import ResidentPayments from "./pages/resident/Payments";
import ResidentParking from "./pages/resident/Parking";
import ResidentDocuments from "./pages/resident/Documents";
import ResidentCommunity from "./pages/resident/Community";
import ResidentMessages from "./pages/resident/Messages";

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
          <Route path="/resident/announcements" element={<ResidentAnnouncements />} />
          <Route path="/resident/maintenance" element={<ResidentMaintenance />} />
          <Route path="/resident/amenities" element={<ResidentAmenityBookings />} />
          <Route path="/resident/payments" element={<ResidentPayments />} />
          <Route path="/resident/parking" element={<ResidentParking />} />
          <Route path="/resident/documents" element={<ResidentDocuments />} />
          <Route path="/resident/community" element={<ResidentCommunity />} />
          <Route path="/resident/messages" element={<ResidentMessages />} />
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