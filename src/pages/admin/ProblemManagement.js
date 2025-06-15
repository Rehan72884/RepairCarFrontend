import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import ProblemForm from '../../components/admin/ProblemForm'; // 👈 import form

const ProblemManagement = () => {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    const res = await axios.get('/api/admin/problems');
    setProblems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/admin/problems', form);
    fetchProblems();
    setForm({ title: '', description: '' });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/admin/problems/${id}`);
    fetchProblems();
  };

  return (
    <div className="container mt-4">
      <h3>Problem Management</h3>

      {/* ✅ Use reusable form */}
      <ProblemForm form={form} setForm={setForm} handleSubmit={handleSubmit} />

      <ul className="list-group">
        {problems.map((problem) => (
          <li key={problem.id} className="list-group-item d-flex justify-content-between align-items-center">
            {problem.title} ({problem.description})
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(problem.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemManagement;
