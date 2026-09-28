import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (kycData: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateUserPoints: (newPoints: number, streak?: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('katha_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      if (!localStorage.getItem('katha_token')) {
        setUser(null);
        setLoading(false);
        return;
      }
      const profile = await api.getProfile();
      setUser(profile);
    } catch (err) {
      console.warn('Session expired or invalid, logging out:', err);
      localStorage.removeItem('katha_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    localStorage.setItem('katha_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (kycData: any) => {
    const res = await api.register(kycData);
    localStorage.setItem('katha_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('katha_token');
    setToken(null);
    setUser(null);
  };

  const updateUserPoints = (newPoints: number, streak?: number) => {
    if (!user) return;
    setUser(prev => prev ? {
      ...prev,
      rewardPoints: newPoints,
      currentStreak: streak !== undefined ? streak : prev.currentStreak
    } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      updateUserPoints
    }}>
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
