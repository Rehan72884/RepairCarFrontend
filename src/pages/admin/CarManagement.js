import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import CarForm from '../../components/admin/CarForm';

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ company: '', model: '', year: '' });
  const [editingCarId, setEditingCarId] = useState(null); 
  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const res = await axios.get('api/cars/list');
    setCars(res.data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    if (editingCarId) {
      await axios.post(`api/cars/update/${editingCarId}`, form);
      setEditingCarId(null);
      setSuccessMessage('Car updated successfully!');
    } else {
      // Create new car
      await axios.post('api/cars/store', form);
      setSuccessMessage('Car added successfully!');
    }

    fetchCars();
    setForm({ company: '', model: '', year: '' });

    setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving expert:', error);
      alert('Error saving expert');
    }
  };

  const handleDelete = async (id) => {
    try {
    await axios.delete(`api/cars/delete/${id}`);
    setSuccessMessage('Car deleted successfully!');
    fetchCars();

    setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    }
  };

  const handleEdit = (car) => {
    setForm({ company: car.company, model: car.model, year: car.year });
    setEditingCarId(car.id);
  };

  return (
    <div className="container mt-4">
      <h3>Car Management</h3>
      {successMessage && (
      <div className="alert alert-success" role="alert">
        {successMessage}
      </div>
    )}

      <CarForm
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        editingCarId={editingCarId}  // pass this prop
      />

      <ul className="list-group">
        {cars.map((car) => (
          <li key={car.id} className="list-group-item d-flex justify-content-between align-items-center">
            {car.company} {car.model} ({car.year})
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => handleEdit(car)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(car.id)}
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

export default CarManagement;
