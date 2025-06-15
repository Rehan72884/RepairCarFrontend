import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import ProblemList from '../../components/expert/ProblemList';
import { useNavigate } from 'react-router-dom';

const ExpertDashboard = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  const fetchProblems = async () => {
    try {
      const res = await axios.get('/api/expert/problems'); // ⬅️ API to get admin-created problems
      setProblems(res.data.problems);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Expert Dashboard</h2>
      <button onClick={handleLogout} className="btn btn-danger float-end mb-3">
        Logout
      </button>
      <ProblemList problems={problems} refresh={fetchProblems} />
    </div>
  );
};

export default ExpertDashboard;
