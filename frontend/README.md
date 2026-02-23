# LearnBridge Frontend

A modern React-based frontend for the LearnBridge learning management system with role-based dashboards.

## Features

- User Authentication (Registration & Login)
- JWT Token Management
- Role-based Dashboards (Student, Tutor, Admin)
- Profile Management
- Protected Routes
- Responsive Design
- Modern UI with Gradient Themes

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

## Running the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   └── Common/
│       └── ProtectedRoute.js      # Route protection component
├── context/
│   └── AuthContext.js              # Authentication context
├── hooks/
│   └── useAuth.js                  # Custom hook for auth
├── pages/
│   ├── Home.js                     # Landing page
│   ├── Login.js                    # Login page
│   ├── Register.js                 # Registration page
│   ├── Profile.js                  # User profile page
│   ├── Unauthorized.js             # 403 error page
│   └── dashboards/
│       ├── StudentDashboard.js     # Student dashboard
│       ├── TutorDashboard.js       # Tutor dashboard
│       └── AdminDashboard.js       # Admin dashboard
├── styles/
│   ├── AuthPages.css               # Auth pages styling
│   ├── Dashboard.css               # Dashboard styling
│   ├── Profile.css                 # Profile page styling
│   ├── Home.css                    # Home page styling
│   └── ErrorPages.css              # Error pages styling
├── App.js                          # Main app component with routing
├── App.css                         # Global styles
└── index.js                        # Entry point
```

## Authentication Flow

1. **Register**: New users create account with name, email, password, and role selection
2. **Login**: Users authenticate with email and password
3. **Token Storage**: JWT token stored in localStorage
4. **Protected Routes**: Routes check authentication and user role
5. **Auto-redirect**: Redirect to appropriate dashboard based on user role

## Available Routes

### Public Routes
- `/` - Home/Landing page
- `/login` - Login page
- `/register` - Registration page
- `/unauthorized` - 403 Access Denied page

### Protected Routes
- `/profile` - User profile page (all authenticated users)
- `/dashboard/student` - Student dashboard
- `/dashboard/tutor` - Tutor dashboard
- `/dashboard/admin` - Admin dashboard

## User Roles & Dashboards

### Student Dashboard
- View study materials
- Manage study plans
- Ask academic questions
- Take mock exams
- Schedule tutor appointments
- Track learning progress

### Tutor Dashboard
- Upload study materials
- Answer student questions
- Create mock exams
- Manage appointment requests
- View student information
- View tutoring statistics

### Admin Dashboard
- Manage all users
- Manage subjects and topics
- View system analytics
- Configure system settings
- View audit logs
- System administration

## API Integration

The app communicates with backend API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## Available Scripts

### `npm start`
Runs the app in development mode

### `npm test`
Launches the test runner

### `npm run build`
Builds the app for production

## Dependencies

- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing library


If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
