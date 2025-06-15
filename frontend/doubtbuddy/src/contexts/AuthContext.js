import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check for existing auth on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          // Validate that user data has required fields
          if (parsedUser && parsedUser.id && parsedUser.role) {
            setUser(parsedUser);
          } else {
            // Invalid user data structure
            console.error('Invalid user data structure');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        // If there's an error parsing the user data, clear everything
        console.error('Error restoring auth state:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);  const login = async (credentials) => {
    try {
      const response = await api.login(credentials);
      const { token, user } = response.data;
      
      // Validate user data structure
      if (!token || !user) {
        throw new Error('Invalid response: Missing token or user data');
      }
      if (!user.id) {
        throw new Error('Invalid user data: Missing ID');
      }
      if (!user.role) {
        throw new Error('Invalid user data: Missing role');
      }

      // Store auth data only if validation passes
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { 
        success: true,
        user  // Return user data for welcome message
      };
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { 
        success: false, 
        error: error.response?.data?.msg || error.message || 'Login failed. Please try again.' 
      };
    }
  };  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      const { token, user } = response.data;
      
      // Validate user data structure
      if (!token || !user) {
        throw new Error('Invalid response: Missing token or user data');
      }
      if (!user.id) {
        throw new Error('Invalid user data: Missing ID');
      }
      if (!user.role) {
        throw new Error('Invalid user data: Missing role');
      }

      // Store auth data only if validation passes
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { 
        success: true,
        user  // Return user data for welcome message
      };
    } catch (error) {
      console.error('Registration error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { 
        success: false, 
        error: error.response?.data?.msg || error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
