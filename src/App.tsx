import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AdminMaintenance from "./pages/admin/maintenance";
import ResidentMaintenance from "./pages/resident/maintenance";

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/admin/maintenance" element={<AdminMaintenance />} />
      <Route path="/resident/maintenance" element={<ResidentMaintenance />} />
    </Routes>
  );
};

export default App;