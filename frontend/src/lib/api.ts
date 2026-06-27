import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Untuk mendukung cookie session Better Auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk handle global error jika diperlukan
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
