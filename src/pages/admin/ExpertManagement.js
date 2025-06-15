import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import ExpertForm from '../../components/expert/ExpertForm';

const ExpertManagement = () => {
  const [experts, setExperts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const res = await axios.get('/api/experts/list');
      setExperts(res.data.data);
    } catch (error) {
      console.error('Error fetching experts:', error);
      alert('Failed to load experts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.post(`/api/experts/update/${editingId}`, form);
      } else {
        await axios.post('/api/experts/store', form);
      }
      fetchExperts();
      setForm({ name: '', email: '', password: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving expert:', error);
      alert('Error saving expert');
    }
  };

  const handleEdit = (expert) => {
    setForm({
      name: expert.name,
      email: expert.email,
      password: '', // leave empty for updates
    });
    setEditingId(expert.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expert?')) {
      try {
        await axios.delete(`/api/experts/delete/${id}`);
        fetchExperts();
      } catch (error) {
        console.error('Error deleting expert:', error);
        alert('Error deleting expert');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h3>Expert Accounts</h3>

      <ExpertForm
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        buttonLabel={editingId ? 'Update Expert' : 'Add Expert'}
      />

      <ul className="list-group mt-4">
        {experts.map((expert) => (
          <li key={expert.id} className="list-group-item d-flex justify-content-between align-items-center">
            {expert.name} ({expert.email})
            <div>
              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(expert)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(expert.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpertManagement;
