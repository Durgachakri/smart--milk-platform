import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const user = localStorage.getItem('milk_user');
  if (user) {
    config.headers.Authorization = `Bearer ${JSON.parse(user).token}`;
  }
  return config;
});

export default API;