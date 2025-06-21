import React from 'react';

const ProblemForm = ({
  form,
  setForm,
  handleSubmit,
  selectedCarId,
  setSelectedCarId,
  cars = [],
  editing
}) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <select
        className="form-control mb-2"
        value={selectedCarId}
        onChange={(e) => {
          setSelectedCarId(e.target.value);
          setForm({ ...form, car_id: e.target.value });
        }}
        required
      >
        <option value="">Select Car</option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.company} {car.model} ({car.year})
          </option>
        ))}
      </select>

      <input
        className="form-control mb-2"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      <button className="btn btn-primary" disabled={!selectedCarId}>
        {editing ? 'Update Problem' : 'Add Problem'}
      </button>
    </form>
  );
};

export default ProblemForm;
