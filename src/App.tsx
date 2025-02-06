import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaintenanceRequests from './pages/MaintenanceRequests';
import { useAuth } from './hooks/useAuth';
import AdminMaintenance from "./pages/admin/Maintenance";
import ResidentMaintenance from "./pages/resident/Maintenance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/maintenance-requests" element={<MaintenanceRequests />} />
        <Route path="/maintenance-requests/new" element={<MaintenanceRequests />} />
      <Route path="/maintenance" element={<ResidentMaintenance />} />
      <Route path="/admin/maintenance" element={<AdminMaintenance />} />
      </Routes>
    </Router>
  );
}

export default App;
