import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import ProblemForm from '../../components/admin/ProblemForm';

const ProblemManagement = () => {
  const [problems, setProblems] = useState([]);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    car_id: '',
    title: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null); // Track editing
  const [message, setMessage] = useState(''); // For success messages

  useEffect(() => {
    fetchProblems();
    fetchCars();
  }, []);

  const fetchProblems = async () => {
    const res = await axios.get('/api/problems/list');
    setProblems(res.data.data);
  };

  const fetchCars = async () => {
    const res = await axios.get('/api/cars/list');
    setCars(res.data.data);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000); // Clear after 3 sec
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.post(`/api/problems/update/${editingId}`, form);
      showMessage('Problem updated successfully!');
      setEditingId(null);
    } else {
      await axios.post('/api/problems/store', form);
      showMessage('Problem added successfully!');
    }

    fetchProblems();
    setForm({ car_id: '', title: '', description: '' });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/problems/delete/${id}`);
    showMessage('Problem deleted successfully!');
    fetchProblems();
  };

  const handleEdit = (problem) => {
    setForm({
      car_id: problem.car_id,
      title: problem.title,
      description: problem.description
    });
    setEditingId(problem.id);
  };

  return (
    <div className="container mt-4">
      <h3>Problem Management</h3>

      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}

      <ProblemForm
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        cars={cars}
        editing={!!editingId}
      />

      <ul className="list-group">
        {problems.map((problem) => (
          <li
            key={problem.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {problem.title} ({problem.description})
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEdit(problem)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(problem.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemManagement;
