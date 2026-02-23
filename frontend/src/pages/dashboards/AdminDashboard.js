import React from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
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
          <h2>LearnBridge - Admin</h2>
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
          <p>You are logged in as an <strong>Admin</strong></p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>User Management</h3>
            <p>Manage all users and roles</p>
            <button className="card-button">Manage Users</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Subject Management</h3>
            <p>Create and manage subjects</p>
            <button className="card-button">Manage Subjects</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🏷️</div>
            <h3>Topic Management</h3>
            <p>Manage topics and hierarchy</p>
            <button className="card-button">Manage Topics</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Analytics</h3>
            <p>View system analytics and reports</p>
            <button className="card-button">View Analytics</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure system settings</p>
            <button className="card-button">Go to Settings</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Audit Logs</h3>
            <p>View system activity logs</p>
            <button className="card-button">View Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
