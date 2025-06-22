import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import ProblemForm from '../../components/admin/ProblemForm';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';


const ProblemManagement = () => {
  const [problems, setProblems] = useState([]);
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({
    car_id: '',
    title: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    if (selectedCarId) {
      fetchProblems(selectedCarId);
      // Reset form and editing when car changes
      setForm({ car_id: selectedCarId, title: '', description: '' });
      setEditingId(null);
    } else {
      setProblems([]);
      setForm({ car_id: '', title: '', description: '' });
      setEditingId(null);
    }
  }, [selectedCarId]);

  const fetchProblems = async (carId) => {
    try {
      const res = await axios.get(`/api/problems/list?car_id=${carId}`);
      setProblems(res.data.data || []);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      setProblems([]);
    }
  };

  const fetchCars = async () => {
    const res = await axios.get('/api/cars/list');
    setCars(res.data.data);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCarId) {
      alert('Please select a car first.');
      return;
    }

    try {
      if (editingId) {
        await axios.post(`/api/problems/update/${editingId}`, form);
        showMessage('Problem updated successfully!');
        setEditingId(null);
      } else {
        await axios.post('/api/problems/store', form);
        showMessage('Problem added successfully!');
      }

      fetchProblems(selectedCarId);
      setForm({ car_id: selectedCarId, title: '', description: '' });
    } catch (error) {
      console.error('Failed to save problem:', error);
      alert('Error saving problem.');
    }
  };

  const handleDelete = async (id) => {
    if (!selectedCarId) return;
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axios.delete(`/api/problems/delete/${id}`);
      showMessage('Problem deleted successfully!');
      fetchProblems(selectedCarId);
    } catch (error) {
      console.error('Failed to delete problem:', error);
      alert('Error deleting problem.');
    }
  };

  const handleEdit = (problem) => {
    setForm({
      car_id: problem.car_id,
      title: problem.title,
      description: problem.description
    });
    setEditingId(problem.id);
    setSelectedCarId(problem.car_id); // Make sure dropdown matches editing problem's car
  };

  return (
    <div className="container mt-4">
       <Button color="secondary" onClick={() => navigate(-1)}>⬅ Back</Button>
      <h3 className="mb-4 text-center">Problem Management</h3>

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
        selectedCarId={selectedCarId}
        setSelectedCarId={setSelectedCarId}
      />

      {selectedCarId === '' ? (
        <p>Please select a car to see problems.</p>
      ) : problems.length === 0 ? (
        <p>No problems found for this car.</p>
      ) : (
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
      )}
    </div>
  );
};

export default ProblemManagement;
