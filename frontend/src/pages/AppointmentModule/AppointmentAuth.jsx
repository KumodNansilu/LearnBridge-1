import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppointmentModule.css';

const AppointmentAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'student' });
  const navigate = useNavigate();

  const handleMockLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5005/api/appointments/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || 'Test User',
          email: formData.email,
          role: formData.role
        })
      });
      const data = await response.json();
      if(response.ok) {
        localStorage.setItem('appointmentUser', JSON.stringify(data.user));
        if (data.user.role === 'tutor') {
           navigate('/appointments/tutor');
        } else {
           navigate('/appointments/student');
        }
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error logging in. Make sure backend is running.');
    }
  };

  return (
    <div className="appointment-module-container">
      <div className="appointment-card" style={{ marginTop: '10vh' }}>
        <h2 className="appointment-header">LearnBridge Appointments</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          Mock Authentication for the Appointment Scheduling Module
        </p>

        <form onSubmit={handleMockLogin}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="E.g. Dr. Smith"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required={!isLogin}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="user@example.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select 
              className="form-control"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            {isLogin ? 'Login to Appointments' : 'Register for Appointments'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            className="btn-secondary" 
            style={{ width: '100%' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Switch to Register' : 'Already have an account? Login here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentAuth;
