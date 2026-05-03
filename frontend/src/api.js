import axios from 'axios';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const api = axios.create({
  baseURL: API_BASE_URL,
});

//JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); //Retrieve the token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Attaching it as a Bearer token
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api; 