import api from '@/lib/api';
import { BorrowReq, CreateBorrowReq, ApiResponse } from '@/types';

export interface RequestsListResponse {
  success: boolean;
  count: number;
  data: BorrowReq[];
}

export interface RequestsParams {
  type?: 'sent' | 'received';
  status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
}

export const requestsAPI = {
  list: (params?: RequestsParams) =>
    api.get<RequestsListResponse>('/requests', { params }),
  get: (id: string) => api.get<ApiResponse<BorrowReq>>(`/requests/${id}`),
  create: (data: CreateBorrowReq) => api.post<ApiResponse<BorrowReq>>('/requests', data),
  approve: (id: string) => api.put<ApiResponse<BorrowReq>>(`/requests/${id}/approve`),
  reject: (id: string) => api.put<ApiResponse<BorrowReq>>(`/requests/${id}/reject`),
  complete: (id: string) => api.put<ApiResponse<BorrowReq>>(`/requests/${id}/complete`),
  cancel: (id: string) => api.put<ApiResponse<BorrowReq>>(`/requests/${id}/cancel`),
};
