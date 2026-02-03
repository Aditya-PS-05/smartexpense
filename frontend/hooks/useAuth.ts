'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { authAPI } from '@/services/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await authAPI.getMe();
        if (res.data.success && res.data.data) {
          setUser(res.data.data);
        }
      }
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    window.location.href = '/login';
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      await fetchUser();
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  }, [fetchUser]);

  const register = useCallback(async (data: { email: string; password: string; name: string; phone?: string; address?: string }) => {
    const res = await authAPI.register(data);
    if (res.data.success && res.data.token) {
      localStorage.setItem('token', res.data.token);
      await fetchUser();
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  }, [fetchUser]);

  return { user, loading, setUser, logout, login, register, refetch: fetchUser };
}
