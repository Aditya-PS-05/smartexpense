import api from '@/lib/api';
import { BorrowReq, CreateBorrowReq, Paginated } from '@/types';

export const requestsAPI = {
  list: (page = 1) =>
    api.get<Paginated<BorrowReq>>('/requests', { params: { page } }),
  get: (id: string) => api.get<BorrowReq>(`/requests/${id}`),
  create: (data: CreateBorrowReq) => api.post<BorrowReq>('/requests', data),
  approve: (id: string) => api.put(`/requests/${id}/approve`),
  reject: (id: string) => api.put(`/requests/${id}/reject`),
  complete: (id: string) => api.put(`/requests/${id}/complete`),
};
