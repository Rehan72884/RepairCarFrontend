import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css'; // create this file for styling

const ClientDashboard = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Dummy data for now
  useEffect(() => {
    setCompanies(['Toyota', 'Honda', 'Ford']);
    setModels(['Corolla', 'Civic', 'Mustang']);
    setYears(['2022', '2023', '2024']);
  }, []);

  const handleAddToMyCars = () => {
    if (selectedCompany && selectedModel && selectedYear) {
      const newCar = {
        company: selectedCompany,
        model: selectedModel,
        year: selectedYear,
      };
      const storedCars = JSON.parse(localStorage.getItem('myCars')) || [];
      storedCars.push(newCar);
      localStorage.setItem('myCars', JSON.stringify(storedCars));
      alert('Car added successfully!');
    } else {
      alert('Please select all fields.');
    }
  };

  const goToNext = () => {
    if (selectedCompany && selectedModel && selectedYear) {
      navigate('/next-step', {
        state: {
          company: selectedCompany,
          model: selectedModel,
          year: selectedYear,
        },
      });
    } else {
      alert('Please complete all selections.');
    }
  };

  const goToMyCars = () => {
    navigate('/my-cars');
  };

  return (
    <div className="dashboard-container">
      <div className="card p-4 shadow-lg dashboard-card">
        <h3 className="text-center mb-4">Select Your Vehicle</h3>

        <div className="mb-3">
          <label>Company</label>
          <select
            className="form-control"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select Company</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Model</label>
          <select
            className="form-control"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="">Select Model</option>
            {models.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Year</label>
          <select
            className="form-control"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-success" onClick={handleAddToMyCars}>
            Add to My Car
          </button>
          <button className="btn btn-primary" onClick={goToNext}>
            Next
          </button>
        </div>

        <div className="text-center mt-3">
          <button className="btn btn-outline-secondary w-100" onClick={goToMyCars}>
            My Cars
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
