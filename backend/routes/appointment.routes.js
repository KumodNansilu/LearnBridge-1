const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const appointmentController = require('../controllers/appointmentController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// --- Mock Auth (For Demo Purposes) ---
router.post('/login', appointmentController.mockLogin);

// --- Tutor Routes ---
router.post('/sessions', upload.single('lessonImage'), appointmentController.createSession);
router.get('/sessions/tutor/:tutorId', appointmentController.getTutorSessions);
router.put('/sessions/:id', appointmentController.updateSession);
router.delete('/sessions/:id', appointmentController.deleteSession);
router.get('/feedback/tutor/:tutorId', appointmentController.getTutorFeedback);

// --- Student Routes ---
router.get('/subjects', appointmentController.getSubjects); // Mocked data based on prompt requirements
router.get('/sessions', appointmentController.getAvailableSessions); // Filter by subject, date, etc.
router.post('/bookings', appointmentController.bookSession);
router.get('/bookings/student/:studentId', appointmentController.getStudentBookings);
router.put('/bookings/:id/cancel', appointmentController.cancelBooking);
router.post('/feedback', appointmentController.submitFeedback);

module.exports = router;
