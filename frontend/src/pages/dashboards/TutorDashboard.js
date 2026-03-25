import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const TutorDashboard = () => {
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
          <h2>LearnBridge - Tutor</h2>
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
          <p>You are logged in as a <strong>Tutor</strong></p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Upload Materials</h3>
            <p>Create and upload study materials</p>
            <button className="card-button">Upload Material</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">❓</div>
            <h3>Answer Questions</h3>
            <p>Respond to student questions</p>
            <button className="card-button">View Questions</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🧪</div>
            <h3>Create Exams</h3>
            <p>Create MCQ mock exams</p>
            <button className="card-button">Create Exam</button>
          </div>

          <div className="dashboard-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/appointments/tutor')}>
            <div className="card-icon">📅</div>
            <h3>Appointments</h3>
            <p>Manage student session requests</p>
            <button className="card-button" onClick={(e) => { e.stopPropagation(); navigate('/appointments/tutor'); }}>View Appointments</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>My Students</h3>
            <p>View and track your students</p>
            <button className="card-button">View Students</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Statistics</h3>
            <p>View tutoring statistics</p>
            <button className="card-button">View Stats</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
