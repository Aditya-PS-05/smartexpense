# Frontend TODO - Neighborhood Lending Library

> **Tech Stack**: Next.js 16 (App Router), Tailwind CSS, TypeScript

## 1. Project Setup ✅
- [x] Initialize Next.js project with TypeScript
- [x] Set up Tailwind CSS
- [x] Configure environment variables (API base URL)
- [x] Set up folder structure (components, lib, hooks, services, types)
- [x] Create API client (axios wrapper)

## 2. Layout & Navigation ✅
- [x] Root layout with header/footer
- [x] Navbar component (logo, nav links, auth buttons)
- [x] Mobile responsive sidebar/menu
- [x] Footer component
- [x] Loading and error states (Suspense, error boundaries)

## 3. Authentication Pages ✅
- [x] `/login` - Login page
  - [x] Email/password form
  - [x] API: `POST /api/auth/login`
- [x] `/register` - Signup page
  - [x] Registration form with address input
  - [x] API: `POST /api/auth/register`
- [x] Auth context/provider for JWT management
- [x] Protected route components (ProtectedRoute, PublicOnlyRoute)
- [x] Redirect logic (authenticated/unauthenticated)

## 4. User Profile ✅
- [x] `/profile` - User profile page
  - [x] Display user info, ratings, listed items
  - [x] API: `GET /api/auth/me`
- [x] `/profile/edit` - Edit profile page
  - [x] Update form (name, address, phone, image)
  - [x] API: `PUT /api/auth/profile`
- [x] `/users/[id]` - Public user profile
  - [x] Display user ratings and reviews
  - [x] API: `GET /api/users/:id/ratings`

## 5. Item Listing Pages ✅
- [x] `/items` - Browse all items (Home/Explore)
  - [x] Item grid/list view
  - [x] Pagination
  - [x] API: `GET /api/items`
- [x] `/items/[id]` - Item detail page
  - [x] Image carousel
  - [x] Item info, owner info, availability
  - [x] Borrow request button
  - [x] API: `GET /api/items/:id`
- [x] `/items/new` - Create item listing
  - [x] Form: title, description, category, images, condition
  - [x] Image upload
  - [x] API: `POST /api/items`
- [x] `/items/[id]/edit` - Edit item page
  - [x] Pre-filled form
  - [x] API: `PUT /api/items/:id`
- [x] `/my-items` - User's listed items
  - [x] Manage listings (edit/delete)
  - [x] API: `GET /api/items/my-items`

## 6. Search & Filter
- [ ] Search bar component
  - [ ] API: `GET /api/items/search`
- [ ] Filter sidebar/sheet
  - [ ] Category filter
  - [ ] Location/radius filter
  - [ ] Availability toggle
- [ ] Sort dropdown (distance, date, rating)

## 7. Borrow Request System
- [ ] Borrow request modal/dialog
  - [ ] Date picker for borrow period
  - [ ] Message to owner
  - [ ] API: `POST /api/requests`
- [ ] `/requests` - My requests page
  - [ ] Tabs: Sent / Received
  - [ ] Request cards with status badges
  - [ ] API: `GET /api/requests`
- [ ] Request actions
  - [ ] Approve/Reject buttons (for lenders)
  - [ ] API: `PUT /api/requests/:id/approve`, `PUT /api/requests/:id/reject`
  - [ ] Mark as returned
  - [ ] API: `PUT /api/requests/:id/complete`

## 8. Messaging System
- [ ] `/messages` - Conversations list
  - [ ] Conversation preview cards
  - [ ] API: `GET /api/conversations`
- [ ] `/messages/[conversationId]` - Chat page
  - [ ] Message bubbles
  - [ ] Message input
  - [ ] API: `GET /api/messages/:conversationId`, `POST /api/messages`
- [ ] Real-time updates (WebSocket or polling)
- [ ] Unread message indicator

## 9. Trust & Safety
- [ ] Rating modal
  - [ ] Star rating component
  - [ ] Comment textarea
  - [ ] API: `POST /api/ratings`
- [ ] Report modal
  - [ ] Reason select/textarea
  - [ ] API: `POST /api/reports`
- [ ] Display user ratings on profile

## 10. Components ✅ (Partial)
- [x] Button
- [x] Input (with label/error)
- [x] Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- [x] Alert, AlertTitle, AlertDescription
- [x] Loading spinner
- [x] Skeleton loaders
- [x] EmptyState
- [x] ErrorBoundary
- [ ] Dialog, Sheet, Tabs
- [ ] Select, Textarea
- [ ] Badge, Avatar
- [ ] Calendar, DatePicker
- [ ] Toast/Sonner for notifications
- [ ] Dropdown menu (user menu)

## 11. Utilities & Hooks ✅ (Partial)
- [x] `useAuth` / `useAuthContext` - Authentication hook
- [x] API service functions (lib/api.ts)
- [x] Type definitions (types/index.ts)
- [x] Auth service (services/auth.ts)
- [x] Items service (services/items.ts)
- [x] Requests service (services/requests.ts)
- [ ] `useItems` - Fetch items hook
- [ ] `useRequests` - Borrow requests hook
- [ ] `useMessages` - Messaging hook

## 12. Testing & Deployment
- [ ] Component tests (Jest/React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Vercel deployment setup
- [ ] Environment variables for production
