// lib/Auth.jsx - Backend Authentication Service
import React, { createContext, useContext, useState, useEffect } from 'react';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.0.193:5000';

// Auth API Service
class AuthService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/auth`;
  }

  // Login with backend API
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      if (data.success && data.token) {
        // Store token and user data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  }

  // Logout
  async logout() {
    try {
      const token = this.getToken();
      
      if (token) {
        // Optional: Call logout endpoint to invalidate token on server
        await fetch(`${this.baseURL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Verify token validity
  async verifyToken() {
    try {
      const token = this.getToken();
      
      if (!token) {
        return { valid: false };
      }

      // Try to verify token with backend
      const response = await fetch(`${this.baseURL}/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          valid: true,
          user: data.user
        };
      } else if (response.status === 401 || response.status === 403) {
        // Token is definitely invalid
        this.clearAuthData();
        return { valid: false };
      } else {
        // Server error or other issue - assume token is still valid
        console.warn('Token verification failed due to server error, assuming token is valid');
        return { valid: true };
      }
    } catch (error) {
      console.error('Token verification error:', error);
      
      // Check if token is expired by decoding it (basic check)
      const token = this.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp && payload.exp < currentTime) {
            // Token is expired
            this.clearAuthData();
            return { valid: false };
          }
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
        }
      }
      
      // If we can't verify due to network issues, assume token is valid
      // It will be validated on next API call
      return { valid: true };
    }
  }

  // Get stored token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Get stored user data
  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  // Clear authentication data
  clearAuthData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Get authorization header for API requests
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Refresh user data
  async refreshUserData() {
    try {
      const token = this.getToken();
      
      if (!token) {
        return { success: false, error: 'No token available' };
      }

      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user_data', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const token = this.getToken();
      
      if (!token) {
        return { success: false, error: 'No token available' };
      }

      const response = await fetch(`${this.baseURL}/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update local user data
        const currentUser = this.getUser();
        if (currentUser) {
          currentUser.preferences = { ...currentUser.preferences, ...preferences };
          localStorage.setItem('user_data', JSON.stringify(currentUser));
        }
        
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Update preferences error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create service instance
const authService = new AuthService();

// Authentication Context
const AuthContext = createContext();

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      const token = authService.getToken();
      const userData = authService.getUser();
      
      if (token && userData) {
        // Set authenticated state immediately with cached data
        setIsAuthenticated(true);
        setUser(userData);
        
        // Then verify token in background
        try {
          const verification = await authService.verifyToken();
          
          if (verification.valid) {
            // Update user data if verification returns updated info
            if (verification.user) {
              setUser(verification.user);
            }
          } else {
            // Token is invalid, clear auth state
            setIsAuthenticated(false);
            setUser(null);
            authService.clearAuthData();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          // On network error, keep user logged in with cached data
          // Token will be verified on next API call
        }
      } else {
        // No token or user data, user is not authenticated
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoginLoading(true);
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Refresh user data
  const refreshUser = async () => {
    const result = await authService.refreshUserData();
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  // Update user preferences
  const updateUserPreferences = async (preferences) => {
    const result = await authService.updatePreferences(preferences);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  // Check user permissions
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Check user role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Get role display name
  const getRoleDisplayName = () => {
    if (!user) return '';
    
    const roleMap = {
      'admin': 'Administrator',
      'soc_manager': 'SOC Manager',
      'soc_analyst': 'SOC Analyst',
      'security_engineer': 'Security Engineer',
      'incident_responder': 'Incident Responder',
      'compliance_officer': 'Compliance Officer'
    };
    
    return roleMap[user.role] || user.role;
  };

  const contextValue = {
    // State
    isAuthenticated,
    user,
    loading,
    loginLoading,
    
    // Actions
    login,
    logout,
    refreshUser,
    updateUserPreferences,
    
    // Utilities
    hasPermission,
    hasRole,
    getRoleDisplayName,
    getAuthHeader: authService.getAuthHeader.bind(authService),
    getToken: authService.getToken.bind(authService)
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent, requiredPermissions = []) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, user, hasPermission } = useAuth();
    
    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }
    
    if (requiredPermissions.length > 0) {
      const hasRequiredPermissions = requiredPermissions.every(permission => 
        hasPermission(permission)
      );
      
      if (!hasRequiredPermissions) {
        return <div>You don't have permission to access this page.</div>;
      }
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Loading component for authentication
export const AuthLoadingSpinner = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Initializing...</p>
      <p className="text-gray-400 text-sm">Verifying authentication</p>
    </div>
  </div>
);

export default authService;