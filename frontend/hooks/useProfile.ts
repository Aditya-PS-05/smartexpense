/**
 * useProfile Hook
 * 
 * Custom hook for managing user profile data
 * - Fetches current user profile
 * - Handles profile updates
 * - Manages loading and error states
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { userAPI } from '@/services/user';
import type { User } from '@/types';

interface UseProfileResult {
  profile: User | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileResult {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getProfile();
      setProfile(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const response = await userAPI.updateProfile(data);
      setProfile(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [authUser]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
  };
}
