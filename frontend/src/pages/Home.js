import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(`/dashboard/${user.role.toLowerCase()}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="navbar-logo">LearnBridge</div>
        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <button
                className="nav-link"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                className="nav-button"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              className="nav-button"
              onClick={() => navigate(`/dashboard/${user.role.toLowerCase()}`)}
            >
              Dashboard
            </button>
          )}
        </div>
      </nav>

      <div className="hero-section">
        <h1>Welcome to LearnBridge</h1>
        <p>Your comprehensive learning platform for student success</p>
        <button className="cta-button" onClick={handleGetStarted}>
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </button>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Study Materials</h3>
            <p>Access comprehensive study materials organized by subject and topic</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Study Planner</h3>
            <p>Create and manage personalized study plans with daily goals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❓</div>
            <h3>Q&A Support</h3>
            <p>Ask questions and get answers from tutors and peers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>Mock Exams</h3>
            <p>Practice with auto-marked MCQ exams and get instant feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Appointments</h3>
            <p>Schedule one-on-one study sessions with experienced tutors</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>Monitor your learning journey with detailed progress analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
