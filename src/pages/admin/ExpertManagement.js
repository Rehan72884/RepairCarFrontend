
import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import ExpertForm from '../../components/expert/ExpertForm';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

const ExpertManagement = () => {
  const [cars, setCars] = useState([]);
  const [experts, setExperts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    car_ids: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchExperts();
    fetchCompanies();
    fetchCars();
  }, []);

  const fetchExperts = async () => {
  try {
    const res = await axios.get('/api/experts/car');
    console.log('Experts loaded:', res.data.data);
    setExperts(res.data.data);
  } catch (error) {
    console.error(error);
  }
};

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/experts/companies');
      setCompanies(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await axios.get('/api/cars/list');
      setCars(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
  await axios.post(`/api/experts/update/${editingId}`, form);
  setSuccessMessage('Expert updated successfully!');
  fetchExperts();
} else {
  const res = await axios.post('/api/experts/store', form);
  setExperts(prev => [...prev, res.data.data]); // ⬅ manually push new expert
  setSuccessMessage('Expert added successfully!');
}


      fetchExperts();
      setForm({ name: '', email: '', password: '', company: '', car_ids: [] });
      setEditingId(null);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving expert:', error);
      // alert('Error saving expert');
    }
  };

  const handleEdit = (expert) => {
    setForm({
      name: expert.name,
      email: expert.email,
      password: '',
      company: expert.company || '',
      car_ids: expert.cars?.map(car => car.id) || [],
    });
    setEditingId(expert.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/experts/delete/${id}`);
      setSuccessMessage('Expert deleted successfully!');
      fetchExperts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Error deleting expert');
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <Button color="secondary" onClick={() => navigate(-1)}>⬅ Back</Button>
      <h3 className="mb-4 text-center">Expert Accounts</h3>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <ExpertForm
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        buttonLabel={editingId ? 'Update Expert' : 'Add Expert'}
        companies={companies}
        cars={cars}
      />

      <ul className="list-group mt-4">
        {experts.map((expert) => (
          <li key={expert.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{expert.name}</strong> ({expert.email})<br />
              <small>Company: {expert.company}</small>
            </div>
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
