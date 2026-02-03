import api from '@/lib/api';
import { Item, CreateItemReq, Paginated } from '@/types';

export const itemsAPI = {
  list: (page = 1, limit = 10) =>
    api.get<Paginated<Item>>('/items', { params: { page, limit } }),
  get: (id: string) => api.get<Item>(`/items/${id}`),
  search: (query: string) =>
    api.get<Paginated<Item>>('/items/search', { params: { q: query } }),
  create: (data: CreateItemReq) => api.post<Item>('/items', data),
  update: (id: string, data: Partial<CreateItemReq>) =>
    api.put<Item>(`/items/${id}`, data),
  delete: (id: string) => api.delete(`/items/${id}`),
};
