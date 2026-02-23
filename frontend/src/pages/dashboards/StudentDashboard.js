import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <h2>LearnBridge - Student</h2>
        </div>
        <div className="navbar-menu">
          <button
            className="nav-button"
            onClick={() => navigate('/profile')}
          >
            Profile
          </button>
          <button
            className="nav-button logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {user?.name}! 👋</h1>
          <p>You are logged in as a <strong>Student</strong></p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Study Materials</h3>
            <p>Access and download study materials</p>
            <button className="card-button">View Materials</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Study Planner</h3>
            <p>Create and manage study plans</p>
            <button className="card-button">Open Planner</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">❓</div>
            <h3>Ask Questions</h3>
            <p>Get help from tutors and peers</p>
            <button className="card-button">Ask Now</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🧪</div>
            <h3>Mock Exams</h3>
            <p>Practice with mock MCQ exams</p>
            <button className="card-button">Take Exam</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Appointments</h3>
            <p>Schedule sessions with tutors</p>
            <button className="card-button">Book Session</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your learning progress</p>
            <button className="card-button">View Progress</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
