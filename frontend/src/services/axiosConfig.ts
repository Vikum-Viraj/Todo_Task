import axios from 'axios';
import type { AxiosInstance } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any authentication tokens if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle global error responses
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login if needed
      console.error('Unauthorized access');
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
