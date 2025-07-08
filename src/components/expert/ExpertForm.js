// src/components/expert/ExpertForm.jsx
import React, { useEffect, useState } from 'react';

const ExpertForm = ({ form, setForm, handleSubmit, buttonLabel, companies = [], cars = [] }) => {
  const [filteredCars, setFilteredCars] = useState([]);

  const isUpdating = buttonLabel.toLowerCase().includes('update');

  useEffect(() => {
    if (form.company) {
      const carsForCompany = cars.filter(car => car.company === form.company);
      setFilteredCars(carsForCompany);
    } else {
      setFilteredCars([]);
    }
  }, [form.company, cars]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'company') {
      setForm({ ...form, company: value, car_ids: [] }); // reset car_ids on company change
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCarSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => parseInt(opt.value));
    setForm({ ...form, car_ids: selectedOptions });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Name</label>
        <input
          name="name"
          className="form-control"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input
          name="email"
          type="email"
          className="form-control"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label>Password</label>
        <input
          name="password"
          type="password"
          className="form-control"
          value={form.password}
          onChange={handleChange}
          placeholder={isUpdating ? 'Leave blank to keep current' : '********'}
          required={!isUpdating}
        />
      </div>

      <div className="mb-3">
        <label>Company</label>
        <select
          name="company"
          className="form-control"
          value={form.company || ''}
          onChange={handleChange}
        >
          <option value="">-- Select Company --</option>
          {companies.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Assign Cars</label>
        <select
          multiple
          name="car_ids"
          className="form-control"
          value={form.car_ids || []}
          onChange={handleCarSelection}
          disabled={!form.company}
        >
          {filteredCars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.model} ({car.year})
            </option>
          ))}
        </select>
        <small className="text-muted">Only cars from selected company are shown. Hold Ctrl/Cmd to select multiple.</small>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        {buttonLabel}
      </button>
    </form>
  );
};

export default ExpertForm;
