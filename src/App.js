import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import MyCars from './pages/client/MyCars';
import ClientDashboard from './pages/client/ClientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExpertDashboard from './pages/expert/ExpertDashboard';
import ExpertManagement from './pages/admin/ExpertManagement';
import CarManagement from './pages/admin/CarManagement';
import ProblemManagement from './pages/admin/ProblemManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-cars" element={<MyCars />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/experts" element={<ExpertManagement />} />
        <Route path="/admin/cars" element={<CarManagement />} />
        <Route path="/admin/problems" element={<ProblemManagement />} />
        <Route path="/expert" element={<ExpertDashboard />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
