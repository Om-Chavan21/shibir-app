import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Workshop registrations endpoints
export const registerForWorkshop = async (registrationData) => {
  try {
    const response = await api.post('/workshops/register', registrationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getWorkshops = async () => {
  try {
    const response = await api.get('/workshops');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin endpoints
export const adminLogin = async (credentials) => {
  try {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllRegistrations = async () => {
  try {
    const response = await api.get('/admin/registrations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;