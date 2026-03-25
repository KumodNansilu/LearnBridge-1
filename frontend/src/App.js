import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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

// Appointment Module Pages
import AppointmentAuth from './pages/AppointmentModule/AppointmentAuth';
import AppointmentTutorDashboard from './pages/AppointmentModule/AppointmentTutorDashboard';
import AppointmentStudentDashboard from './pages/AppointmentModule/AppointmentStudentDashboard';

// Styles
import './App.css';

function App() {
  return (
    <ThemeProvider>
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

          {/* Appointment Scheduling Module Routes (Mock Auth) */}
          <Route path="/appointments/login" element={<AppointmentAuth />} />
          <Route path="/appointments/tutor" element={<AppointmentTutorDashboard />} />
          <Route path="/appointments/student" element={<AppointmentStudentDashboard />} />

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;

