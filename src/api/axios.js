import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
});

// ✅ Add token to every request if it exists
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Make sure token is saved on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
