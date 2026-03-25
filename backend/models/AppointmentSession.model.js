const mongoose = require('mongoose');

const appointmentSessionSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moduleNameAndCode: {
    type: String,
    required: true
  },
  lessonName: {
    type: String,
    required: true
  },
  lessonImage: {
    type: String, // Path to uploaded image
    default: ''
  },
  subject: {
    type: String,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    default: ''
  },
  capacity: {
    type: Number,
    required: true,
    default: 1
  },
  meetingLink: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AppointmentSession', appointmentSessionSchema);
