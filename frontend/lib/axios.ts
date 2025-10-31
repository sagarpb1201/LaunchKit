import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  withCredentials: true,
});

// Track if we're refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

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
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Skip refresh logic for these endpoints to prevent loops
    const skipRefreshFor = [
      '/auth/refresh',
      '/users/login',
      '/users/me'  // Add this to prevent the loop
    ];

    // If it's not 401 or it's a skipped endpoint or no config exists
    if (!error.response || 
        error.response.status !== 401 || 
        !originalRequest ||
        skipRefreshFor.some(endpoint => originalRequest.url?.includes(endpoint))) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the requests that come in while refreshing
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      // Try to refresh the token
      await api.post('/auth/refresh');
      
      // If refresh successful, retry original request
      processQueue();
      isRefreshing = false;
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, reject all queued requests
      processQueue(refreshError);
      isRefreshing = false;
      
      // Clear user session
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default api;