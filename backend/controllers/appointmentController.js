const User = require('../models/User.model');
const Session = require('../models/AppointmentSession.model');
const Booking = require('../models/AppointmentBooking.model');
const Feedback = require('../models/AppointmentFeedback.model');

// Subject mockup based on prompt:
const DUMMY_SUBJECTS = {
  Computing: {
    'Information Technology': {
      'Year 3': {
        'Semester 2': [
          'Industry Placement',
          'Employability Skills Development',
          'IT Project Management',
          'Programming Applications and Frameworks',
          'Database Systems',
          'Network Design and Management'
        ]
      }
    }
  }
};

// Map _id to id to keep frontend identical
const formatDoc = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  if(obj.tutor && obj.tutor._id) {
    obj.tutor.id = obj.tutor._id;
    obj.tutor.name = obj.tutor.name;
  }
  if(obj.student && obj.student._id) {
    obj.student.id = obj.student._id;
    obj.student.name = obj.student.name;
  }
  return obj;
}

exports.mockLogin = async (req, res) => {
  try {
    let { name, email, role } = req.body;
    // Format role for Mongoose Enum ['Student', 'Tutor']
    role = role === 'student' ? 'Student' : 'Tutor';
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name: name || 'Test User', email, role, password: 'mockpassword123' });
      await user.save();
    }
    // Return lowercase role to frontend to keep it working
    res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name, email, role: user.role.toLowerCase() } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { tutorId, moduleNameAndCode, lessonName, subject, date, startTime, capacity, meetingLink } = req.body;
    const lessonImage = req.file ? req.file.filename : '';
    const session = new Session({ tutorId, moduleNameAndCode, lessonName, lessonImage, subject, date, startTime, capacity, meetingLink });
    await session.save();
    res.status(201).json({ message: 'Session created successfully', session: formatDoc(session) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTutorSessions = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const sessions = await Session.find({ tutorId }).sort({ date: 1, startTime: 1 });
    const now = new Date();

    // Attach bookings for capacity viewing and filter expired sessions
    const sessionsWithBookings = await Promise.all(sessions.map(async s => {
      const sessionDateTime = new Date(`${s.date}T${s.startTime}:00`);
      if (sessionDateTime < now) return null;

      const bookings = await Booking.find({ sessionId: s._id, status: 'Confirmed' });
      const formatted = formatDoc(s);
      formatted.Bookings = bookings.map(formatDoc);
      return formatted;
    }));

    res.status(200).json({ sessions: sessionsWithBookings.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndUpdate(id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ message: 'Session updated successfully', session: formatDoc(session) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingCount = await Booking.countDocuments({ sessionId: id, status: 'Confirmed' });
    if(bookingCount > 0) return res.status(400).json({ message: 'Cannot delete a session with active bookings' });
    
    const session = await Session.findByIdAndDelete(id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTutorFeedback = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const feedbackList = await Feedback.find({ tutorId }).populate('studentId', 'fullname name');
    
    const formattedFeedback = feedbackList.map(f => {
      const fb = formatDoc(f);
      fb.student = { name: (f.studentId?.name || 'Unknown Student') };
      return fb;
    });

    const averageRating = formattedFeedback.length > 0 
      ? formattedFeedback.reduce((acc, curr) => acc + curr.rating, 0) / formattedFeedback.length 
      : 0;

    res.status(200).json({ feedback: formattedFeedback, averageRating: averageRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const { faculty, degree, year, semester } = req.query;
    let subjects = [];
    if(faculty === 'Computing' && degree === 'Information Technology' && year === 'Year 3' && semester === 'Semester 2') {
        subjects = DUMMY_SUBJECTS[faculty][degree][year][semester];
    } else {
        subjects = [
          'Industry Placement',
          'Employability Skills Development',
          'IT Project Management',
          'Programming Applications and Frameworks',
          'Database Systems',
          'Network Design and Management'
        ];
    }
    res.status(200).json({ subjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAvailableSessions = async (req, res) => {
  try {
    const { subject } = req.query;
    const query = {};
    if (subject) query.subject = subject;

    const sessions = await Session.find(query)
      .populate('tutorId', 'name email')
      .sort({ date: 1, startTime: 1 });

    const now = new Date();
    const sessionsWithRatings = await Promise.all(sessions.map(async (sess) => {
      const sessionDateTime = new Date(`${sess.date}T${sess.startTime}:00`);
      if (sessionDateTime < now) return null;

      const fb = await Feedback.find({ tutorId: sess.tutorId._id });
      const avg = fb.length > 0 ? (fb.reduce((sum, f) => sum + f.rating, 0) / fb.length) : 0;
      
      const formatted = formatDoc(sess);
      formatted.tutor = { id: sess.tutorId._id, name: sess.tutorId.name, email: sess.tutorId.email };
      formatted.tutorRating = avg;
      return formatted;
    }));

    const filteredSessions = sessionsWithRatings.filter(Boolean);
    filteredSessions.sort((a, b) => b.tutorRating - a.tutorRating);
    res.status(200).json({ sessions: filteredSessions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.bookSession = async (req, res) => {
  try {
    const { sessionId, studentId } = req.body;
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.capacity <= 0) return res.status(400).json({ message: 'Session is fully booked' });

    const existing = await Booking.findOne({ sessionId, studentId, status: 'Confirmed' });
    if (existing) return res.status(400).json({ message: 'You have already booked this session' });

    const booking = new Booking({ sessionId, studentId, status: 'Confirmed' });
    await booking.save();
    
    session.capacity -= 1;
    await session.save();

    res.status(201).json({ message: 'Session booked successfully', booking: formatDoc(booking) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStudentBookings = async (req, res) => {
  try {
    const { studentId } = req.params;
    const bookings = await Booking.find({ studentId })
      .populate({
        path: 'sessionId',
        populate: { path: 'tutorId', select: 'name' }
      })
      .sort({ createdAt: -1 });

    const formatted = bookings.map(b => {
      let doc = formatDoc(b);
      if(b.sessionId) {
         doc.session = formatDoc(b.sessionId);
         if (b.sessionId.tutorId) {
             doc.session.tutor = { id: b.sessionId.tutorId._id, name: b.sessionId.tutorId.name };
         }
      }
      return doc;
    });

    res.status(200).json({ bookings: formatted });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'Cancelled') return res.status(400).json({ message: 'Booking is already cancelled' });

    booking.status = 'Cancelled';
    await booking.save();

    const session = await Session.findById(booking.sessionId);
    if (session) {
      session.capacity += 1;
      await session.save();
    }

    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { sessionId, studentId, tutorId, rating, comments } = req.body;
    
    const booking = await Booking.findOne({ sessionId, studentId, status: 'Confirmed' });
    if (!booking) return res.status(400).json({ message: 'Cannot submit feedback without a confirmed booking' });

    const existing = await Feedback.findOne({ sessionId, studentId });
    if (existing) return res.status(400).json({ message: 'Feedback already submitted for this session' });

    const feedback = new Feedback({ sessionId, studentId, tutorId, rating, comments });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted', feedback: formatDoc(feedback) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
