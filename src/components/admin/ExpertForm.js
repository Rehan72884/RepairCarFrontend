import React from 'react';

const ExpertForm = ({ form, setForm, handleSubmit, companies = [] }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="form-control mb-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <select
        className="form-control mb-3"
        value={form.company || ''}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        required
      >
        <option value="">-- Select Company --</option>
        {companies.map((company) => (
          <option key={company} value={company}>{company}</option>
        ))}
      </select>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default ExpertForm;
