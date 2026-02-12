
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import MaintenanceList from "./pages/maintenance/MaintenanceList";
import MaintenanceNew from "./pages/maintenance/MaintenanceNew";
import MaintenanceDetail from "./pages/maintenance/MaintenanceDetail";
import MaintenanceAll from "./pages/maintenance/MaintenanceAll";
import BoardDashboard from "./pages/board/BoardDashboard";
import ArchitecturalReview from "./pages/board/ArchitecturalReview";
import FinancialReports from "./pages/board/FinancialReports";
import BoardPolls from "./pages/board/BoardPolls";
import BoardSettings from "./pages/board/BoardSettings";
import ResidentPolls from "./pages/resident/Polls";
import ResidentEvents from "./pages/resident/Events";
import AmenityBookings from "./pages/resident/AmenityBookings";
import AdminPolls from "./pages/admin/Polls";
import AdminEvents from "./pages/admin/Events";
import AmenityManagement from "./pages/admin/AmenityManagement";
import AdminDashboard from "./pages/AdminDashboard";
import CommunicationHub from "./pages/admin/CommunicationHub";
import Documents from "./pages/admin/Documents";
import AdminAnnouncements from "./pages/admin/Announcements";
import PackageLog from "./pages/admin/PackageLog";
import AdminSettings from "./pages/admin/Settings";
import Incidents from "./pages/admin/Incidents";
import Residents from "./pages/admin/Residents";
import ResidentDirectory from "./pages/admin/ResidentDirectory";
import MaintenanceRequests from "./pages/admin/MaintenanceRequests";
import MaintenanceSchedule from "./pages/admin/MaintenanceSchedule";
import AmenityStatus from "./pages/admin/AmenityStatus";
import FinancialManagement from "./pages/admin/FinancialManagement";
import PaymentRecords from "./pages/admin/PaymentRecords";
import ParkingManagement from "./pages/admin/ParkingManagement";
import VehicleRegistry from "./pages/admin/VehicleRegistry";
import ArchitecturalRequest from "./pages/resident/ArchitecturalRequest";
import MyViolations from "./pages/resident/MyViolations";
import Violations from "./pages/admin/Violations";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import AdminArchitecturalRequests from "./pages/admin/ArchitecturalRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/announcements/:id" element={<AnnouncementDetail />} />

                {/* Resident Routes */}
                <Route path="/maintenance" element={<MaintenanceList />} />
                <Route path="/maintenance/new" element={<MaintenanceNew />} />
                <Route path="/maintenance/:id" element={<MaintenanceDetail />} />
                <Route path="/resident/arc" element={<ArchitecturalRequest />} />
                <Route path="/resident/violations" element={<MyViolations />} />
                <Route path="/resident/polls" element={<ResidentPolls />} />
                <Route path="/resident/events" element={<ResidentEvents />} />
                <Route path="/resident/amenities" element={<AmenityBookings />} />

                {/* Staff/Manager Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/polls" element={<AdminPolls />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/amenities" element={<AmenityManagement />} />
                <Route path="/admin/violations" element={<Violations />} />
                <Route path="/admin/communication" element={<CommunicationHub />} />
                <Route path="/admin/documents" element={<Documents />} />
                <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                <Route path="/admin/packages" element={<PackageLog />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/incidents" e lement={<Incidents />} />
                <Route path="/admin/residents" element={<Residents />} />
                <Route path="/admin/residents/directory" element={<ResidentDirectory />} />
                <Route path="/admin/maintenance-requests" element={<MaintenanceRequests />} />
                <Route path="/admin/maintenance/schedule" element={<MaintenanceSchedule />} />
                <Route path="/maintenance/all" element={<MaintenanceAll />} />
                <Route path="/admin/architectural-requests" element={<AdminArchitecturalRequests />} />
                <Route path="/admin/amenities/status" element={<AmenityStatus />} />
                <Route path="/admin/finances" element={<FinancialManagement />} />
                <Route path="/admin/finances/records" element={<PaymentRecords />} />
                <Route path="/admin/parking" element={<ParkingManagement />} />
                <Route path="/admin/parking/registry" element={<VehicleRegistry />} />

                {/* Board Routes */}
                <Route path="/board" element={<BoardDashboard />} />
                <Route path="/board/arc" element={<ArchitecturalReview />} />
                <Route path="/board/financials" element={<FinancialReports />} />
                <Route path="/board/polls" element={<BoardPolls />} />
                <Route path="/board/settings" element={<BoardSettings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
