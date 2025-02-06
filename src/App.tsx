
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import MaintenanceRequests from './pages/MaintenanceRequests';
import AdminMaintenance from "./pages/admin/Maintenance";
import ResidentMaintenance from "./pages/resident/Maintenance";
import Index from './pages/Index';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route 
          path="/maintenance-requests" 
          element={user ? <MaintenanceRequests /> : <Navigate to="/" />} 
        />
        <Route 
          path="/maintenance-requests/new" 
          element={user ? <MaintenanceRequests /> : <Navigate to="/" />} 
        />
        <Route 
          path="/maintenance" 
          element={user ? <ResidentMaintenance /> : <Navigate to="/" />} 
        />
        <Route 
          path="/admin/maintenance" 
          element={user ? <AdminMaintenance /> : <Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
