import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ErrorPages.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-content">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this resource.</p>
        <div className="error-actions">
          <button
            className="error-button primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
          <button
            className="error-button"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
