// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (loginData: LoginResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    
    // Set loading to false after checking for stored auth data
    setLoading(false);
  }, []);

  const login = (loginData: LoginResponse) => {
    setLoading(true);
    setUser(loginData.user);
    setToken(loginData.access_token);
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(loginData.user));
    localStorage.setItem('access_token', loginData.access_token);
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    setUser(null);
    setToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    setLoading(false);
  };

  const isAuthenticated = !!(user && token);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};