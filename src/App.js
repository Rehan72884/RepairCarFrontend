import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ClientDashboard from './pages/client/ClientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExpertDashboard from './pages/expert/ExpertDashboard';
import ExpertManagement from './pages/admin/ExpertManagement';
import CarManagement from './pages/admin/CarManagement';
import ProblemManagement from './pages/admin/ProblemManagement';
import ProblemSolutions from './pages/expert/ProblemSolutions';
import SolutionSteps from './pages/expert/SolutionSteps';
import CarProblems from './pages/client/CarProblems';
import ClientProblemSolutions from './pages/client/ClientProblemSolutions';
import ClientSolutionSteps from './pages/client/ClientSolutionSteps';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/experts" element={<ExpertManagement />} />
        <Route path="/admin/cars" element={<CarManagement />} />
        <Route path="/admin/problems" element={<ProblemManagement />} />
        <Route path="/expert" element={<ExpertDashboard />} />
        <Route path="/expert/problems/:problemId/solutions" element={<ProblemSolutions />} />
        <Route path="/solutions/:solutionId/steps" element={<SolutionSteps />} />
        <Route path="/client/car/:id/problems" element={<CarProblems />} />
        <Route path="/client/problems/:problemId/solutions" element={<ClientProblemSolutions />} />
        <Route path="/client/solutions/:solutionId/steps" element={<ClientSolutionSteps />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
