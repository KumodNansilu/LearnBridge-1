import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AppointmentNavbar from '../../components/AppointmentNavbar/AppointmentNavbar';
import './AppointmentModule.css';

const AppointmentTutorDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [formData, setFormData] = useState({
    moduleNameAndCode: '', lessonName: '', subject: '', lessonImage: null, date: '', startTime: '', capacity: 1, meetingLink: ''
  });
  const [editSessionId, setEditSessionId] = useState(null);
  const [editData, setEditData] = useState({moduleNameAndCode: '', lessonName: '', date: '', startTime: '', capacity: 1, meetingLink: ''});
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  
  const navigate = useNavigate();
  const { user: globalUser, isAuthenticated } = useAuth();
  
  // Use mock auth first, fallback to global user
  const localApptUser = JSON.parse(localStorage.getItem('appointmentUser') || 'null');
  const tutorUser = localApptUser || (globalUser ? { id: globalUser._id, name: globalUser.name, role: globalUser.role?.toLowerCase() } : {});
  const isAuthorized = !!localApptUser || isAuthenticated;

  useEffect(() => {
    if (!isAuthorized || tutorUser.role !== 'tutor') {
      navigate('/appointments/login');
      return;
    }
    fetchSessions();
    fetchFeedback();
  }, [isAuthorized, navigate]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`http://localhost:5005/api/appointments/sessions/tutor/${tutorUser.id}`);
      const data = await res.json();
      if(data.sessions) setSessions(data.sessions);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`http://localhost:5005/api/appointments/feedback/tutor/${tutorUser.id}`);
      const data = await res.json();
      if(data.feedback) {
        setFeedback(data.feedback);
        setAvgRating(data.averageRating);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (!tutorUser.id) {
        alert('Error: Tutor ID is missing. Please log in again.');
        return;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append('moduleNameAndCode', formData.moduleNameAndCode);
      formDataToSend.append('lessonName', formData.lessonName);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('startTime', formData.startTime);
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('meetingLink', formData.meetingLink);
      formDataToSend.append('tutorId', tutorUser.id);
      if (formData.lessonImage) {
        formDataToSend.append('lessonImage', formData.lessonImage);
      }

      const res = await fetch('http://localhost:5005/api/appointments/sessions', {
        method: 'POST',
        body: formDataToSend
      });
      
      if (res.ok) {
        alert('Session published successfully!');
        fetchSessions();
        setFormData({ moduleNameAndCode: '', lessonName: '', lessonImage: null, date: '', startTime: '', capacity: 1, meetingLink: '' });
        setImagePreview(null);
        setErrors({});
      } else {
        const errData = await res.json();
        alert('Failed to publish session: ' + (errData.message || JSON.stringify(errData.error)));
        console.error('Server error details:', errData);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while publishing. Is the backend running?');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.moduleNameAndCode.trim()) newErrors.moduleNameAndCode = 'Module Name & Code is required';
    if (!formData.lessonName.trim()) newErrors.lessonName = 'Lesson Name is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.date) newErrors.date = 'Session Date is required';
    else if (new Date(formData.date) < new Date().setHours(0,0,0,0)) newErrors.date = 'Cannot select past dates';
    if (!formData.startTime) newErrors.startTime = 'Session Time is required';
    else if (formData.date === new Date().toISOString().split('T')[0] && formData.startTime <= new Date().toTimeString().slice(0,5)) newErrors.startTime = 'Cannot select past time for today';
    if (formData.capacity < 1 || formData.capacity > 100) newErrors.capacity = 'Capacity must be between 1 and 100';
    if (!formData.meetingLink.trim()) newErrors.meetingLink = 'Meeting Link is required';
    else if (!/^https?:\/\/.+/.test(formData.meetingLink)) newErrors.meetingLink = 'Must be a valid URL';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, lessonImage: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert('Please select a valid image file (jpg/png)');
    }
  };

  const handleDeleteSession = async (id) => {
    if(!window.confirm('Delete this session?')) return;
    try {
      const res = await fetch(`http://localhost:5005/api/appointments/sessions/${id}`, { method: 'DELETE' });
      if(res.ok) {
        if (selectedSessionId === id) setSelectedSessionId(null);
        fetchSessions();
      } else alert((await res.json()).message);
    } catch (err) {
      console.error(err);
    }
  };

  const isFutureSession = (session) => {
    const dateTime = new Date(`${session.date}T${session.startTime}:00`);
    return dateTime >= new Date();
  };

  const startEditSession = (session) => {
    setEditSessionId(session.id);
    setEditData({
      moduleNameAndCode: session.moduleNameAndCode || '',
      lessonName: session.lessonName || '',
      subject: session.subject || '',
      date: session.date || '',
      startTime: session.startTime || '',
      capacity: session.capacity || 1,
      meetingLink: session.meetingLink || ''
    });
  };

  const cancelEdit = () => {
    setEditSessionId(null);
    setEditData({ moduleNameAndCode: '', lessonName: '', subject: '', date: '', startTime: '', capacity: 1, meetingLink: '' });
  };

  const saveEditSession = async (id) => {
    try {
      const updatePayload = {
        moduleNameAndCode: editData.moduleNameAndCode,
        lessonName: editData.lessonName,
        subject: editData.subject || '',
        date: editData.date,
        startTime: editData.startTime,
        capacity: editData.capacity,
        meetingLink: editData.meetingLink
      };
      const res = await fetch(`http://localhost:5005/api/appointments/sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });
      if (res.ok) {
        alert('Session updated successfully.');
        setEditSessionId(null);
        setSelectedSessionId(null);
        fetchSessions();
      } else {
        const errData = await res.json();
        alert('Update failed: ' + (errData.message || JSON.stringify(errData.error)));
      }
    } catch (err) {
      console.error(err);
      alert('Network error while updating session.');
    }
  };

  return (
    <div className="appointment-module-container" style={{ padding: 0 }}>
      <style>
        {`
          @media (max-width: 768px) {
            .appointment-module-container .grid-container {
              grid-template-columns: 1fr !important;
            }
            .appointment-module-container form {
              gap: 10px !important;
            }
            .appointment-module-container .form-group input {
              padding: 8px !important;
            }
          }
        `}
      </style>
      <AppointmentNavbar />
      
      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: 'var(--appt-text, #142848)' }}>Tutor Dashboard - {tutorUser.name}</h1>
          <span className="badge" style={{ fontSize: '1.1rem', backgroundColor: 'var(--bg-card, #ffffff)' }}>⭐ {avgRating} Rating</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px' }} className="grid-container">
        {/* Left Col: Create Session Form */}
        <div>
          <div className="appointment-card" style={{ margin: 0, backgroundColor: '#feead0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '#142848' }}>📅 Add New Session</h3>
            <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#142848' }}>📚 Module Name & Code *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.moduleNameAndCode}
                  onChange={e => setFormData({...formData, moduleNameAndCode: e.target.value})}
                  placeholder="e.g. IT Project Management (IT3040)"
                  style={{ borderRadius: '5px', border: '1px solid #142848', padding: '10px' }}
                />
                {errors.moduleNameAndCode && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.moduleNameAndCode}</span>}
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#142848' }}>📖 Lesson Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.lessonName}
                  onChange={e => setFormData({...formData, lessonName: e.target.value})}
                  placeholder="e.g. Introduction to Agile Methodology"
                  style={{ borderRadius: '5px', border: '1px solid #142848', padding: '10px' }}
                />
                {errors.lessonName && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.lessonName}</span>}
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#142848' }}>🖼️ Lesson Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ borderRadius: '5px', border: '1px solid #142848', padding: '10px' }}
                />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', marginTop: '10px', borderRadius: '5px' }} />}
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#142848' }}>� Subject *</label>
                <select
                  className="form-control"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  style={{ borderRadius: '5px', border: '1px solid #142848', padding: '10px' }}
                >
                  <option value="">-- Choose subject --</option>
                  <option>Industry Placement</option>
                  <option>Employability Skills Development</option>
                  <option>IT Project Management</option>
                  <option>Programming Applications and Frameworks</option>
                  <option>Database Systems</option>
                  <option>Network Design and Management</option>
                </select>
                {errors.subject && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.subject}</span>}
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#142848' }}>�📅 Session Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ borderRadius: '5px', border: '1px solid #142848', padding: '10px' }}
                />
                {errors.date && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.date}</span>}
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#142848' }}>⏰ Session Time *</label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.startTime}
                  onChange={e => setFormData({...formData, startTime: e.target.value})}
                  style={{ borderRadius: '5px', border: '1px solid #142848', padding: '10px' }}
                />
                {errors.startTime && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.startTime}</span>}
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#142848' }}>👥 Student Capacity *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="form-control"
                  value={formData.capacity}
                  onChange={e => setFormData({...formData, capacity: e.target.value})}
                  style={{ borderRadius: '5px', border: '1px solid #142848', padding: '10px' }}
                />
                {errors.capacity && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.capacity}</span>}
              </div>
              <div className="form-group">
                <label style={{ fontWeight: 'bold', color: '#142848' }}>🔗 Meeting Link *</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.meetingLink}
                  onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                  placeholder="https://zoom.us/..."
                  style={{ borderRadius: '5px', border: '1px solid #142848', padding: '10px' }}
                />
                {errors.meetingLink && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.meetingLink}</span>}
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button type="submit" style={{ backgroundColor: '#142848', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Add Session</button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Col: Sessions & Feedback List */}
        <div>
          <div className="appointment-card" style={{ margin: 0, maxWidth: '100%' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #feead0', paddingBottom: '10px', color: '#142848', fontSize: '1.3rem' }}>📅 Upcoming Sessions</h3>
            {sessions.filter(isFutureSession).length === 0 ? <p style={{ textAlign: 'center', color: '#999' }}>No upcoming sessions scheduled yet.</p> : (
              <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {sessions.filter(isFutureSession).map(s => (
                  <div key={s.id} style={{ borderRadius: '12px', boxShadow: '0 6px 16px rgba(0,0,0,0.12)', backgroundColor: '#fff', border: 'none', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)'; }}>
                    {editSessionId === s.id ? (
                      <div style={{ padding: '18px', backgroundColor: '#f1f7ff' }}>
                        <h4 style={{ marginTop: 0, marginBottom: '12px', color: '#142848' }}>✏️ Edit Session</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <input type="text" value={editData.moduleNameAndCode} onChange={e => setEditData({...editData, moduleNameAndCode: e.target.value})} placeholder="Module Name & Code" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                          <input type="text" value={editData.lessonName} onChange={e => setEditData({...editData, lessonName: e.target.value})} placeholder="Lesson Name" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                          <select value={editData.subject} onChange={e => setEditData({...editData, subject: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                            <option value="">-- Choose subject --</option>
                            <option>Industry Placement</option>
                            <option>Employability Skills Development</option>
                            <option>IT Project Management</option>
                            <option>Programming Applications and Frameworks</option>
                            <option>Database Systems</option>
                            <option>Network Design and Management</option>
                          </select>
                          <input type="date" value={editData.date} onChange={e => setEditData({...editData, date: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                          <input type="time" value={editData.startTime} onChange={e => setEditData({...editData, startTime: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                          <input type="number" min="1" max="100" value={editData.capacity} onChange={e => setEditData({...editData, capacity: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                          <input type="url" value={editData.meetingLink} onChange={e => setEditData({...editData, meetingLink: e.target.value})} placeholder="Meeting Link" style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
                          <button onClick={() => saveEditSession(s.id)} style={{ flex: 1, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Save</button>
                          <button onClick={cancelEdit} style={{ flex: 1, backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ width: '100%', height: '180px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                          {s.lessonImage ? (
                            <img src={`http://localhost:5005/uploads/${s.lessonImage}`} alt="Lesson" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ fontSize: '64px', color: '#feead0' }}>📚</div>
                          )}
                          <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#142848', color: '#feead0', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            {s.capacity - (s.Bookings ? s.Bookings.length : 0)}/{s.capacity}
                          </div>
                        </div>
                        <div style={{ padding: '18px' }}>
                          <h4 style={{ margin: '0 0 6px 0', color: '#142848', fontSize: '1.05rem', fontWeight: 'bold' }}>{s.moduleNameAndCode}</h4>
                          <p style={{ margin: '0 0 14px 0', fontSize: '0.95rem', color: '#666', fontWeight: '500' }}>{s.lessonName}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#555', marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '1.1rem' }}>📅</span><span>{s.date}</span></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ fontSize: '1.1rem' }}>⏰</span><span>{s.startTime}</span></div>
                          </div>
                          {s.meetingLink && (
                            <a href={s.meetingLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', backgroundColor: '#feead0', color: '#142848', border: 'none', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold', textAlign: 'center', textDecoration: 'none', marginBottom: '12px', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5d48a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#feead0'}>
                              🔗 Join Meeting
                            </a>
                          )}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => startEditSession(s)} style={{ flex: 1, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer' }}>✏️ Edit</button>
                            <button onClick={() => handleDeleteSession(s.id)} style={{ flex: 1, backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer' }}>🗑️ Delete</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="appointment-card" style={{ margin: '30px 0 0 0', maxWidth: '100%' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #feead0', paddingBottom: '10px', color: '#142848' }}>⭐ Recent Student Feedback</h3>
            {feedback.length === 0 ? <p>No feedback received yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {feedback.map(f => (
                  <div key={f.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong>{f.student?.name}</strong>
                      <span className="star-rating">{'★'.repeat(f.rating)}{'☆'.repeat(5-f.rating)}</span>
                    </div>
                    <p style={{ margin: 0, color: '#444' }}>{f.comments}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default AppointmentTutorDashboard;
