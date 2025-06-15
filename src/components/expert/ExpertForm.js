import React from 'react';

const ExpertForm = ({ form, setForm, handleSubmit, buttonLabel }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isUpdating = buttonLabel.toLowerCase().includes('update');

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

      <button type="submit" className="btn btn-primary w-100">
        {buttonLabel}
      </button>
    </form>
  );
};

export default ExpertForm;
