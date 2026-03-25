import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './AppointmentNavbar.css';

const AppointmentNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  
  // Use mock auth as fallback for module independence
  const localApptUser = JSON.parse(localStorage.getItem('appointmentUser') || 'null');
  const currentUser = localApptUser || user;
  const isAuthorized = !!localApptUser || isAuthenticated;

  const handleSignOut = () => {
    if (localApptUser) {
      localStorage.removeItem('appointmentUser');
    }
    if (isAuthenticated) {
      logout();
    }
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname.includes(path) ? 'active' : '';
  };

  return (
    <nav className="appointment-navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <span className="brand-icon">🎓</span> LearnBridge
      </div>
      
      <div className="navbar-links">
        <button className={`nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
          <i className="icon-home"></i> Home
        </button>
        
        {isAuthorized && (
          <>
            <button className={`nav-item ${isActive('/dashboard')}`} onClick={() => navigate(`/dashboard/${currentUser?.role?.toLowerCase()}`)}>
              <i className="icon-dashboard"></i> Dashboard
            </button>
            <button className={`nav-item ${isActive('/appointments')}`} onClick={() => navigate(`/appointments/${currentUser?.role?.toLowerCase()}`)}>
              <i className="icon-calendar"></i> Schedule / Sessions
            </button>
            <button className={`nav-item ${isActive('/messages')}`} onClick={() => navigate('/messages')}>
              <i className="icon-envelope"></i> Messages
            </button>
            <button className={`nav-item ${isActive('/profile')}`} onClick={() => navigate('/profile')}>
              <i className="icon-user"></i> Profile
            </button>
          </>
        )}
      </div>

      <div className="navbar-auth">
        {!isAuthorized ? (
          <button className="btn-signin" onClick={() => navigate('/login')}>Sign In</button>
        ) : (
          <button className="btn-signout" onClick={handleSignOut}>Sign Out</button>
        )}
      </div>
    </nav>
  );
};

export default AppointmentNavbar;
