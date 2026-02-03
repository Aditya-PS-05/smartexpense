import api from '@/lib/api';
import { LoginReq, RegisterReq, AuthRes, ApiResponse, User } from '@/types';

export const authAPI = {
  login: (data: LoginReq) => api.post<AuthRes>('/auth/login', data),
  register: (data: RegisterReq) => api.post<AuthRes>('/auth/register', data),
  getMe: () => api.get<ApiResponse<User>>('/auth/me'),
  updateProfile: (data: Partial<User>) => api.put<ApiResponse<User>>('/auth/profile', data),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};
