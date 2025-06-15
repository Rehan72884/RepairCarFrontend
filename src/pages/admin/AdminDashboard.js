import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="list-group">
        <button className="list-group-item list-group-item-action" onClick={() => navigate('/admin/experts')}>
          Manage Experts
        </button>
        <button className="list-group-item list-group-item-action" onClick={() => navigate('/admin/cars')}>
          Manage Cars
        </button>
        <button className="list-group-item list-group-item-action" onClick={() => navigate('/admin/problems')}>
          Manage Problems
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
