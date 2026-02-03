/**
 * User API Service
 * 
 * Handles all user-related API calls:
 * - Profile retrieval and updates
 * - Public user profiles
 * - User ratings and reviews
 */

import api from '@/lib/api';
import type { User, Rating } from '@/types';

export const userAPI = {
  /**
   * Get current user profile
   * GET /api/auth/me
   */
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Update current user profile
   * PUT /api/auth/profile
   */
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  /**
   * Get public user profile by ID
   * GET /api/users/:id
   */
  getUserProfile: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Get user ratings and reviews
   * GET /api/users/:id/ratings
   */
  getUserRatings: async (userId: string) => {
    const response = await api.get(`/users/${userId}/ratings`);
    return response.data;
  },

  /**
   * Get user's listed items
   * GET /api/users/:id/items
   */
  getUserItems: async (userId: string) => {
    const response = await api.get(`/users/${userId}/items`);
    return response.data;
  },
};
