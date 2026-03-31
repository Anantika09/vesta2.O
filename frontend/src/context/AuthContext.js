import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const data = await api.getMe();
      setUser(data.data.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      // Token is invalid, clear it
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };
const updateUser = async (userData) => {
  try {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
  const register = async (userData) => {
    try {
      const data = await api.register(userData);
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
      setUser(data.data.user);
      return { success: true, data };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.login({ email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
      setUser(data.data.user);
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

const value = {
  user,
  loading,
  isAuthenticated: !!user,
  register,
  login,
  logout,
  updateUser, // Add this
};
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;