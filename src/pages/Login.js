import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 import navigate
import axios from '../api/axios';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate(); // 👈 initialize navigate

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.get('/sanctum/csrf-cookie');

    const res = await axios.post('/api/auth/login', form);
    

    const user = res.data.data.user;
    const token = res.data.data.token;
    const role = user.roles?.[0]?.name || 'Client';

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    alert(res.data.message);

    if (role === 'Admin') {
      navigate('/admin');
    } else if (role === 'Expert') {
      navigate('/expert');
    } else {
      navigate('/dashboard');
    }

  } catch (err) {
    console.error(err?.response?.data || err);
    alert(err?.response?.data?.message || 'Login failed');
  }
 };




  return (
    <div className="auth-container d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow-lg auth-card">
        <h3 className="text-center mb-4">Login to Your Account</h3>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
