# Backend TODO - Neighborhood Lending Library

## 1. Project Setup
- [ ] Initialize Node.js/Express project (or preferred framework)
- [ ] Set up database (PostgreSQL/MongoDB)
- [ ] Configure environment variables
- [ ] Set up project structure (routes, controllers, models, middleware)

## 2. User Registration & Verification
- [ ] User model (name, email, password, address, phone, verified status, profile image)
- [ ] POST `/api/auth/register` - User signup
- [ ] POST `/api/auth/login` - User login with JWT
- [ ] POST `/api/auth/verify-email` - Email verification
- [ ] GET `/api/auth/me` - Get current user profile
- [ ] PUT `/api/auth/profile` - Update user profile
- [ ] Implement password hashing (bcrypt)
- [ ] JWT middleware for protected routes

## 3. Item Management (CRUD)
- [ ] Item model (title, description, category, images, condition, availability, location, owner)
- [ ] POST `/api/items` - Create new item listing
- [ ] GET `/api/items` - Get all items (with pagination)
- [ ] GET `/api/items/:id` - Get single item details
- [ ] PUT `/api/items/:id` - Update item (owner only)
- [ ] DELETE `/api/items/:id` - Delete item (owner only)
- [ ] GET `/api/items/my-items` - Get current user's listed items

## 4. Search & Filter
- [ ] GET `/api/items/search` - Search items by keyword
- [ ] Filter by category
- [ ] Filter by geographical location/radius (geospatial queries)
- [ ] Filter by availability status
- [ ] Sort by distance, date added, rating

## 5. Borrow Request System
- [ ] BorrowRequest model (item, borrower, lender, status, dates, pickup details)
- [ ] POST `/api/requests` - Create borrow request
- [ ] GET `/api/requests` - Get user's requests (sent & received)
- [ ] PUT `/api/requests/:id/approve` - Approve request
- [ ] PUT `/api/requests/:id/reject` - Reject request
- [ ] PUT `/api/requests/:id/complete` - Mark as returned

## 6. Messaging System
- [ ] Message/Conversation model
- [ ] POST `/api/messages` - Send message
- [ ] GET `/api/messages/:conversationId` - Get conversation messages
- [ ] GET `/api/conversations` - Get user's conversations
- [ ] WebSocket support for real-time messaging (optional)

## 7. Trust & Safety (Ratings/Reports)
- [ ] Rating model (rater, rated user, item, score, comment)
- [ ] POST `/api/ratings` - Submit rating after transaction
- [ ] GET `/api/users/:id/ratings` - Get user's ratings
- [ ] Report model (reporter, reported user/item, reason, status)
- [ ] POST `/api/reports` - Submit report
- [ ] Admin endpoints to review reports

## 8. Middleware & Utilities
- [ ] Authentication middleware
- [ ] Error handling middleware
- [ ] Input validation (Joi/express-validator)
- [ ] File upload for images (Multer + cloud storage)
- [ ] Rate limiting

## 9. Testing & Deployment
- [ ] Write unit tests for critical endpoints
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Docker setup
- [ ] CI/CD pipeline
