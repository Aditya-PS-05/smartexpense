# Frontend TODO - Neighborhood Lending Library

> **Tech Stack**: Next.js 14 (App Router), shadcn/ui, Tailwind CSS

## 1. Project Setup
- [x] Initialize Next.js project with TypeScript
- [x] Install and configure shadcn/ui
- [x] Set up Tailwind CSS
- [x] Configure environment variables (API base URL)
- [x] Set up folder structure (components, lib, hooks, services, types)
- [x] Create API client (axios/fetch wrapper)

## 2. Layout & Navigation
- [ ] Root layout with header/footer
- [ ] Navbar component (logo, nav links, auth buttons)
- [ ] Mobile responsive sidebar/menu
- [ ] Footer component
- [ ] Loading and error states (Suspense, error boundaries)

## 3. Authentication Pages
- [ ] `/login` - Login page
  - [ ] Email/password form (shadcn Form, Input, Button)
  - [ ] API: `POST /api/auth/login`
- [ ] `/register` - Signup page
  - [ ] Registration form with address input
  - [ ] API: `POST /api/auth/register`
- [ ] `/verify-email` - Email verification page
  - [ ] API: `POST /api/auth/verify-email`
- [ ] Auth context/provider for JWT management
- [ ] Protected route middleware
- [ ] Redirect logic (authenticated/unauthenticated)

## 4. User Profile
- [ ] `/profile` - User profile page
  - [ ] Display user info, ratings, listed items
  - [ ] API: `GET /api/auth/me`
- [ ] `/profile/edit` - Edit profile page
  - [ ] Update form (name, address, phone, image)
  - [ ] API: `PUT /api/auth/profile`
- [ ] `/users/[id]` - Public user profile
  - [ ] Display user ratings and reviews
  - [ ] API: `GET /api/users/:id/ratings`

## 5. Item Listing Pages
- [ ] `/items` - Browse all items (Home/Explore)
  - [ ] Item grid/list view (shadcn Card)
  - [ ] Pagination (shadcn Pagination)
  - [ ] API: `GET /api/items`
- [ ] `/items/[id]` - Item detail page
  - [ ] Image carousel
  - [ ] Item info, owner info, availability
  - [ ] Borrow request button
  - [ ] API: `GET /api/items/:id`
- [ ] `/items/new` - Create item listing
  - [ ] Form: title, description, category, images, condition
  - [ ] Image upload (shadcn Input type file)
  - [ ] API: `POST /api/items`
- [ ] `/items/[id]/edit` - Edit item page
  - [ ] Pre-filled form
  - [ ] API: `PUT /api/items/:id`
- [ ] `/my-items` - User's listed items
  - [ ] Manage listings (edit/delete)
  - [ ] API: `GET /api/items/my-items`

## 6. Search & Filter
- [ ] Search bar component (shadcn Input)
  - [ ] API: `GET /api/items/search`
- [ ] Filter sidebar/sheet (shadcn Sheet, Select, Slider)
  - [ ] Category filter (shadcn Select)
  - [ ] Location/radius filter (map or input)
  - [ ] Availability toggle (shadcn Switch)
- [ ] Sort dropdown (distance, date, rating)

## 7. Borrow Request System
- [ ] Borrow request modal/dialog (shadcn Dialog)
  - [ ] Date picker for borrow period (shadcn Calendar)
  - [ ] Message to owner (shadcn Textarea)
  - [ ] API: `POST /api/requests`
- [ ] `/requests` - My requests page
  - [ ] Tabs: Sent / Received (shadcn Tabs)
  - [ ] Request cards with status badges (shadcn Badge)
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
  - [ ] Message input (shadcn Input, Button)
  - [ ] API: `GET /api/messages/:conversationId`, `POST /api/messages`
- [ ] Real-time updates (WebSocket or polling)
- [ ] Unread message indicator

## 9. Trust & Safety
- [ ] Rating modal (shadcn Dialog)
  - [ ] Star rating component
  - [ ] Comment textarea
  - [ ] API: `POST /api/ratings`
- [ ] Report modal (shadcn Dialog)
  - [ ] Reason select/textarea
  - [ ] API: `POST /api/reports`
- [ ] Display user ratings on profile (shadcn Avatar, stars)

## 10. Components (shadcn/ui)
- [ ] Button, Input, Textarea, Select
- [ ] Card, Badge, Avatar
- [ ] Dialog, Sheet, Tabs
- [ ] Form (react-hook-form + zod)
- [ ] Calendar, DatePicker
- [ ] Toast/Sonner for notifications
- [ ] Skeleton loaders
- [ ] Dropdown menu (user menu)

## 11. Utilities & Hooks
- [ ] `useAuth` - Authentication hook
- [ ] `useItems` - Fetch items hook
- [ ] `useRequests` - Borrow requests hook
- [ ] `useMessages` - Messaging hook
- [ ] API service functions (lib/api.ts)
- [ ] Type definitions (types/index.ts)

## 12. Testing & Deployment
- [ ] Component tests (Jest/React Testing Library)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Vercel deployment setup
- [ ] Environment variables for production
