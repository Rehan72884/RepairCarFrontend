import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import CarForm from '../../components/admin/CarForm';

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ company: '', model: '', year: '' });
  const [editingCarId, setEditingCarId] = useState(null); // Track which car is being edited

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const res = await axios.get('api/cars/list');
    setCars(res.data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingCarId) {
      // Update existing car
      await axios.post(`api/cars/update/${editingCarId}`, form);
      setEditingCarId(null);
    } else {
      // Create new car
      await axios.post('api/cars/store', form);
    }

    fetchCars();
    setForm({ company: '', model: '', year: '' });
  };

  const handleDelete = async (id) => {
    await axios.delete(`api/cars/delete/${id}`);
    fetchCars();
  };

  const handleEdit = (car) => {
    setForm({ company: car.company, model: car.model, year: car.year });
    setEditingCarId(car.id);
  };

  return (
    <div className="container mt-4">
      <h3>Car Management</h3>

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
