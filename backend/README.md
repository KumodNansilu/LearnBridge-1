# LearnBridge Backend API

A comprehensive backend API for the LearnBridge learning management system.

## Features

- User Authentication with JWT
- Role-based Access Control (Student, Tutor, Admin)
- User Profile Management
- Password Hashing with bcryptjs
- MongoDB Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas connection)
- npm or yarn

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
     ```
     MONGO_URI=mongodb://localhost:27017/learnbridge
     JWT_SECRET=your_jwt_secret_key_here_change_in_production
     PORT=5000
     NODE_ENV=development
     ```

## Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register User
- **POST** `/api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Student"
  }
  ```
- **Returns:** User data and JWT token

#### Login User
- **POST** `/api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Returns:** User data and JWT token

#### Get Profile (Protected)
- **GET** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** User profile data

#### Update Profile (Protected)
- **PUT** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- **Returns:** Updated user data

## Middleware

### Protect Middleware
Verifies JWT token and attaches user to request object.

```javascript
const { protect } = require('./middleware/authMiddleware');
router.get('/protected-route', protect, controller);
```

### Authorize Middleware
Checks user role for route access.

```javascript
const { authorize } = require('./middleware/authMiddleware');
router.delete('/admin-route', protect, authorize('Admin'), controller);
```

## User Roles

- **Student**: Access to study materials, Q&A, mock exams, appointments
- **Tutor**: Can upload materials, answer questions, create exams, manage appointments
- **Admin**: Full system access for management and configuration

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['Student', 'Tutor', 'Admin'], default: 'Student'),
  timestamps: true
}
```

## Error Handling

All API errors return consistent JSON responses:

```json
{
  "message": "Error description"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT implementation
- `bcryptjs` - Password hashing
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables

## Development Dependencies

- `nodemon` - Auto-restart server during development

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Usage logging
- [ ] API rate limiting
