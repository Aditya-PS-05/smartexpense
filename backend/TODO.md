# Backend TODO - Neighborhood Lending Library

## 1. Project Setup ✅
- [x] Initialize Node.js/Express project
- [x] Set up database (MongoDB)
- [x] Configure environment variables
- [x] Set up project structure (routes, controllers, models, middleware)

## 2. User Registration & Authentication ✅
- [x] User model (name, email, password, address, phone, profile image)
- [x] POST `/api/auth/register` - User signup
- [x] POST `/api/auth/login` - User login with JWT
- [x] GET `/api/auth/me` - Get current user profile
- [x] PUT `/api/auth/profile` - Update user profile
- [x] Implement password hashing (bcrypt)
- [x] JWT middleware for protected routes

## 3. Item Management (CRUD) ✅
- [x] Item model (title, description, category, images, condition, availability, location, owner)
- [x] POST `/api/items` - Create new item listing
- [x] GET `/api/items` - Get all items (with pagination)
- [x] GET `/api/items/:id` - Get single item details
- [x] PUT `/api/items/:id` - Update item (owner only)
- [x] DELETE `/api/items/:id` - Delete item (owner only)
- [x] GET `/api/items/my-items` - Get current user's listed items

## 4. Search & Filter ✅
- [x] GET `/api/items/search` - Search items by keyword
- [x] Filter by category
- [x] Filter by geographical location/radius (geospatial queries)
- [x] Filter by availability status
- [x] Sort by distance, date added, rating

## 5. Borrow Request System ✅
- [x] BorrowRequest model (item, borrower, lender, status, dates, pickup details)
- [x] POST `/api/requests` - Create borrow request
- [x] GET `/api/requests` - Get user's requests (sent & received)
- [x] PUT `/api/requests/:id/approve` - Approve request
- [x] PUT `/api/requests/:id/reject` - Reject request
- [x] PUT `/api/requests/:id/complete` - Mark as returned
- [x] PUT `/api/requests/:id/cancel` - Cancel request

## 6. Messaging System ✅
- [x] Message/Conversation model
- [x] POST `/api/messages` - Send message
- [x] GET `/api/messages/:conversationId` - Get conversation messages
- [x] GET `/api/conversations` - Get user's conversations
- [ ] WebSocket support for real-time messaging (optional - future enhancement)

## 7. Trust & Safety (Ratings/Reports) ✅
- [x] Rating model (rater, rated user, item, score, comment)
- [x] POST `/api/ratings` - Submit rating after transaction
- [x] GET `/api/users/:id/ratings` - Get user's ratings
- [x] Report model (reporter, reported user/item, reason, status)
- [x] POST `/api/reports` - Submit report
- [x] Admin endpoints to review reports

## 8. Middleware & Utilities ✅
- [x] Authentication middleware
- [x] Error handling middleware
- [x] Input validation
- [x] File upload for images (Multer)
- [x] Rate limiting

## 9. Testing & Deployment
- [ ] Write unit tests for critical endpoints
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Docker setup
- [ ] CI/CD pipeline
