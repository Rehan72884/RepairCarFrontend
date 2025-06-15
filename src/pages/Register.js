import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles/auth.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get('/sanctum/csrf-cookie');
      const res = await axios.post('/api/auth/register', form);
      alert(res.data.message);
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow-lg auth-card">
        <h3 className="text-center mb-4">Create an Account</h3>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-3">
            <label>Name</label>
            <input
              name="name"
              className="form-control"
              placeholder="Your name"
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
              placeholder="you@example.com"
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
              placeholder="********"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              name="password_confirmation"
              type="password"
              className="form-control"
              placeholder="********"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>

        {/* Login link at bottom */}
        <div className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
