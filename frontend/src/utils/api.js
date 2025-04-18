import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await api.get('/auth/refresh');
        const { token } = response.data;
        
        // Store the new token
        localStorage.setItem('token', token);
        
        // Update the original request's header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Improve error handling
export const adminLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/admin-login', credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw {
        ...error.response.data,
        status: error.response.status
      };
    }
    throw { message: error.message || 'Login failed' };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.get('/auth/refresh');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Workshop endpoints
export const getWorkshops = async () => {
  try {
    const response = await api.get('/workshops');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getWorkshopById = async (id) => {
  try {
    const response = await api.get(`/workshops/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createWorkshop = async (workshopData) => {
  try {
    const response = await api.post('/workshops', workshopData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateWorkshop = async (id, workshopData) => {
  try {
    const response = await api.put(`/workshops/${id}`, workshopData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteWorkshop = async (id) => {
  try {
    await api.delete(`/workshops/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Registration endpoints
export const registerForWorkshop = async (registrationData) => {
  try {
    const response = await api.post('/workshops/register', registrationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerWithAccount = async (registrationData) => {
  try {
    const response = await api.post('/workshops/register/with-account', registrationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserRegistrations = async () => {
  try {
    const response = await api.get('/registrations/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllRegistrations = async (workshopId, status) => {
  try {
    let url = '/registrations';
    const params = new URLSearchParams();
    if (workshopId) params.append('workshop_id', workshopId);
    if (status) params.append('status', status);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getRegistrationById = async (id) => {
  try {
    const response = await api.get(`/registrations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateRegistrationStatus = async (id, status) => {
  try {
    const response = await api.put(`/registrations/${id}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteRegistration = async (id) => {
  try {
    await api.delete(`/registrations/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// User management endpoints
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/me', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    return true;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Admin dashboard
export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default api;