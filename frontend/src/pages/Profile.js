import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/Profile.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      await updateProfile(formData.name, formData.email);
      setMessage('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (user?.role === 'Student') return '/dashboard/student';
    if (user?.role === 'Tutor') return '/dashboard/tutor';
    if (user?.role === 'Admin') return '/dashboard/admin';
    return '/';
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button
          className="back-button"
          onClick={() => navigate(getDashboardPath())}
        >
          ← Back to Dashboard
        </button>
        <h1>My Profile</h1>
      </div>

      <div className="profile-card">
        <div className="profile-section">
          <div className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="profile-info">
            <div className="info-row">
              <label>Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              ) : (
                <span>{user?.name}</span>
              )}
            </div>

            <div className="info-row">
              <label>Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              ) : (
                <span>{user?.email}</span>
              )}
            </div>

            <div className="info-row">
              <label>Role:</label>
              <span className={`role-badge role-${user?.role.toLowerCase()}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button
                  className="save-button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="cancel-button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                    });
                    setError('');
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="edit-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
