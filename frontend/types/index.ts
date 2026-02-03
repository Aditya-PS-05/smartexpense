// User
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  rating: number;
}

// Auth
export interface LoginReq {
  email: string;
  password: string;
}

export interface RegisterReq {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface AuthRes {
  token: string;
  user: User;
}

// Items
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  owner: User;
  available: boolean;
}

export interface CreateItemReq {
  title: string;
  description: string;
  category: string;
  images: string[];
}

// Requests
export interface BorrowReq {
  id: string;
  itemId: string;
  borrower: User;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  startDate: string;
  endDate: string;
}

export interface CreateBorrowReq {
  itemId: string;
  startDate: string;
  endDate: string;
  message: string;
}

// Pagination
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
}
