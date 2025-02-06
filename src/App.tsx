import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AdminMaintenance from "./pages/admin/Maintenance";
import ResidentMaintenance from "./pages/resident/Maintenance";

const App = () => {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/maintenance" element={<ResidentMaintenance />} />
      <Route path="/admin/maintenance" element={<AdminMaintenance />} />
    </Routes>
  );
};

export default App;