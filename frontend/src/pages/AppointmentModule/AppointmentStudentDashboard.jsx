import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AppointmentNavbar from '../../components/AppointmentNavbar/AppointmentNavbar';
import './AppointmentModule.css';

const AppointmentStudentDashboard = () => {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({ faculty: '', degree: '', year: '', semester: '', subject: '' });
  const [subjects, setSubjects] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedSessionDetail, setSelectedSessionDetail] = useState(null);
  
  // Feedback state
  const [feedbackSessionId, setFeedbackSessionId] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comments: '' });

  // Search feature state
  const [subjectSearch, setSubjectSearch] = useState('');

  const navigate = useNavigate();
  const { user: globalUser, isAuthenticated } = useAuth();
  
  // Use mock auth first, fallback to global user
  const localApptUser = JSON.parse(localStorage.getItem('appointmentUser') || 'null');
  const studentUser = localApptUser || (globalUser ? { id: globalUser._id, name: globalUser.name, role: globalUser.role?.toLowerCase() } : {});
  const isAuthorized = !!localApptUser || isAuthenticated;

  useEffect(() => {
    if (!isAuthorized || studentUser.role !== 'student') {
      navigate('/appointments/login');
      return;
    }
    fetchMyBookings();
  }, [isAuthorized, navigate]);

  const fetchMyBookings = async () => {
    try {
      const res = await fetch(`http://localhost:5005/api/appointments/bookings/student/${studentUser.id}`);
      const data = await res.json();
      if(data.bookings) {
        const now = new Date();
        const futureBookings = data.bookings.filter(b => {
          if (!b.session || !b.session.date || !b.session.startTime) return false;
          const sessionDateTime = new Date(`${b.session.date}T${b.session.startTime}:00`);
          return sessionDateTime >= now;
        });
        setMyBookings(futureBookings);
      }
    } catch(err) { console.error(err); }
  };

  const handleSelection = (field, value) => {
    const newSel = { ...selections, [field]: value };
    // reset depending on step
    if(field === 'faculty') { newSel.degree = ''; newSel.year = ''; newSel.semester = ''; newSel.subject = ''; }
    if(field === 'degree') { newSel.year = ''; newSel.semester = ''; newSel.subject = ''; }
    if(field === 'year') { newSel.semester = ''; newSel.subject = ''; }
    if(field === 'semester') { newSel.subject = ''; }

    setSelections(newSel);
    
    // Auto advance steps if fully provided or if simple click
    if(field === 'semester') {
      fetchSubjects(newSel);
    }
  };

  const fetchSubjects = async (sel) => {
    try {
      // Dummy params based on requirements
      const query = new URLSearchParams(sel).toString();
      const res = await fetch(`http://localhost:5005/api/appointments/subjects?${query}`);
      const data = await res.json();
      setSubjects(data.subjects || []);
      setStep(5);
    } catch(err) { console.error(err); }
  };

  const handleSubjectSelect = async (subject) => {
    setSelections({ ...selections, subject });
    setStep(6);
    try {
      const res = await fetch(`http://localhost:5005/api/appointments/sessions?subject=${encodeURIComponent(subject)}`);
      const data = await res.json();
      setAvailableSessions(data.sessions || []);
    } catch(err) { console.error(err); }
  };

  const handleBookSession = async (sessionId) => {
    try {
      const res = await fetch('http://localhost:5005/api/appointments/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, studentId: studentUser.id })
      });
      if(res.ok) {
        alert('Booking confirmed!');
        fetchMyBookings();
        handleSubjectSelect(selections.subject); // refresh sessions capacity
      } else {
        alert((await res.json()).message);
      }
    } catch(err) { console.error(err); }
  };

  const handleCancelBooking = async (bookingId) => {
    if(!window.confirm('Cancel this booking?')) return;
    try {
      const res = await fetch(`http://localhost:5005/api/appointments/bookings/${bookingId}/cancel`, { method: 'PUT' });
      if(res.ok) fetchMyBookings();
      else alert((await res.json()).message);
    } catch(err) { console.error(err); }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    const b = myBookings.find(bk => bk.id === feedbackSessionId);
    if(!b) return;
    try {
      const res = await fetch('http://localhost:5005/api/appointments/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: b.sessionId,
          studentId: studentUser.id,
          tutorId: b.session?.tutor?.id,
          rating: feedbackData.rating,
          comments: feedbackData.comments
        })
      });
      if(res.ok) {
        alert('Feedback submitted!');
        setFeedbackSessionId(null);
        setFeedbackData({ rating: 5, comments: '' });
      } else {
        alert((await res.json()).message);
      }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="appointment-module-container" style={{ padding: 0 }}>
      <AppointmentNavbar />
      
      <div style={{ padding: '0 40px 40px' }}>
        <h1 style={{ color: 'var(--appt-text, #142848)', marginBottom: '30px' }}>Student Dashboard - {studentUser.name}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '30px' }}>
        
        {/* Left Column: Booking Flow */}
        <div className="appointment-card" style={{ margin: 0, maxWidth: '100%' }}>
          <h3 style={{ borderBottom: '2px solid #feead0', paddingBottom: '10px' }}>Find a Tutor</h3>
          
          {step <= 4 && (
            <div>
              <div className="form-group">
                <label>Step 1: Select Faculty</label>
                <select className="form-control" value={selections.faculty} onChange={e => handleSelection('faculty', e.target.value)}>
                  <option value="">-- Choose --</option>
                  <option value="Computing">Computing</option>
                  <option value="Business">Business</option>
                  <option value="Engineering">Engineering</option>
                </select>
              </div>

              {selections.faculty === 'Computing' && (
                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Step 2: Select Degree Program</label>
                  <select className="form-control" value={selections.degree} onChange={e => handleSelection('degree', e.target.value)}>
                    <option value="">-- Choose --</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Interactive Media">Interactive Media</option>
                  </select>
                </div>
              )}

              {selections.degree && (
                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Step 3: Select Year</label>
                  <select className="form-control" value={selections.year} onChange={e => handleSelection('year', e.target.value)}>
                    <option value="">-- Choose --</option>
                    <option value="Year 1">Year 1</option><option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option><option value="Year 4">Year 4</option>
                  </select>
                </div>
              )}

              {selections.year && (
                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Step 4: Select Semester</label>
                  <select className="form-control" value={selections.semester} onChange={e => handleSelection('semester', e.target.value)}>
                    <option value="">-- Choose --</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {step >= 5 && (
            <div>
              <button className="btn-secondary" style={{ marginBottom: '15px' }} onClick={() => setStep(4)}>⬅ Back to Filters</button>
              
              {step === 5 && (
                <>
                  <label style={{ fontWeight: 'bold' }}>Step 5: Display Subjects Dynamically</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search subjects..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    style={{ marginTop: '10px', marginBottom: '10px' }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                    {subjects.filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase())).map(sub => (
                      <button key={sub} className="btn-secondary" style={{ backgroundColor: '#fff', border: '1px solid #142848' }} onClick={() => handleSubjectSelect(sub)}>
                        {sub}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 6 && (
                <>
                  <h4 style={{ marginTop: '20px' }}>Step 6 & 7: Available Time Slots for {selections.subject}</h4>
                  {selectedSessionDetail && (
                    <div className="appointment-card" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#e9f2ff', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 8px 0' }}>Selected Session</h5>
                      <p style={{ margin: '2px 0' }}><strong>{selectedSessionDetail.moduleNameAndCode}</strong></p>
                      <p style={{ margin: '2px 0' }}>Lesson: {selectedSessionDetail.lessonName}</p>
                      <p style={{ margin: '2px 0' }}>Tutor: {selectedSessionDetail.tutor?.name || 'N/A'}</p>
                      <p style={{ margin: '2px 0' }}>Date: {selectedSessionDetail.date} | Time: {selectedSessionDetail.startTime}</p>
                      <p style={{ margin: '2px 0' }}>Slots: {selectedSessionDetail.capacity > 0 ? selectedSessionDetail.capacity : 'Fully booked'}</p>
                      <button className="btn-secondary" onClick={() => setSelectedSessionDetail(null)} style={{ marginTop: '8px' }}>Clear</button>
                    </div>
                  )}
                  {availableSessions.length === 0 ? <p>No available slots found.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                      {availableSessions.map(sess => (
                        <div key={sess.id} className="session-card" style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <div>
                            <strong style={{ display: 'block', fontSize: '1.1rem' }}>{sess.tutor?.name}</strong>
                            <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#555' }}>Subject: {sess.subject || 'N/A'}</p>
                            <span className="star-rating">⭐ {parseFloat(sess.tutorRating).toFixed(1)} Rating</span>
                            <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#555' }}>📅 {sess.date} ⏰ {sess.startTime} - {sess.endTime}</p>
                            <span className="badge" style={{ backgroundColor: sess.capacity > 0 ? '#feead0' : '#f8d7da', color: sess.capacity > 0 ? '#142848' : '#721c24' }}>
                              {sess.capacity > 0 ? `Slots left: ${sess.capacity}` : 'Fully Booked'}
                            </span>
                          </div>
                          <div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-primary"
                              onClick={() => handleBookSession(sess.id)}
                              disabled={sess.capacity <= 0}
                              style={{ opacity: sess.capacity <= 0 ? 0.5 : 1, cursor: sess.capacity <= 0 ? 'not-allowed' : 'pointer', flex: 1 }}
                            >
                              Book
                            </button>
                            <button
                              className="btn-secondary"
                              onClick={() => setSelectedSessionDetail(sess)}
                              style={{ flex: 1 }}
                            >
                              View
                            </button>
                          </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Manage Bookings & Feedback */}
        <div>
          <div className="appointment-card" style={{ margin: 0, maxWidth: '100%' }}>
            <h3 style={{ borderBottom: '2px solid #feead0', paddingBottom: '10px' }}>My Upcoming Bookings ({myBookings.length})</h3>
            {myBookings.length === 0 ? <p>No bookings yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {myBookings.map(b => (
                  <div key={b.id} className="session-card" style={{ padding: '15px', borderLeft: b.status === 'Cancelled' ? '4px solid #dc3545' : '4px solid #28a745' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong>{b.session?.subject}</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>Tutor: {b.session?.tutor?.name}</p>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>📅 {b.session?.date} | ⏰ {b.session?.startTime}</p>
                        <span className="badge" style={{ marginTop: '5px', display: 'inline-block', backgroundColor: b.status === 'Cancelled' ? '#f8d7da' : '#d4edda', color: b.status === 'Cancelled' ? '#721c24' : '#155724' }}>
                          {b.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {b.status === 'Confirmed' && (
                          <>
                            <button className="btn-danger" style={{ padding: '6px 10px', fontSize: '0.85rem' }} onClick={() => handleCancelBooking(b.id)}>Cancel</button>
                            <button className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.85rem' }} onClick={() => setFeedbackSessionId(b.id)}>Give Feedback</button>
                          </>
                        )}
                        {b.session?.meetingLink && b.status === 'Confirmed' && (
                          <a href={b.session.meetingLink} target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '6px 10px', fontSize: '0.85rem', textAlign: 'center', textDecoration: 'none' }}>Join Link</a>
                        )}
                      </div>
                    </div>

                    {/* Feedback Form below booking */}
                    {feedbackSessionId === b.id && (
                      <form onSubmit={submitFeedback} style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Rate this Session</h4>
                        <div className="form-group">
                          <label>Rating (1-5)</label>
                          <input type="number" min="1" max="5" className="form-control" value={feedbackData.rating} onChange={e => setFeedbackData({...feedbackData, rating: Number(e.target.value)})} required />
                        </div>
                        <div className="form-group">
                          <label>Comments</label>
                          <textarea className="form-control" value={feedbackData.comments} onChange={e => setFeedbackData({...feedbackData, comments: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" className="btn-primary">Submit</button>
                          <button type="button" className="btn-secondary" onClick={() => setFeedbackSessionId(null)}>Cancel</button>
                        </div>
                      </form>
                    )}
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

export default AppointmentStudentDashboard;
