import React, { useState } from 'react';
import AppointmentNavbar from '../../components/AppointmentNavbar/AppointmentNavbar';
import './StandaloneBookingForm.css';

const StandaloneBookingForm = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    tutorName: '',
    date: '',
    time: '',
    subject: '',
    notes: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus('');
  };

  const handleBook = (e) => {
    e.preventDefault();
    // Simulate backend booking logic
    setStatus('success');
    alert('Appointment officially booked with ' + formData.tutorName + '!');
    setFormData({ studentName: '', tutorName: '', date: '', time: '', subject: '', notes: '' });
  };

  return (
    <div className="standalone-booking-layout">
      <AppointmentNavbar />
      
      <div className="booking-form-wrapper">
        <div className="booking-card">
          <div className="booking-header">
            <h2>Book an Appointment</h2>
            <p>Fill out the details below to schedule your upcoming session.</p>
          </div>

          <form onSubmit={handleBook} className="modern-booking-form">
            <div className="form-row">
              <div className={`input-group ${formData.studentName ? 'has-value' : ''}`}>
                <label>👤 Student Name</label>
                <input 
                  type="text" 
                  name="studentName" 
                  required 
                  placeholder="Enter your full name"
                  value={formData.studentName} 
                  onChange={handleChange} 
                />
              </div>

              <div className={`input-group ${formData.tutorName ? 'has-value' : ''}`}>
                <label>🎓 Tutor Name</label>
                <input 
                  type="text" 
                  name="tutorName" 
                  required 
                  placeholder="Enter tutor's full name"
                  value={formData.tutorName} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className={`input-group ${formData.date ? 'has-value' : ''}`}>
                <label>📅 Date</label>
                <input 
                  type="date" 
                  name="date" 
                  required 
                  value={formData.date} 
                  onChange={handleChange} 
                />
              </div>

              <div className={`input-group ${formData.time ? 'has-value' : ''}`}>
                <label>⏰ Time</label>
                <input 
                  type="time" 
                  name="time" 
                  required 
                  value={formData.time} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className={`input-group ${formData.subject ? 'has-value' : ''}`}>
              <label>📚 Subject / Topic</label>
              <input 
                type="text" 
                name="subject" 
                required 
                placeholder="E.g., Intro to Machine Learning"
                value={formData.subject} 
                onChange={handleChange} 
              />
            </div>

            <div className={`input-group ${formData.notes ? 'has-value' : ''}`}>
              <label>📝 Additional Notes (Optional)</label>
              <textarea 
                name="notes" 
                rows="4" 
                placeholder="What would you like to cover during this session?"
                value={formData.notes} 
                onChange={handleChange} 
              />
            </div>

            {status === 'success' && (
              <div className="status-badge success-badge">
                ✅ Appointment Scheduled Successfully!
              </div>
            )}

            <button type="submit" className="booking-submit-btn">
              <span>Book Appointment</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StandaloneBookingForm;
