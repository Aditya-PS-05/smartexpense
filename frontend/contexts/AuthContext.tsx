'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, LoginReq, RegisterReq } from '@/types';
import { authAPI } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginReq) => Promise<void>;
  register: (data: RegisterReq) => Promise<void>;
  logout: () => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        const res = await authAPI.getMe();
        if (res.data.success && res.data.data) {
          setUser(res.data.data);
        }
      }
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (data: LoginReq) => {
    const res = await authAPI.login(data);
    if (res.data.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      await fetchUser();
    } else {
      throw new Error('Login failed');
    }
  }, [fetchUser]);

  const register = useCallback(async (data: RegisterReq) => {
    const res = await authAPI.register(data);
    if (res.data.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      await fetchUser();
      return;
    }
    throw new Error('Registration failed');
  }, [fetchUser]);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
