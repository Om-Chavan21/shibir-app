import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, adminLogin, getCurrentUser, refreshToken, updateUserProfile } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (token exists in localStorage)
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
    
    // Set up token refresh interval
    const refreshInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        refreshUserToken();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const fetchUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshUserToken = async () => {
    try {
      const data = await refreshToken();
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      throw error;
    }
  };
  
  const adminLoginHandler = async (credentials) => {
    try {
      const data = await adminLogin(credentials);
      localStorage.setItem('token', data.token);
      setUser({
        ...data.user,
        role: 'admin'  // Explicitly set the role to ensure it's included
      });
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await updateUserProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    adminLogin: adminLoginHandler,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};