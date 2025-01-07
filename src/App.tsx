import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ParkingPage from './pages/resident/Parking'; // Fixed casing here

const App = () => {
  return (
    <Routes>
      <Route path="/parking" element={<ParkingPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      {/* Add other routes here */}
    </Routes>
  );
};

export default App;
