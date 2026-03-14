import axios from 'axios';
import type { AxiosInstance } from 'axios';

// API Config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default axiosInstance;
