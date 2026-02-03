import api from '@/lib/api';
import { Item, CreateItemReq, Paginated, ApiResponse } from '@/types';

export interface SearchParams {
  q?: string;
  category?: string;
  condition?: string;
  availability?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  sort?: 'date_asc' | 'date_desc' | 'rating';
  page?: number;
  limit?: number;
}

export const itemsAPI = {
  list: (page = 1, limit = 10, category?: string, condition?: string) =>
    api.get<Paginated<Item>>('/items', { params: { page, limit, category, condition } }),
  get: (id: string) => api.get<ApiResponse<Item>>(`/items/${id}`),
  search: (params: SearchParams) =>
    api.get<Paginated<Item>>('/items/search', { params }),
  nearby: (lat: number, lng: number, radius = 10, limit = 20) =>
    api.get<ApiResponse<Item[]>>('/items/nearby', { params: { lat, lng, radius, limit } }),
  myItems: () => api.get<Paginated<Item>>('/items/my-items'),
  getUserItems: (userId: string) => api.get<Paginated<Item>>(`/users/${userId}/items`),
  create: (data: CreateItemReq) => api.post<ApiResponse<Item>>('/items', data),
  update: (id: string, data: Partial<CreateItemReq>) =>
    api.put<ApiResponse<Item>>(`/items/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<Record<string, never>>>(`/items/${id}`),
};
