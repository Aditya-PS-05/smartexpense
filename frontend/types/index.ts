// Base API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// User
export interface User {
  _id: string;
  id?: string;
  email: string;
  name: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  profileImage?: string;
  averageRating?: number;
  totalRatings?: number;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  success: boolean;
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    profileImage?: string;
  };
  message?: string;
  verificationToken?: string;
}

// Items
export interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  availability: 'Available' | 'Borrowed' | 'Unavailable';
  owner: User;
  location?: {
    type: string;
    coordinates: [number, number];
    address?: string;
  };
  distance?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateItemReq {
  title: string;
  description: string;
  category: string;
  images: string[];
  condition?: string;
  location?: {
    type: string;
    coordinates: [number, number];
    address?: string;
  };
}

// Requests
export interface BorrowReq {
  _id: string;
  item: Item | string;
  borrower: User;
  lender: User;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  message?: string;
  createdAt: string;
}

export interface CreateBorrowReq {
  item: string;
  startDate: string;
  endDate: string;
  message?: string;
}

// Rating
export interface Rating {
  _id: string;
  giver?: User;
  receiver?: User;
  rating: number;
  review?: string;
  item?: Item;
  request?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Pagination
export interface Paginated<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}
