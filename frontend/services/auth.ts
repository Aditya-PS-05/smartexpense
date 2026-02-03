import api from '@/lib/api';
import { LoginReq, RegisterReq, AuthRes, User } from '@/types';

export const authAPI = {
  login: (data: LoginReq) => api.post<AuthRes>('/auth/login', data),
  register: (data: RegisterReq) => api.post<AuthRes>('/auth/register', data),
  getMe: () => api.get<User>('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
  },
};
