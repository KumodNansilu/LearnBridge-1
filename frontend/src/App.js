import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import TutorDashboard from './pages/dashboards/TutorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import Unauthorized from './pages/Unauthorized';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Private Routes - Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute requiredRole="Student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/tutor"
            element={
              <ProtectedRoute requiredRole="Tutor">
                <TutorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

