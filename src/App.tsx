import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ParkingPage from './pages/resident/parking';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/resident/parking" element={<ParkingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
