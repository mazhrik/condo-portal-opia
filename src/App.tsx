import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ParkingPage from './pages/resident/Parking';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/parking" element={<ParkingPage />} />
      {/* Add other routes as needed */}
    </Routes>
  );
};

export default App;