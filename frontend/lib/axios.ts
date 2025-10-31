import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Make sure we're not swallowing the error
    console.error('Axios error:', error.response?.status, error.response?.data);
    
    // Don't intercept 401 errors during login attempts
    if (error.response?.status === 401 && error.config.url.includes('/login')) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;