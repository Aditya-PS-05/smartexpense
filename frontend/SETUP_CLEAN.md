# Section 1: Project Setup - Complete ✅

## Clean & Minimal Implementation

### 📁 Folder Structure Created
```
frontend/
├── lib/
│   ├── api.ts        # Axios instance with interceptors
│   └── utils.ts      # Helper functions (cn)
├── components/       # React components
├── hooks/           # Custom React hooks
├── services/        # API functions
├── types/           # TypeScript types
└── constants/       # Constants
```

### 🔧 Core Files

#### `lib/api.ts` (28 lines)
- Axios instance with base URL config
- Request interceptor: adds JWT token
- Response interceptor: 401 redirect to login
- Clean error handling

#### `lib/utils.ts` (7 lines)
- `cn()` function for merging Tailwind classes

#### `types/index.ts` (60 lines)
All TypeScript interfaces:
- User, Item, BorrowReq
- LoginReq, RegisterReq, AuthRes
- CreateItemReq, CreateBorrowReq
- Paginated response type

#### `constants/index.ts` (20 lines)
- CATEGORIES
- STATUS_COLORS
- STORAGE keys

### 🛣️ Services (3 files)

**`services/auth.ts`**
```ts
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: () => localStorage.removeItem('token'),
}
```

**`services/items.ts`**
```ts
export const itemsAPI = {
  list: (page, limit) => api.get('/items', { params }),
  get: (id) => api.get(`/items/${id}`),
  search: (query) => api.get('/items/search', { params }),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
}
```

**`services/requests.ts`**
```ts
export const requestsAPI = {
  list: (page) => api.get('/requests', { params }),
  get: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  approve: (id) => api.put(`/requests/${id}/approve`),
  reject: (id) => api.put(`/requests/${id}/reject`),
  complete: (id) => api.put(`/requests/${id}/complete`),
}
```

### 🎣 Hooks

**`hooks/useAuth.ts`** (25 lines)
```ts
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch current user on mount
  }, []);
  
  return { user, loading, setUser };
}
```

### 🎨 Components

**`components/Button.tsx`** (25 lines)
- Variants: default, outline, ghost
- Sizes: sm, md, lg
- Clean Tailwind styling

### ⚙️ Configuration

**`.env.local`**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### 📊 File Size Summary
- `lib/api.ts`: 28 lines
- `lib/utils.ts`: 7 lines
- `types/index.ts`: 60 lines
- `constants/index.ts`: 20 lines
- `services/auth.ts`: 9 lines
- `services/items.ts`: 12 lines
- `services/requests.ts`: 11 lines
- `hooks/useAuth.ts`: 25 lines
- `components/Button.tsx`: 25 lines

**Total: ~197 lines of clean, understandable code**

## Usage Examples

### Making API calls
```ts
import { itemsAPI } from '@/services/items';

const { data } = await itemsAPI.list(1, 10);
```

### Using hooks
```ts
import { useAuth } from '@/hooks/useAuth';

const { user, loading } = useAuth();
```

### Using components
```ts
import { Button } from '@/components/Button';

<Button variant="default" size="md">Click</Button>
```

## Ready for Next Steps
✅ Project Setup Complete - All dependencies, folder structure, API client, and core files created
→ Next: Layout & Navigation (Section 2)
